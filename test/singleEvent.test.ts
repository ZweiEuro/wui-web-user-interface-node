import { jestExport } from '../src/PersistentCallback';
import { sendEvent } from '../src/index';
import { TestMock, setupWuiMock } from '../src/TestMock';

afterEach(() => {
  jest.restoreAllMocks();
  jestExport.resetCurrentPersistentQueriesToId();
});

describe('test no throw', () => {
  const wuiMock = new TestMock(false, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock);
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
  const wuiMock = new TestMock(true, false, false, false);

  beforeEach(() => {
    setupWuiMock(wuiMock);
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
  const wuiMock = new TestMock(false, false, true, false);

  beforeEach(() => {
    setupWuiMock(wuiMock);
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
