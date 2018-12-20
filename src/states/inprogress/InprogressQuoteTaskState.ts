import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';

export class InprogressQuoteTaskState extends TaskState {
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