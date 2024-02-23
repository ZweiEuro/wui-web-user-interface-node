export interface WuiQueryOptions {
  persistent: boolean; // true means it can "resolve" multiple times
  request: string; // fully Request for WUI
  onSuccess: (successResponseObjectString: string) => void; // callback for success
  onFailure: (failureErrorCode: number, failureErrorMessage: string) => void; // callback for failure
}

export type WuiQueryId = number & { __type: 'PositiveNumber' };

declare global {
  interface Window {
    WuiQuery: (options: WuiQueryOptions) => WuiQueryId; // returns the ID of the query
    WuiQueryCancel: (options: WuiQueryId) => boolean; // returns true if the query was cancelled
  }
}

export function makeRejectString(
  errorCode: number,
  errorMessage: string,
  errorEventName?: string
): string {
  return JSON.stringify({
    errorCode: errorCode,
    errorMessage: errorMessage,
    eventName: errorEventName,
  });
}

/**
 * WUI is only supported in the WUI library and its internal functions
 *
 * @returns true if WUI is supported, false otherwise
 */
export function WuiSupported(): boolean {
  if (
    globalThis.window.WuiQuery === undefined ||
    globalThis.window.WuiQueryCancel === undefined
  ) {
    return false;
  }
  return true;
}

/**
 * throws an error if WUI is not supported
 */
export function checkWuiSupported(): void {
  if (!WuiSupported()) {
    throw new Error('WUI backend not found.');
  }
}
