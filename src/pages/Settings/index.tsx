import { Typography } from "@mui/material";
import ControlledAccordions from "../../components/ControlledAccordions";
import "./style.css";
import { Dispatch } from "react";
import settingsType from "../../types/settingsType";

const Settings = ({
	settings,
	setSettings,
}: {
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
}) => {
	return (
		<>
			<Typography variant="h3" sx={{ margin: 1 }}>
				Settings
			</Typography>
			<br />
			<ControlledAccordions />
			<br />
			<br />
			<br />
			<br />
		</>
	);
};

export default Settings;
