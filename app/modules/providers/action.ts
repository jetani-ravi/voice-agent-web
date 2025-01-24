"use server";

import { api } from "@/lib/fetchAPI";
import { ListSystemProviders } from "./interface";
import { createParams, SearchParams } from "@/lib/searchParams";

export const getSystemProviders = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/providers/system${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListSystemProviders>(url, {
    bearer: true,
  });
  return response;
};
