import { registerEventListener, unregisterEventListener } from '../src';
import { jestExport } from '../src/PersistentCallback';
import { unregisterFailureCallback } from '../src/index';

import { WuiMock, setupWuiMock } from './wuiMock';

const listener = jest.fn((payload: any) => {
  expect(payload).toEqual({ mockSuccess: true });
});

const failureCallackMock = jest.fn((code: number, msg: string) => {
  expect(code).toBe(10);
  expect(msg).toBe('mockError');
});

describe('tests no throw', () => {
  const wuiMock = new WuiMock(false, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock);
  });

  it('and unsub working normally', () => {
    registerEventListener('test', listener);

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();

    wuiMock.wuiMockOKAll(); // send success to everone

    // send system failure message
    wuiMock.wuiMockFailureAll();

    expect(console.warn).toHaveBeenCalledTimes(1);

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
  const wuiMock = new WuiMock(false, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on register and unregister', () => {
    registerEventListener('test', listener);

    wuiMock.wuiMockFailureAll(); // send failure to everone

    // expect the failure callback to be called once
    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    unregisterFailureCallback();

    wuiMock.wuiMockFailureAll(); // send failure to everone

    // expect the failure callback to be called once
    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    // and now console.warn should have been called
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});

describe('throw on cancel', () => {
  const wuiMock = new WuiMock(false, true, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on cancel', () => {
    registerEventListener('test', listener);

    expect(() => {
      unregisterEventListener('test', listener);
    }).toThrow();
  });
});

describe('failure on cancel', () => {
  const wuiMock = new WuiMock(false, false, false, true);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on cancel', () => {
    registerEventListener('test', listener); // success
    unregisterEventListener('test', listener);

    expect(console.error).toHaveBeenCalledTimes(1);

    // expect the failure callback to be called twice
    expect(failureCallackMock).toHaveBeenCalledTimes(1);
  });
});
