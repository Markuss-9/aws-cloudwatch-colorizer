import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { ColorResult } from "react-color";
import chroma from "chroma-js";
import { Grid, Switch, Typography } from "@mui/material";
import _ from "lodash";

import ColorPicker from "../ColorPicker";

const WordRowSetting = ({
	settings,
	setSettings,
	key,
	options,
	showColorPicker,
	setShowColorPicker,
	keyAccordion,
}: any) => {
	const [savedColor, setSavedColor] = useState(options.color);
	const [currentColor, setCurrentColor] = useState(options.color);

	const toggleColorPicker = () => {
		if (showColorPicker) {
			let tempSettings = settings;
			let pos = _.findIndex(
				tempSettings.advancedSettings[keyAccordion].words,
				{
					word: options.word,
				},
			);
			tempSettings.advancedSettings[keyAccordion].words[pos] = {
				...options,
				color: currentColor,
			};
			setSettings({ ...tempSettings });
			setSavedColor(currentColor);
			setShowColorPicker("");
		} else setShowColorPicker(options.word);
	};

	const lightenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).brighten(0.5).css();
	};

	const darkenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).darken(0.1).css();
	};

	useEffect(() => {
		if (!showColorPicker && options.color !== currentColor)
			console.log(`changin`);
	}, [showColorPicker]);

	const handleColorChange = (color: ColorResult) => {
		console.log(`handle color change`);

		setCurrentColor(
			`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
		);
	};

	const [switchWordEnabled, setSwitchWordEnabled] = useState<boolean>(
		options.enabled,
	);

	const switchWordAction = () => {
		let tempSettings = settings;
		let pos = _.findIndex(
			tempSettings.advancedSettings[keyAccordion].words,
			{
				word: options.word,
			},
		);
		tempSettings.advancedSettings[keyAccordion].words[pos] = {
			...options,
			enabled: !switchWordEnabled,
		};
		setSettings({ ...tempSettings });
		setSwitchWordEnabled(!switchWordEnabled);
	};

	return (
		<>
			<Typography>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item>
						<Button
							sx={{
								minWidth: 0,
								width: 25,
								height: 25,
								padding: 0,
								borderRadius: "50%",
								backgroundColor: savedColor,
								"&:hover": {
									backgroundColor: darkenColor(savedColor),
								},
								"&:before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									border: `1px solid black`,
									zIndex: 1,
									borderRadius: "50%",
								},
								"&:after": {
									content: '""',
									position: "absolute",
									top: 1,
									left: 1,
									right: 1,
									bottom: 1,
									border: `1px solid white`,
									zIndex: 0,
									borderRadius: "50%",
								},
								color: lightenColor(savedColor),
							}}
							onClick={toggleColorPicker}
						/>{" "}
					</Grid>
					<Grid item xs={4}>
						{options.word}
					</Grid>
					<Grid item>
						<Switch
							checked={switchWordEnabled}
							// defaultChecked={section.switch}
							onClick={(e: any) => {
								switchWordAction();
							}}
						/>
					</Grid>
				</Grid>
			</Typography>

			{showColorPicker === options.word && (
				<ColorPicker
					currentColor={currentColor}
					handleColorChange={handleColorChange}
				/>
			)}
		</>
	);
};

export default WordRowSetting;
