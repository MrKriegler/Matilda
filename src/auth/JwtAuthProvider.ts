import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { IAuthProvider, AuthUser } from './types';

export class JwtAuthProvider implements IAuthProvider {
  constructor(private secret: string) {}

  async authenticate(req: Request): Promise<AuthUser | null> {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return null;
    }

    try {
      const token = header.slice(7);
      const payload = jwt.verify(token, this.secret) as any;
      return {
        id: payload.sub,
        name: payload.name
      };
    } catch {
      return null;
    }
  }
}
