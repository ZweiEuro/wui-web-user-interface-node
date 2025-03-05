import { registerEventListener, unregisterEventListener } from '../src';
import { getFailureCallback, jestExport } from '../src/PersistentCallback';
import { unregisterFailureCallback } from '../src/index';

import { TestMock, setupWuiMock } from '../src/TestMock';

const listener = jest.fn((payload: any) => {
  expect(payload).toEqual({ mockSuccess: true });
});

const failureCallackMock = jest.fn((code: number, msg: string) => {
  expect(code).toBe(10);
  expect(msg).toBe('mockError');
});

describe('tests no throw', () => {
  const wuiMock = new TestMock(false, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock);
  });

  it('and unsub working normally', () => {
    const listenerSymbol = registerEventListener('test', listener);

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();

    wuiMock.wuiMockReceiveAllEvents({ mockSuccess: true }); // send success to everone

    // send system failure message
    wuiMock.wuiMockFailureAllEvents(10, 'mockError');

    expect(console.warn).toHaveBeenCalledTimes(1);

    // unsubscribe
    expect(unregisterEventListener('test', listenerSymbol)).toBe(true);
  });

  it('unsub twice', () => {
    const listenerSymbol = registerEventListener('test', listener);

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();

    wuiMock.wuiMockReceiveAllEvents({ mockSuccess: true }); // send success to every listener

    // unsubscribe
    expect(unregisterEventListener('test', listenerSymbol)).toBe(true);

    // unsubscribe again
    expect(unregisterEventListener('test', listenerSymbol)).toBe(false);
  });

  it('unsub something that was never registered', () => {
    // unsubscribe
    expect(unregisterEventListener('test', Symbol())).toBe(false);
  });

  it('unregisterEventListener not throwing', () => {
    const listener = (x: any) => {
      expect(x).toEqual({ mockSuccess: true });
    };

    let listenerSymbol: symbol | undefined = undefined;

    expect(() => {
      listenerSymbol = registerEventListener('test', listener);
    }).not.toThrow();

    expect(listenerSymbol).toBeDefined();

    expect(() => {
      if (listenerSymbol === undefined) {
        throw new Error('listenerSymbol is undefined');
      }
      unregisterEventListener('test', listenerSymbol);
    }).not.toThrow();
  });
});

describe('tests failure callback', () => {
  const wuiMock = new TestMock(false, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on register and unregister, check that getFailureCallback returns the correct one', () => {
    registerEventListener('test', listener);

    wuiMock.wuiMockFailureAllEvents(10, 'mockError'); // send failure to everyone

    // expect the failure callback to be called once
    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    expect(getFailureCallback()).toBe(failureCallackMock);

    unregisterFailureCallback();

    wuiMock.wuiMockFailureAllEvents(10, 'mockError'); // send failure to everyone

    // expect the failure callback to be called once
    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    // and now console.warn should have been called
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});

describe('throw on cancel', () => {
  const wuiMock = new TestMock(false, true, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on cancel', () => {
    const listenerSymbol = registerEventListener('test', listener);

    expect(() => {
      unregisterEventListener('test', listenerSymbol);
    }).toThrow();
  });
});

describe('failure on cancel', () => {
  const wuiMock = new TestMock(false, false, false, true);

  beforeEach(() => {
    setupWuiMock(wuiMock, failureCallackMock);
  });

  it('failure on cancel', () => {
    const listenerSymbol = registerEventListener('test', listener); // success
    unregisterEventListener('test', listenerSymbol);

    expect(console.error).toHaveBeenCalledTimes(1);

    // expect the failure callback to be called twice
    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    // cancelling the query should also fail
    expect(unregisterEventListener('test', listenerSymbol)).toBe(false);
  });
});
