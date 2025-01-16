import { api } from "@/lib/fetchAPI";

import { createParams } from "@/lib/searchParams";

import { SearchParams } from "@/lib/searchParams";
import { KnowledgeBase, ListKnowledgeBasesResponse } from "./interface";

export const getKnowledgeBases = async (params: SearchParams = {}) => {
  const searchParams = createParams(params);
  const url = `/knowledge-base/all${searchParams ? `?${searchParams}` : ""}`;

  const response = await api.get<ListKnowledgeBasesResponse>(url, {
    bearer: true,
  });

  return response;
};

export const getKnowledgeBase = async (knowledge_base_id: string) => {
  const url = `/knowledge-base/${knowledge_base_id}`;
  const response = await api.get<KnowledgeBase>(url, {
    bearer: true,
  });

  return response;
};
