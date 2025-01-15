"use server";

import { api } from "@/lib/fetchAPI";

export const getAgents = async () => {
  const response = await api.get(`/agent/all`, {
    bearer: true,
  });

  return response;
};
