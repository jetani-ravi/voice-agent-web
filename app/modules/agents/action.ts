"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { ListAgentsResponse } from "./interface";

export type GetAgentsParams = SearchParams;

export const getAgents = async (params: GetAgentsParams = {}) => {
  const searchParams = createParams(params);
  const url = `/agent/all${searchParams ? `?${searchParams}` : ""}`;

  const response = await api.get<ListAgentsResponse>(url, {
    bearer: true,
  });

  return response;
};
