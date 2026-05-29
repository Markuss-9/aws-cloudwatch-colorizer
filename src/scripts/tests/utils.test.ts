import { describe, it, expect, vi, beforeEach } from 'vitest';
import defaultSettings from '@/defaultSettings';
import { getSettings, setSettings, settings } from '../utils';

describe('utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setSettings(defaultSettings);
  });

  describe('getSettings', () => {
    it('returns settings from chrome.storage.local', async () => {
      const storedSettings = { ...defaultSettings, master: false };
      vi.mocked(chrome.storage.local.get).mockImplementation(
        (
          _keys: string | string[] | Record<string, unknown> | null | undefined,
          callback?: (items: Record<string, unknown>) => void,
        ) => {
          callback?.({ settings: storedSettings });
        },
      );

      const result = await getSettings();
      expect(result).toEqual(storedSettings);
      expect(result.master).toBe(false);
    });

    it('returns default settings when nothing stored', async () => {
      vi.mocked(chrome.storage.local.get).mockImplementation(
        (
          _keys: string | string[] | Record<string, unknown> | null | undefined,
          callback?: (items: Record<string, unknown>) => void,
        ) => {
          callback?.({});
        },
      );

      const result = await getSettings();
      expect(result).toEqual(defaultSettings);
    });

    it('returns default settings when version mismatches', async () => {
      const oldSettings = { ...defaultSettings, version: '0.0.1' };
      vi.mocked(chrome.storage.local.get).mockImplementation(
        (
          _keys: string | string[] | Record<string, unknown> | null | undefined,
          callback?: (items: Record<string, unknown>) => void,
        ) => {
          callback?.({ settings: oldSettings });
        },
      );

      const result = await getSettings();
      expect(result).toEqual(defaultSettings);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        settings: defaultSettings,
      });
    });

    it('rejects when chrome.runtime.lastError is set', async () => {
      vi.mocked(chrome.storage.local.get).mockImplementation(
        (
          _keys: string | string[] | Record<string, unknown> | null | undefined,
          callback?: (items: Record<string, unknown>) => void,
        ) => {
          (chrome.runtime as { lastError: Error | undefined }).lastError =
            new Error('Storage error');
          callback?.({});
        },
      );

      await expect(getSettings()).rejects.toThrow('Storage error');
    });
  });

  describe('setSettings', () => {
    it('updates the settings variable', () => {
      const newSettings = { ...defaultSettings, master: false };
      setSettings(newSettings);
      expect(settings).toEqual(newSettings);
      expect(settings?.master).toBe(false);
    });
  });
});
