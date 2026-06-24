import { log } from './logger';

export function assert(
  condition: unknown,
  message?: string,
  context?: any,
): asserts condition {
  if (!condition) {
    log.error(`Assertion`, message, context);
    throw new Error(message ?? 'Assertion failed');
  }
}
