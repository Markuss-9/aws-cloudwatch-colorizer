import { PAGE_SETTINGS_KEYS } from '@/types';

const PAGE_URL_PATTERNS: Record<string, RegExp> = {
  [PAGE_SETTINGS_KEYS.LOG_ANALYTICS]: /#log-analytics/,
  [PAGE_SETTINGS_KEYS.LOG_GROUPS]: /\/log-group\/.+\/log-events\//,
  [PAGE_SETTINGS_KEYS.LOG_INSIGHTS]: /#logsV2:logs-insights/,
};

export const getCurrentPage = (): string | null => {
  const href = window.location.href;
  for (const [id, regex] of Object.entries(PAGE_URL_PATTERNS)) {
    if (regex.test(href)) return id;
  }
  return null;
};
