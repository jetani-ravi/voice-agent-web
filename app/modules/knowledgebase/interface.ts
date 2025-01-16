import { Pagination } from "@/types/api";

export interface KnowledgeBase {
  _id: string;
  fileName: string;
  description: string;
  similarityTopK: string;
  status: string;
  vector_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  isDeleted: boolean;
}

export type ListKnowledgeBasesResponse = {
  knowledge_bases: KnowledgeBase[];
  pagination: Pagination;
};
