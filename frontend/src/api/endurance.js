import api from './axios';

export const enduranceAPI = {
  // Dashboard - get all data in one call
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Workouts
  logWorkout: async (workoutData) => {
    const response = await api.post('/log-workout', workoutData);
    return response.data;
  },

  // Sleep
  logSleep: async (sleepData) => {
    const response = await api.post('/log-sleep', sleepData);
    return response.data;
  },

  // Nutrition
  logNutrition: async (nutritionData) => {
    const response = await api.post('/log-nutrition', nutritionData);
    return response.data;
  },

  // Metrics
  getMetrics: async () => {
    const response = await api.get('/metrics');
    return response.data;
  },

  // AI Recommendation
  getRecommendation: async () => {
    const response = await api.post('/recommend');
    return response.data;
  },
};
