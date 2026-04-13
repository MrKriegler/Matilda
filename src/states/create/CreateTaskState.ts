import { TaskData, TaskStatus, TaskStatuses } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class CreateTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    if (targetStatus !== TaskStatuses.NEW) {
      throwError(ERRORS.EINVALID, `Illegal state transition from create to ${targetStatus}`);
    }

    this.task.enabled = true;
    return await super.moveTo(targetStatus, data);
  }
}
