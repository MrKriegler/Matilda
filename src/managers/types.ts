import { TaskData , CreateTaskPayload, UpdateTaskPayload, GetTaskPayload, DeleteTaskPayload } from '@matilda/src/types';

export interface ITaskManager {
  getTask(payload: GetTaskPayload): Promise<TaskData>
  createTask(payload: CreateTaskPayload): Promise<TaskData>
  updateTask(payload: UpdateTaskPayload): Promise<TaskData>
  deleteTask(payload: DeleteTaskPayload): Promise<TaskData>
}
