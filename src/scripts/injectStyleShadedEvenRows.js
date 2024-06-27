import { settings } from './utils';
import _get from 'lodash/get';

const injectCSS = (css, iframe) => {
	const style = iframe.contentDocument.createElement('style');
	style.textContent = css;
	iframe.contentDocument.head.appendChild(style);
};

const DEFAULT_LIGHT_SHADE_COLOR = 'rgba(42, 42, 42, 0.1)';
const DEFAULT_DARK_SHADE_COLOR = 'rgba(42, 42, 42, 0.4)';

const getIsDarkMode = () => {
	const bodyClassList = document.body.classList;
	for (const bodyClass of bodyClassList) {
		if (bodyClass.includes('dark')) return true;
	}
	return false;
};

const injectStyleShadedEvenRows = () => {
	try {
		const iframe = document.querySelector('iframe#microConsole-Logs');

		if (iframe) {
			const isDarkMode = getIsDarkMode();
			const iframeDoc = iframe.contentDocument;

			const defaultShadeColor = isDarkMode
				? DEFAULT_DARK_SHADE_COLOR
				: DEFAULT_LIGHT_SHADE_COLOR;

			if (
				settings.advancedSettings['Log_Groups'].switch ||
				settings.advancedSettings['Log_Insights'].switch
			) {
				const logsGroups_needInject =
					settings.advancedSettings['Log_Groups'].wantBackground;
				const logsGroups_shadeColor = _get(
					settings,
					['advancedSettings', 'Log_Groups', 'evenRowsShadeColor'],
					defaultShadeColor,
				);
				const logsInsights_needInject =
					settings.advancedSettings['Log_Insights'].wantBackground;
				const logsInsights_shadeColor = _get(
					settings,
					['advancedSettings', 'Log_Insights', 'evenRowsShadeColor'],
					defaultShadeColor,
				);

				const css = `
					${
						logsInsights_needInject
							? `
								.logs-table__body-row:nth-child(2n) {
									border: unset !important;
								}
								.logs-table__body-row:nth-child(2n) .logs-table__body-cell {
									background-color: unset !important;
								}
								.logs-table__body-row:nth-child(2n) > * {
									background-color: ${logsInsights_shadeColor} !important;
								}
							`
							: ''
					}
					${
						logsGroups_needInject
							? `
								.logs__log-events-table-v3 table:not(.awsui-cw-date-time-range-calendar-table) td[class*=awsui_body-cell-shaded] {
									background-color: ${logsGroups_shadeColor} !important;
								}
								div .logs__log-events-table-v3 table:not(.awsui-cw-date-time-range-calendar-table) td[class*=awsui_body-cell-selected][class*=awsui_body-cell-shaded] {
									background-color: ${logsGroups_shadeColor} !important;
								}
							`
							: ''
					}
				`;

				if (!iframeDoc.querySelector('style[data-id="shaded-rows"]')) {
					injectCSS(css, iframe);
					//NOTE - add attribute so that the second time i call the func i can check if already injected
					iframeDoc
						.querySelector('style:last-of-type')
						.setAttribute('data-id', 'shaded-rows');
				}
			}
		}
	} catch (error) {
		console.error(error);
	}
};

export default injectStyleShadedEvenRows;
