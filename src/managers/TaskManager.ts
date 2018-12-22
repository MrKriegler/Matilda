import { TaskStore, ITaskStore } from '@matilda/src/stores/TaskStore';
import { throwError, ERRORS, payloadRequestToStoreRequest } from '@matilda/lib/common';
import { constructCreateTaskState, constructTaskState, ITaskStateParent } from '@matilda/src/states';
import { TaskData , CreateTaskPayload, UpdateTaskPayload, GetTaskPayload, DeleteTaskPayload } from '@matilda/src/types';

export class TaskManager {
  private store: ITaskStore;

  public constructor(){
    this.store = new TaskStore();
  }

  public async getTask(payload: GetTaskPayload): Promise<TaskData|null> {
    const query = payloadRequestToStoreRequest({ id: payload.id });
    query.filter.enabled = true;
    const tasks = await this.store.loadTasks(query).toArray();
    return tasks.length ? tasks[0] : null;
  }

  public async createTask(payload: CreateTaskPayload): Promise<TaskData> {
    let state = constructCreateTaskState(this.taskStateParent, payload.task.type);
    state = await state.moveTo('new', payload.task);
    await state.update(payload.task);
    return await this.store.createTask(state.task);
  }

  public async updateTask(payload: UpdateTaskPayload): Promise<TaskData> {
    const task = await this.getTask(payload);
    if (!task) {
      return throwError(ERRORS.ENOTFOUND, 'Task not found');
    }

    let state = constructTaskState(this.taskStateParent, task);
    if (task.status !== payload.task.status) {
      state = await state.moveTo(payload.task.status, payload.task);
    }

    await state.update(payload.task);

    return await this.store.updateTask(state.task);
  }

  public async deleteTask(payload: DeleteTaskPayload): Promise<TaskData> {
    const task = await this.getTask(payload);
    if (!task) {
      return throwError(ERRORS.ENOTFOUND, 'Task not found');
    }

    let state = constructTaskState(this.taskStateParent, task);
    state = await state.moveTo('deleted', task);
    await state.update(task);

    return await this.store.updateTask(state.task);
  }

  private get taskStateParent(): ITaskStateParent {
    return {}
  }

}

export interface ITaskManager {
  getTask(payload: GetTaskPayload): Promise<TaskData|null>
  createTask(payload: CreateTaskPayload): Promise<TaskData>
  updateTask(payload: UpdateTaskPayload): Promise<TaskData>
  deleteTask(payload: DeleteTaskPayload): Promise<TaskData>
}

