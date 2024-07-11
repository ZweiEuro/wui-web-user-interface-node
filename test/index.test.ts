import { WuiSupported, sendEvent } from '../src/index';
import { checkWuiSupported } from '../src/types';

describe('Test wui support throw', () => {
  it('without wui its undefined', () => {
    expect(WuiSupported()).toBe(false);
  });

  it('expect an error element to be created on failure', () => {
    expect(() => {
      checkWuiSupported();
    }).toThrow();

    expect(globalThis.document.body.childElementCount).toBe(1);
    expect(globalThis.document.body.firstChild).toBeDefined();
  });

  it('throw without backend', async () => {
    await expect(async () => {
      await sendEvent('test', {});
    }).rejects.toThrow();
  });
});
