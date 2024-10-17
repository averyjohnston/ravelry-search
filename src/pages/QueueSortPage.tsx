import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { PatternList, PatternSearchEndpointResult, QueueListEndpointResult } from '../types';
import { get, USERNAME } from '../utils';

async function loader() {
  const searchParams = {
    page_size: '500',
    queuer: USERNAME || '',
  };

  /**
   * Making three calls like this isn't great, but it's necessary for three reasons:
   * 1. Neither of the endpoints include the craft in the list.
   * 2. The queue/list endpoint doesn't allow searching by craft.
   * 3. The patterns/search endpoint doesn't sort by queue order.
   *
   * Doing it this way lets us combine craft searching with proper queue order. The
   * next best method would be getting the queue list, then hitting the patterns/show
   * endpoint for every single entry to retrieve the craft.
   */
  const [queueResult, crochetResult, knittingResult] = await Promise.all([
    get(`/people/${USERNAME}/queue/list.json`, { page_size: searchParams.page_size }),
    get('/patterns/search.json', {
      ...searchParams,
      craft: 'crochet',
    }),
    get('/patterns/search.json', {
      ...searchParams,
      craft: 'knitting',
    }),
  ]) as [QueueListEndpointResult, PatternSearchEndpointResult, PatternSearchEndpointResult];

  const orderedQueue = queueResult.queued_projects;
  const crochetPatterns = crochetResult.patterns;
  const knittingPatterns = knittingResult.patterns;

  const orderedIDs = orderedQueue.map(entry => entry.pattern_id);

  const sortPatterns = (patterns: PatternList[]) => {
    const sorted = patterns.slice();
    sorted.sort((a, b) => orderedIDs.indexOf(a.id) - orderedIDs.indexOf(b.id));
    return sorted;
  };

  return {
    crochet: sortPatterns(crochetPatterns),
    knitting: sortPatterns(knittingPatterns),
  };
}

export default function QueueSortPage() {
  const data = useLoaderData() as {
    crochet: PatternList[],
    knitting: PatternList[],
  };

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
