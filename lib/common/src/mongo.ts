import * as mongodb from 'mongodb';
import mongoose from 'mongoose';
import { withCb } from './utils';
import { MONGO_URL } from './config';

export async function configureMongoStores(readPreference = mongodb.ReadPreference.PRIMARY_PREFERRED): Promise<any> {
  return withCb(cb => mongoose.connect(MONGO_URL, { readPreference, useNewUrlParser: true }, cb))
    .then(() => {
      return {
        close: (): any => {
          console.info("Disconnecting from mongodb...");
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