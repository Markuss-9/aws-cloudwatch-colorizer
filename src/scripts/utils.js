export const getListFromClass = (row) => {
	let elements = [];
	const iframe = document.querySelectorAll("iframe#microConsole-Logs")[0];
	if (iframe) elements = iframe.contentDocument.getElementsByClassName(row);
	return [].slice.call(elements);
};

export const getListFromTag = (row) => {
	let elements = [];
	const iframe = document.querySelectorAll("iframe#microConsole-Logs")[0];
	if (iframe) elements = iframe.contentDocument.getElementsByTagName(row);
	return [].slice.call(elements);
};

export var settings;

export const getSettings = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["settings"], (result) => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError));
			} else {
				resolve(result.settings);
			}
		});
	});
};
