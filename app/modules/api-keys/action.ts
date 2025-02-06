"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { ApiKey, ListApiKeysResponse } from "./interface";
import { revalidatePath } from "next/cache";
import { APIKeyValues } from "./validation";

export const getApiKeys = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/api-keys${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListApiKeysResponse>(url, {
    bearer: true,
  });
  return response;
};

export const createApiKey = async (data: APIKeyValues) => {
    const url = `/api-keys`;
    const response = await api.post<ApiKey>(url, data, {
      bearer: true
    });
    revalidatePath("/api-keys");
  
    return response;
  };

export const deleteApiKey = async (id: string) => {
  const url = `/api-keys/${id}`;
  const response = await api.delete(url, {
    bearer: true,
  });
  revalidatePath("/api-keys");

  return response;
};
