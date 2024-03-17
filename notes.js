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
