import { TaskData, TaskStatus } from '@matilda/src/types';
import { ITaskStateParent } from '../types';
import { TaskState } from '../TaskState';
import {ERRORS, throwError } from '@matilda/lib/common';

export class DeletedTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    throwError(ERRORS.EINVALID, 'You cannot move to any state after the task has been deleted');
    return super.moveTo(targetStatus, data);
  }
}
