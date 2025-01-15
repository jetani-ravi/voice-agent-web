export interface User {
  _id: string;
  email: string;
  name: string;
  admin: boolean;
  wallet: number;
  isFirstTimeLogin: boolean;
  llmModels: string[];
  voices: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type AuthResponse = User