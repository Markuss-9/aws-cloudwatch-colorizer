interface word {
	enabled: boolean;
	word: string;
	color: string;
	emoji: string;
}

interface accordion {
	title: string;
	words: Array<word>;
	id: string;
	switch: boolean;
	isAvailable: boolean;
}
interface accordionsID {
	[key: string]: accordion;
}

interface settingsType {
	master: boolean;
	performance: string;
	advancedSettings: accordionsID;
}

export default settingsType;
