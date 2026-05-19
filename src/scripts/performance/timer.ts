import colorizeAll from '../colorizeAll';

let intervalId: number | null = null;

export const resetInterval = () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

export const startInterval = () => {
	if (!intervalId) intervalId = setInterval(colorizeAll, 3000);
};