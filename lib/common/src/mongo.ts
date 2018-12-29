import * as mongodb from 'mongodb';
import mongoose from 'mongoose';
import { withCb } from './utils';
import { MONGO_URL } from './config';

export interface IMongoStoreQuery {
  filter: any;
  sort: any;
  skip: number;
  limit: number;
}

export interface IPayloadQuery {
  sort?: string;
  dir?: number;
  skip?: number;
  limit?: number;

  [name: string]: any;
}

export async function configureMongoStores(readPreference = mongodb.ReadPreference.PRIMARY_PREFERRED): Promise<any> {
  return withCb(cb => mongoose.connect(MONGO_URL, { readPreference, useNewUrlParser: true }, cb))
    .then(() => {
      return {
        close: (): any => {
          console.info('Disconnecting from mongodb...');
          return withCb(cb => mongoose.disconnect(cb));
        }
      };
    });
}

export async function findNextSequenceNumber(db: mongoose.Connection, sequenceName: string): Promise<number> {
  const rec = await withCb<mongodb.FindAndModifyWriteOpResultObject>(cb => db
    .collection('sequences')
    .findOneAndUpdate(
      {_id: sequenceName},
      {$inc: {nextIndex: 2}},
      {upsert: true}, cb));

  return rec.value && rec.value.nextIndex || 1;
}

export function payloadRequestToStoreRequest(payload: IPayloadQuery): IMongoStoreQuery {
  let result: IMongoStoreQuery = {
    filter: { },
    sort: {},
    skip: 0,
    limit: 20
  };

  Object.keys(payload).forEach(key => {
    if (['sort', 'dir', 'skip', 'limit'].indexOf(key) > -1) {
      return;
    }
    result.filter[key] = payload[key];
  });

  if (payload.sort && payload.dir) {
    result.sort = { [payload.sort]: payload.dir };
  }

  if (payload.skip) {
    result.skip = payload.skip;
  }

  if (payload.limit) {
    result.limit = payload.limit;
  }
  return result;
}
