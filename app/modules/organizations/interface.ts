import { Pagination } from "@/types/api";
import { Voice } from "../voice-library/interface";

// Base interface with common fields
interface BaseOrganization {
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

// Organizations without voices
export type Organizations = BaseOrganization;

// Organizations with voices
export interface ActiveOrganizationDetails extends BaseOrganization {
  voices: Voice[] | [];
}

// Aggregated organization (only necessary fields)
export type AggregatedOrganization = Omit<
  BaseOrganization,
  "created_at" | "updated_at" | "deleted_at"
>;

export interface ListOrganizationsResponse {
  organizations: Organizations[];
  pagination: Pagination;
}
