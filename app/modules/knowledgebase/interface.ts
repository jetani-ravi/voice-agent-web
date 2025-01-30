import { Pagination } from "@/types/api";

export interface KnowledgeBase {
  _id: string;
  name: string;
  file_name: string;
  description: string;
  similarity_top_k: string;
  status: string;
  vector_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_deleted: boolean;
  error?: string;
}

export type ListKnowledgeBasesResponse = {
  knowledge_bases: KnowledgeBase[];
  pagination: Pagination;
};
