import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Grid, Switch, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import ColorPickerButton from "../ColorPicker";
import { useEffect, useState } from "react";

const CustomAccordion = ({
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
	const [accordionEnabled, setAccordionEnabled] = useState<boolean>(
		section.switch,
	);
	const [wantBackground, setWantBackground] = useState<boolean>(
		section.wantBackground,
	);

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
							checked={accordionEnabled}
							// defaultChecked={section.switch}
							onClick={(e: any) => {
								handleSwitchClick(e, keyAccordion);
								setAccordionEnabled(!accordionEnabled);
							}}
						/>
					</Tooltip>
					<Typography sx={{ flexShrink: 0, marginLeft: "40px" }}>
						{section.title}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
						>
							<Tooltip
								title={`The words are replaced with the colorized label`}
							>
								<Grid item>Color</Grid>
							</Tooltip>
							<Grid item xs={4}>
								<Switch
									checked={wantBackground}
									onClick={() => {
										let tempSettings = settings;
										tempSettings.advancedSettings[
											keyAccordion
										].wantBackground =
											!tempSettings.advancedSettings[
												keyAccordion
											].wantBackground;
										setSettings({ ...tempSettings });
										setWantBackground(!wantBackground);
									}}
								/>
							</Grid>
							<Tooltip title={`The rows are colorized`}>
								<Grid item>Background</Grid>
							</Tooltip>
						</Grid>
					</Typography>

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

export default CustomAccordion;
