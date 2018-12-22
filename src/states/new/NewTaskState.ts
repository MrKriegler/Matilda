import { TaskData, TaskStatus } from '@matilda/src/types';
import { TaskState, ITaskStateParent } from '../index';

export class NewTaskState extends TaskState {
  public constructor(parent: ITaskStateParent,
                     task: TaskData) {
    super(parent, task);
  }

  public async onEnter(sourceStatus: TaskStatus): Promise<void> {
    if (this.task.status === 'rescheduled') {
      const description = `Rescheduled ${this.task.type}`;
    }

    return super.onEnter(sourceStatus);
  }
}