import mongoose from 'mongoose';
import { TaskData } from '@matilda/src/types';
import { findNextSequenceNumber, throwError, ERRORS } from '@matilda/lib/common';


export class TaskStore {

  public async createTask(task: TaskData): Promise<TaskData> {
    task.id = 'id:task:' + await findNextSequenceNumber(mongoose.connection, 'task_id');
    task.version = 1;

    await mongoose
      .connection
      .collection('tasks')
      .insertOne(task);

    return task;
  }

  public async updateTask(task: TaskData): Promise<TaskData> {
    let query: any = { id: task.id, version: task.version };

    if (!task.version) {
      task.version = 1;
      query = { id: task.id, version: { $exists: false } };
    } else {
      task.version ++;
    }

    const result = await mongoose
      .connection
      .collection('tasks')
      .updateOne(query, { $set: task });

    if (result.modifiedCount === 0) {
      throwError(ERRORS.ECONFLICT, "Referenced task has been updated by a concurrent process, please refresh");
    }

    return task;
  }

}

