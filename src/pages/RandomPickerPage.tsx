import { useEffect } from 'react';
import type { LoaderFunction } from 'react-router-dom';
import { Form, useLoaderData } from 'react-router-dom';

import DetailsCard from '../components/DetailsCard';
import type { QueuedProjectFull, QueueListEndpointResult, QueueShowEndPointResult } from '../types';
import { buildQueueURL, get, USERNAME } from '../utils';

import './RandomPickerPage.scss';

const loader: LoaderFunction = async ({ request }) => {
  const choice = new URL(request.url).searchParams.get('choice');

  switch(choice) {
    case 'queue': {
      const queueSearchResult = await get(`/people/${USERNAME}/queue/list.json`, {
        page_size: '500',
      }) as QueueListEndpointResult;

      const queueItems = queueSearchResult.queued_projects;
      const randomItem = queueItems[Math.floor(Math.random() * queueItems.length)];
      const fullResult = await get(`/people/${USERNAME}/queue/${randomItem.id}.json`) as QueueShowEndPointResult;

      return {
        choice,
        randomItem: fullResult.queued_project,
      };
    }

    default: return null;
  }
};

function buildQueueEntryDisplay(queueEntry: QueuedProjectFull) {
  return (
    <DetailsCard
      photoURL={queueEntry.best_photo?.small2_url}
      linkURL={buildQueueURL(queueEntry)}
      name={queueEntry.pattern?.name || queueEntry.name}
      details={[
        {
          label: 'Queued on:',
          value: new Date(queueEntry.created_at).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        },
        {
          label: 'Craft:',
          value: queueEntry.pattern?.craft.name || 'Unknown',
        },
        {
          label: 'Yarn weight:',
          value: queueEntry.pattern?.yarn_weight?.name || 'Unknown',
        },
        {
          label: 'Yarn assigned?',
          value: queueEntry.queued_stashes.length > 0 ? '✔️' : '❌',
        },
      ]}
    />
  );
}

export default function RandomPickerPage() {
  const result = useLoaderData() as {
    choice: 'queue',
    randomItem: QueuedProjectFull,
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div id="random-picker-page" className="page">
      <Form className="header">
        <button name="choice" value="queue">Random Queue Entry</button>
      </Form>
      <div className="content">
        {result === null && 'Click a button above!'}
        {result?.choice === 'queue' && buildQueueEntryDisplay(result.randomItem)}
      </div>
    </div>
  )
}

RandomPickerPage.loader = loader;
