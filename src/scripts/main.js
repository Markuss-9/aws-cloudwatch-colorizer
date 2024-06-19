import colorizeAll from './colorizeAll';
import { settings, getSettings } from './utils';

import { startInterval, resetInterval } from './performance/timer';
import { resetCheckIframe, mutationObs, startObserve } from './performance/dom';

const startAction = async () => {
	settings = await getSettings();
	if (settings.master) {
		switch (settings.performance) {
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

chrome.runtime.onMessage.addListener((message) => {
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
