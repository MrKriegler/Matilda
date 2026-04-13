import { Request } from 'express';

export interface AuthUser {
  id: string;
  name?: string;
}

export interface IAuthProvider {
  authenticate(req: Request): Promise<AuthUser | null>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
