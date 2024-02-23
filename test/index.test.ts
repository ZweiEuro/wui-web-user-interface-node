import { jestExport } from '../src/PersistentCallback';
import { WuiSupported, sendEvent } from '../src/index';

afterEach(() => {
  jest.restoreAllMocks();
  jestExport.resetCurrentPersistentQueriesToId();
});

describe('Test wui support throw', () => {
  it('without wui its undefined', () => {
    expect(WuiSupported()).toBe(false);
  });

  it('throw without backend', async () => {
    await expect(async () => {
      await sendEvent('test', {});
    }).rejects.toThrow();
  });
});

/*
describe('tests with working wui', () => {
  let windowSpy: jest.SpyInstance;

  const wuiMock = new WuiMock();

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
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

    expect(jestExport.getCurrentPersistentQueriesToId()['test']).toBeDefined();
  });

  it('registerEventListener not throwing', () => {
    registerEventListener('test', x => {
      expect(x).toEqual({ mockSuccess: true });
    });
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

describe('tests with failing wui', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(true);

  beforeEach(() => {
    windowSpy = jest.spyOn(global as any, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      WuiQuery: wuiMock.wuiQuery.bind(wuiMock),
      WuiQueryCancel: wuiMock.wuiQueryCancel.bind(wuiMock),
    }));
  });

  it('sendEvent throwing', async () => {
    await expect(async () => {
      await sendEvent('test', {
        test: 'test',
      });
    }).rejects.toThrow();
  });

  it('registerEventListener throwing', () => {
    expect(() => {
      registerEventListener('test', () => {});
    }).toThrow();
  });

  it('unregisterEventListener to throw', () => {
    expect(() => {
      unregisterEventListener('test', () => {});
    }).not.toThrow();
  });
});
*/
