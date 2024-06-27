import defaultSettings from '../defaultSettings.ts';

export const getListFromClass = (row) => {
	let elements = [];
	const iframe = document.querySelectorAll('iframe#microConsole-Logs')[0];
	if (iframe) elements = iframe.contentDocument.getElementsByClassName(row);
	return [].slice.call(elements);
};

export const getListFromTag = (row, container) => {
	let elements = [];
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

export var settings;

export const getSettings = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(['settings'], (result) => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError));
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
