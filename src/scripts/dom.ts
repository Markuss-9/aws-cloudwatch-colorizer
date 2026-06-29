import { assert } from '@/assert';

const getIframe = (): HTMLIFrameElement => {
  const iframe = document.querySelector(
    'iframe#microConsole-Logs',
  ) as HTMLIFrameElement | null;
  assert(iframe, 'iframe must exist');
  return iframe;
};

export const getListFromClass = (row: string): Element[] => {
  const iframe = getIframe();
  assert(iframe.contentDocument, 'contentDocument must exist');
  return Array.from(iframe.contentDocument.getElementsByClassName(row));
};

export const getListFromTag = (row: string, container?: Element): Element[] => {
  const iframe = getIframe();
  if (container) {
    return Array.from(container.getElementsByTagName(row));
  }
  assert(iframe.contentDocument, 'contentDocument must exist');
  return Array.from(iframe.contentDocument.getElementsByTagName(row));
};
