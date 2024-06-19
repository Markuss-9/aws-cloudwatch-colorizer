import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';

import colorizing from './colorizing';
import { getListFromClass, getListFromTag, settings } from './utils';
import injectStyleShadedEvenRows from './injectStyleShadedEvenRows';

const logsGroupsFlow = () => {
	try {
		const tables = getListFromTag('table');
		if (!tables.length) return;

		const table = tables.find(
			(table) => table['data-testid'] !== 'relative-range-slow-picks',
		);

		const thElements = getListFromTag('th', table);

		const messageColPos = thElements.findIndex(
			(thEl) => _get(thEl, ['dataset', 'focusId']) === 'header-message',
		);

		const tbody = getListFromTag('tbody', table)[0];
		const trElements = getListFromTag('tr', tbody);

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
				colorizing(child, row, settings.advancedSettings['Log_Groups']);
			}
		}
	} catch (error) {
		console.error(`LOGS_GROUPS_FLOW: `, error);
	}
};

const logsInsightsFlow = () => {
	try {
		const thElements = getListFromClass('logs-table__header-cell');

		const messageColPos = _findIndex(thElements, {
			innerText: '@message',
		});

		const elements = getListFromClass('logs-table__body-row');
		for (let row of elements) {
			if (row.getElementsByClassName('logs-table__body-cell').length) {
				const child = row.getElementsByClassName('logs-table__body-cell')[
					messageColPos
				];
				colorizing(child, row, settings.advancedSettings['Log_Insights']);
			}
		}
	} catch (error) {
		console.error(`LOGS_INSIGHTS_FLOW: `, error);
	}
};

const colorizeAll = () => {
	try {
		console.assert(settings !== undefined, 'Settings are not loaded');
		const currentUrl = window.location.href;

		const isLogsGroupsPage = currentUrl.includes('log-groups');
		const isLogsInsightsPage = currentUrl.includes('logs-insights');

		if (isLogsGroupsPage || isLogsInsightsPage) {
			injectStyleShadedEvenRows();
		}

		if (isLogsGroupsPage) {
			if (settings.advancedSettings['Log_Groups'].switch) {
				logsGroupsFlow();
			}
		} else if (isLogsInsightsPage) {
			if (settings.advancedSettings['Log_Insights'].switch) {
				logsInsightsFlow();
			}
		}
	} catch (error) {
		console.error('COLORIZE_ALL: ', error);
	}
};

export default colorizeAll;
