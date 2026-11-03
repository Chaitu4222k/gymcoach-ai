export const AUTH_ROUTES = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  ME: "/auth/me",
};

export const PROFILE_ROUTES = {
  GET: "/profile",
  CREATE: "/profile",
  UPDATE: "/profile",
  DELETE: "/profile",
};

export const EXERCISE_ROUTES = {
  GET_ALL: "/exercises",
  GET_OPTIONS: "/exercises/options",
  GET_BY_ID: (id) => `/exercises/${id}`,
  CREATE: "/exercises",
  DELETE: (id) => `/exercises/${id}`,
};

export const ROUTINE_ROUTES = {
  GET_ALL: "/workouts/routines",
  GET_ACTIVE: "/workouts/routines/active",
  RECOMMENDATIONS: "/workouts/routines/recommendations",
  GET_BY_ID: (id) => `/workouts/routines/${id}`,
  CREATE: "/workouts/routines",
  UPDATE: (id) => `/workouts/routines/${id}`,
  DELETE: (id) => `/workouts/routines/${id}`,
  SET_ACTIVE: (id) => `/workouts/routines/${id}/active`,
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
