import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { LoaderFunction } from 'react-router-dom';
import { Form, useLoaderData, useSearchParams } from 'react-router-dom';

import QueueCard from '../components/QueueCard';
import type { ExtendedQueuedProjectSmall, PatternSearchEndpointResult, QueueListEndpointResult } from '../types';
import { get, USERNAME } from '../utils';

import './QueueSortPage.scss';

const loader: LoaderFunction = async ({ request }) => {
  const tagFilter = new URL(request.url).searchParams.get('filter');

  const queueURL = `/people/${USERNAME}/queue/list.json`;
  const queueSearchParams = {
    page_size: '500',
    query_type: 'tags',
    query: tagFilter ? `${tagFilter} OR ${tagFilter}-k` : '',
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
  const [searchParams] = useSearchParams();
  const [linkTo, setLinkTo] = useState('queue');
  const [showCrochet, setShowCrochet] = useState(true);
  const [showKnitting, setShowKnitting] = useState(true);
  const [showReady, setShowReady] = useState(true);
  const [showYarnNeeded, setShowYarnNeeded] = useState(true);

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
        <div className="sort-controls__option">
          Show crafts:
          <label>
            <input type="checkbox" name="show-crochet" checked={showCrochet} onChange={(e) => setShowCrochet(e.target.checked)} />
            Crochet
          </label>
          <label>
            <input type="checkbox" name="show-knitting" checked={showKnitting} onChange={(e) => setShowKnitting(e.target.checked)} />
            Knitting
          </label>
        </div>
        <div className="sort-controls__option">
          Show status:
          <label>
            <input type="checkbox" name="show-ready" checked={showReady} onChange={(e) => setShowReady(e.target.checked)} />
            Ready to make
          </label>
          <label>
            <input type="checkbox" name="show-yarn-needed" checked={showYarnNeeded} onChange={(e) => setShowYarnNeeded(e.target.checked)} />
            Yarn needed
          </label>
        </div>
        <div className="sort-controls__option">
          <label htmlFor="filter">Filter by project type:</label>
          <Form>
            <input type="text" name="filter" id="filter" defaultValue={searchParams.get('filter') || undefined} />
            <button type="submit">Go</button>
          </Form>
        </div>
      </div>
      <div className="queue-list">
        {queueEntries.flatMap(entry => {
          if (
            entry.craft === 'crochet' && !showCrochet ||
            entry.craft === 'knitting' && !showKnitting ||
            entry.isReadyToMake && !showReady ||
            !entry.isReadyToMake && !showYarnNeeded
          ) return [];
          return <QueueCard linkTo={linkTo} key={entry.id} queueEntry={entry} />;
        })}
      </div>
    </div>
  )
}

QueueSortPage.loader = loader;
