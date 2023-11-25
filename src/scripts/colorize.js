import { findIndex } from "lodash-es";

// const regexIndexOf = (string, regex, startpos) => {
// 	var indexOf = string.substring(startpos || 0).search(regex);
// 	return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
// };

// const regexLastIndexOf = (string, regex, startpos) => {
// 	regex = regex.global
// 		? regex
// 		: new RegExp(
// 				regex.source,
// 				"g" +
// 					(regex.ignoreCase ? "i" : "") +
// 					(regex.multiLine ? "m" : "")
// 		  );
// 	if (typeof startpos == "undefined") {
// 		startpos = string.length;
// 	} else if (startpos < 0) {
// 		startpos = 0;
// 	}
// 	var stringToWorkWith = string.substring(0, startpos + 1);
// 	var lastIndexOf = -1;
// 	var nextStop = 0;
// 	while ((result = regex.exec(stringToWorkWith)) != null) {
// 		lastIndexOf = result.index;
// 		regex.lastIndex = ++nextStop;
// 	}
// 	return lastIndexOf;
// };

const pretty = (e, parent, reg, regInit, spanWordChange) => {
	// const isoPattern = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]/;

	var content = e.textContent;
	//? not necessary
	// if (isoPattern.test(e.textContent)) {
	//   // content = e.textContent.slice(24);
	//   content.split(reg)[1];
	// }

	const match = content.match(reg);

	if (match)
		e.innerHTML = `${content.split(regInit)[0]}${spanWordChange}${
			// content.split(reg)[1]
			match[2]
		}`;
	parent.removeAttribute("style");
};

// const escape_codes = new Map([
//   ["0", "font-weight:normal"],
//   ["1", "font-weight:bold"],
//   ["2", "opacity:0.75"],
//   ["4", "text-decoration:underline"],
//   ["30", "color:darkslategray"],
//   ["31", "color:darkred"],
//   ["32", "color:darkgreen"],
//   ["33", "color:darkgoldenrod"],
//   ["34", "color:darkblue"],
//   ["35", "color:indigo"],
//   ["36", "color:darkcyan"],
//   ["39", "color:black"],
//   ["90", "color:darkgrey"],
//   ["91", "color:red"],
//   ["92", "color:green"],
//   ["93", "color:goldenrod"],
//   ["94", "color:blue"],
//   ["95", "color:darkviolet"],
//   ["96", "color:cyan"],
//   ["97", "color:whitesmoke"],
// ]);

const colorizing = (e, parent, wordsOptionsCurrentPage) => {
	var computedStyle = window.getComputedStyle(parent);
	var backgroundColor = computedStyle.backgroundColor;

	const wordsToFind = ["error", "warn", "info", "debug"];
	let foundWord = null;
	for (const word of wordsToFind) {
		const wordReg = new RegExp(`${word}`, "i");
		if (wordReg.test(e.textContent.slice(0, 50))) {
			foundWord = word;
			break;
		}
	}

	if (foundWord !== null) {
		let pos = findIndex(wordsOptionsCurrentPage, {
			word: foundWord,
		});
		const wordOptions = wordsOptionsCurrentPage[pos];

		if (wantBackground) {
			if (
				!parent.style.backgroundColor.includes(
					`${wordOptions.backgroundColor}`,
				)
			) {
				if (parent.style.backgroundColor.includes(`color-mix`)) {
					parent.style.backgroundColor = "";
					computedStyle = window.getComputedStyle(parent);
					backgroundColor = computedStyle.backgroundColor;
				}
				parent.style.backgroundColor = `color-mix(in srgb, ${wordOptions.backgroundColor}, ${backgroundColor})`;
			}
		} else {
			console.log("Switch is disabled, executing NORMAL colorizeAll");
			const dynamicRegex = new RegExp(
				`(\\x1b\\[${wordOptions.code}m${foundWord}\\x1b\\[39m|${foundWord})(.*?)$`,
			);
			const dynamicRegexInit = new RegExp(
				`\\x1b\\[${wordOptions.code}m${foundWord}\\x1b\\[39m|${foundWord}`,
			);

			if (!e.getElementsByTagName("span").length)
				pretty(
					e,
					parent,
					dynamicRegex,
					dynamicRegexInit,
					`<span style="color:${wordOptions.color}">${wordOptions.emoji} ${wordOptions.label}</span>`,
				);
		}
	} else parent.removeAttribute("style");
};

const getListFromClass = (row) => {
	let elements = [];
	const iframe = document.querySelectorAll("iframe#microConsole-Logs")[0];
	if (iframe) elements = iframe.contentDocument.getElementsByClassName(row);
	return [].slice.call(elements);
};

