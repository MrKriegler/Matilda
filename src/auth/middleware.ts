import { Request, Response, NextFunction } from 'express';
import { getAuthProvider } from './index';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const provider = getAuthProvider();
    const user = await provider.authenticate(req);

    if (!user) {
      return res.status(401).json({ statusCode: 401, status: 'E-UNAUTHORIZED', message: 'Authentication required' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
