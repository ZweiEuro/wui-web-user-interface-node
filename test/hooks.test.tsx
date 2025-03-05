import { renderHook } from '@testing-library/react';

import { useEventListener } from '../src/hooks';
import { TestMock, setupWuiMock } from '../src/TestMock';
import { act } from 'react-dom/test-utils';

describe('tests no throw persistent call', () => {
  const mock = new TestMock(false, false, false, false);
  beforeEach(() => {
    setupWuiMock(mock);
  });

  test('data can be forwarded', () => {
    const { result, unmount } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );

    expect(result.current).toEqual(null);

    act(() => {
      mock.wuiMockReceiveAllEvents({ mockSuccess: true });
    });

    unmount();

    expect(result.current).toEqual({ mockSuccess: true });
  });

  test('registration fail ', () => {
    const { result, unmount } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );

    expect(result.current).toEqual(null);

    act(() => {
      mock.wuiMockReceiveAllEvents({ mockSuccess: true });
    });

    unmount();

    expect(result.current).toEqual({ mockSuccess: true });
  });
});

describe('tests failure no backend', () => {
  beforeEach(() => {
    setupWuiMock(new TestMock(true, false, false, false));
  });

  test('failure on cancel', () => {
    const { result, unmount } = renderHook(() =>
      useEventListener<{ mockSuccess: boolean }>('test')
    );
    expect(result.current).toEqual(null);

    expect(console.error).toHaveBeenCalledTimes(1);
    unmount();
  });
});
