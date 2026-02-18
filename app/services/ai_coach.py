"""
AI Recommendation Engine using LangGraph and Fireworks AI

This module uses a multi-agent workflow to generate personalized workout recommendations:
1. Data Analyzer - Analyzes training metrics and identifies patterns
2. Coach - Creates workout recommendations based on analysis
3. Validator - Ensures recommendations are safe and appropriate
"""

import os
from typing import TypedDict, Annotated, List, Dict
from datetime import date
import json

from openai import OpenAI
from langgraph.graph import StateGraph, END
from sqlalchemy.orm import Session

from app.routes.config import settings
from app.services.training_engine import get_training_metrics
from app.models.user import User
from app.models.recommendation import Recommendation


# Initialize Fireworks client with OpenAI SDK
def get_fireworks_client():
    """Get Fireworks AI client using OpenAI SDK"""
    return OpenAI(
        api_key=settings.FIREWORKS_API_KEY,
        base_url=settings.FIREWORKS_BASE_URL
    )


class RecommendationState(TypedDict):
    """State for the recommendation workflow"""
    user_profile: Dict
    training_metrics: Dict
    analysis: str
    recommendation: Dict
    validation: str
    final_output: Dict


def analyze_training_data(state: RecommendationState) -> RecommendationState:
    """
    Step 1: Analyze user's training data and metrics
    """
    client = get_fireworks_client()
    
    user_profile = state["user_profile"]
    metrics = state["training_metrics"]
    
    # Create analysis prompt
    prompt = f"""You are an expert endurance sports coach analyzing an athlete's training data.

ATHLETE PROFILE:
- Name: {user_profile['name']}
- Sport: {user_profile['sport']}
- Experience: {user_profile['experience_level']}
- Goal: {user_profile['goal']}

CURRENT TRAINING METRICS:
- Fitness (CTL): {metrics['fitness']['ctl']}
- Fatigue (ATL): {metrics['fatigue']['atl']}
- Form (TSB): {metrics['form']['tsb']} - {metrics['form']['status']}
- Recovery Score: {metrics['recovery']['recovery_score']}% - {metrics['recovery']['recommendation']}
- Weekly Training Load: {metrics['weekly_training_load']}

ANALYSIS TASK:
1. Assess the athlete's current training state
2. Identify any red flags (overtraining, under-recovery, detraining)
3. Determine what type of training they need most
4. Consider their experience level and goals

Provide a concise 2-3 paragraph analysis."""

    try:
        response = client.chat.completions.create(
            model=settings.FIREWORKS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        analysis = response.choices[0].message.content
        state["analysis"] = analysis
        
    except Exception as e:
        state["analysis"] = f"Error in analysis: {str(e)}"
    
    return state


def generate_recommendation(state: RecommendationState) -> RecommendationState:
    """
    Step 2: Generate specific workout recommendation
    """
    client = get_fireworks_client()
    
    metrics = state["training_metrics"]
    analysis = state["analysis"]
    user_profile = state["user_profile"]
    
    prompt = f"""Based on this analysis, create a specific workout recommendation.

ANALYSIS:
{analysis}

CURRENT STATE:
- Form (TSB): {metrics['form']['tsb']}
- Recovery: {metrics['recovery']['recovery_score']}%
- Athlete Goal: {user_profile['goal']}

Generate a workout recommendation in JSON format with these fields:
{{
    "workout_type": "easy|tempo|interval|long|race|rest",
    "duration_minutes": <number>,
    "intensity": "low|moderate|high",
    "description": "<detailed workout description>",
    "reasoning": "<why this workout is appropriate now>",
    "warnings": ["<any important warnings or cautions>"]
}}

IMPORTANT:
- If TSB < -20, prioritize recovery (rest or very easy workouts)
- If Recovery Score < 60%, recommend easy training or rest
- Consider experience level (don't overload beginners)
- Match workout to stated goal (marathon prep, base building, etc.)

Return ONLY valid JSON, no additional text."""

    try:
        response = client.chat.completions.create(
            model=settings.FIREWORKS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=600
        )
        
        recommendation_text = response.choices[0].message.content.strip()
        
        # Try to parse JSON (handle markdown code blocks)
        if "```json" in recommendation_text:
            recommendation_text = recommendation_text.split("```json")[1].split("```")[0].strip()
        elif "```" in recommendation_text:
            recommendation_text = recommendation_text.split("```")[1].split("```")[0].strip()
        
        recommendation = json.loads(recommendation_text)
        state["recommendation"] = recommendation
        
    except Exception as e:
        # Fallback recommendation
        state["recommendation"] = {
            "workout_type": "rest",
            "duration_minutes": 0,
            "intensity": "low",
            "description": "Take a rest day to recover",
            "reasoning": f"Error generating recommendation: {str(e)}",
            "warnings": ["System error - defaulting to rest day"]
        }
    
    return state


def validate_recommendation(state: RecommendationState) -> RecommendationState:
    """
    Step 3: Validate the recommendation for safety
    """
    client = get_fireworks_client()
    
    recommendation = state["recommendation"]
    metrics = state["training_metrics"]
    user_profile = state["user_profile"]
    
    prompt = f"""You are a sports medicine expert. Review this workout recommendation for safety.

ATHLETE:
- Experience: {user_profile['experience_level']}
- Current Recovery: {metrics['recovery']['recovery_score']}%
- Form (TSB): {metrics['form']['tsb']}

RECOMMENDED WORKOUT:
- Type: {recommendation['workout_type']}
- Duration: {recommendation['duration_minutes']} minutes
- Intensity: {recommendation['intensity']}
- Description: {recommendation['description']}

VALIDATION TASK:
1. Is this safe given their current state?
2. Are there any injury risks?
3. Should the intensity/duration be adjusted?

Respond with:
- "APPROVED" if safe as-is
- "ADJUST: <specific changes needed>" if needs modification
- "REJECT: <reason>" if unsafe

Keep response to 1-2 sentences."""

    try:
        response = client.chat.completions.create(
            model=settings.FIREWORKS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=200
        )
        
        validation = response.choices[0].message.content
        state["validation"] = validation
        
        # Apply adjustments if needed
        if "ADJUST:" in validation:
            state["recommendation"]["warnings"].append(f"Validation note: {validation}")
        elif "REJECT:" in validation:
            state["recommendation"] = {
                "workout_type": "rest",
                "duration_minutes": 0,
                "intensity": "low",
                "description": "Rest day recommended",
                "reasoning": validation,
                "warnings": ["Original recommendation rejected by safety validator"]
            }
        
    except Exception as e:
        state["validation"] = f"Validation error: {str(e)}"
    
    return state


def finalize_output(state: RecommendationState) -> RecommendationState:
    """
    Step 4: Format final output
    """
    state["final_output"] = {
        "recommendation": state["recommendation"],
        "analysis": state["analysis"],
        "validation": state["validation"],
        "generated_date": date.today().isoformat()
    }
    return state


def build_recommendation_workflow() -> StateGraph:
    """
    Build the LangGraph workflow for generating recommendations
    """
    workflow = StateGraph(RecommendationState)
    
    # Add nodes
    workflow.add_node("analyze", analyze_training_data)
    workflow.add_node("recommend", generate_recommendation)
    workflow.add_node("validate", validate_recommendation)
    workflow.add_node("finalize", finalize_output)
    
    # Define edges
    workflow.set_entry_point("analyze")
    workflow.add_edge("analyze", "recommend")
    workflow.add_edge("recommend", "validate")
    workflow.add_edge("validate", "finalize")
    workflow.add_edge("finalize", END)
    
    return workflow.compile()


def generate_workout_recommendation(db: Session, user: User) -> Dict:
    """
    Generate a personalized workout recommendation using AI
    
    Args:
        db: Database session
        user: User object
    
    Returns:
        Dictionary with recommendation and analysis
    """
    # Get training metrics
    metrics = get_training_metrics(db, user.id)
    
    # Prepare user profile
    user_profile = {
        "name": user.name,
        "sport": user.sport or "endurance sports",
        "experience_level": user.experience_level or "intermediate",
        "goal": user.goal or "general fitness"
    }
    
    # Initialize state
    initial_state = {
        "user_profile": user_profile,
        "training_metrics": metrics,
        "analysis": "",
        "recommendation": {},
        "validation": "",
        "final_output": {}
    }
    
    # Run workflow
    workflow = build_recommendation_workflow()
    result = workflow.invoke(initial_state)
    
    # Save to database
    recommendation_record = Recommendation(
        user_id=user.id,
        date=date.today(),
        recommendation_json=result["final_output"]["recommendation"],
        reasoning_summary=result["final_output"]["analysis"]
    )
    db.add(recommendation_record)
    db.commit()
    db.refresh(recommendation_record)
    
    return result["final_output"]
