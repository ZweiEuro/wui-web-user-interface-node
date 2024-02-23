import { WuiQueryId, checkWuiSupported } from './types';

export class PersistentCallbacksManager {
  private queryId_: WuiQueryId | null = null;
  private eventName_: string;

  private dataCallbacks_: Array<(arg: unknown) => void> = [];

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

  addOnData(callback: (arg: unknown) => void) {
    this.dataCallbacks_.push(callback);

    if (this.queryId_ === null) {
      this.queryId_ = globalThis.window.WuiQuery({
        persistent: true,
        request: JSON.stringify({ wuiEventName: this.eventName_ }),
        onSuccess: this.onData.bind(this),
        onFailure: this.onFailure.bind(this),
      });
    }
  }

  removeOnData(callback: (arg: unknown) => void): boolean {
    const index = this.dataCallbacks_.indexOf(callback);
    if (index !== -1) {
      this.dataCallbacks_.splice(index, 1);
    } else {
      return false;
    }

    if (this.dataCallbacks_.length === 0) {
      if (this.queryId_ !== null) {
        if (globalThis.window.WuiQueryCancel(this.queryId_) === false) {
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
 * Register a listener for a given event name.
 *
 * @param eventName for which the backend is listening
 * @param callback to call when the event is received
 *
 *
 */
export function registerEventListener<payload_t = Record<string, unknown>>(
  eventName: string,
  callback: (payload: payload_t) => void
): void {
  checkWuiSupported();

  const manager = getPersistentCallbacksManager(eventName);
  manager.addOnData(callback as (arg: unknown) => void);
}

/**
 * Unregister a listener for a given event name.
 *
 * @param eventName for which the backend is listening
 * @param callback to call when the event is received
 *
 * @returns true if the callback was removed, false otherwise (e.g. if it was not registered)
 *
 */
export function unregisterEventListener<payload_t = Record<string, unknown>>(
  eventName: string,
  callback: (payload: payload_t) => void
): boolean {
  checkWuiSupported();

  const manager = getPersistentCallbacksManager(eventName);
  return manager.removeOnData(callback as (arg: unknown) => void);
}

export function registerFailureCallback(
  callback: (errorCode: number, errorMessage: string) => void
): void {
  failureCallback = callback;
}

export function unregisterFailureCallback(): void {
  failureCallback = undefined;
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
