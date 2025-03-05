import { registerFailureCallback } from '../src';
import { WuiQueryId, WuiQueryOptions } from '../src/types';

export class WuiMock {
  public wuiQueryIdGenerator: number = 0;

  private throwQuery_: boolean = false;
  private throwCancel_: boolean = false;
  private failureNonPersistentQuery_: boolean = false;
  private failurePersistentQuery_: boolean = false;

  private openPersistentQueries_: Map<WuiQueryId, WuiQueryOptions> = new Map();

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
        options.onFailure(10, 'mockError');
        return -1 as WuiQueryId;
      } else {
        this.openPersistentQueries_.set(queryId, options);
      }
    } else {
      if (this.failureNonPersistentQuery_) {
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

    if (this.failurePersistentQuery_) {
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
   * Send event data to a previously opened query
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
export function setupWuiMock(
  mock: WuiMock,
  failureCb?: Parameters<typeof registerFailureCallback>[0]
): { mock: WuiMock; failureCb: typeof failureCb } {
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

  return {
    mock: mock,
    failureCb: failureCb,
  };
}
