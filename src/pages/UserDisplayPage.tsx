import { useLoaderData } from 'react-router-dom';

import { get } from '../utils';

async function loader() {
  return await get('/current_user.json');
}

export default function UserDisplayPage() {
  const user = useLoaderData();

  return (
    <div id="user-display-page">
      {JSON.stringify(user)}
    </div>
  )
}

UserDisplayPage.loader = loader;
