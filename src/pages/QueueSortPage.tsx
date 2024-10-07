import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { get, USERNAME } from '../utils';

async function loader() {
  return await get(`/people/${USERNAME}/queue/list.json`, { page_size: '500' });
}

export default function QueueSortPage() {
  const data = useLoaderData();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div id="queue-sort-page" className="page">
      Data loaded!
    </div>
  )
}

QueueSortPage.loader = loader;
