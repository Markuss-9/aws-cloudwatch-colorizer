import { log } from '@/logger';
import colorizeAll from './flows';
import { settings, setSettings, getSettings } from './settings';
import { getCurrentPage } from './pageDetector';

import { startInterval, resetInterval } from './observers/timer';
import {
  resetCheckIframe,
  mutationObserver,
  startObserving,
} from './observers/mutation';
import type { ExtensionMessage } from '@/types';
import { assert } from '@/assert';

const cleanupAll = () => {
  resetInterval();
  mutationObserver.disconnect();
  resetCheckIframe();
};

const applyPerformanceStrategy = () => {
  try {
    if (!settings?.master) {
      cleanupAll();
      return;
    }

    switch (settings.performance) {
      case 'timer':
        cleanupAll();
        startInterval();
        break;
      case 'dom':
        resetInterval();
        startObserving(getCurrentPage());
        break;
      default:
        cleanupAll();
        break;
    }
  } catch (error) {
    log.error('Error in applyPerformanceStrategy:', error);
  }
};

const initialize = async () => {
  try {
    setSettings(await getSettings());
    assert(settings, 'settings must exist');
    applyPerformanceStrategy();
  } catch (error) {
    log.error('Error in initialize:', error);
  }
};

initialize();

let lastUrl = location.href;

const onUrlChange = () => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    applyPerformanceStrategy();
  }
};

window.addEventListener('hashchange', onUrlChange);
window.addEventListener('popstate', onUrlChange);

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  switch (message.type) {
    case 'changeSettings':
      initialize();
      break;
    case 'manualColorize':
      colorizeAll();
      break;
    default:
      log.info(`no message.type matched`);
  }
});
