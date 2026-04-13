import { Response } from 'express';

export function sleep(ms: number): Promise<any> {
  return new Promise(r => setTimeout(r, ms));
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export async function runRequest<T>(res: Response, fn: () => Promise<T>) {
  try {
    const result = await fn();
    return res.status(200).json({ data: result });
  } catch (e: any) {
    if (e && e.$platformError) {
      const { statusCode, message, status } = e;
      return res.status(statusCode).json({ statusCode, message, status });
    }
    return res.status(500).json({ statusCode: 500, message: 'Internal server error', status: 'E-OTHER' });
  }
}
