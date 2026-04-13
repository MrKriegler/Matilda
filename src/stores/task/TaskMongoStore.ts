import mongoose from 'mongoose';
import { FindCursor } from 'mongodb';
import { ITaskStore } from '../types';
import { TaskData, TaskNote } from '@matilda/src/types';
import { findNextSequenceNumber, throwError, ERRORS, IMongoStoreQuery } from '@matilda/lib/common';


export class TaskMongoStore implements ITaskStore {

  public async ensureIndexes(): Promise<void> {
    const collection = mongoose.connection.collection('tasks');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ enabled: 1, status: 1 });
    await collection.createIndex({ enabled: 1, type: 1, status: 1 });
    await collection.createIndex({ userId: 1, enabled: 1 });
    await collection.createIndex({ scheduledDate: 1, enabled: 1 });
    await collection.createIndex({ ref: 1 }, { unique: true, sparse: true });
  }

  public async createTask(task: TaskData): Promise<TaskData> {
    const seq = await findNextSequenceNumber(mongoose.connection, 'task_id');
    task.id = `mid:task:${seq}`;
    task.ref = `MAT-${String(seq).padStart(5, '0')}`;
    task.version = 1;
    task.notes = [];
    const now = new Date().toISOString();
    task.createdAt = now;
    task.updatedAt = now;
    await mongoose
    .connection
    .collection('tasks')
    .insertOne(task);

    return task;
  }

  public async countTasks(filter: any): Promise<number> {
    return mongoose
      .connection
      .collection('tasks')
      .countDocuments(filter);
  }

  public loadTasks(query: IMongoStoreQuery): FindCursor<TaskData> {
    return mongoose
      .connection
      .collection('tasks')
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit) as unknown as FindCursor<TaskData>;
  }

  public async updateTask(task: TaskData): Promise<TaskData> {
    let query: any = { id: task.id, version: task.version };

    if (!task.version) {
      task.version = 1;
      query = { id: task.id, version: { $exists: false } };
    } else {
      task.version++;
    }

    task.updatedAt = new Date().toISOString();

    const result = await mongoose
      .connection
      .collection('tasks')
      .updateOne(query, { $set: task });

    if (result.modifiedCount === 0) {
      throwError(ERRORS.ECONFLICT, 'Task has not been updated, this means a concurrent process has updated it.');
    }

    return task;
  }

  public async addNote(taskId: string, version: number, note: TaskNote): Promise<TaskData> {
    const result = await mongoose
      .connection
      .collection('tasks')
      .findOneAndUpdate(
        { id: taskId, version: version } as any,
        {
          $push: { notes: note },
          $inc: { version: 1 },
          $set: { updatedAt: new Date().toISOString() }
        } as any,
        { returnDocument: 'after' }
      );

    if (!result) {
      throwError(ERRORS.ECONFLICT, 'Task has been modified concurrently');
    }

    return result as unknown as TaskData;
  }

}
