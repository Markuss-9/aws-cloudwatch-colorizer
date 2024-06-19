import _isEmpty from 'lodash/isEmpty';

const changeWordColor = ({ wordOptions, foundWord, elWithMessage }) => {
	const regex = new RegExp(`([\\S]*${foundWord}[\\S]*)(.*)`, 'i');

	if (!elWithMessage.getElementsByTagName('label').length) {
		const content = elWithMessage.textContent;

		const match = content.match(regex);

		if (match) {
			const contentSplit = content.split(regex);
			const injectLabel = `<label style="color:${wordOptions.color};">${wordOptions.emoji} ${wordOptions.label}</label>`;
			elWithMessage.innerHTML = `${contentSplit[0]}${injectLabel}${contentSplit[2]}`;
		}
	}
};

const findWourd = ({ wordsOptionsCurrentPage, elWithMessage }) => {
	const wordsToFind = wordsOptionsCurrentPage.map((word) => word.word);
	let foundWords = {};
	const textToSearch = elWithMessage.textContent.slice(0, 50).toLowerCase();
	for (const word of wordsToFind) {
		const index = textToSearch.indexOf(word);
		if (index !== -1) {
			foundWords[index] = word;
		}
	}

	if (!_isEmpty(foundWords)) {
		const words = Object.keys(foundWords);
		return foundWords[words[0]];
	}
	return null;
};

const colorizing = (elWithMessage, parentElem, pageSettings) => {
	const wordsOptionsCurrentPage = pageSettings.words;
	const foundWord = findWourd({ wordsOptionsCurrentPage, elWithMessage });

	if (foundWord !== null) {
		const wordOptions = wordsOptionsCurrentPage.find(
			(wordSettings) => wordSettings.word === foundWord,
		);

		if (pageSettings.wantBackground) {
			if (parentElem.style.backgroundColor !== wordOptions.backgroundColor) {
				parentElem.style.backgroundColor = wordOptions.backgroundColor;
			}
		} else {
			changeWordColor({
				wordOptions,
				foundWord,
				elWithMessage,
			});
		}
		return wordOptions;
	} else parentElem.attributeStyleMap.delete('background-color');
};

export default colorizing;
