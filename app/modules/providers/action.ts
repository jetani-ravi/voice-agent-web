"use server";

import { api } from "@/lib/fetchAPI";
import { ListSystemProviders, UserProviders } from "./interface";
import { createParams, SearchParams } from "@/lib/searchParams";
import { revalidatePath } from "next/cache";
import { ConnectProvidersValues } from "./validation";

export const getProvidersWithConnection = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/providers${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListSystemProviders>(url, {
    bearer: true,
  });
  return response;
};

export const connectUserProvider = async (payload: ConnectProvidersValues) => {
  const url = `/providers/user`;
  const response = await api.post<UserProviders>(url, payload, {
    bearer: true,
  });
  revalidatePath("/providers");
  return response;
};

export const disconnectUserProvider = async (provider_id: string) => {
  const url = `/providers/user/${provider_id}/disconnect`;
  const response = await api.post(
    url,
    {},
    {
      bearer: true,
    }
  );
  revalidatePath("/providers");
  return response;
};
