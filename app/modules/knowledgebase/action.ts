"use server";

import { api } from "@/lib/fetchAPI";

import { createParams, SearchParams } from "@/lib/searchParams";
import { KnowledgeBase, ListKnowledgeBasesResponse } from "./interface";
import { revalidatePath } from "next/cache";
import { KnowledgeBaseValues } from "./validation";

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

export const createKnowledgeBase = async (data: FormData) => {
  const url = `/knowledge-base/upload`;
  const response = await api.post<KnowledgeBase>(url, data, {
    bearer: true,
    formData: true,
  });
  revalidatePath("/knowledge-base");

  return response;
};

export const updateKnowledgeBase = async (id: string, data: KnowledgeBaseValues) => {
  const url = `/knowledge-base/${id}`;
  const response = await api.put<KnowledgeBase>(url, data, {
    bearer: true,
  });
  revalidatePath("/knowledge-base");

  return response;
};

export const deleteKnowledgeBase = async (id: string) => {
  const url = `/knowledge-base/${id}`;
  const response = await api.delete(url, {
    bearer: true,
  });
  revalidatePath("/knowledge-base");

  return response;
};
