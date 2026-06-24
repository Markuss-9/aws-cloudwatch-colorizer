import { describe, it, expect, vi, beforeEach } from 'vitest';
import colorizing, { findPattern } from '../colorizing';
import type { PageSettings, LevelPreset } from '@/types';
import { PresetName, LEVEL_PRESETS } from '@/defaultSettings';

function wordPreset(
  preset: PresetName,
  overrides?: Partial<LevelPreset> & { patterns?: LevelPreset['patterns'] },
): LevelPreset {
  return {
    ...LEVEL_PRESETS[preset],
    ...overrides,
  };
}

function createSpanWithText(text: string): HTMLSpanElement {
  const el = document.createElement('span');
  el.textContent = text;
  return el;
}

const mockSettings: PageSettings = {
  title: 'Test',
  levels: [wordPreset('error'), wordPreset('warn'), wordPreset('info')],
  id: 'Test',
  switch: true,
  isAvailable: true,
  wantBackground: false,
};

function createParentElem(): HTMLElement {
  const el = document.createElement('div');
  (el as unknown as Record<string, unknown>).attributeStyleMap = {
    delete: vi.fn(),
  };
  return el;
}

function createElementAndParent(text: string): {
  elWithMessage: ReturnType<typeof createSpanWithText>;
  parentElem: ReturnType<typeof createParentElem>;
} {
  const elWithMessage = createSpanWithText(text);
  const parentElem = createParentElem();
  parentElem.appendChild(elWithMessage);
  return { elWithMessage, parentElem };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('colorizing - integration', () => {
  it('injects a label when a matching word is found (no background)', () => {
    const { elWithMessage, parentElem } = createElementAndParent(
      'An error occurred in the system',
    );

    colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    expect(elWithMessage.innerHTML).toContain(LEVEL_PRESETS.error.emoji);
    expect(elWithMessage.innerHTML).toContain(LEVEL_PRESETS.error.label);
  });

  it('sets background color on parent when wantBackground is true', () => {
    const { elWithMessage, parentElem } = createElementAndParent(
      'warn: something is wrong',
    );

    colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: true,
    });

    expect(parentElem.style.backgroundColor).toBe(
      LEVEL_PRESETS.warn.backgroundColor,
    );
  });

  it('does not inject label if element already has a label tag', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.innerHTML =
      '<span class="log-with-label-tag">Existing</span> error happened';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(elWithMessage.innerHTML).toBe(
      '<span class="log-with-label-tag">Existing</span> error happened',
    );
  });

  it('deletes background when no word matches', () => {
    const elWithMessage = createSpanWithText('No matching words here');
    const parentElem = createParentElem();
    parentElem.style.backgroundColor = 'red';
    parentElem.appendChild(elWithMessage);

    colorizing(elWithMessage, parentElem, mockSettings);
    expect(parentElem.style.backgroundColor).toBeFalsy();
  });
});

describe('findPattern', () => {
  it('returns the found word option', () => {
    const elWithMessage = createSpanWithText('info: system running');

    const result = findPattern({
      levels: mockSettings.levels,
      elWithMessage,
    });

    expect(result).toEqual({
      pattern: 'info',
      levelPreset: mockSettings.levels[2],
      matchIndex: 0,
      matchText: 'info',
    });
  });

  it('returns null when no words configured', () => {
    const elWithMessage = createSpanWithText('error in system');

    const result = findPattern({
      levels: [],
      elWithMessage,
    });

    expect(result).toBeNull();
  });

  describe('pattern surrounded by delimiters', () => {
    it.each([
      ['49071 - [ERR] - bracketed error', 'err'],
      ['Something {ERR} in braces', 'err'],
      ['Found "err" in double quotes', 'err'],
      ["Found 'err' in single quotes", 'err'],
      ['err: after colon', 'err'],
      ['[error] inside brackets', 'error'],
    ])('matches pattern in "%s"', (message, expectedWord) => {
      const elWithMessage = createSpanWithText(message);

      const result = findPattern({
        levels: [wordPreset('error')],
        elWithMessage,
      });

      expect(result?.pattern).toBe(expectedWord);
    });
  });

  describe('ANSI escape codes', () => {
    it.each([
      ['[31merror[39m A log line', 'error'],
      ['[31mERR[39m uppercase error formatted with ANSI codes', 'err'],
    ])('matches pattern in "%s"', (message, expectedWord) => {
      const elWithMessage = createSpanWithText(message);

      const result = findPattern({
        levels: [wordPreset('error')],
        elWithMessage,
      });

      expect(result?.pattern).toBe(expectedWord);
    });
  });

  describe('case variation', () => {
    it.each([
      ['ERROR: critical system failure', 'error'],
      ['Error: invalid input detected', 'error'],
      ['WARN: storage at 95%', 'warn'],
      ['WaRning: unhandled promise rejection', 'warning'],
      ['2024-06-04 10:30:00 - [error] failed', 'error'],
      ['49071 - WARN - generic warning', 'warn'],
    ])('matches "%s"', (message, expectedWord) => {
      const elWithMessage = createSpanWithText(message);

      const result = findPattern({
        levels: [wordPreset('error'), wordPreset('warn')],
        elWithMessage,
      });

      expect(result?.pattern).toBe(expectedWord);
    });
  });

  describe('earliest match wins', () => {
    it.each([
      ['info: debug error occurred', 'info'],
      ['warn: error during backup', 'warn'],
    ])('earliest pattern wins in "%s"', (message, expectedWord) => {
      const elWithMessage = createSpanWithText(message);

      const result = findPattern({
        levels: [wordPreset('error'), wordPreset('warn'), wordPreset('info')],
        elWithMessage,
      });

      expect(result?.pattern).toBe(expectedWord);
    });
  });

  describe('long-form vs short-form patterns', () => {
    it.each([
      ['error: failed to connect', 'error'],
      ['err: unexpected token', 'err'],
      ['debug: entering processOrder', 'debug'],
      ['dbg: cache miss for key', 'dbg'],
      ['Some err happening in stack trace', 'err'],
    ])('matches "%s"', (message, expectedWord) => {
      const elWithMessage = createSpanWithText(message);

      const result = findPattern({
        levels: [wordPreset('error'), wordPreset('debug')],
        elWithMessage,
      });

      expect(result?.pattern).toBe(expectedWord);
    });
  });

  describe('no-match scenarios', () => {
    it('returns null for a message with no keywords', () => {
      const elWithMessage = createSpanWithText(
        'just some random log line with no matching keywords whatsoever',
      );

      const result = findPattern({
        levels: mockSettings.levels,
        elWithMessage,
      });

      expect(result).toBeNull();
    });
  });
});

