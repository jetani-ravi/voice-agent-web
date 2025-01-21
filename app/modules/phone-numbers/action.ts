"use server";

import { cookies } from "next/headers";
import { InitiateCall } from "./interface";

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
