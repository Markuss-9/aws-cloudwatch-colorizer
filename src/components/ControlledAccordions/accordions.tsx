import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Switch, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import ColorPickerButton from "../ColorPicker";
import { useEffect, useState } from "react";

const Accordions = ({
	expanded,
	keyAccordion,
	disabledAccordions,
	handleChange,
	section,
	i,
	handleSwitchClick,
	settings,
	setSettings,
	showColorPicker,
	setShowColorPicker,
}: any) => {
	const [switchEnabled, setSwitchEnabled] = useState<boolean>(section.switch);

	return (
		<>
			<Accordion
				expanded={
					expanded === keyAccordion &&
					!disabledAccordions.includes(keyAccordion)
				}
				sx={{ width: "90%" }}
				onChange={handleChange(keyAccordion)}
				disabled={!section.isAvailable}
				// disabled={disabledAccordions.includes(keyAccordion)}
				className="Accordion"
				key={i}
			>
				<AccordionSummary
					expandIcon={
						!disabledAccordions.includes(keyAccordion) && (
							<ExpandMoreIcon />
						)
					}
					aria-controls="panel2bh-content"
					id="panel2bh-header"
				>
					<Tooltip title={`Show logs for the ${section.title} pages`}>
						<Switch
							checked={switchEnabled}
							// defaultChecked={section.switch}
							onClick={(e: any) => {
								setSwitchEnabled(!switchEnabled);
								handleSwitchClick(e, keyAccordion);
							}}
						/>
					</Tooltip>
					<Typography sx={{ flexShrink: 0, marginLeft: "40px" }}>
						{section.title}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{section.words.map((options: any) => {
						return (
							<>
								<ColorPickerButton
									settings={settings}
									setSettings={setSettings}
									key={options.word}
									options={options}
									showColorPicker={showColorPicker}
									setShowColorPicker={setShowColorPicker}
									keyAccordion={keyAccordion}
								/>
							</>
						);
					})}
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export default Accordions;
