"use client";

import axios, { type AxiosError } from "axios";
import { ApiRoutes } from "./apiRoutes";

// Types for authentication
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    balance: number;
  };
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  referralCode?: string; // Optional referral code
}

export interface SignupResponse {
  userId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add common headers
API.interceptors.request.use((config) => {
  // Add common headers here if needed
  config.headers["Content-Type"] = "application/json";
  config.headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;

  // Add CSRF token if available
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      // window.location.href = '/login';
    }

    // Format error for consistent handling
    const apiError: ApiError = {
      message: error.response?.data?.error || "An unexpected error occurred",
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

// Helper to get CSRF token from meta tag
function getCsrfToken(): string | null {
  if (typeof document !== "undefined") {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : null;
  }
  return null;
}

// API client functions
export const apiClient = {
  // Authentication
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await API.post<LoginResponse>(ApiRoutes.Login, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await API.post<SignupResponse>(ApiRoutes.Signup, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  preSignupEmailVerification: async (data: {email: string}): Promise<any> => {
    try {
      const response = await API.post<any>(ApiRoutes.PreSignupEmailVerification, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await API.post(ApiRoutes.Logout);
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await API.post<ForgotPasswordResponse>(
        ApiRoutes.ForgotPassword,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await API.post<ResetPasswordResponse>(
        ApiRoutes.ResetPassword,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    try {
      const response = await API.post<VerifyEmailResponse>(
        ApiRoutes.VerifyEmail,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      const response = await API.post(ApiRoutes.VerifyEmail, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  validateSession: async (): Promise<LoginResponse> => {
    try {
      const response = await API.get<LoginResponse>(ApiRoutes.ValidateSession);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// React hooks for API calls
export function useAuth() {
  return {
    signup: apiClient.signup,
    preSignupEmailVerification: apiClient.preSignupEmailVerification,
    forgotPassword: apiClient.forgotPassword,
    resetPassword: apiClient.resetPassword,
    verifyEmail: apiClient.verifyEmail,
    resendVerificationEmail: apiClient.resendVerificationEmail
  };
}