import { create } from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "@/features/auth/services/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not configured. Check your .env file.",
  );
}

export const axiosInstance = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshClient = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as
      (typeof error.config & { _retried?: boolean }) | undefined;

    if (error.response?.status !== 401 || !request || request._retried) {
      return Promise.reject(error);
    }

    request._retried = true;
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return Promise.reject(error);
    }

    try {
      const response = await refreshClient.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/refresh", { refreshToken });

      await saveAuthTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      request.headers.Authorization = `Bearer ${response.data.accessToken}`;

      return axiosInstance(request);
    } catch (refreshError) {
      await clearAuthTokens();
      return Promise.reject(refreshError);
    }
  },
);
