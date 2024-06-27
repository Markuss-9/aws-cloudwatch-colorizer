const defaultSettings = {
	version: '1.0.2',
	master: true,
	performance: 'dom',
	advancedSettings: {
		Log_Groups: {
			title: 'Log groups',
			words: [
				{
					enabled: true,
					code: 31,
					word: 'error',
					color: 'rgba(255, 0, 0, 1)',
					backgroundColor: 'rgba(155, 0, 0, 0.44)',
					emoji: '❌',
					label: 'Error',
				},
				{
					enabled: true,
					code: 33,
					word: 'warn',
					color: 'rgba(255, 242, 0, 1)',
					backgroundColor: 'rgba(227, 217, 0, 0.4)',
					emoji: '⚠️',
					label: 'Warn',
				},
				{
					enabled: true,
					code: 32,
					word: 'info',
					color: 'rgba(0, 200, 0, 1)',
					backgroundColor: 'rgba(0, 155, 10, 0.16)',
					emoji: 'ℹ️',
					label: 'Info',
				},
				{
					enabled: true,
					code: 34,
					word: 'debug',
					color: 'rgba(0, 125, 255, 1)',
					backgroundColor: 'rgba(0, 78, 155, 0.16)',
					emoji: '🐛',
					label: 'Debug',
				},
			],
			id: 'Log_Groups',
			switch: true,
			isAvailable: true,
			wantBackground: true,
			// evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
		},
		Log_Insights: {
			title: 'Log Insights',
			words: [
				{
					enabled: true,
					code: 31,
					word: 'error',
					color: 'rgba(255, 0, 0, 1)',
					backgroundColor: 'rgba(155, 0, 0, 0.44)',
					emoji: '❌',
					label: 'Error',
				},
				{
					enabled: true,
					code: 33,
					word: 'warn',
					color: 'rgba(255, 242, 0, 1)',
					backgroundColor: 'rgba(227, 217, 0, 0.4)',
					emoji: '⚠️',
					label: 'Warn',
				},
				{
					enabled: true,
					code: 32,
					word: 'info',
					color: 'rgba(0, 200, 0, 1)',
					backgroundColor: 'rgba(0, 155, 10, 0.16)',
					emoji: 'ℹ️',
					label: 'Info',
				},
				{
					enabled: true,
					code: 34,
					word: 'debug',
					color: 'rgba(0, 125, 255, 1)',
					backgroundColor: 'rgba(0, 78, 155, 0.16)',
					emoji: '🐛',
					label: 'Debug',
				},
			],
			id: 'Log_Insights',
			switch: true,
			isAvailable: true,
			wantBackground: true,
			// evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
		},
		Log_Tails: {
			title: 'Log Tails',
			words: [
				{
					enabled: true,
					code: 31,
					word: 'error',
					color: 'rgba(255, 0, 0, 1)',
					backgroundColor: 'rgba(155, 0, 0, 0.44)',
					emoji: '❌',
					label: 'Error',
				},
				{
					enabled: true,
					code: 33,
					word: 'warn',
					color: 'rgba(255, 242, 0, 1)',
					backgroundColor: 'rgba(227, 217, 0, 0.4)',
					emoji: '⚠️',
					label: 'Warn',
				},
				{
					enabled: true,
					code: 32,
					word: 'info',
					color: 'rgba(0, 200, 0, 1)',
					backgroundColor: 'rgba(0, 155, 10, 0.16)',
					emoji: 'ℹ️',
					label: 'Info',
				},
				{
					enabled: true,
					code: 34,
					word: 'debug',
					color: 'rgba(0, 125, 255, 1)',
					backgroundColor: 'rgba(0, 78, 155, 0.16)',
					emoji: '🐛',
					label: 'Debug',
				},
			],
			id: 'Log_Tails',
			switch: false,
			isAvailable: false,
			wantBackground: true,
			// evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
		},
	},
};

export default defaultSettings;
