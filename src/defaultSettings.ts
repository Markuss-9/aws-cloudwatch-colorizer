const defaultSettings = {
	master: true,
	performance: "manual",
	advancedSettings: {
		Accordion_1: {
			title: "Log groups",
			words: [
				{
					enabled: true,
					word: "error",
					color: "rgba(255, 0, 0, 1)",
					emoji: "❌",
				},
				{
					enabled: true,
					word: "warn",
					color: "rgba(255, 255, 0, 1)",
					emoji: "⚠️",
				},
				{
					enabled: true,
					word: "info",
					color: "rgba(0, 128, 0, 1)",
					emoji: "ℹ️",
				},
				{
					enabled: true,
					word: "debug",
					color: "rgba(0, 0, 255, 1)",
					emoji: "🐛",
				},
			],
			id: "Accordion_1",
			switch: true,
			isAvailable: true,
		},
		Accordion_2: {
			title: "Log Tails",
			words: [
				{
					enabled: true,
					word: "error",
					color: "rgba(255, 0, 0, 1)",
					emoji: "❌",
				},
				{
					enabled: true,
					word: "warn",
					color: "rgba(255, 255, 0, 1)",
					emoji: "⚠️",
				},
				{
					enabled: true,
					word: "info",
					color: "rgba(0, 128, 0, 1)",
					emoji: "ℹ️",
				},
				{
					enabled: true,
					word: "debug",
					color: "rgba(0, 0, 255, 1)",
					emoji: "🐛",
				},
			],
			id: "Accordion_2",
			switch: false,
			isAvailable: false,
		},
		Accordion_3: {
			title: "Log Insights",
			words: [
				{
					enabled: true,
					word: "error",
					color: "rgba(255, 0, 0, 1)",
					emoji: "❌",
				},
				{
					enabled: true,
					word: "warn",
					color: "rgba(255, 255, 0, 1)",
					emoji: "⚠️",
				},
				{
					enabled: true,
					word: "info",
					color: "rgba(0, 128, 0, 1)",
					emoji: "ℹ️",
				},
				{
					enabled: true,
					word: "debug",
					color: "rgba(0, 0, 255, 1)",
					emoji: "🐛",
				},
			],
			id: "Accordion_3",
			switch: true,
			isAvailable: true,
		},
	},
};

export default defaultSettings;
