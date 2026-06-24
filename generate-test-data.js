#!/usr/bin/env node
const now = Date.now();

const messages = [
  // === Each of the 8 patterns at start of message ===
  'error: failed to connect to database',
  'err: unexpected token in request body',
  'warn: disk space usage above 90%, please investigate',
  'warning: CPU temperature threshold exceeded on server 42',
  'info: system health check passed successfully',
  'information: new version 2.3.1 is now available for download',
  'debug: entering function processOrder with transaction ID 48201',
  'dbg: cache miss for key user_48201 in redis cluster',

  // === Patterns after a short prefix ===
  '49071 - WARN - A generic warning message here',
  '49071 - [ERR] - A bracketed error message example',
  '[31merror[39m A log line with ANSI escape codes',
  '[31mERR[39m Uppercase error formatted with ANSI codes',
  '2024-06-04 10:30:00 - [error] failed to authenticate user',

  // === Case variations ===
  'ERROR: critical system failure in payment processing',
  'Error: invalid input detected at configuration line 42',
  'WARN: storage capacity at 95% utilization and growing',
  'WaRning: unhandled promise rejection in async module',

  // === Multiple patterns — the earliest match in the message should win ===
  'info: debug error occurred in the main thread',
  'warn: error encountered during data backup process',

  // === Substring edge cases — 'error' vs 'err', 'warning' vs 'warn' ===
  'An erroneous entry was logged by the validator',
  'Some err happening deep in the stack trace',

  // === Long messages ===
  'LONG_MODULE_NAME_that_is_very_long_and_then_has_error_at_the_end_of_line',
  '2024-12-01 15:30:45,678 [us-east-1] [ec2-user] [i-0abc1234] ERROR: failure in payment processing system',
  'This line has a massive amount of fluff and padding before the word error appears way down here',

  // === JSON stringified logs ===
  '{"level":"ERROR","data":"critical failure detected"}',
  `{\\"level\\":\\"ERROR\\",\\"data\\":\\"critical failure detected\\"}`,

  // === No-match messages ===
  'just some random log line with no matching keywords whatsoever',
  'heartbeat check completed: all systems operational and healthy',
];

process.stdout.write(
  JSON.stringify(
    messages.map((msg) => ({ timestamp: now, message: msg })),
    null,
    '\t',
  ) + '\n',
);
