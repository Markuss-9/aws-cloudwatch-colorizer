import { debounce } from 'lodash';
import colorizeAll from '../colorizeAll';

export var intervalIdDOM = null;

export const resetCheckIframe = () => {
	if (intervalIdDOM) clearInterval(intervalIdDOM);
};

export const getIframeElement = () => {
	return new Promise((resolve) => {
		resetCheckIframe();
		intervalIdDOM = setInterval(() => {
			const element = document.getElementById('microConsole-Logs');
			console.debug('checking for iframe');
			if (element) {
				console.debug('found iframe');
				clearInterval(intervalIdDOM);
				resolve(element);
			}
		}, 1500);
	});
};

export var mutationObs = new MutationObserver(debounce(colorizeAll, 50));

export const startObserve = () =>
	getIframeElement()
		.then((iframe) => {
			mutationObs.observe(iframe.contentWindow.document.body, {
				subtree: true,
				childList: true,
				characterData: true,
			});
		})
		.catch((error) => {
			console.error('Error:', error);
		});
