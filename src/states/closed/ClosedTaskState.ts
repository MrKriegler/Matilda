import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class ClosedTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    throwError(ERRORS.EINVALID, 'You cannot move to any state after the task has been completed');
    return super.moveTo(targetStatus, data);
  }
}