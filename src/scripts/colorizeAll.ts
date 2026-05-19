import { get as _get, findIndex as _findIndex } from 'lodash-es';

import colorizing from './colorizing';
import * as utils from './utils';
import injectStyleShadedEvenRows from './injectStyleShadedEvenRows';

const logsGroupsFlow = () => {
	try {
		const tables = utils.getListFromTag('table');
		if (!tables.length) return;

		const table = tables.find(
			(table) => table['data-testid'] !== 'relative-range-slow-picks',
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

				console.assert(
					span,
					'span cannot be empty - type %s and value',
					typeof span,
					span,
				);

				console.assert(Object.keys(span).length, 'span cannot be empty');

				const child = span[span.length - 1];
				colorizing(child, row, utils.settings.advancedSettings['Log_Groups']);
			}
		}
	} catch (error) {
		console.error(`LOGS_GROUPS_FLOW: `, error);
	}
};

const logsInsightsFlow = () => {
	try {
		const thElements = utils.getListFromClass('logs-table__header-cell');

		const messageColPos = _findIndex(thElements, {
			innerText: '@message',
		});

		const elements = utils.getListFromClass('logs-table__body-row');
		for (let row of elements) {
			if (row.getElementsByClassName('logs-table__body-cell').length) {
				const child = row.getElementsByClassName('logs-table__body-cell')[
					messageColPos
				];
				colorizing(child, row, utils.settings.advancedSettings['Log_Insights']);
			}
		}
	} catch (error) {
		console.error(`LOGS_INSIGHTS_FLOW: `, error);
	}
};

const colorizeAll = () => {
	try {
		console.assert(utils.settings !== undefined, 'Settings are not loaded');
		const currentUrl = window.location.href;

		const isLogsGroupsPage = currentUrl.includes('log-groups');
		const isLogsInsightsPage = currentUrl.includes('logs-insights');

		if (isLogsGroupsPage || isLogsInsightsPage) {
			injectStyleShadedEvenRows();
		}

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
		console.error('COLORIZE_ALL: ', error);
	}
};

export default colorizeAll;
