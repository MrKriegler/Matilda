import * as os from 'os';

export interface IErrorConstructor {
  new(msg: string): any;
}

export interface IErrorDefinition {
  statusCode: number;
  status: string;
}

export function declareError(statusCode: number, status: string): IErrorDefinition {
  return { statusCode, status };
}

export const ERRORS = {
  EUNAUTHORIZED: declareError(401, 'E-UNAUTHORIZED'),
  ETOKENEXPIRED: declareError(401, 'E-TOKENEXPIRED'),
  ETOKENINVALID: declareError(401, 'E-TOKENINVALID'),
  EINVALID: declareError(400, 'E-INVALID'),
  ENOTFOUND: declareError(404, 'E-NOTFOUND'),
  EEXISTS: declareError(409, 'E-EXISTS'),
  ECONFLICT: declareError(500, 'E-CONFLICT'),
  EOTHER: declareError(500, 'E-OTHER'),
  EPIPECLOSED: declareError(0, 'E-PIPECLOSED'),
  EUNSUPPORTED: declareError(500, 'E-UNSU'),
  ETARGET: declareError(500, 'E-TARGET'),
  ETIMEOUT: declareError(408, 'E-TIMEOUT'),
  EBUSY: declareError(503, 'E-BUSY'),
  ERATELIMIT: declareError(429, 'E-RATELIMIT'),
  E2FAREQUIRED: declareError(401, 'E-2FAREQUIRED')
};

export interface PlatformError {
  statusCode: number;
  status: string;
  message: string;
  source: string;
  reason: any;
  stack: string;
  $platformError: boolean;
  meta?: any;
}

function translateReasonIfNecessary(reason: any): any {
  if (!reason) {
    return reason;
  }
  if (reason.stack) {
    return {
      message: `${reason.name} : ${reason.message}`,
      stack: reason.stack
    };
  } else if (typeof reason === 'string') {
    return reason;
  }
  return reason;
}

export function constructError(def: IErrorDefinition, message: string, reason?: any): PlatformError {
  let stack: string = (new Error()).stack || '';
  let ret: PlatformError = {
    statusCode: def.statusCode,
    status: def.status,
    message,
    source: source(),
    reason: translateReasonIfNecessary(reason),
    stack,
    meta: {},
    $platformError: true
  };
  return ret;
}

export function throwError(def: IErrorDefinition, message: string, reason?: any): never {
  throw constructError(def, message, reason);
}

export function isError(def: IErrorDefinition, e: any): boolean {
  return e && e.status && e.status === def.status;
}

export function source() {
  let name = process.env['SERVICE_NAME'] || process.argv;
  let hostname = os.hostname();
  let pid = process.pid;

  return `${hostname}:${pid}:${name}`;
}

export function convertToPlatformError(e: any) {
  if (e.$platformError) {
    return e;
  }
  if (e.constructor.name === 'ValidationError') {
    return constructError(ERRORS.EINVALID, e.message);
  }

  return constructError(ERRORS.ETARGET, `Error: ${e}`, e);
}

export function sanitizeError(e: any) {
  if (!e) { return e; }
  return {
    ...(e.status) && {status: e.status},
    ...(e.message) && {message: e.message},
    ...(e.reason) && {reason: e.reason},
    ...(e.meta) && {meta: e.meta},
    ...(e.statusCode) && {statusCode: e.statusCode}
  };
}