import { replayTool_is_initialized } from './replayTool/replayTool.ts';

export interface WuiQueryOptions {
  persistent: boolean; // true means it can "resolve" multiple times
  request: string; // request as defined by CEF message routing API
  onSuccess: (successResponseObjectString: string) => void; // callback for success
  onFailure: (failureErrorCode: number, failureErrorMessage: string) => void; // callback for failure
}

export type WuiQueryId = number & { __type: 'PositiveNumber' };

/*
Why is this commented out?
A: Because deno does not allow global type augmentation https://jsr.io/docs/about-slow-types#global-augmentation 
This is annoying but not THAT bad thankfully

declare global {
  interface Window {
    WuiQuery: (options: WuiQueryOptions) => WuiQueryId; // returns the ID of the query
    WuiQueryCancel: (options: WuiQueryId) => boolean; // returns true if the query was cancelled
  }
}

// it makes ALL the window calls require an explicit cast
((globalThis.window as unknown as window_t) as unknown as window_t).WuiQuery

but thats not too bad, other than being really ugly

*/

export type window_t = {
  WuiQuery: (options: WuiQueryOptions) => WuiQueryId; // returns the ID of the query
  WuiQueryCancel: (options: WuiQueryId) => boolean; // returns true if the query was cancelled
} & globalThis.Window;

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
 * @brief WUI is only supported in the WUI library and its internal functions. Detected via the global object.
 *
 * @returns true if WUI is supported, false otherwise.
 */
export function WuiSupported(): boolean {
  if (
    (globalThis.window as unknown as window_t).WuiQuery === undefined ||
    (globalThis.window as unknown as window_t).WuiQueryCancel === undefined
  ) {
    return false;
  }
  return true;
}

/**
 * @brief Check if wui is supported, will throw if it isn't.
 */
export function checkWuiSupported(): void {
  if (!WuiSupported()) {
    if (replayTool_is_initialized == false) {
      const last_timestamp = localStorage.getItem('wuiWarningWasShown');
      // show warning once a day
      if (
        last_timestamp === null ||
        Date.now() - parseInt(last_timestamp) > 24 * 60 * 60 * 1000 // a day has passed
      ) {
        globalThis.alert(
          'WUI is running outside the supported environment.\nYou will encounter undefined behavior. Note: The standard "background" in a browser is white, your entire website might be white on white.\nWarning shown every 24h, timestamp save in local storage.'
        );
        localStorage.setItem('wuiWarningWasShown', Date.now().toString());
      }
    }

    throw new Error('WUI is not supported in this environment');
  }
}
