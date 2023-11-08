// background.js

const MAX_REQUESTS_TO_TRACK = 4;
const WAIT_AFTER_LAST_REQUEST_MS = 500; // Adjust this value as needed

let ongoingRequests = 0;
let recentRequests = [];

function notifyContentScript() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: "networkRequestsCompleted",
			recentRequests,
		});
	});
}

function checkIfRequestsFinished() {
	// Wait for a short period before checking if more requests are coming
	setTimeout(function () {
		if (ongoingRequests === 0) {
			notifyContentScript();
		}
	}, WAIT_AFTER_LAST_REQUEST_MS);
}

function trackRequest(request) {
	if (recentRequests.length >= MAX_REQUESTS_TO_TRACK) {
		recentRequests.shift(); // Remove the oldest request if the limit is reached
	}
	recentRequests.push(request);
}

// Add listeners for network requests
chrome.webRequest.onBeforeRequest.addListener(
	function () {
		ongoingRequests++;
	},
	{ urls: ["<all_urls>"] },
	["blocking"]
);

chrome.webRequest.onCompleted.addListener(
	function (details) {
		ongoingRequests--;
		if (details.method === "GET" || details.method === "POST") {
			// Track successful GET and POST requests only
			trackRequest(details);
		}
		checkIfRequestsFinished();
	},
	{ urls: ["<all_urls>"] }
);

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message === "getOngoingRequests") {
		// Send the number of ongoing requests to the content script
		sendResponse({ ongoingRequests });
	}
});

// Listen for page load completion to send the message
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		notifyContentScript();
	}
});

// manifest
/*
"background": {
    "scripts": ["background.js"],
    "persistent": true
  },
  */
