import { ProvidersStatus } from "@/constants/providers";

export interface CredentialConfig {
  label: string;
  placeholder?: string;
  type: string;
  required: boolean;
}

export interface SystemProviders {
  _id: string;
  name: string;
  category: string;
  credentials: Record<string, CredentialConfig>;
  is_supported?: boolean;
  version?: number;
  iconPath?: string;
  created_at: string;
  updated_at: string;
}

export interface ProvidersConnection {
  status: ProvidersStatus;
  credential: Record<string, string>;
  user_provider_id: string;
}

export interface ProvidersWithConnection {
  _id: string;
  name: string;
  category: string;
  credentials: Record<string, CredentialConfig>;
  is_supported?: boolean;
  version?: number;
  iconPath?: string;
  created_at: string;
  updated_at: string;
  connection: ProvidersConnection | null;
}

export type ListSystemProviders = {
  providers: ProvidersWithConnection[];
  count: number;
};

export interface UserProviders {
  _id: string;
  provider_id: string;
  user_id: string;
  credentials: Record<string, string>;
  status: ProvidersStatus;
  created_at: string;
  updated_at: string;
}

export type ListUserProviders = {
  providers: UserProviders[];
  count: number;
};
