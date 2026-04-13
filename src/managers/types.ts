import { TaskData , CreateTaskPayload, UpdateTaskPayload, GetTaskPayload, DeleteTaskPayload, AddNotePayload } from '@matilda/src/types';

export interface ITaskManager {
  getTask(payload: GetTaskPayload): Promise<TaskData>
  listTasks(payload: any): Promise<{ tasks: TaskData[], total: number }>
  createTask(payload: CreateTaskPayload): Promise<TaskData>
  updateTask(payload: UpdateTaskPayload): Promise<TaskData>
  deleteTask(payload: DeleteTaskPayload): Promise<TaskData>
  addNote(payload: AddNotePayload): Promise<TaskData>
}
