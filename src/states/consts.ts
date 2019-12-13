import { TaskState } from './base/TaskState';
import { ITaskStateParent } from './types';
import { TaskData, TaskStatuses, TaskTypes } from '@matilda/src/types';
import { NewTaskState } from './new';
import { ClosedTaskState } from './closed';
import { DeletedTaskState } from './deleted';
import {
  ScheduledQuoteTaskState,
  ScheduledInstallationTaskState,
  ScheduledRepairTaskState,
  ScheduledDeinstallationTaskState
} from './scheduled';
import {
  CreateQuoteTaskState,
  CreateInstallationTaskState,
  CreateRepairTaskState,
  CreateDeinstallationTaskState
} from './create';
import {
  InprogressQuoteTaskState,
  InprogressInstallationTaskState,
  InprogressRepairTaskState,
  InprogressDeinstallationTaskState
} from './inprogress';

export const TASK_STATE_CONSTRUCTORS: {
  [type: string]:
    {
      [state: string]: new (parent: ITaskStateParent, task: TaskData) => TaskState
    }
  } = {
    [TaskTypes.QUOTE]: {
      [TaskStatuses.CREATED]: CreateQuoteTaskState,
      [TaskStatuses.NEW] : NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledQuoteTaskState,
      [TaskStatuses.INPROGRESS]: InprogressQuoteTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.INSTALLATION]: {
      [TaskStatuses.CREATED]: CreateInstallationTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledInstallationTaskState,
      [TaskStatuses.INPROGRESS]: InprogressInstallationTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.REPAIR]: {
      [TaskStatuses.CREATED]: CreateRepairTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledRepairTaskState,
      [TaskStatuses.INPROGRESS]: InprogressRepairTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.DEINSTALLATION]: {
      [TaskStatuses.CREATED]: CreateDeinstallationTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledDeinstallationTaskState,
      [TaskStatuses.INPROGRESS]: InprogressDeinstallationTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
  }
};