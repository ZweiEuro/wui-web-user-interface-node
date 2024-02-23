import { jestExport } from '../src/PersistentCallback';
import { sendEvent } from '../src/index';
import { WuiMock } from './wuiMock';

afterEach(() => {
  jest.restoreAllMocks();
  jestExport.resetCurrentPersistentQueriesToId();
});

describe('test no throw', () => {
  let windowSpy: jest.SpyInstance;

  const wuiMock = new WuiMock(false, false, false, false);

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
});

describe('test throw query', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(true, false, false, false);

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
});

describe('test failure query', () => {
  let windowSpy: jest.SpyInstance;
  const wuiMock = new WuiMock(false, false, true, false);

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
    }).rejects.toBe(
      '{"errorCode":10,"errorMessage":"mockError","eventName":"test"}'
    );
  });
});
