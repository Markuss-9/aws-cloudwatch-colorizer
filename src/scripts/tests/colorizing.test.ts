import { describe, it, expect, vi, beforeEach } from 'vitest';
import colorizing from '../colorizing';
import type { PageSettings, WordOption } from '@/types';

function wordOption(overrides: Partial<WordOption> & { patterns: WordOption['patterns'] }): WordOption {
  return {
    enabled: true,
    code: 31,
    color: 'rgba(255,0,0,1)',
    backgroundColor: 'rgba(155,0,0,0.44)',
    emoji: '❌',
    label: 'Error',
    ...overrides,
  };
}

const mockSettings: PageSettings = {
  title: 'Test',
  words: [
    wordOption({ patterns: ['error'], label: 'Error' }),
    wordOption({ patterns: ['warn'], code: 33, color: 'rgba(255,242,0,1)', backgroundColor: 'rgba(227,217,0,0.4)', emoji: '⚠️', label: 'Warn' }),
    wordOption({ patterns: ['info'], code: 32, color: 'rgba(0,200,0,1)', backgroundColor: 'rgba(0,155,10,0.16)', emoji: 'ℹ️', label: 'Info' }),
  ],
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

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('colorizing', () => {
  it('injects a label when a matching word is found (no background)', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'An error occurred in the system';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(result).toEqual({
      word: 'error',
      wordSetting: mockSettings.words[0],
    });
    expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    expect(elWithMessage.innerHTML).toContain('❌');
    expect(elWithMessage.innerHTML).toContain('Error');
  });

  it('sets background color on parent when wantBackground is true', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'warn: something is wrong';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: true,
    });

    expect(result).toEqual({
      word: 'warn',
      wordSetting: mockSettings.words[1],
    });
    expect(parentElem.style.backgroundColor).toBe('rgba(227, 217, 0, 0.4)');
  });

  it('returns the found word option', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'info: system running';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });
    expect(result).toEqual({
      word: 'info',
      wordSetting: mockSettings.words[2],
    });
  });

  it('does not inject label if element already has a label tag', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.innerHTML =
      '<span class="log-with-label-tag">Existing</span> error happened';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(result).toEqual({
      word: 'error',
      wordSetting: mockSettings.words[0],
    });
    expect(elWithMessage.innerHTML).toBe(
      '<span class="log-with-label-tag">Existing</span> error happened',
    );
  });

  it('returns undefined and deletes background when no word matches', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'No matching words here';
    const parentElem = createParentElem();
    parentElem.style.backgroundColor = 'red';
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, mockSettings);

    expect(result).toBeUndefined();
  });

  it('finds the earliest matching word in text', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'info: error happened';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(result?.word).toBe('info');
  });

  it('returns undefined when no words configured', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'error in system';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      words: [],
    });

    expect(result).toBeUndefined();
  });

  // ─── Word-boundary / delimiter scenarios ───────────────────────────

  describe('pattern surrounded by delimiters', () => {
    it.each([
      ['49071 - [ERR] - bracketed error', 'err'],
      ['Something {ERR} in braces',       'err'],
      ['Found "err" in double quotes',    'err'],
      ["Found 'err' in single quotes",    'err'],
      ['err: after colon',                'err'],
      ['[error] inside brackets',         'error'],
    ])('matches pattern in "%s"', (message, expectedWord) => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = message;
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['error', 'err'], label: 'Error' })],
        wantBackground: false,
      });

      expect(result?.word).toBe(expectedWord);
      expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    });
  });

  // ─── ANSI escape-code scenarios ────────────────────────────────────

  describe('ANSI escape codes', () => {
    it.each([
      ['[31merror[39m A log line',                                                      'error'],
      ['[31mERR[39m uppercase error formatted with ANSI codes',                          'err'],
    ])('matches pattern in "%s"', (message, expectedWord) => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = message;
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['error', 'err'], label: 'Error' })],
        wantBackground: false,
      });

      expect(result?.word).toBe(expectedWord);
      expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    });
  });

  // ─── Case-variation scenarios ──────────────────────────────────────

  describe('case variation', () => {
    it.each([
      ['ERROR: critical system failure',              'error'],
      ['Error: invalid input detected',               'error'],
      ['WARN: storage at 95%',                        'warn'],
      ['WaRning: unhandled promise rejection',        'warning'],
      ['2024-06-04 10:30:00 - [error] failed',        'error'],
      ['49071 - WARN - generic warning',              'warn'],
    ])('matches "%s"', (message, expectedWord) => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = message;
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [
          wordOption({ patterns: ['error', 'err'], label: 'Error' }),
          wordOption({ patterns: ['warn', 'warning'], code: 33, color: 'rgba(255,242,0,1)', backgroundColor: 'rgba(227,217,0,0.4)', emoji: '⚠️', label: 'Warn' }),
        ],
        wantBackground: false,
      });

      expect(result?.word).toBe(expectedWord);
      expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    });
  });

  // ─── Earliest-pattern-wins scenarios ───────────────────────────────

  describe('earliest match wins', () => {
    it.each([
      ['info: debug error occurred',      'info'],
      ['warn: error during backup',       'warn'],
    ])('earliest pattern wins in "%s"', (message, expectedWord) => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = message;
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [
          wordOption({ patterns: ['error', 'err'], label: 'Error' }),
          wordOption({ patterns: ['warn', 'warning'], code: 33, color: 'rgba(255,242,0,1)', backgroundColor: 'rgba(227,217,0,0.4)', emoji: '⚠️', label: 'Warn' }),
          wordOption({ patterns: ['info', 'information'], code: 32, color: 'rgba(0,200,0,1)', backgroundColor: 'rgba(0,155,10,0.16)', emoji: 'ℹ️', label: 'Info' }),
        ],
        wantBackground: false,
      });

      expect(result?.word).toBe(expectedWord);
    });
  });

  // ─── Long-form vs short-form patterns ──────────────────────────────

  describe('long-form vs short-form patterns', () => {
    it.each([
      ['error: failed to connect',           'error'],
      ['err: unexpected token',              'err'],
      ['debug: entering processOrder',       'debug'],
      ['dbg: cache miss for key',           'dbg'],
      ['Some err happening in stack trace',  'err'],
    ])('matches "%s"', (message, expectedWord) => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = message;
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [
          wordOption({ patterns: ['error', 'err'], label: 'Error' }),
          wordOption({ patterns: ['debug', 'dbg'], code: 34, color: 'rgba(0,125,255,1)', backgroundColor: 'rgba(0,78,155,0.16)', emoji: '🐛', label: 'Debug' }),
        ],
        wantBackground: false,
      });

      expect(result?.word).toBe(expectedWord);
      expect(elWithMessage.innerHTML).toContain('log-with-label-tag');
    });

    it('does not match a word-internal occurrence ("err" in "erroneous")', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'An erroneous entry was logged';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [
          wordOption({ patterns: ['error', 'err'], label: 'Error' }),
          wordOption({ patterns: ['debug', 'dbg'], code: 34, color: 'rgba(0,125,255,1)', backgroundColor: 'rgba(0,78,155,0.16)', emoji: '🐛', label: 'Debug' }),
        ],
        wantBackground: false,
      });

      expect(result).toBeUndefined();
    });
  });

  // ─── False-positive prevention ─────────────────────────────────────

  describe('false-positive prevention', () => {
    it('does not match "dbg" inside "gdbgui"', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'gdbgui';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['dbg'], label: 'Debug' })],
        wantBackground: false,
      });

      expect(result).toBeUndefined();
    });

    it('does not match "err" inside "terrace"', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'terrace';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['err'], label: 'Error' })],
        wantBackground: false,
      });

      expect(result).toBeUndefined();
    });

    it('does not match "info" inside "infographic"', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'infographic';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['info'], label: 'Info' })],
        wantBackground: false,
      });

      expect(result).toBeUndefined();
    });
  });

  // ─── No-match / beyond-window scenarios ────────────────────────────

  describe('no-match scenarios', () => {
    it('returns undefined for a message with no keywords', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'just some random log line with no matching keywords whatsoever';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, mockSettings);

      expect(result).toBeUndefined();
    });

    it('does not match when the pattern is beyond the 50-char window', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'A very long prefix text that pushes the keyword error way past the fifty char check limit';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['error'], label: 'Error' })],
      });

      expect(result).toBeUndefined();
    });

    it('does not match a keyword preceded by a letter (no word boundary)', () => {
      const elWithMessage = document.createElement('span');
      elWithMessage.textContent = 'gdbgui session started';
      const parentElem = createParentElem();
      parentElem.appendChild(elWithMessage);

      const result = colorizing(elWithMessage, parentElem, {
        ...mockSettings,
        words: [wordOption({ patterns: ['dbg'], label: 'Debug' })],
        wantBackground: false,
      });

      expect(result).toBeUndefined();
    });
  });
});
