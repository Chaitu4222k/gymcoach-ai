import apiClient from "../api/apiClient";
import { EXERCISE_ROUTES } from "../api/routes";

export const getExercises = (params = {}) =>
  apiClient.get(EXERCISE_ROUTES.GET_ALL, { params });

export const getExerciseOptions = () =>
  apiClient.get(EXERCISE_ROUTES.GET_OPTIONS);

export const getExerciseById = (id) =>
  apiClient.get(EXERCISE_ROUTES.GET_BY_ID(id));

export const createCustomExercise = (data) =>
  apiClient.post(EXERCISE_ROUTES.CREATE, data);

export const deleteCustomExercise = (id) =>
  apiClient.delete(EXERCISE_ROUTES.DELETE(id));
