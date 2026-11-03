import apiClient from "../api/apiClient";
import { DASHBOARD_ROUTES } from "../api/routes";

export const getDashboard = () =>
  apiClient.get(DASHBOARD_ROUTES.GET);
