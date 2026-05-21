const PREFIX = '[AWS CloudWatch Colorizer]';

const createLogger = (consoleFn: (...args: unknown[]) => void) => {
  return (...args: unknown[]) => consoleFn(PREFIX, ...args);
};

export const log = {
  debug: createLogger(console.debug),
  info: createLogger(console.info),
  warn: createLogger(console.warn),
  error: createLogger(console.error),
};
