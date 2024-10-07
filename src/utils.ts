const { VITE_RAVELRY_USERNAME, VITE_RAVELRY_PASSWORD, VITE_RAVELRY_ACCOUNT_NAME } = import.meta.env;

export const USERNAME = VITE_RAVELRY_ACCOUNT_NAME as string | undefined;

export async function get(path: string, params?: { [key: string]: string }) {
  const paramsStr = params && '?' + new URLSearchParams(params).toString();
  const response = await fetch(`https://api.ravelry.com${path}${paramsStr || ''}`, {
    headers: {
      'Authorization': btoa(`${VITE_RAVELRY_USERNAME}:${VITE_RAVELRY_PASSWORD}`),
    },
  });

  // TODO: types?
  return await response.json();
}
