import { isEmpty as _isEmpty } from 'lodash-es';
import type { PageSettings, WordOption } from '@/types';
import { UnreachableError } from '@/errors';
import { log } from '@/logger';

const CLASS_NAME_TAG = 'log-with-label-tag';

// I create a label instead of a span because when i search the most child element i take the last one
// and if the span is the most child element i cannot find it and i create infinite spans inside spans
// and to avoid it the if statement has classList.contains(CLASS_NAME_TAG) and querySelector with the same class to be sure that i don't create infinite spans inside spans

// TODO: Fix the search in the pages to take the last element without the CLASS_NAME_TAG class
const changeWordColor = ({
  wordOptions,
  foundWord,
  elWithMessage,
}: {
  wordOptions: WordOption;
  foundWord: string;
  elWithMessage: HTMLElement;
}) => {
  if (
    elWithMessage.classList.contains(CLASS_NAME_TAG) ||
    elWithMessage.querySelector(`.${CLASS_NAME_TAG}`)
  ) {
    return;
  }

  const regex = new RegExp(foundWord, 'i');
  const content = elWithMessage.textContent;

  const match = content.match(regex);

  if (!match || match.index === undefined) return;

  const label = document.createElement('label');

  label.className = CLASS_NAME_TAG;
  label.style.color = wordOptions.color;
  label.textContent = `${wordOptions.emoji} ${wordOptions.label}`;

  const beforeText = content.slice(0, match.index);
  const afterText = content.slice(match.index + match[0].length);

  elWithMessage.textContent = '';

  elWithMessage.append(
    document.createTextNode(beforeText),
    label,
    document.createTextNode(afterText),
  );
};

export const findWord = ({
  wordsOptionsCurrentPage,
  elWithMessage,
}: {
  wordsOptionsCurrentPage: PageSettings['words'];
  elWithMessage: HTMLElement;
}): { word: string; wordSetting: WordOption } | null => {
  const textToSearch = (elWithMessage.textContent ?? '')
    .slice(0, 50)
    .toLowerCase();
  let bestIndex = Infinity;
  let bestWordSetting: WordOption | null = null;
  let bestPattern: string | null = null;

  for (const wordSetting of wordsOptionsCurrentPage) {
    if (!wordSetting.patterns) {
      throw new UnreachableError(
        `Patterns not found, invalid configuration for word ${wordSetting.label}`,
      );
    }

    let minIndexForThisSetting = Infinity;
    let patternForThisSetting: string | null = null;
    for (const pattern of wordSetting.patterns) {
      const index = textToSearch.indexOf(pattern.toLowerCase());
      if (index !== -1 && index < minIndexForThisSetting) {
        minIndexForThisSetting = index;
        patternForThisSetting = pattern;
      }
    }
    if (minIndexForThisSetting < bestIndex) {
      bestIndex = minIndexForThisSetting;
      bestWordSetting = wordSetting;
      bestPattern = patternForThisSetting;
    }
  }

  return bestIndex === Infinity
    ? null
    : { word: bestPattern!, wordSetting: bestWordSetting! };
};

const colorizing = (
  elWithMessage: HTMLElement,
  parentElem: HTMLElement,
  pageSettings: PageSettings,
) => {
  try {
    const wordsOptionsCurrentPage = pageSettings.words;
    const found = findWord({ wordsOptionsCurrentPage, elWithMessage });

    if (found !== null) {
      const { word, wordSetting: wordOptions } = found;

      if (pageSettings.wantBackground) {
        if (parentElem.style.backgroundColor !== wordOptions.backgroundColor) {
          parentElem.style.backgroundColor = wordOptions.backgroundColor;
        }
      } else {
        changeWordColor({
          wordOptions,
          foundWord: word,
          elWithMessage,
        });
      }
      return found;
    }

    parentElem.style.removeProperty('background-color');
  } catch (error) {
    if (error instanceof UnreachableError) {
      throw error;
    }
    log.error('colorizing for element', { elWithMessage, parentElem }, error);
    return;
  }
};

export default colorizing;
