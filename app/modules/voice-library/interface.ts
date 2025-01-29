import { Pagination } from "@/types/api";

export interface Voice {
  _id: string;
  voice_id: string;
  provider: string;
  name: string;
  model: string;
  language_code: string;
  accent?: string;
  custom: boolean;
  gender?: string;
  age?: string;
  description?: string;
  use_case?: string;
  preview_url?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListVoiceResponse {
  voices: Voice[];
  pagination: Pagination;
}
