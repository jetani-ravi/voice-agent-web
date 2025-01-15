"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { Agent, ListAgentsResponse } from "./interface";

export type GetAgentsParams = SearchParams;

export const getAgents = async (params: GetAgentsParams = {}) => {
  const searchParams = createParams(params);
  const url = `/agent/all${searchParams ? `?${searchParams}` : ""}`;

  const response = await api.get<ListAgentsResponse>(url, {
    bearer: true,
  });

  return response;
};

export const getAgent = async (agent_id: string) => {
  const url = `/agent/${agent_id}`;
  const response = await api.get<Agent>(url, {
    bearer: true,
  });
  return response;
};
