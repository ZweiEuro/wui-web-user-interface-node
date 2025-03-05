import { registerFailureCallback } from '.';
import { WuiQueryId, WuiQueryOptions } from './types';

/**
 * Helper class to mock and test WuiQuery and WuiQueryCancel
 */
export class TestMock {
  public wuiQueryIdGenerator: number = 0;

  private throwQuery_: boolean = false;
  private throwCancel_: boolean = false;
  private failureNonPersistentQuery_: boolean = false;
  private failurePersistentQuery_: boolean = false;

  private openPersistentQueries_: Map<WuiQueryId, WuiQueryOptions> = new Map();

  /**
   * Create a new WuiMock
   * The flags are only necessary if you want to simulate your webpages behavior in case of a 'environment' error,
   * like running the webpage outside of the WUI environment.
   *
   * @param throwQuery Will cause wuiQuery to throw an error on _all_ requests.
   * @param throwCancel Will cause wuiQueryCancel to throw an error on _all_ requests that have previously been requested that are persistent (receiver registration).
   * @param failureSending Will cause wuiQuery to call the onFailure callback on _all_ non-persistent requests, hard-coded to 10 and 'mockError'.
   * @param failureSubscribe Will cause wuiQuery to call the onFailure callback on _all_ persistent requests, hard-coded to 10 and 'mockError'.
   */
  constructor(
    throwQuery: boolean,
    throwCancel: boolean,
    failureSending: boolean,
    failureSubscribe: boolean
  ) {
    this.throwQuery_ = throwQuery;
    this.throwCancel_ = throwCancel;
    this.failureNonPersistentQuery_ = failureSending;
    this.failurePersistentQuery_ = failureSubscribe;
  }

  private newQueryId(): WuiQueryId {
    return this.wuiQueryIdGenerator++ as WuiQueryId;
  }

  private getPersistentEventName(options: WuiQueryOptions): string {
    const parsed = JSON.parse(options.request) as { wuiEventName: string };
    return parsed.wuiEventName;
  }

  wuiQuery(options: WuiQueryOptions): WuiQueryId {
    if (this.throwQuery_) {
      throw new Error('Test Throw');
    }

    const queryId = this.newQueryId();
    if (options.persistent) {
      if (this.failurePersistentQuery_) {
        // this will land in the "failure callback" if one is registered
        options.onFailure(10, 'mockError');
        return -1 as WuiQueryId;
      } else {
        this.openPersistentQueries_.set(queryId, options);
      }
    } else {
      if (this.failureNonPersistentQuery_) {
        // this will cause the onFailure callback to be called, which in turn will cause a rejection
        options.onFailure(10, 'mockError');
      } else {
        options.onSuccess('{"mockSuccess": true}');
      }
    }

    return queryId;
  }

  wuiQueryCancel(queryId: WuiQueryId): boolean {
    if (this.throwCancel_) {
      throw new Error('Test Throw');
    }

    if (!this.openPersistentQueries_.has(queryId)) {
      // if no open query found return false
      return false;
    }

    // if it is found remove it return true
    this.openPersistentQueries_.delete(queryId);
    return true;
  }

  wuiMockReceiveAllEvents(payload: Record<string, unknown>) {
    this.openPersistentQueries_.forEach(query => {
      query.onSuccess(JSON.stringify(payload));
    });
  }

  /**
   * Send event data to a previously opened query. This simulates
   * that WUI (from the backend) has sent data to the website.
   * So the website is receiving the event
   *
   * @param eventName
   * @param data
   */
  wuiMockReceiveEvent(eventName: string, data: Record<string, unknown>) {
    // find the query that matches the event name, throw if none is found
    const query = Array.from(this.openPersistentQueries_.values()).find(
      query => this.getPersistentEventName(query) === eventName
    );

    if (!query) {
      throw new Error('No query found');
    }
    query.onSuccess(JSON.stringify(data));
  }

  wuiMockFailureAllEvents(
    failureErrorCode: number,
    failureErrorMessage: string
  ) {
    this.openPersistentQueries_.forEach(query => {
      query.onFailure(failureErrorCode, failureErrorMessage);
    });
  }

  wuiMockFailureEvent(
    eventName: string,
    failureErrorCode: number,
    errorMessage: string
  ) {
    // find the query that matches the event name, throw if none is found
    const query = Array.from(this.openPersistentQueries_.values()).find(
      query => this.getPersistentEventName(query) === eventName
    );

    if (!query) {
      throw new Error('No query found');
    }
    query.onFailure(failureErrorCode, errorMessage);
  }
}

let activeMock: TestMock | undefined = undefined;

/**
 * Setup a mock for WuiQuery and WuiQueryCancel
 * - Subsequent calls will overwrite the previous mock
 * - This overwrites the global WuiQuery and WuiQueryCancel functions
 *
 * @param mock mock and settings to apply
 * @param failureCb optional failure callback to register for _all_ persistent querie failures
 * @returns the mock and the failure callback
 */
export function setupWuiMock(
  mock: TestMock,
  failureCb?: Parameters<typeof registerFailureCallback>[0]
): { mock: TestMock; failureCb: typeof failureCb } {
  Object.defineProperties(window, {
    WuiQuery: {
      value: mock.wuiQuery.bind(mock),
      writable: true,
    },
    WuiQueryCancel: {
      value: mock.wuiQueryCancel.bind(mock),
      writable: true,
    },
  });

  if (failureCb) {
    registerFailureCallback(failureCb);
  }

  activeMock = mock;

  return {
    mock: mock,
    failureCb: failureCb,
  };
}

/**
 *
 * @returns the active mock or throws if none is present
 */
export function getActiveMock(): TestMock {
  if (!activeMock) {
    throw new Error('No active mock, call setupWuiMock first');
  }

  return activeMock;
}

/**
 * @brief Clears the active mock, if none is present it returns undefined
 *
 * @returns the active mock and clears it
 */
export function clearActiveMock(): TestMock | undefined {
  const ret = activeMock;
  activeMock = undefined;
  return ret;
}
