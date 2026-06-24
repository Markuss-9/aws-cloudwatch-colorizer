import { get as _get } from 'lodash-es';
import { log } from '@/logger';

import colorizing from './colorizing';
import * as utils from './utils';
import { PAGE_SETTINGS_KEYS } from '@/types';
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

      assert(utils.settings, 'settings must exist');

      const child =
        tdElements[messageColPos].querySelector<HTMLElement>(
          '.logs__log-events-table__cell',
        ) ??
        tdElements[messageColPos].querySelector<HTMLElement>(
          '[data-testid="logs__log-events-table__formatted-message"]',
        );

      if (!child) continue;

      const settings = utils.settings;
      const result = colorizing(
        child,
        row as HTMLElement,
        settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS],
      );
      if (
        !result &&
        settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS].wantBackground
      ) {
        (row as HTMLElement).style.removeProperty('background-color');
      }
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
      let anyMatched = false;
      for (let child of cells) {
        const result = colorizing(
          child as HTMLElement,
          row as HTMLElement,
          settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS],
        );
        if (result) anyMatched = true;
      }
      if (
        !anyMatched &&
        settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS]
          .wantBackground
      ) {
        (row as HTMLElement).style.removeProperty('background-color');
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

    const rows = document.querySelectorAll<HTMLElement>(
      '#result-table-body tr',
    );

    for (const row of rows) {
      const cells = row.querySelectorAll<HTMLElement>('td[data-column]');
      let anyMatched = false;
      for (const cell of cells) {
        const result = colorizing(
          cell,
          row,
          settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS],
        );
        if (result) anyMatched = true;
      }
      if (
        !anyMatched &&
        settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS]
          .wantBackground
      ) {
        row.style.removeProperty('background-color');
      }
    }
  } catch (error) {
    log.error(`LOG_ANALYTICS_FLOW: `, error);
  }
};

const colorizeAll = () => {
  try {
    log.debug('colorizeAll');

    const page = utils.getCurrentPage();
    if (!page) return;

    injectStyleShadedEvenRows();

    assert(utils.settings, 'Settings are not loaded');

    if (page === PAGE_SETTINGS_KEYS.LOG_GROUPS) {
      if (
        utils.settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS].switch
      ) {
        logsGroupsFlow();
      }
    } else if (page === PAGE_SETTINGS_KEYS.LOG_ANALYTICS) {
      if (
        utils.settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS].switch
      ) {
        logAnalyticsFlow();
      }
    } else if (page === PAGE_SETTINGS_KEYS.LOG_INSIGHTS) {
      if (
        utils.settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS].switch
      ) {
        logsInsightsFlow();
      }
    }
  } catch (error) {
    log.error('COLORIZE_ALL: ', error);
  }
};

export default colorizeAll;
