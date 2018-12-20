import { ITaskStateParent, CreateTaskPayload, ITaskStore } from './types';
import { TaskData } from '@matilda/src/types';
import { constructCreateTaskState } from '@matilda/src/states';
import { TaskStore } from '@matilda/src/stores/TaskStore';

export class TaskManager {
  private store: ITaskStore;

  public constructor(){
    this.store = new TaskStore();
  }

  public async createTask(payload: CreateTaskPayload): Promise<TaskData> {
    let state = constructCreateTaskState(this.taskStateParent, payload.task.type);
    state = await state.moveTo('new', payload.task);
    await state.update(payload.task);
    return await this.store.createTask(state.task);
  }

  private get taskStateParent(): ITaskStateParent {
    return {}
  }

}
