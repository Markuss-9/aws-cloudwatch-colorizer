import colorizeAll from '@/scripts/colorizeAll';

let intervalId: NodeJS.Timeout | string | number | undefined = undefined;

export const resetInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
};

export const startInterval = () => {
  if (!intervalId) intervalId = setInterval(colorizeAll, 3000);
};
