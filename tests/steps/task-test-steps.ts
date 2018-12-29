import { TaskData } from '@matilda/src/types';
import { IGlobalTestStateHolder } from './base-test-steps';
import { deepClone } from '@matilda/lib/common';
import { TEST_INSTALLER } from '../consts';
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
      async () => await request(app).post('/api/v1/tasks').send(taskData)
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

  public async task_is_scheduled() {
    return await this.task_is_updated('scheduled');
  }

  public async task_is_closed() {
    return await this.task_is_updated('closed');
  }

  public async task_is_updated(status: TaskTemplate['expectedStatus']) {
    expect(this.state.currentTask.id).to.exist;

    let taskData = deepClone(this.state.currentTask.task);
    taskData.status = status;
    taskData.userId = TEST_INSTALLER;

    const updatedTask = await this.state.system.runRequest(
      async () => await request(app).put(`/api/v1/tasks/${this.state.currentTask.id}`).send(taskData)
    );

    if (this.state.lastError) {
      return;
    }

    expect(updatedTask).to.be.an('object');

    const newTask: TaskData = <any> updatedTask;
    expect(newTask).to.exist;
    expect(newTask.status).to.eq(status);
    expect(newTask.version).to.eq(taskData.version + 1);

    this.state.currentTask.task.version = newTask.version;
    this.state.currentTask.task.status = status;
    this.state.currentTask.task.userId = taskData.userId;

    delete (<any> newTask)._id;
    expect(newTask).to.deep.eq(this.state.currentTask.task);
  }

  public async close() {
    return 0;
  }

}