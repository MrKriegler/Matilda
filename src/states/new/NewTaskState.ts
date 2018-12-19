import { TaskData, TaskStatus } from '@matilda/src/types';
import { ITaskStateParent } from '../types';
import { TaskState } from '../base/TaskState';

export class NewTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async onEnter(sourceStatus: TaskStatus): Promise<void> {
    if (this.task.status === 'rescheduled') {
      const description = `Cancelled callout for this.task.type`;
    }

    return super.onEnter(sourceStatus);
  }
}