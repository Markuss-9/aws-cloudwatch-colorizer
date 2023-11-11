const defaultSettings = {
	master: true,
	performance: "manual",
	advancedSettings: {
		Accordion_1: {
			title: "Log groups",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_1",
			switch: true,
			isAvailable: true,
		},
		Accordion_2: {
			title: "Log Tails",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_2",
			switch: false,
			isAvailable: false,
		},
		Accordion_3: {
			title: "Log Insights",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_3",
			switch: true,
			isAvailable: true,
		},
	},
};

export default defaultSettings;
