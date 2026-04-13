import { TaskState } from './base/TaskState';
import { ITaskStateParent } from './types';
import { TaskData, TaskStatuses, TaskTypes } from '@matilda/src/types';
import { NewTaskState } from './new';
import { ClosedTaskState } from './closed';
import { DeletedTaskState } from './deleted';
import { ScheduledTaskState } from './scheduled';
import { CreateTaskState } from './create';
import { InprogressTaskState } from './inprogress';

export const TASK_STATE_CONSTRUCTORS: {
  [type: string]:
    {
      [state: string]: new (parent: ITaskStateParent, task: TaskData) => TaskState
    }
  } = {
    [TaskTypes.QUOTE]: {
      [TaskStatuses.CREATED]: CreateTaskState,
      [TaskStatuses.NEW] : NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledTaskState,
      [TaskStatuses.INPROGRESS]: InprogressTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.INSTALLATION]: {
      [TaskStatuses.CREATED]: CreateTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledTaskState,
      [TaskStatuses.INPROGRESS]: InprogressTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.REPAIR]: {
      [TaskStatuses.CREATED]: CreateTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledTaskState,
      [TaskStatuses.INPROGRESS]: InprogressTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
    },
    [TaskTypes.DEINSTALLATION]: {
      [TaskStatuses.CREATED]: CreateTaskState,
      [TaskStatuses.NEW]: NewTaskState,
      [TaskStatuses.SCHEDULED]: ScheduledTaskState,
      [TaskStatuses.INPROGRESS]: InprogressTaskState,
      [TaskStatuses.CLOSED]: ClosedTaskState,
      [TaskStatuses.RESCHEDULED]: NewTaskState,
      [TaskStatuses.DELETED]: DeletedTaskState
  }
};
