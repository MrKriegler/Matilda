import { TaskMongoStore, ITaskStore } from '@matilda/src/stores';
import { throwError, ERRORS, payloadRequestToStoreRequest } from '@matilda/lib/common';
import { constructCreateTaskState, constructTaskState, ITaskStateParent } from '@matilda/src/states';
import { TaskData , CreateTaskPayload, UpdateTaskPayload, GetTaskPayload, DeleteTaskPayload, TaskStatuses } from '@matilda/src/types';
import { ITaskManager } from './types';

 /**
  *  Task Manager manages the task logic
  */
export class TaskManager implements ITaskManager {
  private store: ITaskStore;

  /**
   *  Initialize the Task Store
   *  @todo: Allow for use of different stores/databases
   */
  public constructor(){
    this.store = new TaskMongoStore();
  }

  public async getTask(payload: GetTaskPayload): Promise<TaskData> {
    const query = payloadRequestToStoreRequest({ id: payload.id });
    query.filter.enabled = true;
    const tasks = await this.store.loadTasks(query).toArray();
    return tasks.length ? tasks[0] : null;
  }

  public async createTask(payload: CreateTaskPayload): Promise<TaskData> {
    let state = constructCreateTaskState(this.taskStateParent, payload.task.type);
    state = await state.moveTo(TaskStatuses.NEW, payload.task);
    await state.update(payload.task);
    return await this.store.createTask(state.task);
  }

   /**
    *  Gets task with ID
    *  Constructs the task state
    *  Move to new state if needed
    *  Update Task sate
    *  Save to DB
    */
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

   /**
    *  Gets task with ID
    *  Constructs the task state
    *  Moves task to deleted state
    *  Update Task sate
    *  Save to DB
    */
  public async deleteTask(payload: DeleteTaskPayload): Promise<TaskData> {
    const task = await this.getTask(payload);
    if (!task) {
      return throwError(ERRORS.ENOTFOUND, 'Task not found');
    }

    let state = constructTaskState(this.taskStateParent, task);
    state = await state.moveTo(TaskStatuses.DELETED, task);
    await state.update(task);

    return await this.store.updateTask(state.task);
  }

  private get taskStateParent(): ITaskStateParent {
    return {}
  }

}


