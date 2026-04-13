import { TaskData } from '@matilda/src/types';
import { IGlobalTestStateHolder } from './base-test-steps';
import { deepClone } from '@matilda/lib/common';
import { TEST_INSTALLER } from '../consts';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const { expect, request } = chai;
import app from "@matilda/src/server";

export interface TaskTemplate {
  type: 'quote' | 'installation' | 'repair' | 'deinstallation';
  expectedStatus?: 'new' | 'scheduled' | 'inprogress' | 'closed' | 'rescheduled' | 'deleted';
  customer?: { name: string; phone?: string; email?: string };
  site?: { address: string; city?: string; postcode?: string };
  service?: string;
}

const TEST_SCHEDULED_DATE = '2026-05-15';

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

    if (template.customer) taskData.customer = template.customer;
    if (template.site) taskData.site = template.site;

    this.state.currentTask = {
      task: taskData
    };

    if (this.state.lastError) {
      return;
    }

    const createdTask = await this.state.system.runRequest(
      async () => await request(app).post('/api/v1/tasks').send(taskData)
    );

    if (this.state.lastError) {
      return;
    }

    expect(createdTask).to.be.an('object');

    const newTask: TaskData = <any> createdTask;
    this.state.currentTask.id = newTask.id;
    this.state.currentTask.task = newTask;

    expect(newTask.id).to.exist;
    expect(newTask.ref).to.match(/^MAT-\d{5}$/);
    expect(newTask.version).to.eq(1);
    expect(newTask.userId).to.not.exist;
    expect(newTask.createdAt).to.exist;
    expect(newTask.updatedAt).to.exist;
    expect(newTask.notes).to.deep.eq([]);

    taskData.id = newTask.id;
    taskData.ref = newTask.ref;
    taskData.version = 1;
    taskData.createdAt = newTask.createdAt;
    taskData.updatedAt = newTask.updatedAt;
    taskData.notes = [];

    delete (<any> newTask)._id;
    expect(newTask).to.deep.eq(taskData);
  }

  public async task_is_scheduled() {
    return await this.task_is_updated('scheduled');
  }

  public async task_is_inprogress() {
    return await this.task_is_updated('inprogress');
  }

  public async task_is_closed() {
    return await this.task_is_updated('closed');
  }

  public async task_is_rescheduled() {
    return await this.task_is_updated('rescheduled');
  }

  public async task_is_deleted() {
    expect(this.state.currentTask.id).to.exist;

    const deletedTask = await this.state.system.runRequest(
      async () => await request(app).del(`/api/v1/tasks/${this.state.currentTask.id}`)
    );

    if (this.state.lastError) {
      return;
    }

    expect(deletedTask).to.be.an('object');

    const task: TaskData = <any> deletedTask;
    expect(task.status).to.eq('deleted');
    expect(task.enabled).to.eq(false);

    this.state.currentTask.task = task;
  }

  public async task_is_updated(status: TaskTemplate['expectedStatus']) {
    expect(this.state.currentTask.id).to.exist;

    let taskData = deepClone(this.state.currentTask.task);
    taskData.status = status;
    taskData.userId = TEST_INSTALLER;

    if (status === 'scheduled' && !taskData.scheduledDate) {
      taskData.scheduledDate = TEST_SCHEDULED_DATE;
    }

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
    this.state.currentTask.task.updatedAt = newTask.updatedAt;

    if (status === 'scheduled') {
      this.state.currentTask.task.scheduledDate = taskData.scheduledDate;
    }

    if (status === 'closed') {
      this.state.currentTask.task.completedAt = newTask.completedAt;
      expect(newTask.completedAt).to.exist;
    }

    delete (<any> newTask)._id;
    expect(newTask).to.deep.eq(this.state.currentTask.task);
  }

  public async list_tasks(query: any = {}) {
    const response = await this.state.system.runRequest(
      async () => {
        let req = request(app).get('/api/v1/tasks');
        Object.keys(query).forEach(key => {
          req = req.query({ [key]: query[key] });
        });
        return req;
      }
    );
    return response;
  }

  public async add_note(text: string) {
    expect(this.state.currentTask.id).to.exist;

    const response = await this.state.system.runRequest(
      async () => await request(app)
        .post(`/api/v1/tasks/${this.state.currentTask.id}/notes`)
        .send({ text })
    );

    if (!this.state.lastError) {
      this.state.currentTask.task = <any> response;
    }

    return response;
  }

  public async task_is_updated_raw(payload: any) {
    expect(this.state.currentTask.id).to.exist;

    let taskData = deepClone(this.state.currentTask.task);
    Object.assign(taskData, payload);

    await this.state.system.runRequest(
      async () => await request(app).put(`/api/v1/tasks/${this.state.currentTask.id}`).send(taskData)
    );
  }

  public async close() {
    return 0;
  }

}
