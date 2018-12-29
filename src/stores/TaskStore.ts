import mongoose from 'mongoose';
import { Cursor } from "mongodb";
import { TaskData } from '@matilda/src/types';
import { findNextSequenceNumber, throwError, ERRORS, IMongoStoreQuery } from '@matilda/lib/common';


export class TaskStore {

  public async createTask(task: TaskData): Promise<TaskData> {
    task.id = `id:task:${await findNextSequenceNumber(mongoose.connection, 'task_id')}`;
    task.version = 1;
    await mongoose
    .connection
    .collection('tasks')
    .insertOne(task);

    return task;
  }

  public loadTasks(query: IMongoStoreQuery): Cursor<TaskData> {
    return mongoose
      .connection
      .collection('tasks')
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);
  }

  public async updateTask(task: TaskData): Promise<TaskData> {
    let query: any = { id: task.id, version: task.version };

    if (!task.version) {
      task.version = 1;
      query = { id: task.id, version: { $exists: false } };
    } else {
      task.version++;
    }

    const result = await mongoose
      .connection
      .collection('tasks')
      .updateOne(query, { $set: task });

    if (result.modifiedCount === 0) {
      throwError(ERRORS.ECONFLICT, 'Task has not been updated, this means a concurrent process has updated it.');
    }

    return task;
  }

}

export interface ITaskStore {
  loadTasks(query: IMongoStoreQuery): Cursor<TaskData>
  createTask(task: TaskData): Promise<TaskData>;
  updateTask(task: TaskData): Promise<TaskData>;
}
