import { log } from '@/logger';
import colorizeAll from './colorizeAll';
import * as utils from './utils';

import { startInterval, resetInterval } from './performance/timer';
import { resetCheckIframe, mutationObs, startObserve } from './performance/dom';
import type { ExtensionMessage } from '@/types';
import { assert } from '@/assert';

const { getCurrentPage } = utils;

const cleanupAll = () => {
  resetInterval();
  mutationObs.disconnect();
  resetCheckIframe();
};

const applyAction = () => {
  try {
    if (!utils.settings?.master) {
      cleanupAll();
      return;
    }

    switch (utils.settings.performance) {
      case 'timer':
        cleanupAll();
        startInterval();
        break;
      case 'dom':
        resetInterval();
        startObserve(getCurrentPage());
        break;
      default:
        cleanupAll();
        break;
    }
  } catch (error) {
    log.error('Error in applyAction:', error);
  }
};

const startAction = async () => {
  try {
    utils.setSettings(await utils.getSettings());
    assert(utils.settings, 'settings must exist');
    applyAction();
  } catch (error) {
    log.error('Error in startAction:', error);
  }
};

startAction();

let lastUrl = location.href;

const onUrlChange = () => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    applyAction();
  }
};

window.addEventListener('hashchange', onUrlChange);
window.addEventListener('popstate', onUrlChange);

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  switch (message.type) {
    case 'changeSettings':
      startAction();
      break;
    case 'manualColorize':
      colorizeAll();
      break;
    default:
      log.info(`no message.type matched`);
  }
});
