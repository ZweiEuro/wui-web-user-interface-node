import { WuiSupported } from '../src/index';

let windowSpy: jest.SpyInstance;

beforeEach(() => {
  windowSpy = jest.spyOn(global as any, 'window', 'get');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('index', () => {
  describe('Basic mock test', () => {
    it('without wui its undefined', () => {
      expect(WuiSupported()).toBe(false);
    });

    it('Mimic wui and check', () => {
      windowSpy.mockImplementation(() => ({
        WuiQuery: () => {},
        WuiQueryCancel: () => {},
      }));

      expect(WuiSupported()).toBe(true);
    });
  });
});
