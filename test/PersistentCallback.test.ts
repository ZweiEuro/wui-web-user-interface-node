import { registerEventListener, unregisterEventListener } from '../src';
import { jestExport } from '../src/PersistentCallback';
import {
  unregisterFailureCallback,
  registerFailureCallback,
} from '../src/index';
import { WuiMock } from './wuiMock';

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jestExport.resetCurrentPersistentQueriesToId();

  unregisterFailureCallback();
});

const listener = jest.fn((payload: any) => {
  expect(payload).toEqual({ mockSuccess: true });
});

const failureCallackMock = jest.fn((code: number, msg: string) => {
  expect(code).toBe(10);
  expect(msg).toBe('mockError');
});

describe('tests no throw', () => {
  let windowSpy: jest.SpyInstance;

  const wuiMock = new WuiMock(false, false, false, false);

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
    }));

    // do not register a callback so the listener should give us an error
    //registerFailureCallback(failureCallackMock);
  });

  it('and unsub working normally', () => {
    registerEventListener('test', listener);

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();

    wuiMock.wuiMockOKAll(); // send success to everone

    // send system failure message
    wuiMock.wuiMockFailureAll();

    // unsubscribe
    expect(unregisterEventListener('test', listener)).toBe(true);
  });

  it('unsub twice', () => {
    registerEventListener('test', listener);

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();

    wuiMock.wuiMockOKAll(); // send success to everone

    // unsubscribe
    expect(unregisterEventListener('test', listener)).toBe(true);

    // unsubscribe again
    expect(unregisterEventListener('test', listener)).toBe(false);
  });

  it('unsub something that was never registered', () => {
    // unsubscribe
    expect(unregisterEventListener('test', listener)).toBe(false);
  });

  it('unregisterEventListener not throwing', () => {
    const listener = (x: any) => {
      expect(x).toEqual({ mockSuccess: true });
    };

    expect(() => {
      registerEventListener('test', listener);
    }).not.toThrow();

    expect(() => {
      unregisterEventListener('test', listener);
    }).not.toThrow();
  });
});

describe('tests failure callback', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(false, false, false, false);

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
    }));

    registerFailureCallback(failureCallackMock);
  });

  it('failure on register and unregister', () => {
    registerEventListener('test', listener);

    wuiMock.wuiMockFailureAll(); // send failure to everone

    // expect the failure callback to be called once
    expect(failureCallackMock).toHaveBeenCalledTimes(1);
  });
});

describe('throw on cancel', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(false, true, false, false);

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
    }));

    registerFailureCallback(failureCallackMock);
  });

  it('failure on cancel', () => {
    registerEventListener('test', listener);

    expect(() => {
      unregisterEventListener('test', listener);
    }).toThrow();
  });
});

describe('failure on cancel', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(false, false, false, true);

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
    }));

    registerFailureCallback(failureCallackMock);
  });

  it('failure on cancel', () => {
    registerEventListener('test', listener); // success
    unregisterEventListener('test', listener);

    // expect the failure callback to be called twice
    expect(failureCallackMock).toHaveBeenCalledTimes(1);
  });
});
