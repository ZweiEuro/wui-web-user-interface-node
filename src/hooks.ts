import { useEffect, useState } from 'react';
import {
  registerEventListener,
  unregisterEventListener,
} from './PersistentCallback';

export function useEventListener<T extends Record<string, unknown>>(
  eventName: string
): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let callbackIdentifier: symbol | undefined = undefined;

    try {
      callbackIdentifier = registerEventListener(eventName, (data: T) => {
        setData(data);
      });
    } catch (e) {
      console.error('Error registering event listener', e);
    }

    return () => {
      if (callbackIdentifier) {
        unregisterEventListener(eventName, callbackIdentifier);
      }
    };
  }, []);

  return data;
}
