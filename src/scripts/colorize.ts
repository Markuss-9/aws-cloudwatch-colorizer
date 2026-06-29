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

  const { matchIndex, matchText, levelPreset } = foundPattern;
  const matchEnd = matchIndex + matchText.length;

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(elWithMessage, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  let charIdx = 0;
  let startNode: Text | null = null;
  let startOffset = 0;
  let endNode: Text | null = null;
  let endOffset = 0;

  for (const textNode of textNodes) {
    const content = textNode.textContent ?? '';
    const nodeEnd = charIdx + content.length;

    if (!startNode && matchIndex < nodeEnd) {
      startNode = textNode;
      startOffset = matchIndex - charIdx;
    }

    if (matchEnd <= nodeEnd) {
      endNode = textNode;
      endOffset = matchEnd - charIdx;
      break;
    }

    charIdx += content.length;
  }

  if (!startNode || !endNode) return;

  const label = document.createElement('label');
  label.className = CLASS_NAME_TAG;
  label.style.color = levelPreset.color;
  label.textContent = `${levelPreset.emoji} ${levelPreset.label}`;

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  range.deleteContents();
  range.insertNode(label);

  let el = label.parentElement;
  while (el && el !== elWithMessage) {
    const onlyLabel = Array.from(el.childNodes).every(
      (n) =>
        n === label ||
        (n.nodeType === Node.TEXT_NODE && !(n.textContent ?? '').trim()),
    );

    if (onlyLabel) {
      const parent = el.parentElement;
      parent?.insertBefore(label, el);
      el.remove();
      el = parent;
    } else {
      break;
    }
  }
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
  const textToSearch = stripAnsi(elWithMessage.textContent ?? '').slice(0, 500);

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

export default function colorize(
  elWithMessage: HTMLElement,
  parentElem: HTMLElement,
  pageSettings: PageSettings,
) {
  try {
    const levels = pageSettings.levels.filter((level) => level.enabled);
    const found = findPattern({ levels, elWithMessage });
    if (!found) {
      return null;
    }

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
  } catch (error) {
    if (error instanceof UnreachableError) {
      throw error;
    }
    log.error('colorize for element', { elWithMessage, parentElem }, error);
    return;
  }
}
