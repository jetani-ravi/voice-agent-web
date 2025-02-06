import { Pagination } from "@/types/api";

export interface ApiKey {
    _id: string;
    name: string;
    value: string;
    display_value: string;
    active: boolean;
    last_accessed_at?: string | null;
    org_id: string;
    user_id: string;
    created_at: string;
    expires_at?: string | null;
    deleted_at?: string | null;
  }

  export type ListApiKeysResponse = {
    api_keys: ApiKey[];
    pagination: Pagination;
  };