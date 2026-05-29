import { assert } from '@/assert';
import { log } from '@/logger';
import defaultSettings from '@/defaultSettings';
import type { Settings } from '@/types';

export const getListFromClass = (row: string): Element[] => {
  let elements: Element[] = [];
  const iframe = document.querySelectorAll(
    'iframe#microConsole-Logs',
  )[0] as HTMLIFrameElement | null;
  assert(iframe, 'iframe must exist');
  assert(iframe.contentDocument, 'contentDocument must exist');
  if (iframe)
    elements = Array.from(iframe.contentDocument.getElementsByClassName(row));
  return elements;
};

export const getListFromTag = (row: string, container?: Element): Element[] => {
  let elements: Element[] = [];
  const iframe = document.querySelectorAll(
    'iframe#microConsole-Logs',
  )[0] as HTMLIFrameElement | null;
  if (iframe) {
    if (container) {
      elements = Array.from(container.getElementsByTagName(row));
      return elements;
    }
    assert(iframe.contentDocument, 'contentDocument must exist');
    elements = Array.from(iframe.contentDocument.getElementsByTagName(row));
  }
  return elements;
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
          return resolve(defaultSettings);
        }
        const version = result.settings.version;
        if (!version || version !== defaultSettings.version) {
          log.info(
            `Your settings (v${version}) are outdated, forcing reset to default v${defaultSettings.version}`,
          );
          chrome.storage.local.set({ settings: defaultSettings });
          return resolve(defaultSettings);
        }
        resolve(result.settings);
      },
    );
  });
};
