import { Pagination } from "@/types/api";

export interface ApiKey {
    _id: string;
    name: string;
    value: string;
    display_value: string;
    active: boolean;
    last_accessed_at?: Date | null;
    org_id: string;
    user_id: string;
    created_at: Date;
    expires_at?: Date | null;
    deleted_at?: Date | null;
  }

  export type ListApiKeysResponse = {
    api_keys: ApiKey[];
    pagination: Pagination;
  };