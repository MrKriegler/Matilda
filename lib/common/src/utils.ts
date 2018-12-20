export function sleep(ms: number): Promise<any> {
  return new Promise(r => setTimeout(r, ms));
}


export function withCb<T>(fn: (cb: (err: any, ret?: T) => void) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => fn((err, ret) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(ret);
  }));
}