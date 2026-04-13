export { IAuthProvider, AuthUser } from './types';
export { JwtAuthProvider } from './JwtAuthProvider';
export { DevAuthProvider } from './DevAuthProvider';
export { authMiddleware } from './middleware';

import { IAuthProvider } from './types';
import { JwtAuthProvider } from './JwtAuthProvider';
import { DevAuthProvider } from './DevAuthProvider';

let customProvider: IAuthProvider | null = null;

export function setAuthProvider(provider: IAuthProvider): void {
  customProvider = provider;
}

export function getAuthProvider(): IAuthProvider {
  if (customProvider) {
    return customProvider;
  }

  const secret = process.env['MATILDA_JWT_SECRET'];
  if (secret) {
    return new JwtAuthProvider(secret);
  }

  return new DevAuthProvider();
}
