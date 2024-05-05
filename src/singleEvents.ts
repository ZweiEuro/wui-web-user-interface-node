import { checkWuiSupported, makeRejectString } from './types';

/**
 * @brief Send a single event to a backend destination which is listening for it.
 *
 * @param eventName for which the backend is listening
 * @param payload
 * @returns resolve on success, reject on failure
 */
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
      onFailure: function (errorCode: number, errorMessage: string) {
        const errString = makeRejectString(errorCode, errorMessage, eventName);

        console.debug('sendEvent failed', errString);
        reject(errString);
      },
    });
  });
}
