import Chance from 'chance';
import { expect, AssertionError } from 'chai';
import { IGlobalTestStateHolder } from './base-test-steps';
import { Response } from 'superagent';
import { sleep } from '@matilda/lib/common'

const chance = new Chance();

export class SystemTestSteps {

  public constructor(private state: IGlobalTestStateHolder) {
    state.lastError = null;
  }

  public async initialize() {
  }

  public async close() {
  }

  public server_returned_success() {
    expect(
      this.state.lastError,
      `Error ${JSON.stringify(this.state.lastError)} returned when success was expected`
    ).to.not.exist;
  }

  public server_returned_error() {
    expect(this.state.lastError, 'server should have failed').to.exist;
  }

  public async runRequest(fn: () => Promise<Response>) {
    const response: Response = await fn();
    this.state.lastError = response.error || null;
    return response.body.data;
  }

  public randomPhoneNumber(): string {
    return `+${chance.natural({ min: 100000000000, max: 999999999999 })}`;
  }
}
