import { TaskState } from './TaskState';
import { ITaskStateParent } from './types';
import { TaskData } from '@matilda/src/types';
import { CreateQuoteTaskState, CreateInstallationTaskState, CreateRepairTaskState, CreateDeinstallationTaskState } from './create';

export const TASK_STATE_CONSTRUCTORS: {
  [type: string]:
    {
      [state: string]: new (parent: ITaskStateParent, task: TaskData) => TaskState
    }
  } = {
    'quote': {
      'create': CreateQuoteTaskState,
      'new': NewTaskState,
      'scheduled': OpenQuoteTaskState,
      'inprogress': InprogressQuoteTaskState,
      'closed': ClosedTaskState,
      'rescheduled': RescheduledTaskState,
      'deleted': DeletedTaskState
    },
    'installation': {
      'create': CreateInstallationTaskState,
      'new': NewTaskState,
      'scheduled': OpenInstallationTaskState,
      'inprogress': InprogressInstallationTaskState,
      'closed': ClosedTaskState,
      'rescheduled': RescheduledTaskState,
      'deleted': DeletedTaskState
    },

    'repair': {
      'create': CreateRepairTaskState,
      'new': NewTaskState,
      'scheduled': OpenRepairTaskState,
      'inprogress': InprogressRepairTaskState,
      'closed': ClosedTaskState,
      'rescheduled': RescheduledTaskState,
      'deleted': DeletedTaskState
    },

    'deinstallation': {
      'create': CreateDeinstallationTaskState,
      'new': NewTaskState,
      'scheduled': OpenDeinstallationTaskState,
      'inprogress': InprogressDeinstallationTaskState,
      'closed': ClosedTaskState,
      'rescheduled': RescheduledTaskState,
      'deleted': DeletedTaskState
  }
};