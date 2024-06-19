import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Switch, Tooltip } from '@mui/material';

import { Dispatch, useState } from 'react';
import WordRowSettingColor from '../WordRowSettingColor';
import WordRowSettingBackground from '../WordRowSettingBackground';
import settingsType, {
	accordionType,
	optionsType,
} from '../../types/settingsType';

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
}: {
	expanded: string | boolean;
	keyAccordion: string;
	disabledAccordions: string[];
	handleChange: Function;
	section: accordionType;
	i: number;
	handleSwitchClick: Function;
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
	showColorPicker: string;
	setShowColorPicker: Dispatch<string>;
}) => {
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
				sx={{ width: '90%' }}
				onChange={handleChange(keyAccordion)}
				disabled={!section.isAvailable}
				// disabled={disabledAccordions.includes(keyAccordion)}
				className="Accordion"
				key={`${keyAccordion}-Accordion-${i}`}
			>
				<AccordionSummary
					expandIcon={
						!disabledAccordions.includes(keyAccordion) && <ExpandMoreIcon />
					}
					aria-controls="panel2bh-content"
					id="panel2bh-header"
					key={`${keyAccordion}-AccordionSummary-${i}`}
				>
					<Tooltip title={`Show logs for the ${section.title} pages`}>
						<Switch
							checked={accordionEnabled}
							// defaultChecked={section.switch}
							onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
								handleSwitchClick(e, keyAccordion);
								setAccordionEnabled(!accordionEnabled);
							}}
						/>
					</Tooltip>
					<Typography sx={{ flexShrink: 0, marginLeft: '40px' }}>
						{section.title}
					</Typography>
				</AccordionSummary>
				<AccordionDetails key={`${keyAccordion}-AccordionDetails-${i}`}>
					<Grid
						container
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Tooltip title={`The words are replaced with the colorized label`}>
							<Grid item>
								<Typography>Color</Typography>
							</Grid>
						</Tooltip>
						<Grid item xs={4}>
							<Switch
								checked={wantBackground}
								onClick={() => {
									let tempSettings = settings;
									tempSettings.advancedSettings[keyAccordion].wantBackground =
										!tempSettings.advancedSettings[keyAccordion].wantBackground;
									setSettings({ ...tempSettings });
									setShowColorPicker('');
									setWantBackground(!wantBackground);
								}}
							/>
						</Grid>
						<Tooltip title={`The rows are colorized`}>
							<Grid item>
								<Typography>Background</Typography>
							</Grid>
						</Tooltip>
					</Grid>

					{section.words.map((options: optionsType, i: number) => {
						return wantBackground ? (
							<>
								<WordRowSettingBackground
									settings={settings}
									setSettings={setSettings}
									key={`${keyAccordion}-bg-${options.word}-${i}`}
									options={options}
									showColorPicker={showColorPicker}
									setShowColorPicker={setShowColorPicker}
									keyAccordion={keyAccordion}
								/>
							</>
						) : (
							<>
								<WordRowSettingColor
									settings={settings}
									setSettings={setSettings}
									key={`${keyAccordion}-color-${options.word}-${i}`}
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
