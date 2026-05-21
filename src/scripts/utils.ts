import defaultSettings from '../defaultSettings';
import type { Settings } from '../types';

export const getListFromClass = (row: string): Element[] => {
  let elements: Element[] = [];
  const iframe = document.querySelectorAll('iframe#microConsole-Logs')[0];
  if (iframe) elements = iframe.contentDocument.getElementsByClassName(row);
  return [].slice.call(elements);
};

export const getListFromTag = (row: string, container?: Element): Element[] => {
  let elements: Element[] = [];
  const iframe = document.querySelectorAll('iframe#microConsole-Logs')[0];
  if (iframe) {
    if (container) {
      elements = container.getElementsByTagName(row);
      return [].slice.call(elements);
    }
    elements = iframe.contentDocument.getElementsByTagName(row);
  }
  return [].slice.call(elements);
};

export let settings: Settings = defaultSettings;

export const setSettings = (newSettings: Settings) => {
  settings = newSettings;
};

export const getSettings = (): Promise<Settings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['settings'], (result: { settings?: Settings }) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        if (!result.settings) {
          return resolve(defaultSettings);
        }
        const version = result.settings.version;
        if (!version || version !== defaultSettings.version) {
          console.info(
            `Your settings (v${version}) are outdated, forcing reset to default v${defaultSettings.version}`,
          );
          chrome.storage.local.set({ settings: defaultSettings });
          return resolve(defaultSettings);
        }
        resolve(result.settings);
      }
    });
  });
};
