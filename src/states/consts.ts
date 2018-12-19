import { TaskState } from './base/TaskState';
import { ITaskStateParent } from './types';
import { TaskData } from '@matilda/src/types';
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
    'quote': {
      'create': CreateQuoteTaskState,
      'new': NewTaskState,
      'scheduled': ScheduledQuoteTaskState,
      'inprogress': InprogressQuoteTaskState,
      'closed': ClosedTaskState,
      'rescheduled': NewTaskState,
      'deleted': DeletedTaskState
    },
    'installation': {
      'create': CreateInstallationTaskState,
      'new': NewTaskState,
      'scheduled': ScheduledInstallationTaskState,
      'inprogress': InprogressInstallationTaskState,
      'closed': ClosedTaskState,
      'rescheduled': NewTaskState,
      'deleted': DeletedTaskState
    },
    'repair': {
      'create': CreateRepairTaskState,
      'new': NewTaskState,
      'scheduled': ScheduledRepairTaskState,
      'inprogress': InprogressRepairTaskState,
      'closed': ClosedTaskState,
      'rescheduled': NewTaskState,
      'deleted': DeletedTaskState
    },
    'deinstallation': {
      'create': CreateDeinstallationTaskState,
      'new': NewTaskState,
      'scheduled': ScheduledDeinstallationTaskState,
      'inprogress': InprogressDeinstallationTaskState,
      'closed': ClosedTaskState,
      'rescheduled': NewTaskState,
      'deleted': DeletedTaskState
  }
};