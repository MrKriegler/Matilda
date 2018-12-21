import { ITaskStateParent, CreateTaskPayload, ITaskStore, UpdateTaskPayload, GetTaskPayload } from './types';
import { TaskData } from '@matilda/src/types';
import { constructCreateTaskState, constructTaskState } from '@matilda/src/states';
import { TaskStore } from '@matilda/src/stores/TaskStore';
import { throwError, ERRORS, payloadRequestToStoreRequest } from '@matilda/lib/common';

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
    let task = await this.getTask(payload);
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

  private get taskStateParent(): ITaskStateParent {
    return {}
  }

}
