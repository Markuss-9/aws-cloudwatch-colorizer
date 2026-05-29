import { get as _get } from 'lodash-es';
import { log } from '@/logger';

import colorizing from './colorizing';
import * as utils from './utils';
import injectStyleShadedEvenRows from './injectStyleShadedEvenRows';
import { assert } from '@/assert';

const logsGroupsFlow = () => {
  try {
    const tables = utils.getListFromTag('table');
    if (!tables.length) return;

    const table = tables.find(
      (table) => table.getAttribute('data-testid') !== 'relative-range-slow-picks',
    );

    const thElements = utils.getListFromTag('th', table);

    const messageColPos = thElements.findIndex(
      (thEl) => _get(thEl, ['dataset', 'focusId']) === 'header-message',
    );

    const tbody = utils.getListFromTag('tbody', table)[0];
    const trElements = utils.getListFromTag('tr', tbody);

    for (const row of trElements) {
      if (row.getElementsByTagName('td')) {
        const tdElements = row.getElementsByTagName('td');

        if (Object.keys(tdElements).length - 1 < messageColPos) {
          continue;
        }

        const span = tdElements[messageColPos].getElementsByTagName('span');

        assert(span, 'span cannot be empty');
        assert(utils.settings, 'settings must exist');
        assert(Object.keys(span).length, 'span cannot be empty');

        const settings = utils.settings;
        const child = span[span.length - 1] as HTMLElement;
        colorizing(child, row as HTMLElement, settings.advancedSettings['Log_Groups']);
      }
    }
  } catch (error) {
    log.error(`LOGS_GROUPS_FLOW: `, error);
  }
};

const logsInsightsFlow = () => {
  try {
    const thElements = utils.getListFromClass('logs-table__header-cell');

    const messageColPos = (thElements as HTMLElement[]).findIndex(
      (el) => el.innerText === '@message',
    );

    assert(utils.settings, 'settings must exist');
    const settings = utils.settings;
    const elements = utils.getListFromClass('logs-table__body-row');
    for (let row of elements) {
      if (row.getElementsByClassName('logs-table__body-cell').length) {
        const child = row.getElementsByClassName('logs-table__body-cell')[
          messageColPos
        ] as HTMLElement;
        colorizing(child, row as HTMLElement, settings.advancedSettings['Log_Insights']);
      }
    }
  } catch (error) {
    log.error(`LOGS_INSIGHTS_FLOW: `, error);
  }
};

const colorizeAll = () => {
  try {
    const currentUrl = window.location.href;

    const isLogsGroupsPage = currentUrl.includes('log-groups');
    const isLogsInsightsPage = currentUrl.includes('logs-insights');

    if (isLogsGroupsPage || isLogsInsightsPage) {
      injectStyleShadedEvenRows();
    }

    assert(utils.settings, 'Settings are not loaded');

    if (isLogsGroupsPage) {
      if (utils.settings.advancedSettings['Log_Groups'].switch) {
        logsGroupsFlow();
      }
    } else if (isLogsInsightsPage) {
      if (utils.settings.advancedSettings['Log_Insights'].switch) {
        logsInsightsFlow();
      }
    }
  } catch (error) {
    log.error('COLORIZE_ALL: ', error);
  }
};

export default colorizeAll;
