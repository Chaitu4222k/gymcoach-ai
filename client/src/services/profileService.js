import apiClient from "../api/apiClient";

import {
    PROFILE_ROUTES,
    AUTH_ROUTES,
} from "../api/routes";

export const getCurrentUser = () =>
    apiClient.get(AUTH_ROUTES.ME);

export const getProfile = () =>
    apiClient.get(PROFILE_ROUTES.GET);

export const createProfile = (data) =>
    apiClient.post(PROFILE_ROUTES.CREATE, data);

export const updateProfile = (data) =>
    apiClient.put(PROFILE_ROUTES.UPDATE, data);

export const deleteProfile = () =>
    apiClient.delete(PROFILE_ROUTES.DELETE);