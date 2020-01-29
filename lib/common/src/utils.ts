import { Response } from 'express';

export function sleep(ms: number): Promise<any> {
  return new Promise(r => setTimeout(r, ms));
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function withCb<T>(fn: (cb: (err: any, ret?: T) => void) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => fn((err, ret) => {
    if (err) {
      return reject(err);
    }
    return resolve(ret);
  }));
}

export async function runRequest<T>(res: Response, fn: () => Promise<T>) {
  try {
    const result = await fn();
    return res.status(200).json({ data: result });
  } catch (e) {
    const { statusCode, message, status } = e;
    const error = {
      statusCode,
      message,
      status
    }
    return res.status(statusCode).json(error);
  }
}