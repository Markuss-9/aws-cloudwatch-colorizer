import { Button, Typography } from "@mui/material";
import ControlledAccordions from "../../components/ControlledAccordions";
import "./style.css";
import { Dispatch } from "react";
import settingsType from "../../types/settingsType";

const Settings = ({
	settings,
	setSettings,
	resetSettings,
}: {
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
	resetSettings: any;
}) => {
	return (
		<>
			<Typography variant="h3" sx={{ margin: 1 }}>
				Settings
			</Typography>
			<br />
			<ControlledAccordions
				settings={settings}
				setSettings={setSettings}
			/>
			<br />
			<br />
			<br />
			<Button variant="outlined" color="warning" onClick={resetSettings}>
				RESET
			</Button>
			<br />
			<br />
			<br />
			<br />
			<br />
		</>
	);
};

export default Settings;
