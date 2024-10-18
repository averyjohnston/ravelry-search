import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import QueueCard from '../components/QueueCard';
import type { ExtendedQueuedProjectSmall, PatternSearchEndpointResult, QueueListEndpointResult } from '../types';
import { get, USERNAME } from '../utils';

import './QueueSortPage.scss';

async function loader() {
  const queueURL = `/people/${USERNAME}/queue/list.json`;
  const queueSearchParams = {
    page_size: '500',
    query_type: 'tags',
  };

  const patternURL = '/patterns/search.json';
  const patternSearchParams = {
    page_size: queueSearchParams.page_size,
    queuer: USERNAME || '',
  };

  /**
   * Making all these calls like this isn't great, but it's necessary to combine queue order,
   * craft, and tag information into one result. (Notably, none of the "queue" endpoints
   * return tags, not even queue/show.)
   *
   * The next best method would be doing the queue searches, then hitting patterns/show for
   * every single entry to retrieve the craft.
   *
   * We can at least avoid a couple extra searches by assuming anything that doesn't appear
   * in the ready-to-make search is yarn-needed, and ditto for knitting vs. crochet.
   */
  const [totalQueueResult, readyToMakeQueueResult, knittingPatternResult] = await Promise.all([
    get(queueURL, queueSearchParams),
    get(queueURL, {
      ...queueSearchParams,
      query: 'ready-to-make',
    }),
    get(patternURL, {
      ...patternSearchParams,
      craft: 'knitting',
    }),
  ]) as [QueueListEndpointResult, QueueListEndpointResult, PatternSearchEndpointResult];

  const readyToMakeIDs = readyToMakeQueueResult.queued_projects.map(entry => entry.pattern_id);
  const knittingIDs = knittingPatternResult.patterns.map(pattern => pattern.id);
  const extendedQueue: ExtendedQueuedProjectSmall[] = [];

  for(const queueEntry of totalQueueResult.queued_projects) {
    extendedQueue.push({
      ...queueEntry,
      craft: knittingIDs.indexOf(queueEntry.pattern_id || -1) > -1 ? 'knitting' : 'crochet',
      isReadyToMake: readyToMakeIDs.indexOf(queueEntry.pattern_id || -1) > -1,
    });
  }

  return extendedQueue;
}

export default function QueueSortPage() {
  const queueEntries = useLoaderData() as ExtendedQueuedProjectSmall[];
  const [linkTo, setLinkTo] = useState('queue');

  useEffect(() => {
    console.log(queueEntries);
  }, [queueEntries]);

  const handleLinkToChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkTo(e.target.value);
  };

  return (
    <div id="queue-sort-page" className="page">
      <div className="sort-controls">
        <div className="sort-controls__option">
          Link to:
          <label>
            <input type="radio" name="link-to" value="queue" checked={linkTo === 'queue'} onChange={handleLinkToChange} />
            Queue entry
          </label>
          <label>
            <input type="radio" name="link-to" value="pattern" checked={linkTo === 'pattern'} onChange={handleLinkToChange} />
            Pattern page
          </label>
        </div>
      </div>
      <div className="queue-list">
        {queueEntries.map(entry => <QueueCard linkTo={linkTo} key={entry.id} queueEntry={entry} />)}
      </div>
    </div>
  )
}

QueueSortPage.loader = loader;
