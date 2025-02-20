"use server";

import {
  AvailablePhoneNumbers,
  InitiateCall,
  ListPhoneNumbersResponse,
  SyncPhoneNumbersResponse,
} from "./interface";
import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import {
  BuyPhoneNumber,
  buyPhoneNumberSchema,
  SearchPhoneNumbers,
} from "./validation";
import { revalidatePath } from "next/cache";

export const initiateCall = async (
  payload: InitiateCall,
  user_id: string,
  org_id: string
) => {
  const queryParams = new URLSearchParams({ user_id, org_id });
  const url = `/call?${queryParams.toString()}`;

  const response = await api.post(url, payload, {
    bearer: true,
  });

  return response;
};

export const getPhoneNumbers = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/phone-numbers/all${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListPhoneNumbersResponse>(url, {
    bearer: true,
  });
  return response;
};

export const searchAvailablePhoneNumbers = async (
  payload: SearchPhoneNumbers
) => {
  const searchParams = createParams(payload);
  const url = `/phone-numbers/available${
    searchParams ? `?${searchParams}` : ""
  }`;
  const response = await api.get<AvailablePhoneNumbers[]>(url, {
    bearer: true,
  });
  return response;
};

export const syncPhoneNumbers = async () => {
  const url = `/phone-numbers/sync`;
  const response = await api.post<SyncPhoneNumbersResponse>(
    url,
    {},
    {
      bearer: true,
    }
  );
  revalidatePath("/phone-numbers");
  return response;
};

export const deletePhoneNumber = async (id: string) => {
  const url = `/phone-numbers/${id}`;
  const response = await api.delete(url, {
    bearer: true,
  });
  revalidatePath("/phone-numbers");
  return response;
};

export const buyPhoneNumber = async (payload: BuyPhoneNumber) => {
  const parsedPayload = buyPhoneNumberSchema.safeParse(payload);
  if (!parsedPayload.success) {
    throw new Error(parsedPayload.error.message);
  }
  const url = `/phone-numbers/purchase`;
  const response = await api.post(url, parsedPayload.data, {
    bearer: true,
  });
  revalidatePath("/phone-numbers");
  return response;
};
