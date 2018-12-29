import { Cursor } from 'mongodb';
import { TaskData } from '@matilda/src/types';
import { IMongoStoreQuery } from '@matilda/lib/common';

export interface ITaskStore {
  loadTasks(query: IMongoStoreQuery): Cursor<TaskData>
  createTask(task: TaskData): Promise<TaskData>;
  updateTask(task: TaskData): Promise<TaskData>;
}
