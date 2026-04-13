import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class ScheduledTaskState extends TaskState {
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

      case 'deleted':
        break;

      default:
        throwError(ERRORS.EINVALID, 'Illegal state transition from scheduled to ' + targetStatus);
    }

    return await super.moveTo(targetStatus, data);
  }

  public async update(data: TaskData): Promise<void> {
    if (data.userId !== undefined) this.task.userId = data.userId;
    if (data.scheduledDate !== undefined) this.task.scheduledDate = data.scheduledDate;
    return await super.update(data);
  }
}
