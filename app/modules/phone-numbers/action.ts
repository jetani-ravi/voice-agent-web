"use server";

import { cookies } from "next/headers";
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

export const initiateCall = async (payload: InitiateCall) => {
  const url = `${process.env.TELEPHONY_API_URL}/call`;
  const cookieStore = await cookies();
  let token;
  if (process.env.NODE_ENV === "production") {
    token = cookieStore.get("__Secure-authjs.session-token")?.value;
  } else {
    token = cookieStore.get("authjs.session-token")?.value;
  }
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to initiate call");
  }

  const data = await response.text();

  return data;
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
