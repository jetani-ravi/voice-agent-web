"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { Agent, CreateAgentPayload, ListAgentsResponse } from "./interface";
import { revalidatePath } from "next/cache";

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

export const updateAgent = async (
  agent_id: string,
  payload: CreateAgentPayload
) => {
  const url = `/agent/${agent_id}`;
  const response = await api.put<Agent>(url, payload, { bearer: true });
  revalidatePath("/agents", "layout");
  return response;
};

export const createAgent = async (payload: CreateAgentPayload) => {
  const url = `/agent`;
  const response = await api.post<Agent>(url, payload, { bearer: true });
  revalidatePath("/agents", "layout");
  return response;
};

export const deleteAgent = async (agent_id: string) => {
  const url = `/agent/${agent_id}`;
  const response = await api.delete(url, { bearer: true });
  revalidatePath("/agents", "layout");
  return response;
};
