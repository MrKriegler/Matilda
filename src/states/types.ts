import { TaskData } from '@matilda/src/types';

export interface ITaskStateParent {
}

export interface ITaskStore {
  createTask(task: TaskData): Promise<TaskData>;
  updateTask(task: TaskData): Promise<TaskData>;
}

export interface ITaskManager {
  createTask(payload: CreateTaskPayload): Promise<TaskData>
}

export interface CreateTaskPayload {
  'task': TaskData;
}