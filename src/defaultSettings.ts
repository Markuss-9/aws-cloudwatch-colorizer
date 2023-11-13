const defaultSettings = {
	master: true,
	performance: "manual",
	advancedSettings: {
		Accordion_1: {
			title: "Log groups",
			words: [
				{ enabled: true, word: "error", color: "red", emoji: "❌" },
				{ enabled: true, word: "warn", color: "yellow", emoji: "⚠️" },
				{ enabled: true, word: "info", color: "green", emoji: "ℹ️" },
				{ enabled: true, word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_1",
			switch: true,
			isAvailable: true,
		},
		Accordion_2: {
			title: "Log Tails",
			words: [
				{ enabled: true, word: "error", color: "red", emoji: "❌" },
				{ enabled: true, word: "warn", color: "yellow", emoji: "⚠️" },
				{ enabled: true, word: "info", color: "green", emoji: "ℹ️" },
				{ enabled: true, word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_2",
			switch: false,
			isAvailable: false,
		},
		Accordion_3: {
			title: "Log Insights",
			words: [
				{ enabled: true, word: "error", color: "red", emoji: "❌" },
				{ enabled: true, word: "warn", color: "yellow", emoji: "⚠️" },
				{ enabled: true, word: "info", color: "green", emoji: "ℹ️" },
				{ enabled: true, word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_3",
			switch: true,
			isAvailable: true,
		},
	},
};

export default defaultSettings;
