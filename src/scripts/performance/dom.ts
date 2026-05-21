import { debounce } from 'lodash-es';
import { log } from '@/logger';
import colorizeAll from '@/scripts/colorizeAll';
import { assert } from '@/assert';

export let intervalIdDOM: NodeJS.Timeout | string | number | undefined =
  undefined;

export const resetCheckIframe = () => {
  if (intervalIdDOM) clearInterval(intervalIdDOM);
};

export const getIframeElement = (): Promise<HTMLIFrameElement> => {
  return new Promise((resolve) => {
    resetCheckIframe();
    intervalIdDOM = window.setInterval(() => {
      const element = document.getElementById(
        'microConsole-Logs',
      ) as HTMLIFrameElement | null;
      log.debug('checking for iframe');
      if (element) {
        log.debug('found iframe');
        clearInterval(intervalIdDOM);
        resolve(element);
      }
    }, 1500);
  });
};

export const mutationObs = new MutationObserver(debounce(colorizeAll, 50));

export const startObserve = () =>
  getIframeElement()
    .then((iframe: HTMLIFrameElement) => {
      assert(iframe.contentWindow, 'iframe contentWindow must exist');
      mutationObs.observe(iframe.contentWindow.document.body, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    })
    .catch((error) => {
      log.error('Error:', error);
    });
