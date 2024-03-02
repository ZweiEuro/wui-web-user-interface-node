import { WuiSupported, sendEvent } from '../src/index';

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
