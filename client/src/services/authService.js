import apiClient from "../api/apiClient";
import { AUTH_ROUTES } from "../api/routes";

export const registerUser = (data) =>
  apiClient.post(AUTH_ROUTES.REGISTER, data);

export const loginUser = (data) =>
  apiClient.post(AUTH_ROUTES.LOGIN, data);