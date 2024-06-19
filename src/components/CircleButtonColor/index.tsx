import { Button } from '@mui/material';
import chroma from 'chroma-js';

const CircleButtonColor = ({
	savedColor,
	toggleColorPicker,
}: {
	savedColor: string;
	toggleColorPicker: VoidFunction;
}) => {
	const lightenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).brighten(0.5).css();
	};

	const darkenColor = (rgbaColor: string | number | chroma.Color) => {
		return chroma(rgbaColor).darken(0.1).css();
	};

	return (
		<Button
			sx={{
				minWidth: 0,
				width: 25,
				height: 25,
				padding: 0,
				borderRadius: '50%',
				backgroundColor: savedColor,
				'&:hover': {
					backgroundColor: darkenColor(savedColor),
				},
				'&:before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					border: `1px solid black`,
					zIndex: 1,
					borderRadius: '50%',
				},
				'&:after': {
					content: '""',
					position: 'absolute',
					top: 1,
					left: 1,
					right: 1,
					bottom: 1,
					border: `1px solid white`,
					zIndex: 0,
					borderRadius: '50%',
				},
				color: lightenColor(savedColor),
			}}
			onClick={toggleColorPicker}
		/>
	);
};

export default CircleButtonColor;
