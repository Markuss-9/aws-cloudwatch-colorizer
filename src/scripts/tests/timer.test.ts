import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startInterval, resetInterval } from '../observers/timer';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  resetInterval();
  vi.useRealTimers();
});

describe('timer', () => {
  it('startInterval sets an interval that calls colorizeAll', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    startInterval();
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  it('resetInterval clears the interval', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    startInterval();
    resetInterval();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it('calling startInterval twice does not set a second interval', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    startInterval();
    startInterval();
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it('calling resetInterval when none is set does not throw', () => {
    expect(() => resetInterval()).not.toThrow();
  });
});
