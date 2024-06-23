export interface user {
  id: number;
  user_name: string;
  user_email: string;
  user_photo: string;
  user_password: string;
  is_verified: boolean;
  role: string;
  created_at: Date;
  updated_at: Date;
}
