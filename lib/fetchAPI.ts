import { ApiResponse } from "@/types/api";
import { getToken } from "next-auth/jwt";
import { headers as nextHeaders } from "next/headers";
import { handleApiResponse } from "./api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions extends Omit<RequestInit, "method" | "headers"> {
  params?: Record<string, string>;
  requiresAuth?: boolean;
  bearer?: boolean;
  formData?: boolean;
  headers?: HeadersInit;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FAST_API_URL;

// Request interceptor to add common headers and auth token
const requestInterceptor = async (
  options: FetchOptions
): Promise<RequestInit> => {
  const requestHeaders = new Headers();
  if (!options.formData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Add custom headers if provided
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        requestHeaders.set(key, value);
      }
    });
  }

  // Handle authentication
  if (options.requiresAuth || options.bearer) {
    try {
      const headersList = await nextHeaders();
      for (const [key, value] of headersList.entries()) {
        console.log(`${key}: ${value}`);
      }
      const cookie = headersList.get("cookie");
      console.log("cookie: ", cookie);
      const token = await getToken({
        req: {
          headers: Object.fromEntries(headersList.entries()),
          cookies: cookie,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        secret: process.env.NEXTAUTH_SECRET,
        raw: true,
      });

      console.log("token: ", token);

      if (token) {
        if (token) {
          requestHeaders.set(
            "Authorization",
            options.bearer ? `Bearer ${token}` : token
          );
        }
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }

  return {
    ...options,
    headers: requestHeaders,
  };
};

// Main fetch wrapper
async function fetchWrapper<T>(
  endpoint: string,
  method: HttpMethod,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    console.log("endpoint: ", endpoint);
    console.log("method: ", method);
    console.log("options: ", options);
    // Add query params if they exist
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    console.log("options.params: ", options.params);

    // Apply request interceptor
    const interceptedOptions = await requestInterceptor(options);
    console.log("interceptedOptions: ", interceptedOptions);
    // Make the request
    const response = await fetch(url.toString(), {
      ...interceptedOptions,
      method,
    });
    return handleApiResponse<T>(response);
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        type: "SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
    };
  }
}

// Type-safe HTTP method specific functions
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, "GET", options),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, "POST", {
      ...options,
      body: options?.formData ? body as BodyInit : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, "PUT", {
      ...options,
      body: options?.formData ? body as BodyInit : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, "PATCH", {
      ...options,
      body: options?.formData ? body as BodyInit : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, "DELETE", options),
};
