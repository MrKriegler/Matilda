import { TaskData, TaskStatus, TaskStatuses } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';
import {ERRORS, throwError } from '@matilda/lib/common';


export class CreateDeinstallationTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async moveTo(targetStatus: TaskStatus, data: TaskData): Promise<TaskState> {
    if (targetStatus !== TaskStatuses.NEW) {
      throwError(ERRORS.EINVALID, `Illegal state transition from create to ${targetStatus}`);
    }

    // const provider = data.providerId && await this.parent.loadProvider(data.providerId)
    //   || throwError(ERRORS.EINVALID, 'valid providerId is required');
    // const company = data.companyId && await this.parent.loadCompany(data.companyId)
    //   || throwError(ERRORS.EINVALID, 'valid companyId is required');
    this.task.enabled = true;
    return await super.moveTo(targetStatus, data);
  }
}