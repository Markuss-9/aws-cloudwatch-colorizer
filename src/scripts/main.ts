import colorizeAll from './colorizeAll';
import * as utils from './utils';

import { startInterval, resetInterval } from './performance/timer';
import { resetCheckIframe, mutationObs, startObserve } from './performance/dom';
import type { ExtensionMessage } from '@/types';

const startAction = async () => {
  utils.setSettings(await utils.getSettings());
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
      console.log(`no message.type matched`);
  }
});
