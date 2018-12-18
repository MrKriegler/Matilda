import { TaskData, TaskStatus, TaskType } from '@matilda/src/types';
import { ITaskStateParent } from './types';
import { TASK_STATE_CONSTRUCTORS } from './consts';


export function constructTaskState(
  parent: ITaskStateParent,
  task: TaskData
): TaskState {
  const Constructor = TASK_STATE_CONSTRUCTORS[task.type] && TASK_STATE_CONSTRUCTORS[task.type][task.status];

  if (!Constructor) {
    throw new Error(`Unrecognized type of task or status: ${task.type}:${task.status}`);
  }

  return new Constructor(parent, task);
}

export function constructCreateTaskState(
  parent: ITaskStateParent,
  type: TaskType
): TaskState {
  const Constructor = TASK_STATE_CONSTRUCTORS[type]
  && TASK_STATE_CONSTRUCTORS[type]['create'];

  if (!Constructor) {
  throw new Error(`Unrecognized type of task: ${type}`);
  }

  return new Constructor(parent, <any> { type });
}

export abstract class TaskState {
  public constructor(
    protected parent: ITaskStateParent,
    public task: TaskData
  ) {

  }

  public async onExit(targetStatus: TaskStatus): Promise<void> {
    return void 0;
  }

  public async onEnter(sourceStatus: TaskStatus): Promise<void> {
    return void 0;
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    const sourceStatus = this.task.status;
    await this.onExit(targetStatus);
    this.task.status = targetStatus;
    const newState = constructTaskState(this.parent, this.task);
    await newState.onEnter(sourceStatus);
    return newState;
  }

  public async update(data: TaskData): Promise<void> {
    return void 0;
  }
}

