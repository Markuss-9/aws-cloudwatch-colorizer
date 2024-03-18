import pretty from "./pretty";
import { findIndex } from "lodash-es";

const colorizing = (e, parent, pageSettings) => {
	let computedStyle = window.getComputedStyle(parent);
	let backgroundColor = computedStyle.backgroundColor;

	const wordsOptionsCurrentPage = pageSettings.words;
	const wordsToFind = wordsOptionsCurrentPage.map((word) => word.word);
	let foundWord = null;
	for (const word of wordsToFind) {
		const wordReg = new RegExp(`${word}`, "i");
		if (wordReg.test(e.textContent.slice(0, 50))) {
			foundWord = word;
			break;
		}
	}

	if (foundWord !== null) {
		let pos = findIndex(wordsOptionsCurrentPage, {
			word: foundWord,
		});
		const wordOptions = wordsOptionsCurrentPage[pos];

		if (pageSettings.wantBackground) {
			if (
				!parent.style.backgroundColor.includes(
					`${wordOptions.backgroundColor}`,
				)
			) {
				if (parent.style.backgroundColor.includes(`color-mix`)) {
					parent.style.backgroundColor = "";
					computedStyle = window.getComputedStyle(parent);
					backgroundColor = computedStyle.backgroundColor;
				}
				parent.style.backgroundColor = `color-mix(in srgb, ${wordOptions.backgroundColor}, ${backgroundColor})`;
			}
		} else {
			const dynamicRegex = new RegExp(
				`(\\x1b\\[${wordOptions.code}m${foundWord}\\x1b\\[39m|${foundWord})(.*?)$`,
			);
			const dynamicRegexInit = new RegExp(
				`\\x1b\\[${wordOptions.code}m${foundWord}\\x1b\\[39m|${foundWord}`,
			);

			if (!e.getElementsByTagName("span").length)
				pretty(
					e,
					parent,
					dynamicRegex,
					dynamicRegexInit,
					`<span style="color:${wordOptions.color};">${wordOptions.emoji} ${wordOptions.label}</span>`,
				);
		}
	} else parent.attributeStyleMap.delete("background-color");
};

export default colorizing;
