export type User = {
  id: number;
  userName?: string;
  userEmail: string;
  role: string;
  isVerified: boolean;
  userPhoto?: string;
  userPassword?: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
