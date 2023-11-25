import colorizeAll from "../colorizeAll";

export var intervalIdDOM = null;

export const resetCheckIframe = () => {
	if (intervalIdDOM) clearInterval(intervalIdDOM);
};

export const getIframeElement = () => {
	return new Promise((resolve, reject) => {
		resetCheckIframe();
		intervalIdDOM = setInterval(() => {
			const element = document.getElementById("microConsole-Logs");
			console.log("checking for iframe");
			if (element) {
				console.log("found iframe");
				clearInterval(intervalIdDOM);
				resolve(element);
			}
		}, 1000);
	});
};

export var isRunning = false;

export var mutationObs = new MutationObserver(() => {
	if (!isRunning) {
		isRunning = true;
		setTimeout(() => {
			colorizeAll();
			isRunning = false;
		}, 50);
	}
});

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
			console.error("Error:", error);
		});
