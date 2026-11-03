import apiClient from "../api/apiClient";
import { PROGRESS_ROUTES } from "../api/routes";

export const logBodyWeight = (data) =>
  apiClient.post(PROGRESS_ROUTES.WEIGHT, data);

export const getBodyWeightLogs = () =>
  apiClient.get(PROGRESS_ROUTES.WEIGHT);

export const deleteBodyWeightLog = (id) =>
  apiClient.delete(PROGRESS_ROUTES.WEIGHT_BY_ID(id));

export const getVolumeTrends = (timeframe = "4weeks") =>
  apiClient.get(PROGRESS_ROUTES.VOLUME, { params: { timeframe } });

export const getMuscleDistribution = () =>
  apiClient.get(PROGRESS_ROUTES.MUSCLES);
