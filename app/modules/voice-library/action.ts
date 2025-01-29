"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { ListVoiceResponse } from "./interface";

export const getVoiceLibrary = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/voices${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListVoiceResponse>(url, {
    bearer: true,
  });
  return response;
};
