import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useNavigate } from "react-router-dom";

import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

export default function SimpleBottomNavigation() {
	const [value, setValue] = useState(1);
	const [isHovered, setIsHovered] = useState(false);

	const navigate = useNavigate();

	return (
		<>
			<Box
				onMouseLeave={() => setTimeout(() => setIsHovered(false), 1500)}
				sx={{
					// position: "sticky",
					// bottom: 0,

					width: "80%",
					mx: "auto",
					position: "absolute",
					bottom: 5,
					left: 0,
					right: 0,
					opacity: isHovered ? 1 : 0,
					transition: "opacity 1.25s ease",
				}}
			>
				<BottomNavigation
					showLabels
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
					sx={{
						backgroundColor: "#9b9b9b",
						border: "1px solid black",
						borderRadius: "10px",
					}}
				>
					<BottomNavigationAction
						label="Settings"
						icon={<SettingsIcon />}
						onClick={() => {
							navigate("settings");
						}}
						sx={{ fontWeight: "bold" }}
					/>
					<BottomNavigationAction
						label="Home"
						icon={<HomeIcon />}
						onClick={() => {
							navigate("");
						}}
						sx={{ fontWeight: "bold" }}
					/>
					<BottomNavigationAction
						label="Tutorial"
						icon={<LightbulbIcon />}
						onClick={() => {
							navigate("tutorial");
						}}
						sx={{ fontWeight: "bold" }}
					/>
				</BottomNavigation>
			</Box>
			{!isHovered && (
				<Box
					onMouseEnter={() => setIsHovered(true)}
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						opacity: isHovered ? 0 : 1,
						transition: "opacity 1.25s ease",
						height: 35,
					}}
				>
					<KeyboardArrowUpIcon />
				</Box>
			)}
		</>
	);
}
