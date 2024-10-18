const { VITE_RAVELRY_USERNAME, VITE_RAVELRY_PASSWORD, VITE_RAVELRY_ACCOUNT_NAME } = import.meta.env;

export const USERNAME = VITE_RAVELRY_ACCOUNT_NAME as string | undefined;

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
