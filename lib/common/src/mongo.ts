import mongoose from 'mongoose';
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

export async function configureMongoStores(): Promise<any> {
  await mongoose.connect(MONGO_URL);
  return {
    close: async () => {
      console.info('Disconnecting from mongodb...');
      await mongoose.disconnect();
    }
  };
}

export async function findNextSequenceNumber(db: mongoose.Connection, sequenceName: string): Promise<number> {
  const rec = await db
    .collection('sequences')
    .findOneAndUpdate(
      {_id: sequenceName as any},
      {$inc: {nextIndex: 1}},
      {upsert: true, returnDocument: 'after'}
    );

  return rec!.nextIndex as number;
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
