import { describe, it, expect, vi, beforeEach } from 'vitest';
import { log } from '@/logger';
import injectShadedRows from '../shadedRows';
import { setSettings } from '../settings';
import { PAGE_SETTINGS_KEYS } from '@/types';
import defaultSettings from '@/defaultSettings';

let debugSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  debugSpy = vi.spyOn(log, 'debug').mockImplementation(() => {});
  setSettings(defaultSettings);
});

describe('injectShadedRows', () => {
  it('does nothing when iframe is missing', () => {
    injectShadedRows();

    expect(debugSpy).toHaveBeenCalledWith('iframe not ready, skipping');
  });

  it('does nothing when iframe contentDocument is not ready', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);
    Object.defineProperty(iframe, 'contentDocument', { value: null });

    injectShadedRows();

    expect(debugSpy).toHaveBeenCalledWith('iframe not ready, skipping');
  });

  it('injects shaded rows CSS into iframe when switches are on and wantBackground is true', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);

    const iframeDoc = document.implementation.createHTMLDocument();
    const appendChildSpy = vi.spyOn(iframeDoc.head, 'appendChild');
    Object.defineProperty(iframe, 'contentDocument', { value: iframeDoc });

    injectShadedRows();

    const styleTag = iframeDoc.querySelector('style[data-id="shaded-rows"]');
    expect(styleTag).not.toBeNull();
    expect(styleTag?.textContent).toContain(
      'logs-table__body-row:nth-child(2n)',
    );
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('does not inject CSS when all page switches are off', () => {
    const disabledSettings = {
      ...defaultSettings,
      advancedSettings: {
        ...defaultSettings.advancedSettings,
        [PAGE_SETTINGS_KEYS.LOG_GROUPS]: {
          ...defaultSettings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_GROUPS],
          switch: false,
        },
        [PAGE_SETTINGS_KEYS.LOG_INSIGHTS]: {
          ...defaultSettings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_INSIGHTS],
          switch: false,
        },
        [PAGE_SETTINGS_KEYS.LOG_ANALYTICS]: {
          ...defaultSettings.advancedSettings[PAGE_SETTINGS_KEYS.LOG_ANALYTICS],
          switch: false,
        },
      },
    };
    setSettings(disabledSettings);

    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);
    const iframeDoc = document.implementation.createHTMLDocument();
    Object.defineProperty(iframe, 'contentDocument', { value: iframeDoc });

    injectShadedRows();

    const styleTag = iframeDoc.querySelector('style[data-id="shaded-rows"]');
    expect(styleTag).toBeNull();
  });

  it('handles dark mode detection', () => {
    document.body.classList.add('awsui-dark-mode');

    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);
    const iframeDoc = document.implementation.createHTMLDocument();
    Object.defineProperty(iframe, 'contentDocument', { value: iframeDoc });

    injectShadedRows();

    const styleTag = iframeDoc.querySelector('style[data-id="shaded-rows"]');
    expect(styleTag).not.toBeNull();
  });
});
