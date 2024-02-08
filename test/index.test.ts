import {
  WuiQueryOptions,
  WuiSupported,
  registerEventListener,
  sendEvent,
  unregisterEventListener,
} from '../src/index';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('tests without wui', () => {
  it('without wui its undefined', () => {
    expect(WuiSupported()).toBe(false);
  });

  it('throw without backend', async () => {
    await expect(async () => {
      await sendEvent('test', {});
    }).rejects.toThrow();
  });
});

function MockWuiQuerySuccess(opt: WuiQueryOptions): Promise<void> {
  opt.onSuccess('{"mockSuccess": true}');
  return Promise.resolve();
}

function MockWuiQueryCancelSuccess(opt: WuiQueryOptions): void {
  opt.onSuccess('{"mockSuccess": true}');
}

function MockWuiQueryFailure(opt: WuiQueryOptions): void {
  opt.onFailure(1, 'mockError');
}

describe('tests with working wui', () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: MockWuiQuerySuccess,
      WuiQueryCancel: MockWuiQueryCancelSuccess,
    }));
  });

  it('sendEvent not throwing', () => {
    expect(async () => {
      await sendEvent('test', {
        test: 'test',
      });
    }).not.toThrow();
  });

  it('sendEvent response being mock response', async () => {
    const k = await sendEvent('test', {
      test: 'test',
    });

    expect(k).toEqual({ mockSuccess: true });
  });

  it('registerEventListener not throwing', () => {
    expect(() => {
      registerEventListener('test', () => {});
    }).not.toThrow();
  });

  it('registerEventListener not throwing', () => {
    registerEventListener('test', x => {
      expect(x).toEqual({ mockSuccess: true });
    });
  });

  it('unregisterEventListener not throwing', () => {
    expect(() => {
      registerEventListener('test', () => {});
    }).not.toThrow();

    expect(() => {
      unregisterEventListener('test');
    }).not.toThrow();
  });
});

describe('tests with failing wui', () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: MockWuiQueryFailure,
      WuiQueryCancel: MockWuiQueryFailure,
    }));
  });

  it('sendEvent throwing', async () => {
    await expect(async () => {
      await sendEvent('test', {
        test: 'test',
      });
    }).rejects.toBe('{"errorCode":1,"errorMessage":"mockError"}');
  });

  it('registerEventListener throwing', () => {
    expect(() => {
      registerEventListener('test', () => {});
    }).toThrow();
  });

  it('unregisterEventListener to throw', () => {
    expect(() => {
      unregisterEventListener('test');
    }).toThrow();
  });
});
