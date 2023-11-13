import "./style.css";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Switch, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ColorPickerButton from "../ColorPicker";
import settingsType from "../../types/settingsType";

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

	var tempSettings: any = {};

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
		tempSettings = settings;
		tempSettings.advancedSettings[panel].switch =
			!tempSettings.advancedSettings[panel].switch;
		console.log("🚀 ~ handleSwitchClick ~ tempSettings:", tempSettings);
		// setSettings({...settings, settings.advancedSettings[panel]: {switch: !settings.advancedSettings[panel].switch}});
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
			{/* {accordionsDisplay} */}

			{Object.entries(settings.advancedSettings).map(
				([key, section]: any, i) => {
					return (
						<Accordion
							expanded={
								expanded === key &&
								!disabledAccordions.includes(key)
							}
							sx={{ width: "90%" }}
							onChange={handleChange(key)}
							disabled={!section.isAvailable}
							// disabled={disabledAccordions.includes(key)}
							className="Accordion"
							key={i}
						>
							<AccordionSummary
								expandIcon={
									!disabledAccordions.includes(key) && (
										<ExpandMoreIcon />
									)
								}
								aria-controls="panel2bh-content"
								id="panel2bh-header"
							>
								<Tooltip
									title={`Show logs for the ${section.title} pages`}
								>
									<Switch
										// checked={section.switch}
										defaultChecked={section.switch}
										inputProps={{
											"aria-label": "ant design",
										}}
										onClick={(e: any) => {
											handleSwitchClick(e, key);
										}}
									/>
								</Tooltip>
								<Typography
									sx={{ flexShrink: 0, marginLeft: "40px" }}
								>
									{section.title}
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								{section.words.map((options: any) => {
									return (
										<>
											<ColorPickerButton
												color={options.color}
												settings={settings}
												setSettings={setSettings}
												key={options.word}
												options={options}
												showColorPicker={
													showColorPicker
												}
												setShowColorPicker={
													setShowColorPicker
												}
											/>
										</>
									);
								})}
							</AccordionDetails>
						</Accordion>
					);
				},
			)}
			{/* <Tooltip title="Show logs for the Logs Insights pages">
				<InfoIcon sx={{ color: "black" }} />
			</Tooltip> */}
		</div>
	);
}
