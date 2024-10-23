import type { ExtendedQueuedProjectSmall, QueuedProjectFull } from './types';

const { VITE_RAVELRY_USERNAME, VITE_RAVELRY_PASSWORD, VITE_RAVELRY_ACCOUNT_NAME } = import.meta.env;

export const USERNAME = VITE_RAVELRY_ACCOUNT_NAME as string | undefined;
export const DEFAULT_IMAGE = 'https://www.ravelry.com/images/assets/illustrations/color/svg/blank-skein-herdwick.svg?v=6';

// TODO: implement caching https://www.ravelry.com/api#extra_etags

export async function get(path: string, params?: { [key: string]: string }) {
  const paramsStr = params && '?' + new URLSearchParams(params).toString();
  const response = await fetch(`https://api.ravelry.com${path}${paramsStr || ''}`, {
    headers: {
      'Authorization': btoa(`${VITE_RAVELRY_USERNAME}:${VITE_RAVELRY_PASSWORD}`),
    },
  });

  // types should be handled on the caller side
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await response.json();
}

export function buildQueueURL(queueEntry: QueuedProjectFull | ExtendedQueuedProjectSmall) {
  const queuePosition = queueEntry.position_in_queue;
  return `https://www.ravelry.com/people/${USERNAME}/queue?view=thumblist&page=${Math.ceil(queuePosition / 30)}#q${queuePosition}`;
}

export function formatDatetime(datetime: string) {
  return new Date(datetime).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
