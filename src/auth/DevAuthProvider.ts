import { Request } from 'express';
import { IAuthProvider, AuthUser } from './types';

export class DevAuthProvider implements IAuthProvider {
  async authenticate(req: Request): Promise<AuthUser> {
    return { id: 'dev:user', name: 'Dev User' };
  }
}
