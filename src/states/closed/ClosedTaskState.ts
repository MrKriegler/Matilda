import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';
import { TaskData, TaskStatus } from '@matilda/src/types';

export class ClosedTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async onEnter(sourceStatus: TaskStatus): Promise<void> {
    this.task.completedAt = new Date().toISOString();
    return super.onEnter(sourceStatus);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    throwError(ERRORS.EINVALID, 'You cannot move to any state after the task has been completed');
    return super.moveTo(targetStatus, data);
  }

  public async update(data: TaskData): Promise<void> {
    return void 0;
  }
}
