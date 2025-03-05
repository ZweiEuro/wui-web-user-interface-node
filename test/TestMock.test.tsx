import { renderHook } from '@testing-library/react';

import { useEventListener } from '../src/hooks';
import {
  TestMock,
  clearActiveMock,
  getActiveMock,
  setupWuiMock,
} from '../src/TestMock';
import { act } from 'react-dom/test-utils';

const failureCallackMock = jest.fn((code: number, msg: string) => {
  expect(code).toBe(10);
  expect(msg).toBe('mockError');
});

describe('test mocking class', () => {
  const mock = new TestMock(false, false, false, false);
  beforeEach(() => {
    setupWuiMock(mock, failureCallackMock);
  });

  test('return current mock object', () => {
    expect(getActiveMock()).toEqual(mock);

    expect(clearActiveMock()).toEqual(mock);

    expect(() => {
      getActiveMock();
    }).toThrow();
  });

  test('Can receive data for event', () => {
    const { result, unmount } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );

    expect(result.current).toEqual(null);

    act(() => {
      mock.wuiMockReceiveEvent('test', { mockSuccess: true });
    });

    unmount();

    expect(result.current).toEqual({ mockSuccess: true });
  });

  test('Can receive event on all registered calls', () => {
    const { result: result1, unmount: unmount1 } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );

    const { result: result2, unmount: unmount2 } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('secondTestEvent')
    );

    expect(result1.current).toEqual(null);
    expect(result2.current).toEqual(null);

    act(() => {
      mock.wuiMockReceiveAllEvents({ mockSuccess: true });
    });

    unmount1();
    unmount2();

    expect(result1.current).toEqual({ mockSuccess: true });
    expect(result2.current).toEqual({ mockSuccess: true });
  });

  test('Can mock failure events', () => {
    const { result, unmount } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );

    expect(result.current).toEqual(null);

    act(() => {
      mock.wuiMockFailureEvent('test', 10, 'mockError');
    });

    unmount();

    expect(failureCallackMock).toHaveBeenCalledTimes(1);

    expect(result.current).toEqual(null);
  });

  test('sending a mock a failure event to a unknown event query should throw', () => {
    expect(() => {
      mock.wuiMockFailureEvent('unknown', 10, 'mockError');
    }).toThrow('No query found');
  });

  test('incorrect usage of mock event sending', () => {
    act(() => {
      expect(() => {
        mock.wuiMockReceiveEvent('test', { mockSuccess: true });
      }).toThrow('No query found');
    });
  });
});
