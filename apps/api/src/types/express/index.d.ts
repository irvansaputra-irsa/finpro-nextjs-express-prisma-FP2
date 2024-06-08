export type User = {
  userId: number;
  email: string;
  username: string;
  role: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
