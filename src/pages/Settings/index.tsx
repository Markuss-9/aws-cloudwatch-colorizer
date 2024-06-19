import { Button, Tooltip, Typography } from '@mui/material';
import ControlledAccordions from '../../components/ControlledAccordions';
import './style.css';
import { Dispatch } from 'react';
import settingsType from '../../types/settingsType';

const Settings = ({
	settings,
	setSettings,
	resetSettings,
}: {
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
	resetSettings: VoidFunction;
}) => {
	return (
		<>
			<Typography variant="h3" sx={{ margin: 1 }}>
				Settings
			</Typography>
			<br />
			<ControlledAccordions settings={settings} setSettings={setSettings} />
			<br />
			<br />
			<br />
			<Tooltip title={`Reset all settings to default`}>
				<Button variant="outlined" color="warning" onClick={resetSettings}>
					RESET
				</Button>
			</Tooltip>
			<br />
			<br />
			<br />
			<br />
			<br />
		</>
	);
};

export default Settings;