const getListFromTag = (row) => {
	let elements = [];
	const iframe = document.querySelectorAll("iframe#microConsole-Logs")[0];
	if (iframe) elements = iframe.contentDocument.getElementsByTagName(row);
	return [].slice.call(elements);
};

//! NETWORK START
// // Create a PerformanceObserver to monitor network activity
// const networkObserver = new PerformanceObserver((list) => {
// 	const entries = list.getEntries();
// 	for (const entry of entries) {
// 		if (entry.entryType === "resource") {
// 			// console.log("New resource loaded:", entry.name); //? attivare quando serve altrimenti spamma
// 			// You can add your custom logic here
// 		}
// 	}
// });

// // Start observing network activity
// networkObserver.observe({ entryTypes: ["resource"] });

// // Add an event listener to stop observing when the page unloads
// window.addEventListener("unload", () => {
// 	networkObserver.disconnect();
// });
//! NETWORK FINISH

var isRunning = false;
//! OBSERVE DOM
// const checkForIframe = () => {
// 	const iframe = document.getElementById("microConsole-Logs");

// 	if (iframe) {
// 		clearInterval(intervalIdDOM); // Stop the timer
// 		console.log('Found the iframe with ID "microConsole-Logs"');
// 		new MutationObserver(() => {
// 			if (!isRunning) {
// 				isRunning = true;
// 				setTimeout(() => {
// 					colorizeAll();
// 				}, 50);
// 			}
// 		}).observe(iframe.contentWindow.document.body, {
// 			subtree: true,
// 			childList: true,
// 			characterData: true,
// 		});
// 	}
// };

var intervalIdDOM = null;

const resetCheckIframe = () => {
	if (intervalIdDOM) clearInterval(intervalIdDOM);
};

const getIframeElement = () => {
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

// // Set an interval to periodically check for the iframe
//! FINISH OBSERVE DOM

var wantBackground = true; //to change the mode, if true it colorize the background
var settings;

var intervalId = null;

var insertedStyle = false;

function getSettings() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["settings"], (result) => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError));
			} else {
				resolve(result.settings);
			}
		});
	});
}

const resetInterval = () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

var mutationObs = new MutationObserver(() => {
	if (!isRunning) {
		isRunning = true;
		setTimeout(() => {
			colorizeAll();
			isRunning = false;
		}, 50);
	}
});

