import '@testing-library/jest-dom';
import { vi } from 'vitest';

const chromeStorage = new Map<string, unknown>();

const chromeMock = {
  runtime: {
    lastError: undefined as Error | undefined,
    onMessage: {
      addListener: vi.fn(),
      hasListener: vi.fn(),
      hasListeners: vi.fn(),
      removeListener: vi.fn(),
      getRules: vi.fn(),
      removeRules: vi.fn(),
      addRules: vi.fn(),
    },
  },
  storage: {
    local: {
      get: vi.fn(
        (
          keys: unknown,
          callback?: (items: Record<string, unknown>) => void,
        ) => {
          const keysArray = Array.isArray(keys)
            ? keys
            : typeof keys === 'string'
              ? [keys]
              : Object.keys((keys ?? {}) as Record<string, unknown>);
          const result: Record<string, unknown> = {};
          for (const key of keysArray) {
            result[key] = chromeStorage.get(key);
          }
          callback?.(result);
        },
      ),
      set: vi.fn((items: Record<string, unknown>, callback?: () => void) => {
        for (const [key, value] of Object.entries(items)) {
          chromeStorage.set(key, value);
        }
        callback?.();
      }),
    },
  },
};

Object.assign(globalThis, { chrome: chromeMock as unknown as typeof chrome });
