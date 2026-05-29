import { describe, it, expect, vi, beforeEach } from 'vitest';
import colorizing from '../colorizing';
import type { PageSettings } from '@/types';

const mockSettings: PageSettings = {
  title: 'Test',
  words: [
    {
      enabled: true,
      code: 31,
      word: 'error',
      color: 'rgba(255,0,0,1)',
      backgroundColor: 'rgba(155,0,0,0.44)',
      emoji: '❌',
      label: 'Error',
    },
    {
      enabled: true,
      code: 33,
      word: 'warn',
      color: 'rgba(255,242,0,1)',
      backgroundColor: 'rgba(227,217,0,0.4)',
      emoji: '⚠️',
      label: 'Warn',
    },
    {
      enabled: true,
      code: 32,
      word: 'info',
      color: 'rgba(0,200,0,1)',
      backgroundColor: 'rgba(0,155,10,0.16)',
      emoji: 'ℹ️',
      label: 'Info',
    },
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

    expect(result).toEqual(mockSettings.words[0]);
    expect(elWithMessage.innerHTML).toContain('<label');
    expect(elWithMessage.innerHTML).toContain('❌');
    expect(elWithMessage.innerHTML).toContain('Error');
  });

  it('sets background color on parent when wantBackground is true', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.textContent = 'warning: something is wrong';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: true,
    });

    expect(result).toEqual(mockSettings.words[1]);
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
    expect(result).toEqual(mockSettings.words[2]);
  });

  it('does not inject label if element already has a label tag', () => {
    const elWithMessage = document.createElement('span');
    elWithMessage.innerHTML = '<label>Existing</label> error happened';
    const parentElem = createParentElem();
    parentElem.appendChild(elWithMessage);

    const result = colorizing(elWithMessage, parentElem, {
      ...mockSettings,
      wantBackground: false,
    });

    expect(result).toEqual(mockSettings.words[0]);
    expect(elWithMessage.innerHTML).toBe(
      '<label>Existing</label> error happened',
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
});
