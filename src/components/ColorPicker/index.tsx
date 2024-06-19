import { Box } from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import './index.css';

const ColorPicker = ({
	currentColor,
	handleColorChange,
}: {
	currentColor: string;
	handleColorChange: (color: ColorResult) => void;
}) => {
	const chromePickerStyles = {
		default: {
			picker: {
				background: '#333',
				boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
				borderRadius: '8px',
			},
			saturation: {
				borderRadius: '8px',
			},
			swatch: {
				border: '0.5px solid #fff',
				borderRadius: '50%',
			},
		},
	};

	return (
		<Box sx={{ zIndex: '1000' }}>
			<ChromePicker
				color={currentColor}
				onChange={handleColorChange}
				styles={chromePickerStyles}
			/>
		</Box>
	);
};
export default ColorPicker;
