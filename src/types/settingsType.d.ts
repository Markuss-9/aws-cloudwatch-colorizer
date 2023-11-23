interface word {
	enabled: boolean;
	code: number;
	word: string;
	color: string;
	backgroundColor: string;
	emoji: string;
	label: string;
}

interface accordion {
	title: string;
	words: Array<word>;
	id: string;
	switch: boolean;
	isAvailable: boolean;
	wantBackground: boolean;
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
