import { TaskData } from '@matilda/src/types';
import { IGlobalTestStateHolder } from './base-test-steps';
import { Response } from 'superagent';
import * as chai from "chai";

chai.use(require("chai-http"));

import { request, expect } from 'chai';
import app from "@matilda/src/server";

export interface TaskTemplate {
  type: 'quote' | 'installation' | 'repair' | 'deinstallation';
  expectedStatus?: 'new' | 'scheduled' | 'inprogress' | 'closed' | 'rescheduled' | 'deleted';
  service?: string;
}

export class TaskTestSteps {
  public constructor(private state: IGlobalTestStateHolder){
  }

  public async initialize() {
  }

  public async new_task_is_created(template: TaskTemplate = { type: 'installation' }) {

    template.expectedStatus = template.expectedStatus || 'new';

    let taskData: TaskData = {
      type: template.type,
      status: template.expectedStatus,
      detail: 'Test task',
      version: 1,
      enabled: true
    };

    this.state.currentTask = {
      task: taskData
    };

    if (this.state.lastError) {
      return;
    }

    const createdTask = await this.state.system.runRequest(
      async () =>{
        const response: Response = await request(app).post('/api/v1/tasks').send(taskData)
        return response.body.data;
      }
    );

    expect(createdTask).to.be.an('object');

    const newTask: TaskData = <any> createdTask;
    this.state.currentTask.id = newTask.id;
    this.state.currentTask.task = newTask;

    expect(newTask.id).to.exist;
    expect(newTask.version).to.eq(1);
    expect(newTask.userId).to.not.exist;

    taskData.id = newTask.id;
    taskData.version = 1;

    delete (<any> newTask)._id;
    expect(newTask).to.deep.eq(taskData);
  }

  public async close() {
    return 0;
  }

}