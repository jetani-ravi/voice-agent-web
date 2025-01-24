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
  iconPath: string;
  created_at: string;
  updated_at: string;
}

export type ListSystemProviders = {
  providers: SystemProviders[];
  count: number;
};

export interface UserProviders {
  _id: string;
  provider_id: string;
  user_id: string;
  credentials: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export type ListUserProviders = {
  providers: UserProviders[];
  count: number;
};
