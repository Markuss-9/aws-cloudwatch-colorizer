import { Info } from '@mui/icons-material';
import { Box } from '@mui/material';

const info = (msg: string) => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		<Info sx={{ width: 16 }} />
		<Box sx={{ marginLeft: 1 }}>{msg}</Box>
	</Box>
);

export default info;
