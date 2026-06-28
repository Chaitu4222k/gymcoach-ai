export const AUTH_ROUTES = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
};

export const PROFILE_ROUTES = {
  GET: "/profile",
  UPDATE: "/profile",
};

export const WORKOUT_ROUTES = {
  GET_ALL: "/workouts",
  CREATE: "/workouts",
  UPDATE: (id) => `/workouts/${id}`,
  DELETE: (id) => `/workouts/${id}`,
};

export const AI_ROUTES = {
  GENERATE_PLAN: "/ai/generate-plan",
  CHAT: "/ai/chat",
};