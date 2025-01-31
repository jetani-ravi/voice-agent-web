"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { ListVoiceResponse } from "./interface";
import { revalidatePath } from "next/cache";

export const getVoiceLibrary = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/voices${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListVoiceResponse>(url, {
    bearer: true,
  });
  return response;
};

export const addVoiceToOrganization = async (voiceId: string) => {
  const url = `/voices/${voiceId}/organization`;
  const response = await api.post<null>(
    url,
    {},
    {
      bearer: true,
    }
  );
  revalidatePath("/voice-library");
  return response;
};

export const removeVoiceFromOrganization = async (voiceId: string) => {
  const url = `/voices/${voiceId}/organization`;
  const response = await api.delete<null>(url, {
    bearer: true,
  });
  revalidatePath("/voice-library");
  return response;
};
