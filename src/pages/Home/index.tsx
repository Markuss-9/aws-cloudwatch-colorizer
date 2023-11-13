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
import { useEffect, useState, Dispatch } from "react";
import settingsType from "../../types/settingsType";

const Home = ({
	settings,
	setSettings,
}: {
	settings: settingsType;
	setSettings: Dispatch<settingsType>;
}) => {
	const handleToggle = () =>
		setSettings({ ...settings, ...{ master: !settings.master } });

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		newPerf: string,
	) => setSettings({ ...settings, ...{ performance: newPerf } });

	const handleAutoMode = () =>
		setSettings({
			...settings,
			...{
				performance:
					settings.performance !== "manual" ? "manual" : "timer",
			},
		});

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
					lineHeight: 1,
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
				selected={settings.performance !== "manual"}
				onChange={handleAutoMode}
				sx={{
					position: "absolute",
					top: 120,
					right: 15,
				}}
			>
				<Tooltip title="Auto mode">
					<span>AUTO</span>
				</Tooltip>
			</ToggleButton>
			<br />
			<ToggleButtonGroup
				color="secondary"
				value={settings.performance}
				exclusive
				onChange={handleChange}
				aria-label="performance"
				disabled={settings.performance === "manual"}
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

			<Box sx={{ display: "inline-flex", alignItems: "center" }}>
				<Typography
					sx={{
						width: 165,
						fontSize: "0.9rem",
						display: "inline-flex",
						alignItems: "center",
					}}
				>
					Give a star at the repo
				</Typography>
				<GitHubIcon
					sx={{ fontSize: 30 }}
					onClick={() => {
						window.open(
							"https://github.com/Markuss-9/aws-cloudwatch-colorizer",
						);
					}}
				/>
			</Box>
		</>
	);
};

export default Home;
