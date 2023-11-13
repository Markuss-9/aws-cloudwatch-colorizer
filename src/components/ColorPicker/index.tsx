import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { ChromePicker, ColorResult } from "react-color";
import chroma from "chroma-js";
import { Box, Switch, Typography } from "@mui/material";

const ColorPickerButton = ({
	color,
	settings,
	setSettings,
	key,
	options,
	showColorPicker,
	setShowColorPicker,
}: any) => {
	const [currentColor, setCurrentColor] = useState(color);

	const toggleColorPicker = () => {
		showColorPicker
			? setShowColorPicker("")
			: setShowColorPicker(options.word);
	};

	const lightenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).brighten(0.5).css();
	};

	const darkenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).darken(0.1).css();
	};

	useEffect(() => {
		if (!showColorPicker && color !== currentColor) console.log(`changin`);
	}, [showColorPicker]);

	const handleColorChange = (color: ColorResult) => {
		setCurrentColor(
			`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
		);
	};

	return (
		<>
			<Typography>
				<Button
					sx={{
						minWidth: 0,
						width: 25,
						height: 25,
						padding: 0,
						borderRadius: "50%",
						backgroundColor: currentColor,
						"&:hover": {
							backgroundColor: darkenColor(currentColor),
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
						color: lightenColor(currentColor),
					}}
					onClick={toggleColorPicker}
				/>{" "}
				{options.word}
				<Switch />
			</Typography>
			{showColorPicker === options.word && (
				<Box sx={{ position: "absolute", zIndex: "1000" }}>
					<ChromePicker
						color={currentColor}
						onChange={handleColorChange}
					/>
				</Box>
			)}
		</>
	);
};

export default ColorPickerButton;
