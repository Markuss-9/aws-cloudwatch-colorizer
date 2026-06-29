import { get as _get } from 'lodash-es';
import { log } from '@/logger';

import colorize from './colorize';
import { getListFromTag, getListFromClass } from './dom';
import { settings } from './settings';
import { getCurrentPage } from './pageDetector';
import { PAGE_SETTINGS_KEYS } from '@/types';
import injectShadedRows from './shadedRows';
import { assert } from '@/assert';

const logGroupsFlow = () => {
  try {
    const tables = getListFromTag('table');
    if (!tables.length) return;

    const table = tables.find(
      (table) =>
        table.getAttribute('data-testid') !== 'relative-range-slow-picks',
    );

    const thElements = getListFromTag('th', table);

    const messageColPos = thElements.findIndex(
      (thEl) => _get(thEl, ['dataset', 'focusId']) === 'header-message',
    );

    const tbody = getListFromTag('tbody', table)[0];
    const trElements = getListFromTag('tr', tbody);

    for (const row of trElements) {
      const tdElements = row.getElementsByTagName('td');

      if (tdElements.length <= messageColPos) {
        continue;
      }

      assert(settings, 'settings must exist');

      const child =
        tdElements[messageColPos].querySelector<HTMLElement>(
          '.logs__log-events-table__cell',
        ) ??
        tdElements[messageColPos].querySelector<HTMLElement>(
          '[data-testid="logs__log-events-table__formatted-message"]',
        );

      if (!child) continue;

      const setting = settings;
      const result = colorize(
        child,
        row as HTMLElement,
        setting.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS],
      );
      if (
        !result &&
        setting.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS].wantBackground
      ) {
        (row as HTMLElement).style.removeProperty('background-color');
      }
    }
  } catch (error) {
    log.error(`LOGS_GROUPS_FLOW: `, error);
  }
};

const logInsightsFlow = () => {
  try {
    assert(settings, 'settings must exist');
    const s = settings;
    const elements = getListFromClass('logs-table__body-row');
    for (let row of elements) {
      const cells = row.getElementsByClassName('logs-table__body-cell');
      let anyMatched = false;
      for (let child of cells) {
        const result = colorize(
          child as HTMLElement,
          row as HTMLElement,
          s.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS],
        );
        if (result) anyMatched = true;
      }
      if (
        !anyMatched &&
        s.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS].wantBackground
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
    assert(settings, 'settings must exist');
    const s = settings;

    const rows = document.querySelectorAll<HTMLElement>(
      '#result-table-body tr',
    );

    for (const row of rows) {
      const cells = row.querySelectorAll<HTMLElement>('td[data-column]');
      let anyMatched = false;
      for (const cell of cells) {
        const result = colorize(
          cell,
          row,
          s.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS],
        );
        if (result) anyMatched = true;
      }
      if (
        !anyMatched &&
        s.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS].wantBackground
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

    const page = getCurrentPage();
    if (!page) return;

    injectShadedRows();

    assert(settings, 'Settings are not loaded');

    if (page === PAGE_SETTINGS_KEYS.LOG_GROUPS) {
      if (settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS].switch) {
        logGroupsFlow();
      }
    } else if (page === PAGE_SETTINGS_KEYS.LOG_ANALYTICS) {
      if (settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS].switch) {
        logAnalyticsFlow();
      }
    } else if (page === PAGE_SETTINGS_KEYS.LOG_INSIGHTS) {
      if (settings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS].switch) {
        logInsightsFlow();
      }
    }
  } catch (error) {
    log.error('COLORIZE_ALL: ', error);
  }
};

export default colorizeAll;
