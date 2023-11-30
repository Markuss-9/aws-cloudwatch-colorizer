import colorizeAll from "../colorizeAll";
import { page, pageInDom } from "../utils";
import { getListFromClass } from "../utils";

export var intervalIdDOM = null;

export const resetCheckIframe = () => {
	if (intervalIdDOM) clearInterval(intervalIdDOM);
};

export const getIframeElement = () => {
	return new Promise((resolve, reject) => {
		resetCheckIframe();
		intervalIdDOM = setInterval(() => {
			const iframe = document.getElementById("microConsole-Logs");
			console.log("checking for iframe");
			if (iframe) {
				if (page) {
					var element =
						iframe.contentWindow.document.body.getElementsByClassName(
							page,
						)[0];
					if (pageInDom !== page) pageInDom = page;
				} else var element = iframe.contentWindow.document.body;
				if (element) {
					console.log("found iframe");
					clearInterval(intervalIdDOM);
					resolve(element);
				}
			}
		}, 1000);
	});
};

export var isRunning = false;

export var mutationObs = new MutationObserver(() => {
	if (!isRunning) {
		isRunning = true;
		setTimeout(() => {
			colorizeAll({ isDom: true });
			isRunning = false;
		}, 50);
	}
});

export const startObserve = () =>
	getIframeElement()
		.then((elementObserved) => {
			mutationObs.observe(elementObserved, {
				subtree: true,
				childList: true,
				characterData: true,
			});
		})
		.catch((error) => {
			console.error("Error:", error);
		});

export const restartDom = () => {
	mutationObs.disconnect();
	startObserve();
};
