import { TaskData, TaskStatus } from '@matilda/src/types';
import { ITaskStateParent } from '../types';
import { TaskState } from '../TaskState';
import {ERRORS, throwError } from '@matilda/lib/common';

export class ScheduledQuoteTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    switch (targetStatus) {
      case 'rescheduled':
        break;

      case 'inprogress':
        break;

      default:
        throwError(ERRORS.EINVALID, 'Illegal state transition from open to ' + targetStatus);
    }

    return await super.moveTo(targetStatus, data);
  }

  public async update(data: TaskData): Promise<void> {
    if (data.userId !== this.task.userId) {
      throwError(ERRORS.EINVALID, 'valid installer user id required');
    }

    return await super.update(data);
  }
}