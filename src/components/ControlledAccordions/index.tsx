import "./style.css";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Switch, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { useEffect, useState } from "react";

export default function ControlledAccordions() {
	const [expanded, setExpanded] = useState<string | false>(false);

	const [disabledAccordions, setDisabledAccordions] = useState([""]);

	let settingsDefault = {
		Accordion_1: {
			title: "Log groups",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_1",
			switch: true,
			isAvailable: true,
		},
		Accordion_2: {
			title: "Log Tails",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_2",
			switch: false,
			isAvailable: false,
		},
		Accordion_3: {
			title: "Log Insights",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_3",
			switch: true,
			isAvailable: true,
		},
	};

	const [settings, setSettings] = useState<any>(settingsDefault);

	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	var tempSettings: any = {};

	const handleSwitchClick = (event: any, panel: string) => {
		event.stopPropagation();

		let currentAccordion: any = settings[panel];

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
		tempSettings[panel].switch = !tempSettings[panel].switch;
		setSettings(tempSettings);
	};

	useEffect(() => {
		Object.entries(settings).forEach(([key, section]: any) => {
			if (!section.switch)
				setDisabledAccordions([...disabledAccordions, key]);
		});
	}, []);

	return (
		<div className="center">
			{/* {accordionsDisplay} */}

			{Object.entries(settings).map(([key, section]: any, i) => {
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
									inputProps={{ "aria-label": "ant design" }}
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
									<Typography key={options.word}>
										{options.word}
										<Switch />
									</Typography>
								);
							})}
						</AccordionDetails>
					</Accordion>
				);
			})}
			{/* <Tooltip title="Show logs for the Logs Insights pages">
				<InfoIcon sx={{ color: "black" }} />
			</Tooltip> */}
		</div>
	);
}
