import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class NewTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    switch (targetStatus) {
      case 'scheduled':
        if (!data.scheduledDate && !this.task.scheduledDate) {
          throwError(ERRORS.EINVALID, 'scheduledDate is required to schedule a task');
        }
        break;

      case 'deleted':
        break;

      default:
        throwError(ERRORS.EINVALID, `Illegal state transition from new to ${targetStatus}`);
    }

    return await super.moveTo(targetStatus, data);
  }

  public async update(data: TaskData): Promise<void> {
    if (data.userId !== undefined) this.task.userId = data.userId;
    return await super.update(data);
  }
}
