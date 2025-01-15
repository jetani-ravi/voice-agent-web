// types/api.ts
import { ZodError } from "zod";

export type ApiErrorType = 
  | "VALIDATION_ERROR"
  | "AUTH_ERROR" 
  | "NOT_FOUND"
  | "SERVER_ERROR";

export interface ApiError {
  type: ApiErrorType;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ZodError | ApiError;
}

export interface Pagination {
  count: number;
  page: number;
  limit: number;
}

// Simple type guard for API errors
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error
  );
}

// Helper functions
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
}

export function createErrorResponse(message: string, type: ApiErrorType): ApiResponse<never> {
  return {
    success: false,
    error: {
      type,
      message
    }
  };
}