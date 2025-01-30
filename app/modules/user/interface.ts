export interface User {
  _id: string;
  email: string;
  name: string;
  admin: boolean;
  wallet: number;
  is_first_time_login: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type AuthResponse = User;
