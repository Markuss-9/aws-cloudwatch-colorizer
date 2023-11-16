import "./style.css";

import { Dispatch, useEffect, useState } from "react";

import settingsType from "../../types/settingsType";
import Accordions from "./accordions";

export default function ControlledAccordions({
	settings,
	setSettings,
}: {
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
}) {
	const [expanded, setExpanded] = useState<string | false>(false);
	const [showColorPicker, setShowColorPicker] = useState<string>("");

	const [disabledAccordions, setDisabledAccordions] = useState([""]);

	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const handleSwitchClick = (event: any, panel: string) => {
		event.stopPropagation();

		let currentAccordion: any = settings.advancedSettings[panel];

		if (currentAccordion.switch) {
			setTimeout(() => {
				setExpanded(false);
				setDisabledAccordions([...disabledAccordions, panel]);
			}, 500);
		} else {
			let tempDis = disabledAccordions;
			tempDis = tempDis.filter(function (s) {
				return s !== panel;
			});
			setDisabledAccordions([...tempDis]);
		}
		let tempSettings = settings;
		tempSettings.advancedSettings[panel].switch =
			!tempSettings.advancedSettings[panel].switch;
		setSettings({ ...tempSettings });
	};

	useEffect(() => {
		Object.entries(settings.advancedSettings).forEach(
			([key, section]: any) => {
				if (!section.switch)
					setDisabledAccordions([...disabledAccordions, key]);
			},
		);
	}, []);

	return (
		<div className="center">
			{Object.entries(settings.advancedSettings).map(
				([keyAccordion, section]: any, i) => {
					return (
						<Accordions
							expanded={expanded}
							keyAccordion={keyAccordion}
							disabledAccordions={disabledAccordions}
							handleChange={handleChange}
							section={section}
							i={i}
							handleSwitchClick={handleSwitchClick}
							settings={settings}
							setSettings={setSettings}
							showColorPicker={showColorPicker}
							setShowColorPicker={setShowColorPicker}
						/>
					);
				},
			)}
		</div>
	);
}
