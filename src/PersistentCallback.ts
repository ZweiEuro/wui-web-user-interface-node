import { WuiQueryId, checkWuiSupported, window_t } from './types.ts';

export class PersistentCallbacksManager {
  private queryId_: WuiQueryId | null = null;
  private eventName_: string;

  private dataCallbacks_: Map<symbol, (arg: unknown) => void> = new Map();

  constructor(eventName: string) {
    this.eventName_ = eventName;
  }

  onData(rawData: string): void {
    this.dataCallbacks_.forEach(callback => callback(JSON.parse(rawData)));
  }

  onFailure(errorCode: number, errorMessage: string): void {
    if (failureCallback) {
      failureCallback(errorCode, errorMessage);
    } else {
      console.warn(
        'PersistentCallbacksManager.onFailure',
        errorCode,
        errorMessage
      );
    }
  }

  addOnData(callback: (arg: unknown) => void): symbol {
    const newSymbol = Symbol();

    this.dataCallbacks_.set(newSymbol, callback);

    if (this.queryId_ === null) {
      this.queryId_ = (globalThis.window as unknown as window_t).WuiQuery({
        persistent: true,
        request: JSON.stringify({ wuiEventName: this.eventName_ }),
        onSuccess: this.onData.bind(this),
        onFailure: this.onFailure.bind(this),
      });
    }

    return newSymbol;
  }

  removeOnData(callbackIdentifier: symbol): boolean {
    if (!this.dataCallbacks_.has(callbackIdentifier)) {
      return false;
    }

    this.dataCallbacks_.delete(callbackIdentifier);

    if (this.dataCallbacks_.size === 0) {
      if (this.queryId_ !== null) {
        if (
          (globalThis.window as unknown as window_t).WuiQueryCancel(
            this.queryId_
          ) === false
        ) {
          console.error(
            'PersistentCallbacksManager.removeOnData: WuiQueryCancel failed.'
          );
          return false;
        }
        this.queryId_ = null;
      }
    }
    return true;
  }
}

const currentPersistentQueriesToId: {
  [eventName: string]: PersistentCallbacksManager;
} = {};

let failureCallback:
  | undefined
  | ((errorCode: number, errorMessage: string) => void) = undefined;

function getPersistentCallbacksManager(eventName: string) {
  if (!currentPersistentQueriesToId[eventName]) {
    currentPersistentQueriesToId[eventName] = new PersistentCallbacksManager(
      eventName
    );
  }
  return currentPersistentQueriesToId[eventName];
}

/**
 * @brief Register a listener for a given event name.
 *
 * @param eventName for which the backend is listening
 * @param callback to call when the event is received
 *
 *
 */
export function registerEventListener<payload_t = Record<string, unknown>>(
  eventName: string,
  callback: (payload: payload_t) => void
): symbol {
  checkWuiSupported();

  const manager = getPersistentCallbacksManager(eventName);
  return manager.addOnData(callback as (arg: unknown) => void);
}

/**
 * @brief Unregister a listener for a given event name.
 *
 * @param eventName for which the backend is listening
 * @param callbackIdentifier to call when the event is received
 *
 * @returns true if the callback was removed, false otherwise (e.g. if it was not registered)
 *
 */
export function unregisterEventListener(
  eventName: string,
  callbackIdentifier: symbol
): boolean {
  checkWuiSupported();

  const manager = getPersistentCallbacksManager(eventName);
  return manager.removeOnData(callbackIdentifier);
}

/**
 * @brief register a single callback that is called when any persistent query fails. If none is registered a console warning is printed instead.
 *
 * @param callback to call when a persistent query fails
 */
export function registerFailureCallback(
  callback: (errorCode: number, errorMessage: string) => void
): void {
  failureCallback = callback;
}

/**
 * @brief unregister the failure callback
 */
export function unregisterFailureCallback(): void {
  failureCallback = undefined;
}

/**
 *
 * @returns the current failure callback
 */
export function getFailureCallback(): typeof failureCallback {
  return failureCallback;
}

// Testing

export const jestExport = {
  PersistentCallbacksManager,
  getCurrentPersistentQueriesToId: () => currentPersistentQueriesToId,
  resetCurrentPersistentQueriesToId: () => {
    for (const key in currentPersistentQueriesToId) {
      delete currentPersistentQueriesToId[key];
    }
  },
  getPersistentCallbacksManager,
};

// replayTool utility

export const replayToolExport = {
  getPersistentCallbacksManager: getPersistentCallbacksManager,
};
