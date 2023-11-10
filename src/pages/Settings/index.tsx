import { Typography } from "@mui/material";
import ControlledAccordions from "../../components/ControlledAccordions";
import "./style.css";

const Settings = () => {
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
