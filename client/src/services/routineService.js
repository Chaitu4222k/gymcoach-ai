import apiClient from "../api/apiClient";
import { ROUTINE_ROUTES } from "../api/routes";

export const getUserRoutines = () =>
  apiClient.get(ROUTINE_ROUTES.GET_ALL);

export const getActiveRoutine = () =>
  apiClient.get(ROUTINE_ROUTES.GET_ACTIVE);

export const getRoutineById = (id) =>
  apiClient.get(ROUTINE_ROUTES.GET_BY_ID(id));

export const createRoutine = (data) =>
  apiClient.post(ROUTINE_ROUTES.CREATE, data);

export const updateRoutine = (id, data) =>
  apiClient.put(ROUTINE_ROUTES.UPDATE(id), data);

export const deleteRoutine = (id) =>
  apiClient.delete(ROUTINE_ROUTES.DELETE(id));

export const setActiveRoutine = (id) =>
  apiClient.put(ROUTINE_ROUTES.SET_ACTIVE(id));

export const getStarterRecommendation = () =>
  apiClient.get(ROUTINE_ROUTES.RECOMMENDATIONS);
