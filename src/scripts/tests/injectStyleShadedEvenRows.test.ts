import { describe, it, expect, vi, beforeEach } from 'vitest';
import { log } from '@/logger';
import injectStyleShadedEvenRows from '../injectStyleShadedEvenRows';
import { setSettings } from '../utils';
import defaultSettings from '@/defaultSettings';

let debugSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  debugSpy = vi.spyOn(log, 'debug').mockImplementation(() => {});
  setSettings(defaultSettings);
});

describe('injectStyleShadedEvenRows', () => {
  it('does nothing when iframe is missing', () => {
    injectStyleShadedEvenRows();

    expect(debugSpy).toHaveBeenCalledWith('iframe not ready, skipping');
  });

  it('does nothing when iframe contentDocument is not ready', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);
    Object.defineProperty(iframe, 'contentDocument', { value: null });

    injectStyleShadedEvenRows();

    expect(debugSpy).toHaveBeenCalledWith('iframe not ready, skipping');
  });

  it('injects shaded rows CSS into iframe when switches are on and wantBackground is true', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'microConsole-Logs';
    document.body.appendChild(iframe);

    const iframeDoc = document.implementation.createHTMLDocument();
    const appendChildSpy = vi.spyOn(iframeDoc.head, 'appendChild');
    Object.defineProperty(iframe, 'contentDocument', { value: iframeDoc });

    injectStyleShadedEvenRows();

    const styleTag = iframeDoc.querySelector('style[data-id="shaded-rows"]');
    expect(styleTag).not.toBeNull();
    expect(styleTag?.textContent).toContain(
      'logs-table__body-row:nth-child(2n)',
    );
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('does not inject CSS when both Log_Groups and Log_Insights switches are off', () => {
    const disabledSettings = {
      ...defaultSettings,
      advancedSettings: {
        ...defaultSettings.advancedSettings,
        Log_Groups: {
          ...defaultSettings.advancedSettings.Log_Groups,
          switch: false,
        },
        Log_Insights: {
          ...defaultSettings.advancedSettings.Log_Insights,
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

    injectStyleShadedEvenRows();

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

    injectStyleShadedEvenRows();

    const styleTag = iframeDoc.querySelector('style[data-id="shaded-rows"]');
    expect(styleTag).not.toBeNull();
  });
});
