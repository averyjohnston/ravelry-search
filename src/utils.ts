const { VITE_RAVELRY_USERNAME, VITE_RAVELRY_PASSWORD } = import.meta.env;

export async function get(path: string) {
  const response = await fetch(`https://api.ravelry.com${path}`, {
    headers: {
      'Authorization': btoa(`${VITE_RAVELRY_USERNAME}:${VITE_RAVELRY_PASSWORD}`),
    },
  });

  // TODO: types?
  return await response.json();
}
