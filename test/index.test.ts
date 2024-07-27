import { queryByAttribute } from '@testing-library/react';
import { WuiSupported, sendEvent } from '../src/index';
import { checkWuiSupported } from '../src/types';
import { initializeReplayTool } from '../src/replayTool/replayTool';

describe('Test wui support throw', () => {
  it('without wui its undefined', () => {
    expect(WuiSupported()).toBe(false);
  });

  it('expect an error element to be created on failure', () => {
    expect(() => {
      checkWuiSupported();
    }).toThrow();
  });

  it('starting the replay tool first should then define settings and avoid a crash', () => {
    initializeReplayTool(); // this should be called first, if so it should catch any problems like missing peer deps

    expect(() => {
      checkWuiSupported();
    }).not.toThrow();

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
