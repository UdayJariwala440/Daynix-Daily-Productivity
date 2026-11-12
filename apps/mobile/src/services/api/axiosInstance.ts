import { create, isAxiosError } from "axios";
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

const PUBLIC_AUTH_ENDPOINTS = new Set([
  "/auth/login",
  "/auth/signup",
  "/auth/resend-otp",
  "/auth/verify-otp",
  "/auth/refresh",
]);

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

export function isSessionExpiredError(error: unknown) {
  return error instanceof SessionExpiredError;
}

let refreshPromise: Promise<string> | null = null;

async function refreshSession(refreshToken: string) {
  const response = await refreshClient.post<RefreshResponse>(
    "/auth/refresh",
    { refreshToken },
  );

  await saveAuthTokens(
    response.data.accessToken,
    response.data.refreshToken,
  );

  return response.data.accessToken;
}

async function clearRejectedSession(rejectedRefreshToken: string) {
  // Do not erase a newer session if the user signed in while this request
  // was in flight.
  if ((await getRefreshToken()) === rejectedRefreshToken) {
    await clearAuthTokens();
  }
}

axiosInstance.interceptors.request.use(async (config) => {
  if (config.url && PUBLIC_AUTH_ENDPOINTS.has(config.url)) {
    return config;
  }

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

    if (request.url && PUBLIC_AUTH_ENDPOINTS.has(request.url)) {
      return Promise.reject(error);
    }

    request._retried = true;
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthTokens();
      return Promise.reject(new SessionExpiredError());
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession(refreshToken).finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(request);
    } catch (refreshError) {
      if (
        isAxiosError(refreshError) &&
        (refreshError.response?.status === 400 ||
          refreshError.response?.status === 401)
      ) {
        await clearRejectedSession(refreshToken);
        return Promise.reject(new SessionExpiredError());
      }

      return Promise.reject(refreshError);
    }
  },
);
