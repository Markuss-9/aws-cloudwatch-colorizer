import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import FlashOnIcon from "@mui/icons-material/FlashOn";

import {
	ToggleButtonGroup,
	Button,
	ToggleButton,
	Typography,
	Tooltip,
	Box,
} from "@mui/material";

import packageJson from "../../../package.json";

const Home = ({ settings, setSettings }: any) => {
	const handleToggle = () => {
		let temp: any = settings;
		temp.master = !settings.master;
		//! ********************** if condition only for debug
		if (process.env.NODE_ENV === "production")
			chrome.storage.local.set({ settings: temp }).then(() => {
				console.log("Changed settings master", temp);
			});
		setSettings({ ...temp });
	};

	const [performance, setPerformance] = useState("timer");
	const [isAuto, setAuto] = useState(true);

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		newPerf: string
	) => {
		// let temp: any = settings;
		// temp.performance = newPerf;
		// setSettings({ ...temp });
		setPerformance(newPerf);
	};

	const handleAutoMode = () => {
		if (isAuto) setPerformance("manual");
		setAuto(!isAuto);
	};

	console.log(packageJson.version);

	return (
		<>
			<Typography
				sx={{
					width: "fit-content",
					height: "fit-content",
					padding: 1,
					right: 0,
					position: "absolute",
					fontSize: 12,
				}}
			>
				{packageJson.version}
			</Typography>
			<Typography variant="h3" sx={{ margin: 1 }}>
				Home
			</Typography>
			<Button
				variant="contained"
				color={settings.master ? "on" : "off"}
				onClick={handleToggle}
				sx={{
					borderRadius: "50%",
					width: "130px",
					height: "130px",
				}}
			>
				{settings.master ? (
					<FlashOnIcon sx={{ fontSize: 60 }} />
				) : (
					<PowerSettingsNewIcon sx={{ fontSize: 60 }} />
				)}
			</Button>
			<br />
			<ToggleButton
				color="primary"
				value={"AUTO"}
				selected={isAuto}
				onChange={handleAutoMode}
				sx={{
					position: "absolute",
					top: 120,
					right: 0,
				}}
			>
				<Tooltip title="Auto mode">
					<span>AUTO</span>
				</Tooltip>
			</ToggleButton>
			<br />
			<ToggleButtonGroup
				color="secondary"
				value={performance}
				exclusive
				onChange={handleChange}
				aria-label="performance"
				disabled={!isAuto}
			>
				<ToggleButton value="timer">
					<Tooltip title="Every 3 seconds it updates">
						<span>TIMER</span>
					</Tooltip>
				</ToggleButton>

				<ToggleButton value="dom">
					<Tooltip title="[WIP] It updates when the DOM is changed">
						<span>DOM</span>
					</Tooltip>
				</ToggleButton>
				<ToggleButton value="net">
					<Tooltip title="[WIP] It updates when the a network request has finished">
						<span>NET</span>
					</Tooltip>
				</ToggleButton>
			</ToggleButtonGroup>

			<br />
			<br />

			<Typography sx={{ display: "inline-flex", alignItems: "center" }}>
				<Box
					sx={{
						width: 165,
						fontSize: "0.9rem",
						display: "inline-flex",
						alignItems: "center",
					}}
				>
					Give a star at the repo
				</Box>
				<GitHubIcon
					sx={{ fontSize: 30 }}
					onClick={() => {
						window.open("http://www.google.com");
					}}
				/>
			</Typography>
		</>
	);
};

export default Home;
