import '@testing-library/jest-dom';
import {
  jestExport,
  unregisterFailureCallback,
} from '../src/PersistentCallback';

beforeAll(() => {
  jest.spyOn(global.console, 'warn').mockImplementation(() => {});
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jestExport.resetCurrentPersistentQueriesToId();

  Object.defineProperties(window, {
    WuiQuery: {
      value: undefined,
      writable: true,
    },
    WuiQueryCancel: {
      value: undefined,
      writable: true,
    },
  });

  unregisterFailureCallback();
});
