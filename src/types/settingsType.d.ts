export interface optionsType {
	enabled: boolean;
	code: number;
	word: string;
	color: string;
	backgroundColor: string;
	emoji: string;
	label: string;
}

export interface accordionType {
	title: string;
	words: Array<optionsType>;
	id: string;
	switch: boolean;
	isAvailable: boolean;
	wantBackground: boolean;
}
export interface accordionsIDType {
	[key: string]: accordionType;
}

interface settingsType {
	version: string;
	master: boolean;
	performance: string;
	advancedSettings: accordionsIDType;
}

export default settingsType;