describe('word matching - false positive prevention', () => {
  it.each([
    'An erroneous entry was logged',
    'There are some flowers on my terrace',
    'A error_free log',
    'terrorizing',
    '1err',
    'err1',
    'prefixerror',
    'errorSuffix',
  ])('does NOT match internal occurrence: "%s"', (message) => {
    const elWithMessage = createSpanWithText(message);

    const result = findPattern({
      levels: [wordPreset('error')],
      elWithMessage,
    });

    expect(result).toBeNull();
  });
});

describe('JSON stringified logs', () => {
  it('matches uppercase level value in JSON log', () => {
    const elWithMessage = createSpanWithText(
      '{"level":"ERROR","data":"critical failure detected"}',
    );

    const result = findPattern({
      levels: [wordPreset('error')],
      elWithMessage,
    });

    expect(result).not.toBeNull();
    expect(result?.pattern).toBe('error');
    expect(result?.matchText).toBe('ERROR');
  });

  it('matches level in escaped-quotes JSON string', () => {
    const elWithMessage = createSpanWithText(
      `{\\"level\\":\\"ERROR\\",\\"data\\":\\"critical failure detected\\"}`,
    );

    const result = findPattern({
      levels: [wordPreset('error')],
      elWithMessage,
    });

    expect(result).not.toBeNull();
    expect(result?.pattern).toBe('error');
    expect(result?.matchText).toBe('ERROR');
  });
});

describe('regex mode', () => {
  it('matches pattern as raw regex with alternation', () => {
    const elWithMessage = createSpanWithText('critical: system failure');

    const result = findPattern({
      levels: [
        wordPreset('error', {
          patterns: ['(error|critical|failed)'],
          regex: true,
        }),
      ],
      elWithMessage,
    });

    expect(result?.pattern).toBe('(error|critical|failed)');
  });

  it('matches inside words when no \\b in the regex pattern', () => {
    const elWithMessage = createSpanWithText('traceback: something broke');

    const result = findPattern({
      levels: [wordPreset('error', { patterns: ['trace'], regex: true })],
      elWithMessage,
    });

    expect(result).not.toBeNull();
    expect(result?.pattern).toBe('trace');
  });

  it('respects word boundaries when \\b is in the regex pattern', () => {
    const elWithMessage = createSpanWithText('traceback: something broke');

    const result = findPattern({
      levels: [wordPreset('error', { patterns: ['\\btrace\\b'], regex: true })],
      elWithMessage,
    });

    expect(result).toBeNull();
  });

  it('matches with quantifiers in regex pattern', () => {
    const elWithMessage = createSpanWithText('status code: 404');

    const result = findPattern({
      levels: [wordPreset('error', { patterns: ['\\d{3}'], regex: true })],
      elWithMessage,
    });

    expect(result).not.toBeNull();
  });

  it('returns null when regex pattern does not match', () => {
    const elWithMessage = createSpanWithText('everything is fine');

    const result = findPattern({
      levels: [wordPreset('error', { patterns: ['\\d+'], regex: true })],
      elWithMessage,
    });

    expect(result).toBeNull();
  });

  it('works with replaceWithLabel via colorizing function', () => {
    const { elWithMessage, parentElem } = createElementAndParent(
      'FAILED: deployment aborted',
    );

    colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
      levels: [
        wordPreset('error', {
          patterns: ['(FAILED|ERROR|CRASH)'],
          regex: true,
        }),
      ],
    });

    expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    expect(elWithMessage.innerHTML).toContain(LEVEL_PRESETS.error.emoji);
  });
});
