import { settings } from './utils';
import { log } from '@/logger';
import { assert } from '@/assert';

export const DEFAULT_LIGHT_SHADE_COLOR = 'rgba(42, 42, 42, 0.1)';
export const DEFAULT_DARK_SHADE_COLOR = 'rgba(42, 42, 42, 0.4)';

const STYLE_DATA_ID = 'shaded-rows';
const STYLE_SELECTOR = `style[data-id="${STYLE_DATA_ID}"]`;

const getIsDarkMode = (): boolean =>
  Array.from(document.body.classList).some((c) => c.includes('dark'));

const getDefaultShadeColor = (): string =>
  getIsDarkMode() ? DEFAULT_DARK_SHADE_COLOR : DEFAULT_LIGHT_SHADE_COLOR;

const getSectionConfig = (section: 'Log_Groups' | 'Log_Insights') => {
  assert(settings, 'settings must exist');
  const s = settings.advancedSettings[section];
  return {
    needInject: s.wantBackground,
    shadeColor: s.evenRowsShadeColor ?? getDefaultShadeColor(),
  };
};

const areSwitchesOff = (): boolean => {
  assert(settings, 'settings must exist');
  return (
    !settings.advancedSettings['Log_Groups'].switch &&
    !settings.advancedSettings['Log_Insights'].switch
  );
};

const injectAndTag = (css: string, doc: Document) => {
  const style = doc.createElement('style');
  style.textContent = css;
  style.setAttribute('data-id', STYLE_DATA_ID);
  doc.head.appendChild(style);
  log.debug('injecting shaded rows CSS');
};

const cssForInsightsShade = (shadeColor: string) => `
.logs-table__body-row:nth-child(2n) {
  border: unset !important;
}
.logs-table__body-row:nth-child(2n) .logs-table__body-cell {
  background-color: unset !important;
}
.logs-table__body-row:nth-child(2n) > * {
  background-color: ${shadeColor} !important;
}
`;

const cssForGroupsShade = (shadeColor: string) => `
.logs__log-events-table-v3 table:not(.awsui-cw-date-time-range-calendar-table) td[class*=awsui_body-cell-shaded] {
  background-color: ${shadeColor} !important;
}
div .logs__log-events-table-v3 table:not(.awsui-cw-date-time-range-calendar-table) td[class*=awsui_body-cell-selected][class*=awsui_body-cell-shaded] {
  background-color: ${shadeColor} !important;
}
`;

const cssForAnalyticsInsights = (shadeColor: string) => `
#result-table-body > table:nth-child(2n) tr[data-slot="table-row"] > td {
  background-color: ${shadeColor} !important;
}
`;

const buildLogAnalyticsCSS = (): string => {
  const { needInject, shadeColor } = getSectionConfig('Log_Insights');
  return needInject ? cssForAnalyticsInsights(shadeColor) : '';
};

const buildIframeCSS = (): string => {
  const insights = getSectionConfig('Log_Insights');
  const groups = getSectionConfig('Log_Groups');

  return [
    insights.needInject && cssForInsightsShade(insights.shadeColor),
    groups.needInject && cssForGroupsShade(groups.shadeColor),
  ]
    .filter(Boolean)
    .join('\n');
};

const injectStyleShadedEvenRows = () => {
  try {
    if (areSwitchesOff()) return;

    if (window.location.href.includes('#log-analytics')) {
      if (document.querySelector(STYLE_SELECTOR)) return;
      const css = buildLogAnalyticsCSS();
      if (css) injectAndTag(css, document);
      return;
    }

    const iframe = document.querySelector(
      'iframe#microConsole-Logs',
    ) as HTMLIFrameElement | null;

    if (!iframe?.contentDocument) {
      log.debug('iframe not ready, skipping');
      return;
    }

    if (iframe.contentDocument.querySelector(STYLE_SELECTOR)) return;

    const css = buildIframeCSS();
    if (css) injectAndTag(css, iframe.contentDocument);
  } catch (error) {
    log.error(error);
  }
};

export default injectStyleShadedEvenRows;
