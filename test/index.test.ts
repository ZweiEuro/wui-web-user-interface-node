import { queryByAttribute } from '@testing-library/react';
import { WuiSupported, sendEvent } from '../src/index';
import { checkWuiSupported } from '../src/types';

describe('Test wui support throw', () => {
  it('without wui its undefined', () => {
    expect(WuiSupported()).toBe(false);
  });

  it('expect an error element to be created on failure', () => {
    checkWuiSupported();

    expect(globalThis.document.body.childElementCount).toBeGreaterThan(0);
    expect(globalThis.document.body.firstChild).toBeDefined();

    expect(
      queryByAttribute('id', globalThis.document.body, 'ReplaySettings')
    ).toBeDefined();
  });

  it('throw without backend', async () => {
    await expect(async () => {
      await sendEvent('test', {});
    }).rejects.toThrow();
  });
});
