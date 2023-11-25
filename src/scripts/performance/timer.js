import colorizeAll from "../colorizeAll";

export var intervalId = null;

export const resetInterval = () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

export const startInterval = () => {
	if (!intervalId) intervalId = setInterval(colorizeAll, 500);
};
