import Chance from 'chance';
import { expect, AssertionError } from 'chai';
import { IGlobalTestStateHolder } from './base-test-steps';
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

  public server_returned_error(expectedStatus?: string, message?: RegExp | string) {
    expect(this.state.lastError, 'server should have failed').to.exist;
    if (!expectedStatus) {
      // failed with an error, we don't care which one
      return;
    }
    let e = this.state.lastError;
    let statuses = [];
    while (e) {
      if (e.status) { statuses.push(e.status); }
      e = e.reason;
    }
    expect(statuses, `server should have failed with ${expectedStatus}`).to.contain(expectedStatus);

    if (message) {
      if (typeof message === 'string') {
        expect(this.state.lastError.message).to.contain(message);
      } else {
        expect(this.state.lastError.message).to.match(message);
      }
    }
  }

  public server_returned_error_object(validate: any) {
    expect(this.state.lastError, 'server should have failed').to.exist;
    expect(this.state.lastError.status).to.eq('E-OTHER');
    expect(this.state.lastError.cause).to.exist;
    let e = this.state.lastError.cause;
    Object.keys(validate)
      .forEach(key => expect(e[key]).to.eq(validate[key]));
  }

  public async runRequest<T>(fn: () => Promise<T>): Promise<T | undefined> {
    try {
      this.state.lastError = null;
      return await fn();
    } catch (e) {
      this.state.lastError = e;
      console.log(e);
      return undefined;
    }
  }

  public async waitUntilAssertionsSucceed<T>(timeout: number,
                                             fn: () => Promise<T>): Promise<T> {
    let lastTime = Date.now() + timeout;
    let lastError: any;
    while (Date.now() < lastTime) {
      try {
        return await fn();
      } catch (e) {
        if (e instanceof AssertionError) {
          lastError = e;
          await sleep(100);
          continue;
        }
        throw e;
      }
    }
    throw lastError;
  }

  public randomPhoneNumber(): string {
    return `+${chance.natural({ min: 100000000000, max: 999999999999 })}`;
  }

  public randomSALocalPhoneNumber(): string {
    return `0${chance.natural({ min: 600000000 , max: 799999999 })}`;
  }
}
