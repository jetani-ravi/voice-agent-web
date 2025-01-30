import { Pagination } from "@/types/api";

export interface Organizations {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  created_by: string;
  updated_by?: string;
  deleted_by?: string;
  is_deleted?: boolean;
}

export interface AggregatedOrganization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_by: string;
  updated_by?: string;
  deleted_by?: string;
  is_deleted?: boolean;
}

export interface ListOrganizationsResponse {
  organizations: Organizations[];
  pagination: Pagination;
}
