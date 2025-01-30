"use server";

import { api } from "@/lib/fetchAPI";
import { createParams, SearchParams } from "@/lib/searchParams";
import { ListOrganizationsResponse, Organizations } from "./interface";
import { revalidatePath } from "next/cache";
import { OrganizationValues } from "./validation";

export const getOrganizations = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/organizations/all${searchParams ? `?${searchParams}` : ""}`;
  const response = await api.get<ListOrganizationsResponse>(url, {
    bearer: true,
  });
  return response;
};

export const setOrganization = async (organizationId: string) => {
  const url = `/organizations/${organizationId}/set-active`;
  const response = await api.post<null>(
    url,
    {},
    {
      bearer: true,
    }
  );
  revalidatePath("/", "layout");
  return response;
};

export const createOrganization = async (payload: OrganizationValues) => {
  const url = `/organizations/`;
  const response = await api.post<Organizations>(url, payload, {
    bearer: true,
  });
  revalidatePath("/", "layout");
  return response;
};

export const updateOrganization = async (
  organizationId: string,
  payload: OrganizationValues
) => {
  const url = `/organizations/${organizationId}`;
  const response = await api.put<Organizations>(url, payload, {
    bearer: true,
  });
  revalidatePath("/", "layout");
  return response;
};

export const deleteOrganization = async (
  organizationId: string,
) => {
  const url = `/organizations/${organizationId}`;
  const response = await api.delete<null>(url, {
    bearer: true,
  });
  revalidatePath("/", "layout");
  return response;
};
