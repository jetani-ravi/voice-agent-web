import { SearchParams, createParams } from "@/lib/searchParams";

import { ListCallHistoryResponse, ExecutionModel } from "./interface";

import { api } from "@/lib/fetchAPI";

export const getCallHistory = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/execution/all${searchParams ? `?${searchParams}` : ""}`;

  const response = await api.get<ListCallHistoryResponse>(url, {
    bearer: true,
  });

  return response;
};

export const getCallHistoryById = async (id: string) => {
  const url = `/execution/${id}`;

  const response = await api.get<ExecutionModel>(url, {
    bearer: true,
  });

  return response;
};
