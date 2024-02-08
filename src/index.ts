interface WuiQueryOptions {
  persistent: boolean; // true means it can "resolve" multiple times
  request: string; // fully Request for WUI
  onSuccess: (successResponseObjectString: string) => void; // callback for success
  onFailure: (failureErrorCode: number, failureErrorMessage: string) => void; // callback for failure
}

declare global {
  interface Window {
    WuiQuery: (options: WuiQueryOptions) => void;
    WuiQueryCancel: (options: WuiQueryOptions) => void;
  }
}

export function WuiSupported(): boolean {
  if (
    globalThis.window.WuiQuery === undefined ||
    globalThis.window.WuiQueryCancel === undefined
  ) {
    return false;
  }
  return true;
}

function checkWuiSupported(): void {
  if (!WuiSupported()) {
    throw new Error('WUI backend not found.');
  }
}

export function sendEvent<
  payload_t extends Record<string, unknown>,
  successObject_t = Record<string, unknown>,
>(eventName: string, payload: payload_t): Promise<successObject_t> {
  checkWuiSupported();

  return new Promise<successObject_t>((resolve, reject) => {
    globalThis.window.WuiQuery({
      persistent: false,
      request: JSON.stringify({
        wuiEventName: eventName,
        wuiEventPayload: payload,
      }),
      onSuccess: function (response: string) {
        resolve(JSON.parse(response) as successObject_t);
      },
      onFailure: function (error_code: number, error_message: string) {
        reject(
          JSON.stringify({ errorCode: error_code, errorMessage: error_message })
        );
      },
    });
  });
}

export function registerEventListener<payload_t = Record<string, unknown>>(
  eventName: string,
  callback: (payload: payload_t) => void
): void {
  checkWuiSupported();

  globalThis.window.WuiQuery({
    persistent: true,
    request: JSON.stringify({ wuiEventName: eventName }),
    onSuccess: function (payloadString: string) {
      const payload = JSON.parse(payloadString) as payload_t;
      callback(payload);
    },
    onFailure: function (error_code: number, error_message: string) {
      throw new Error(
        `Failed to register event listener for event ${eventName} error_code: ${error_code} error_message: ${error_message}`
      );
    },
  });
}
