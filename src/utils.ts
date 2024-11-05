import type { ExtendedQueuedProjectSmall, QueuedProjectFull } from './types';

const { VITE_RAVELRY_USERNAME, VITE_RAVELRY_PASSWORD, VITE_RAVELRY_ACCOUNT_NAME } = import.meta.env;

export const USERNAME = VITE_RAVELRY_ACCOUNT_NAME as string | undefined;
export const DEFAULT_IMAGE = 'https://www.ravelry.com/images/assets/illustrations/color/svg/blank-skein-herdwick.svg?v=6';

const AUTH_HEADER = {
  'Authorization': btoa(`${VITE_RAVELRY_USERNAME}:${VITE_RAVELRY_PASSWORD}`),
};

export async function get(path: string, params?: { [key: string]: string }) {
  const paramsStr = params && '?' + new URLSearchParams(params).toString();
  const response = await fetch(`https://api.ravelry.com${path}${paramsStr || ''}`, {
    headers: AUTH_HEADER,
  });

  return await response.json() as object;
}

export async function post(path: string, params: { [key: string]: string | string[] }) {
  const response = await fetch(`https://api.ravelry.com${path}`, {
    method: 'post',
    headers: AUTH_HEADER,
    body: JSON.stringify(params),
  });

  return await response.json() as object;
}

export function buildQueueURL(queueEntry: QueuedProjectFull | ExtendedQueuedProjectSmall) {
  const queuePosition = queueEntry.position_in_queue || queueEntry.sort_order || 1;
  return `https://www.ravelry.com/people/${USERNAME}/queue?view=thumblist&page=${Math.ceil(queuePosition / 30)}#q${queuePosition}`;
}

export function formatDatetime(datetime: string) {
  return new Date(datetime).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function pickRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
