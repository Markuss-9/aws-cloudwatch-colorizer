import { assert } from '@/assert';
import { log } from '@/logger';
import defaultSettings from '@/defaultSettings';
import type { Settings } from '@/types';

const getIframe = (): HTMLIFrameElement => {
  const iframe = document.querySelector(
    'iframe#microConsole-Logs',
  ) as HTMLIFrameElement | null;
  assert(iframe, 'iframe must exist');
  return iframe;
};

export const getListFromClass = (row: string): Element[] => {
  const iframe = getIframe();
  assert(iframe.contentDocument, 'contentDocument must exist');
  return Array.from(iframe.contentDocument.getElementsByClassName(row));
};

export const getListFromTag = (row: string, container?: Element): Element[] => {
  const iframe = getIframe();
  if (container) {
    return Array.from(container.getElementsByTagName(row));
  }
  assert(iframe.contentDocument, 'contentDocument must exist');
  return Array.from(iframe.contentDocument.getElementsByTagName(row));
};

export let settings: Settings | undefined = defaultSettings;

export const setSettings = (newSettings: Settings) => {
  settings = newSettings;
};

export const getSettings = (): Promise<Settings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      ['settings'],
      (result: { settings?: Settings }) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        if (!result.settings) {
          log.debug('No settings found, using default:', defaultSettings);
          return resolve(defaultSettings);
        }
        const version = result.settings.version;
        if (!version || version !== defaultSettings.version) {
          log.info(
            `Your settings (v${version}) are outdated, forcing reset to default v${defaultSettings.version}:`,
            defaultSettings,
          );
          chrome.storage.local.set({ settings: defaultSettings });
          return resolve(defaultSettings);
        }
        log.debug('Current settings:', result.settings);
        resolve(result.settings);
      },
    );
  });
};
