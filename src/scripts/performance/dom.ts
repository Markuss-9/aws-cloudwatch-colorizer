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

export const getTableBodyElement = (): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    resetCheckIframe();
    intervalIdDOM = window.setInterval(() => {
      const element = document.getElementById('result-table-body');
      log.debug('checking for result-table-body');
      if (element) {
        log.debug('found result-table-body');
        clearInterval(intervalIdDOM);
        resolve(element);
      }
    }, 1500);
  });
};

export const mutationObs = new MutationObserver(debounce(colorizeAll, 50));

const observeTableBody = (body: HTMLElement) => {
  const parent = body.parentElement;
  if (!parent) {
    log.warn('result-table-body has no parent element');
    return;
  }

  mutationObs.observe(parent, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  // pre-existing rows (missed by observer)
  colorizeAll();
};

export const startObserve = () => {
  const isLogAnalytics = window.location.href.includes('#log-analytics');

  if (isLogAnalytics) {
    resetCheckIframe();
    mutationObs.disconnect();

    getTableBodyElement()
      .then((body: HTMLElement) => {
        observeTableBody(body);
      })
      .catch((error) => {
        log.error('Error:', error);
      });
    return;
  }

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
};
