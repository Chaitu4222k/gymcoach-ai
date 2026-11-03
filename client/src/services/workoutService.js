import apiClient from "../api/apiClient";
import { WORKOUT_ROUTES } from "../api/routes";

export const logWorkout = (data) =>
  apiClient.post(WORKOUT_ROUTES.LOG, data);

export const getWorkoutHistory = (params = {}) =>
  apiClient.get(WORKOUT_ROUTES.HISTORY, { params });

export const getWorkoutLogs = (params = {}) =>
  apiClient.get(WORKOUT_ROUTES.GET_ALL, { params });

export const getWorkoutById = (id) =>
  apiClient.get(WORKOUT_ROUTES.GET_BY_ID(id));

export const deleteWorkout = (id) =>
  apiClient.delete(WORKOUT_ROUTES.DELETE(id));
