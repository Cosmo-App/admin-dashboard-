/**
 * API Client - Axios Configuration
 * Handles all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";
import type { ApiResponse, ApiError } from "@/types/models";

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor
 * Add any auth headers or modify requests before sending
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests only in development and only in browser
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common response patterns and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log responses only in development and only in browser
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      console.log(`[API] Response:`, response.data);
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Only log non-401 errors (401 is expected when not authenticated)
      if (status !== 401) {
        console.error(`[API] Error ${status}:`, data);
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("[API] Access Denied");
      }

      // Return formatted error
      return Promise.reject({
        message: data?.message || "An error occurred",
        code: status.toString(),
        details: data,
      });
    } else if (error.request) {
      // Network error (no response)
      console.error("[API] Network Error:", error.message);
      return Promise.reject({
        message: "Unable to connect to the server. Please check your internet connection and try again.",
        code: "NETWORK_ERROR",
        details: error.message,
      });
    } else {
      // Something else went wrong
      console.error("[API] Error:", error.message);
      return Promise.reject({
        message: error.message || "An unexpected error occurred. Please try again.",
        code: "UNKNOWN_ERROR",
        details: error,
      });
    }
  }
);

/**
 * Generic GET request
 */
export async function get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data;
}

/**
 * Generic POST request
 */
export async function post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic PUT request
 */
export async function put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic PATCH request
 */
export async function patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic DELETE request
 */
export async function del<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
}

/**
 * Upload file(s) with multipart/form-data
 */
export async function upload<T>(
  url: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Download file
 */
export async function download(url: string, filename: string): Promise<void> {
  const response = await apiClient.get(url, {
    responseType: "blob",
  });

  // Create download link
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * API object with all methods - for convenience
 */
export const api = {
  get,
  post,
  put,
  patch,
  del,
  upload,
  download,
};

export default apiClient;
