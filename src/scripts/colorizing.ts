import { isEmpty as _isEmpty } from 'lodash-es';
import type { PageSettings, WordOption } from '@/types';
import { UnreachableError } from '@/errors';
import { log } from '@/logger';

const CLASS_NAME_TAG = 'log-with-label-tag';

const sanitizeAnsi = (text: string) =>
  text.replace(/(?:\x1b)?\[\d+(?:;\d+)*m/g, (m) => ' '.repeat(m.length));

const buildRegex = (pattern: string, isRegex: boolean) =>
  isRegex ? new RegExp(pattern, 'i') : new RegExp(`\\b${pattern}\\b`, 'i');

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

  const content = elWithMessage.textContent;
  const searchText = sanitizeAnsi(content);
  const regex = buildRegex(foundWord, wordOptions.regex ?? false);

  const match = searchText.match(regex);

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

const regexCache = new Map<string, RegExp>();

const getCachedRegex = (pattern: string, isRegex: boolean): RegExp => {
  const key = `${isRegex ? 'r' : 'w'}\0${pattern}`;
  let re = regexCache.get(key);
  if (!re) {
    re = buildRegex(pattern, isRegex);
    regexCache.set(key, re);
  }
  return re;
};

export const findWord = ({
  wordsOptionsCurrentPage,
  elWithMessage,
}: {
  wordsOptionsCurrentPage: PageSettings['words'];
  elWithMessage: HTMLElement;
}): { word: string; wordSetting: WordOption } | null => {
  const textToSearch = sanitizeAnsi(elWithMessage.textContent ?? '').slice(
    0,
    50,
  );

  if (!textToSearch) return null;

  let bestIndex = Infinity;
  let bestWordSetting: WordOption | null = null;
  let bestPattern: string | null = null;
  let bestMatchLen = 0;

  for (const wordSetting of wordsOptionsCurrentPage) {
    if (!wordSetting.patterns) {
      throw new UnreachableError(
        `Patterns not found, invalid configuration for word ${wordSetting.label}`,
      );
    }

    const isRegex = wordSetting.regex ?? false;

    for (const pattern of wordSetting.patterns) {
      const match = textToSearch.match(getCachedRegex(pattern, isRegex));
      if (!match || match.index === undefined) continue;

      const { index } = match;
      const matchLen = match[0].length;

      if (
        index < bestIndex ||
        (index === bestIndex && matchLen > bestMatchLen)
      ) {
        bestIndex = index;
        bestWordSetting = wordSetting;
        bestPattern = pattern;
        bestMatchLen = matchLen;

        // pattern is at the start of the text, no need to check for priority
        if (bestIndex === 0) {
          return { word: bestPattern!, wordSetting: bestWordSetting! };
        }
      }
    }
  }

  return bestIndex === Infinity
    ? null
    : { word: bestPattern!, wordSetting: bestWordSetting! };
};

export default function colorizing(
  elWithMessage: HTMLElement,
  parentElem: HTMLElement,
  pageSettings: PageSettings,
) {
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
}
