"use server";

import { api } from "@/lib/fetchAPI";
import { TranscribersConfig } from "./interface";

export const getTranscribers = async () => {
  const url = `/configs/transcribers`;
  const response = await api.get<TranscribersConfig[]>(url, {
    bearer: true,
  });
  return response;
};
