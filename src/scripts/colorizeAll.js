import colorizing from "./colorizing";
import { getListFromClass, getListFromTag, settings } from "./utils";

const colorizeAll = () => {
	console.log("colorizing ALL");
	const currentUrl = window.location.href;

	if (currentUrl.includes("log-groups")) {
		if (settings.advancedSettings["Log_Groups"].switch) {
			console.log("log-groups");
			const elements = getListFromClass("awsui-table-row");
			for (let e of elements) {
				if (
					e.getElementsByClassName("logs__log-events-table__cell")[1]
				) {
					const child = e
						.getElementsByClassName(
							"logs__log-events-table__cell",
						)[1]
						.getElementsByTagName("span")[0];
					colorizing(
						child,
						e,
						settings.advancedSettings["Log_Groups"],
					);
				}
			}
			//? e.getElementsByTagName("td")[2] restituisce il parent
		}
	} else if (currentUrl.includes("logs-insights")) {
		if (settings.advancedSettings["Log_Insights"].switch) {
			const elements = getListFromClass("logs-table__body-row");
			const iframe = document.querySelectorAll(
				"iframe#microConsole-Logs",
			)[0];
			if (iframe) {
				var cont = getListFromTag("style");
				const regexUpdateStyle =
					/\.logs-table__body-row:nth-child\(2n\),.logs-table__body-row:nth-child\(2n\) .logs-table__body-cell{background-color:(.*)}/;

				cont.forEach((styleElement) => {
					if (regexUpdateStyle.test(styleElement.innerHTML)) {
						styleElement.innerHTML = styleElement.innerHTML.replace(
							".logs-table__body-row:nth-child(2n),.logs-table__body-row:nth-child(2n) .logs-table__body-cell{background-color:",
							".logs-table__body-row:nth-child(2n),.logs-table__body-row:nth-child(2n) {background-color:",
						);
					}
				});
			}

			console.log("logs-insights da vedere");
			for (let e of elements) {
				if (e.getElementsByClassName("logs-table__body-cell")[2]) {
					const child = e.getElementsByClassName(
						"logs-table__body-cell",
					)[2];
					colorizing(
						child,
						e,
						settings.advancedSettings["Log_Insights"],
					);
				}
			}
		}
	}
};

export default colorizeAll;
