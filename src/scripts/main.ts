import { log } from '@/logger';
import colorizeAll from './colorizeAll';
import * as utils from './utils';

import { startInterval, resetInterval } from './performance/timer';
import { resetCheckIframe, mutationObs, startObserve } from './performance/dom';
import type { ExtensionMessage } from '@/types';
import { assert } from '@/assert';

const startAction = async () => {
  try {
    utils.setSettings(await utils.getSettings());

    assert(utils.settings, 'settings must exist');

    if (utils.settings.master) {
      switch (utils.settings.performance) {
        case 'timer':
          startInterval();
          mutationObs.disconnect();
          resetCheckIframe();
          break;
        case 'dom':
          resetInterval();
          startObserve();
          break;
        case 'net':
          resetInterval();
          mutationObs.disconnect();
          resetCheckIframe();
          break;
        default:
          resetInterval();
          mutationObs.disconnect();
          resetCheckIframe();
          break;
      }
    } else {
      resetInterval();
      mutationObs.disconnect();
      resetCheckIframe();
    }
  } catch (error) {
    log.error('Error in startAction:', error);
  }
};

startAction();

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
