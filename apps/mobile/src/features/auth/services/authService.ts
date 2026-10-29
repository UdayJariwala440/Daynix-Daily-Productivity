import { API_ENDPOINTS, axiosInstance } from "@/services";
export interface signupPayload {
  name: string;
  email: string;
}

export interface loginPayload {
  email: string;
}

export interface refreshPayload {
  refreshToken: string;
}

export interface verifyOtpPayload {
  otp: string;
  email: string;
  device: {
    name: string;
    model?: string;
    platform: "android" | "ios" | "web" | "unknown";
    osVersion?: string;
    appVersion?: string;
  };
}

export interface resendPayload {
  email: string;
}

export interface signupResponse {
  success: boolean;
  message: string;
}

export interface loginResponse {
  success: boolean;
  message: string;
}

export interface ResendOTPResponse {
  success: boolean;
  user: User;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: User;
}

export interface Session {
  id: string;
  device_name: string;
  device_model: string | null;
  platform: "android" | "ios" | "web" | "unknown";
  os_version: string | null;
  app_version: string | null;
  ip_address: string | null;
  last_active_at: string;
  created_at: string;
  expires_at: string;
  current: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: any;
  timezone: string;
  created_at: string;
  updated_at: string;
}


export interface RefreshResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}
export const signup = async (
  payload: signupPayload,
): Promise<signupResponse> => {
  const response = await axiosInstance.post<signupResponse>(
    API_ENDPOINTS.auth.signup,
    payload,
  );

  return response.data;
};

export const resend = async (
  payload: resendPayload,
): Promise<ResendOTPResponse> => {
  const response = await axiosInstance.post<ResendOTPResponse>(
    API_ENDPOINTS.auth.resendOtp,
    payload,
  );

  return response.data;
};

export const verifyOtp = async (
  payload: verifyOtpPayload,
): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    API_ENDPOINTS.auth.verifyOtp,
    payload,
  );
  return response.data;
};
export const refresh = async (
  payload: refreshPayload,
): Promise<RefreshResponse> => {
  const response = await axiosInstance.post<RefreshResponse>(
    API_ENDPOINTS.auth.refresh,
    payload,
  );
  return response.data;
};

export const login = async (payload: loginPayload): Promise<loginResponse> => {
  const response = await axiosInstance.post<loginResponse>(
    API_ENDPOINTS.auth.login,
    payload,
  );

  return response.data;
};

export async function getSessions(): Promise<Session[]> {
  const response = await axiosInstance.get<{
    success: boolean;
    sessions: Session[];
  }>(API_ENDPOINTS.auth.sessions);

  return response.data.sessions;
}

export async function revokeSession(sessionId: string) {
  const response = await axiosInstance.delete<{
    currentSessionRevoked: boolean;
  }>(API_ENDPOINTS.auth.session(sessionId));

  return response.data;
}

export async function revokeOtherSessions() {
  const response = await axiosInstance.delete<{ revokedCount: number }>(
    API_ENDPOINTS.auth.otherSessions,
  );

  return response.data;
}
