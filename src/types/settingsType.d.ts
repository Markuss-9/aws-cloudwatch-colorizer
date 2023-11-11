interface word {
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
	Accordion_1: accordion;
	Accordion_2: accordion;
	Accordion_3: accordion;
}

interface settingsType {
	master: boolean;
	performance: string;
	advancedSettings: accordionsID;
}

export default settingsType;
