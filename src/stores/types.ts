import { FindCursor } from 'mongodb';
import { TaskData, TaskNote } from '@matilda/src/types';
import { IMongoStoreQuery } from '@matilda/lib/common';

export interface ITaskStore {
  loadTasks(query: IMongoStoreQuery): FindCursor<TaskData>;
  countTasks(filter: any): Promise<number>;
  createTask(task: TaskData): Promise<TaskData>;
  updateTask(task: TaskData): Promise<TaskData>;
  addNote(taskId: string, version: number, note: TaskNote): Promise<TaskData>;
}
