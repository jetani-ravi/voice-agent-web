// lib/api.ts
import { ApiResponse, ApiError, ApiErrorType } from "@/types/api";

export async function handleApiResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    const errorType = getErrorType(response.status);
    return {
      success: false,
      error: {
        type: errorType,
        message: data.message || "An error occurred"
      }
    };
  }

  return {
    success: true,
    data: data.data
  };
}

function getErrorType(status: number): ApiErrorType {
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 401 || status === 403) return "AUTH_ERROR";
  if (status === 404) return "NOT_FOUND";
  return "SERVER_ERROR";
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error
  );
}