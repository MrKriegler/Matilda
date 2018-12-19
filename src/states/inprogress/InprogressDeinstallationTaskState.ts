import { TaskData, TaskStatus } from '@matilda/src/types';
import { ITaskStateParent } from '../types';
import { TaskState } from '../base/TaskState';
import {ERRORS, throwError } from '@matilda/lib/common';

export class InprogressDeinstallationTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }


  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    switch (targetStatus) {
      case 'rescheduled':
        break;

      case 'closed':

        break;

      default:
        throwError(ERRORS.EINVALID, 'Illegal state transition from inprogress to ' + targetStatus);
    }

    return await super.moveTo(targetStatus, data);
  }

}