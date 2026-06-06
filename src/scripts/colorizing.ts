import type { PageSettings, LevelPreset } from '@/types';
import { UnreachableError } from '@/errors';
import { log } from '@/logger';

const CLASS_NAME_TAG = 'log-with-label-tag';

interface FoundPattern {
  pattern: string;
  levelPreset: LevelPreset;
  matchIndex: number;
  matchText: string;
}

const stripAnsi = (text: string) =>
  text.replace(/(?:\x1b)?\[\d+(?:;\d+)*m/g, '');

const buildRegex = (pattern: string, isRegex: boolean) =>
  isRegex ? new RegExp(pattern, 'i') : new RegExp(`\\b${pattern}\\b`, 'i');

// I create a label instead of a span because when i search the most child element i take the last one
// and if the span is the most child element i cannot find it and i create infinite spans inside spans
// and to avoid it the if statement has classList.contains(CLASS_NAME_TAG) and querySelector with the same class to be sure that i don't create infinite spans inside spans

// TODO: Fix the search in the pages to take the last element without the CLASS_NAME_TAG class
const replaceWithLabel = ({
  foundPattern,
  elWithMessage,
}: {
  foundPattern: FoundPattern;
  elWithMessage: HTMLElement;
}) => {
  if (
    elWithMessage.classList.contains(CLASS_NAME_TAG) ||
    elWithMessage.querySelector(`.${CLASS_NAME_TAG}`)
  ) {
    return;
  }

  const content = stripAnsi(elWithMessage.textContent ?? '');
  const { matchIndex, matchText, levelPreset } = foundPattern;

  const label = document.createElement('label');

  label.className = CLASS_NAME_TAG;
  label.style.color = levelPreset.color;
  label.textContent = `${levelPreset.emoji} ${levelPreset.label}`;

  const beforeText = content.slice(0, matchIndex);
  const afterText = content.slice(matchIndex + matchText.length);

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

export const findPattern = ({
  levels,
  elWithMessage,
}: {
  levels: PageSettings['levels'];
  elWithMessage: HTMLElement;
}): FoundPattern | null => {
  const textToSearch = stripAnsi(elWithMessage.textContent ?? '').slice(0, 50);

  if (!textToSearch) return null;

  let bestIndex = Infinity;
  let bestPreset: LevelPreset | null = null;
  let bestPattern: string | null = null;
  let bestMatchLen = 0;
  let bestMatchText: string | null = null;

  for (const levelPreset of levels) {
    if (!levelPreset.patterns) {
      throw new UnreachableError(
        `Patterns not found, invalid configuration for level ${levelPreset.label}`,
      );
    }

    const isRegex = levelPreset.regex ?? false;

    for (const pattern of levelPreset.patterns) {
      const match = textToSearch.match(getCachedRegex(pattern, isRegex));
      if (!match || match.index === undefined) continue;

      const { index } = match;
      const matchLen = match[0].length;

      if (
        index < bestIndex ||
        (index === bestIndex && matchLen > bestMatchLen)
      ) {
        bestIndex = index;
        bestPreset = levelPreset;
        bestPattern = pattern;
        bestMatchLen = matchLen;
        bestMatchText = match[0];

        // pattern is at the start of the text, no need to check for priority
        if (bestIndex === 0) {
          return {
            pattern: bestPattern!,
            levelPreset: bestPreset!,
            matchIndex: bestIndex,
            matchText: bestMatchText!,
          };
        }
      }
    }
  }

  return bestIndex === Infinity
    ? null
    : {
        pattern: bestPattern!,
        levelPreset: bestPreset!,
        matchIndex: bestIndex,
        matchText: bestMatchText!,
      };
};

export default function colorizing(
  elWithMessage: HTMLElement,
  parentElem: HTMLElement,
  pageSettings: PageSettings,
) {
  try {
    const levels = pageSettings.levels;
    const found = findPattern({ levels, elWithMessage });

    if (found !== null) {
      if (pageSettings.wantBackground) {
        if (
          parentElem.style.backgroundColor !== found.levelPreset.backgroundColor
        ) {
          parentElem.style.backgroundColor = found.levelPreset.backgroundColor;
        }
      } else {
        replaceWithLabel({ foundPattern: found, elWithMessage });
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
