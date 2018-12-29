import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class ScheduledInstallationTaskState extends TaskState {
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
      this.task.userId = data.userId;
    }

    return await super.update(data);
  }
}