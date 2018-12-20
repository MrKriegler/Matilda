import mongoose from 'mongoose';
import { TaskData } from '@matilda/src/types';
import { MONGO_URL } from '@matilda/lib/common';
import { TaskTestSteps } from './task-test-steps';
import { SystemTestSteps } from './system-test-steps';
import { TEST_TIMEOUT } from '../consts';

export interface CurrentTaskData {
  id?: string;
  ref?: string;
  task?: TaskData;
}

export interface IGlobalTestStateHolder {
  currentTask: CurrentTaskData;
  lastError: any;
  readonly system: SystemTestSteps;
  readonly destructors: {(): Promise<any>}[];
}

export function setupTests(ptr: { timeout(ms: number): void }) {
  let utils: BaseTestSteps;
  ptr.timeout(TEST_TIMEOUT);

  before(async function () {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function() {
    utils = new BaseTestSteps();
    await utils.initialize();
  });

  afterEach(async function() {
    await utils.close();
  });

  return () => utils;
}

export class BaseTestSteps implements IGlobalTestStateHolder {
  public lastError: any;
  public currentTask: CurrentTaskData;

  public taskTest: TaskTestSteps;
  public system: SystemTestSteps;
  public destructors: {(): Promise<any>}[];

  public constructor() {
    this.taskTest = new TaskTestSteps(this);
    this.system = new SystemTestSteps(this);
    this.destructors = [];
  }

  public async initialize() {
    await this.taskTest.initialize();
    await this.system.initialize();
    return void 0;
  }

  public async close() {
    while (this.destructors.length) {
      await this.destructors.pop();
    }

    await this.taskTest.close();
    await this.system.close();
    return void 0;
  }
}