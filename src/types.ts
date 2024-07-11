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
 * @brief WUI is only supported in the WUI library and its internal functions. Detected via the global object.
 *
 * @returns true if WUI is supported, false otherwise.
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
 * @brief Check if wui is supported, will throw if it isn't.
 */
export function checkWuiSupported(): void {
  if (!WuiSupported()) {
    if (globalThis.document !== undefined) {
      // This is a browser environment
      const errorElement = document.createElement('div');
      errorElement.innerHTML = `WUI backend not found! <br> 
      The UI plugin of WUI expects functions to be defined in the globalThis object. <br>
      Running this module outside of the WUI browser (as in any browser without WUI or node) will not work. <br>`;
      errorElement.style.color = 'red';
      errorElement.style.fontSize = '20px';
      errorElement.style.fontWeight = 'bold';
      errorElement.style.position = 'fixed';
      errorElement.style.top = '0';
      errorElement.style.left = '0';
      errorElement.style.zIndex = '9999';
      errorElement.style.backgroundColor = 'white';
      errorElement.style.padding = '10px';
      document.body.replaceChildren(errorElement);
    }

    throw new Error('WUI backend not found.');
  }
}