const startAction = async () => {
	// chrome.storage.local.clear();
	settings = await getSettings();

	if (settings.master) {
		console.log(`MASTER ON`);

		switch (settings.performance) {
			case "timer":
				if (!intervalId) intervalId = setInterval(colorizeAll, 500);
				mutationObs.disconnect();
				resetCheckIframe();
				break;
			case "dom":
				resetInterval();

				// if (!mutationObs)
				getIframeElement()
					.then((iframe) => {
						mutationObs.observe(
							iframe.contentWindow.document.body,
							{
								subtree: true,
								childList: true,
								characterData: true,
							},
						);
					})
					.catch((error) => {
						console.error("Error:", error);
					});
				// else console.log("mutation already exist");
				break;
			case "net":
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// if (message.type === "yourMessageType") {
	// 	try {
	// 		const settings = await getSettings();
	// 		// Process settings or do something with them

	// 		// Send a response back to the sender
	// 		sendResponse({ success: true, settings });
	// 		console.log(`setting the variable settings from chrome extension`);
	// 	} catch (error) {
	// 		console.error("Error getting settings:", error);
	// 		sendResponse({ success: false, error: error.message });
	// 	}

	// 	// Return true to indicate that you will be sending a response asynchronously
	// 	return true;
	// }
	switch (message.type) {
		case "yourMessageType":
			sendResponse("risposta dal content script");
			startAction();
			break;
		case "manualColorize":
			colorizeAll();
			break;
		default:
			console.log(`default no case matchato`);
	}
	console.log(`finito onMessage`);
});

const colorizeAll = () => {
	// console.log("colorizing ALL");
	console.log(`intervalId - `, intervalId);

	const currentUrl = window.location.href;

	if (currentUrl.includes("log-groups")) {
		//
		console.log("log-groups");
		const elements = getListFromClass("awsui-table-row");
		const wordsOptionsCurrentPage =
			settings.advancedSettings["Log_Groups"].words;
		for (let e of elements) {
			if (e.getElementsByClassName("logs__log-events-table__cell")[1]) {
				const child = e
					.getElementsByClassName("logs__log-events-table__cell")[1]
					.getElementsByTagName("span")[0];
				colorizing(child, e, wordsOptionsCurrentPage);
			}
		}
		//? e.getElementsByTagName("td")[2] restituisce il parent
	} else if (currentUrl.includes("logs-insights")) {
		//

		const elements = getListFromClass("logs-table__body-row");
		const iframe = document.querySelectorAll("iframe#microConsole-Logs")[0];
		if (iframe) {
			// var iframe = document.getElementsByTagName("iframe");
			// console.log(" ~ testFunc1 ~ iframe:", iframe);
			// var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")[0];
			// elmnt.style.display = "none";
			// iframe.contentWindow.document;

			var cont = getListFromTag("style");
			const regexUpdateStyle =
				/\.logs-table__body-row:nth-child\(2n\),.logs-table__body-row:nth-child\(2n\) .logs-table__body-cell{background-color:(.*)}/;

			cont.forEach((styleElement) => {
				if (regexUpdateStyle.test(styleElement.innerHTML)) {
					styleElement.innerHTML = styleElement.innerHTML.replace(
						".logs-table__body-row:nth-child(2n),.logs-table__body-row:nth-child(2n) .logs-table__body-cell{background-color:",
						".logs-table__body-row:nth-child(2n),.logs-table__body-row:nth-child(2n) {background-color:",
					);
				}
			});
		}

		console.log("logs-insights da vedere");
		const wordsOptionsCurrentPage =
			settings.advancedSettings["Log_Insights"].words;
		for (let e of elements) {
			// logInsights(e.getElementsByClassName("logs-table__body-cell")[2]);
			if (e.getElementsByClassName("logs-table__body-cell")[2]) {
				const child = e.getElementsByClassName(
					"logs-table__body-cell",
				)[2];
				colorizing(child, e, wordsOptionsCurrentPage);
			}
		}
	}
};

//! setInterval(colorizeAll, 3000); //  not efficient

//? Function to perform the action when all requests are finished
// function doSomethingWhenRequestsFinished() {
//   console.log("All network requests have finished! Doing something...");
//   // Add your code here to perform the desired action
//   // Call the function you want to execute after all requests are finished
//   colorizeAll();
// }

// // Use a global variable to track the number of ongoing requests
// let ongoingRequests = 0;

// // Function to send a message to the background script when all requests are finished
// function allRequestsFinished() {
//   ongoingRequests--;
//   console.log("Ongoing requests:", ongoingRequests);

//   // When there are no ongoing requests, call the function directly
//   if (ongoingRequests === 0) {
//     doSomethingWhenRequestsFinished();
//   }
// }

// // ... your other code that processes the webpage and its requests

// // Increment the ongoingRequests counter for each request
// ongoingRequests++;

// // Call the function to notify the background script
// allRequestsFinished();

// colorize.js////////////////**************************************************** */

// Call colorizeAll when receiving a message that all network requests are completed
// chrome.runtime.onMessage.addListener(function (message) {
//   if (message.type === "networkRequestsCompleted") {
//     colorizeAll();
//   }
// });

// // Ask background script for the ongoing requests count
// chrome.runtime.sendMessage("getOngoingRequests", function (response) {
//   // If there are no ongoing requests, directly call colorizeAll
//   if (response && response.ongoingRequests === 0) {
//     colorizeAll();
//   }
// });

//! **************************** OBSERVE DOM ******************************* */
// const observer = new MutationObserver(colorizeAll);

// // Start observing the entire DOM for changes
// observer.observe(document, { childList: true, subtree: true });

// // Ask background script for the ongoing requests count
// chrome.runtime.sendMessage("getOngoingRequests", function (response) {
// 	// If there are no ongoing requests, directly call colorizeAll
// 	if (response && response.ongoingRequests === 0) {
// 		colorizeAll();
// 	}
// });

// let timeoutId = null;
// const DEBOUNCE_DELAY_MS = 100; // Adjust this value as needed

// function debouncedColorizeAll() {
//   clearTimeout(timeoutId);
//   timeoutId = setTimeout(colorizeAll, DEBOUNCE_DELAY_MS);
// }

// // Call debouncedColorizeAll whenever DOM updates
// const observer = new MutationObserver(debouncedColorizeAll);

// // Start observing the entire DOM for changes
// observer.observe(document, { childList: true, subtree: true });

// // Ask background script for the ongoing requests count
// chrome.runtime.sendMessage("getOngoingRequests", function (response) {
//   // If there are no ongoing requests, directly call colorizeAll
//   if (response && response.ongoingRequests === 0) {
//     debouncedColorizeAll();
//   }
// });
