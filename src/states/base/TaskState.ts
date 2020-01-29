import { TaskData, TaskStatus, TaskType, TaskStatuses } from '@matilda/src/types';
import { ITaskStateParent, TASK_STATE_CONSTRUCTORS } from '../index';

// Needed as opposed to normal construct as the task does not exist yet
export function constructCreateTaskState(
  parent: ITaskStateParent,
  type: TaskType
): TaskState {
  const Constructor = TASK_STATE_CONSTRUCTORS[type] && TASK_STATE_CONSTRUCTORS[type][TaskStatuses.CREATED];
  if (!Constructor) {
    throw new Error(`Unrecognized type of task: ${type}`);
  }

  return new Constructor(parent, <any> { type });
}

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
    (<Array<keyof TaskData>> ['detail'])
      .forEach(property => {
        if (property in data) {
          //@ts-ignore
          this.task[property] = data[property];
        } else {
          delete this.task[property];
        }
      });
  }
}

