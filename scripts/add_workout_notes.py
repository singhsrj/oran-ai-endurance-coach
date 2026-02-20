"""
Add notes column to workouts table
Run this script to add the notes column if it doesn't exist
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        # Check if column exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='workouts' AND column_name='notes'
        """))
        
        if result.fetchone() is None:
            # Column doesn't exist, add it
            conn.execute(text("ALTER TABLE workouts ADD COLUMN notes TEXT"))
            conn.commit()
            print("✅ Successfully added 'notes' column to workouts table")
        else:
            print("ℹ️  'notes' column already exists in workouts table")
            
    except Exception as e:
        print(f"❌ Error: {e}")
