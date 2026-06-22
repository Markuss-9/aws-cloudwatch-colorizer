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
      (table) =>
        table.getAttribute('data-testid') !== 'relative-range-slow-picks',
    );

    const thElements = utils.getListFromTag('th', table);

    const messageColPos = thElements.findIndex(
      (thEl) => _get(thEl, ['dataset', 'focusId']) === 'header-message',
    );

    const tbody = utils.getListFromTag('tbody', table)[0];
    const trElements = utils.getListFromTag('tr', tbody);

    for (const row of trElements) {
      const tdElements = row.getElementsByTagName('td');

      if (tdElements.length <= messageColPos) {
        continue;
      }

      const span = tdElements[messageColPos].getElementsByTagName('span');

      assert(span, 'span cannot be empty');
      assert(utils.settings, 'settings must exist');
      assert(Object.keys(span).length, 'span cannot be empty');

      const settings = utils.settings;
      const child = span[span.length - 1] as HTMLElement;
      colorizing(
        child,
        row as HTMLElement,
        settings.advancedSettings['Log_Groups'],
      );
    }
  } catch (error) {
    log.error(`LOGS_GROUPS_FLOW: `, error);
  }
};

const logsInsightsFlow = () => {
  try {
    assert(utils.settings, 'settings must exist');
    const settings = utils.settings;
    const elements = utils.getListFromClass('logs-table__body-row');
    for (let row of elements) {
      const cells = row.getElementsByClassName('logs-table__body-cell');
      for (let child of cells) {
        colorizing(
          child as HTMLElement,
          row as HTMLElement,
          settings.advancedSettings['Log_Insights'],
        );
      }
    }
  } catch (error) {
    log.error(`LOGS_INSIGHTS_FLOW: `, error);
  }
};

const logAnalyticsFlow = () => {
  try {
    assert(utils.settings, 'settings must exist');
    const settings = utils.settings;

    const messageCells = document.querySelectorAll<HTMLElement>(
      '#result-table-body td[data-column]',
    );
    log.debug(`logAnalyticsFlow: found ${messageCells.length} data cells`);

    for (const cell of messageCells) {
      const row = cell.closest<HTMLElement>('tr');
      if (!row) continue;

      colorizing(cell, row, settings.advancedSettings['Log_Insights']);
    }
  } catch (error) {
    log.error(`LOG_ANALYTICS_FLOW: `, error);
  }
};

const colorizeAll = () => {
  try {
    const currentUrl = window.location.href;

    log.debug('colorizeAll');

    const isLogsGroupsPage = currentUrl.includes('log-groups');
    const isLogsInsightsPage = currentUrl.includes('logs-insights');
    const isLogAnalyticsPage = currentUrl.includes('#log-analytics');

    if (isLogsGroupsPage || isLogsInsightsPage || isLogAnalyticsPage) {
      injectStyleShadedEvenRows();
    }

    assert(utils.settings, 'Settings are not loaded');

    if (isLogsGroupsPage) {
      if (utils.settings.advancedSettings['Log_Groups'].switch) {
        logsGroupsFlow();
      }
    } else if (isLogAnalyticsPage) {
      if (utils.settings.advancedSettings['Log_Insights'].switch) {
        logAnalyticsFlow();
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
