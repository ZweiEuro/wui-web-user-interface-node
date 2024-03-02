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

  wuiMockOKAll() {
    this.openPersistentQueries_.forEach(query => {
      query.onSuccess('{"mockSuccess": true}');
    });
  }

  wuiMockFailureAll() {
    this.openPersistentQueries_.forEach(query => {
      query.onFailure(10, 'mockError');
    });
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
