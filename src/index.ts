/**
 * Main module for WUI event handling, registration and dispatching of events.
 * @module
 */

export { WuiSupported } from './types';

export {
  unregisterEventListener,
  registerEventListener,
  registerFailureCallback,
  unregisterFailureCallback,
} from './PersistentCallback';

export { sendEvent } from './singleEvents';
