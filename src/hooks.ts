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
    const receiver = (data: T) => {
      setData(data);
    };
    try {
      registerEventListener(eventName, receiver);
    } catch (e) {
      console.error('Error registering event listener', e);
    }

    return () => {
      unregisterEventListener(eventName, receiver);
    };
  }, []);

  return data;
}
