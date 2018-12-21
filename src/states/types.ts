import { Cursor } from "mongodb";
import { IMongoStoreQuery } from '@matilda/lib/common';
import { TaskData } from '@matilda/src/types';

export interface ITaskStateParent {
}

export interface ITaskStore {
  loadTasks(query: IMongoStoreQuery): Cursor<TaskData>
  createTask(task: TaskData): Promise<TaskData>;
  updateTask(task: TaskData): Promise<TaskData>;
}

export interface ITaskManager {
  getTask(payload: GetTaskPayload): Promise<TaskData|null>
  createTask(payload: CreateTaskPayload): Promise<TaskData>
  updateTask(payload: UpdateTaskPayload): Promise<TaskData>
}

export interface GetTaskPayload {
  'id':  string;
}

export interface CreateTaskPayload {
  'task': TaskData;
}

export interface UpdateTaskPayload {
  'id': string;
  'task': TaskData;
}