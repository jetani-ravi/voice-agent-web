"use server";
import { ApiResponse } from "@/types/api";
import { AuthResponse, User } from "./interface";
import { loginSchema, signUpSchema } from "./validation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { api } from "@/lib/fetchAPI";

export async function signUp(
  values: FormData
): Promise<ApiResponse<AuthResponse>> {
  try {
    const parsed = signUpSchema.safeParse({
      name: values.get("name"),
      email: values.get("email"),
      password: values.get("password"),
      confirmPassword: values.get("confirmPassword"),
      organizationName: values.get("organizationName"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const response = await api.post<AuthResponse>(`/user/signup`, {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      organization_name: parsed.data.organizationName,
    });
    return response;
  } catch (error) {
    console.error("SignUp Error:", error);
    return {
      success: false,
      error: "Failed to sign up",
    };
  }
}

export async function login(
  formData: FormData
): Promise<ApiResponse<AuthResponse>> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error };
    }

    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid credentials" };
    }

    return { success: false, error: "Something went wrong" };
  }
}

export const me = async () => {
  const url = `/user/me`;
  const response = await api.get<User>(url, { bearer: true });
  return response;
};
