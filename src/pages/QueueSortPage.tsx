import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { LoaderFunction } from 'react-router-dom';
import { Form, useLoaderData, useSearchParams } from 'react-router-dom';

import QueueCard from '../components/QueueCard';
import { type CardLinkType, type ExtendedQueuedProjectSmall, isCardLinkType, type PatternSearchEndpointResult, type QueueListEndpointResult } from '../types';
import { get, USERNAME } from '../utils';

import './QueueSortPage.scss';

const weightTagMap: { [key: string]: string } = {
  '1': 'fingering',
  '2': 'sport',
  '3': 'dk',
  '4': 'worsted',
  '5': 'bulky',
  '6': 'super-bulky',
  'any': 'any-weight',
};

const loader: LoaderFunction = async ({ request }) => {
  const currSearchParams = new URL(request.url).searchParams;
  const tagFilter = currSearchParams.get('filter');
  const weightFilter = currSearchParams.get('weight');
  
  /**
   * Ravelry's tag search has a bug where implicitly ANDing two tags together can
   * sometimes return incorrect results. The most relevant way this manifests is
   * searching [any-text]-k [yarn-weight], where there are no results for the first
   * tag; this will return results as if you'd ONLY searched for the second tag,
   * instead of the expected 0 results. Weirdly, this has only been noted with tags
   * using that "-k" suffix -- "foo dk" works as desired, but "foo-k dk" doesn't.
   * 
   * This is a bandaid fix to avoid the most common ways this bug will be triggered
   * in personal day-to-day usage, until the Ravelry bug can be better understood.
   */
  const includeKnitTag = tagFilter !== 'multicolor-possible' && tagFilter !== 'scrap-buster';

  const queueURL = `/people/${USERNAME}/queue/list.json`;
  let query = '';
  if (tagFilter && !weightFilter) {
    query = `${tagFilter}${includeKnitTag ? ` OR ${tagFilter}-k` : ''}`;
  } else if (weightFilter && !tagFilter) {
    query = `${weightTagMap[weightFilter]} OR any-weight`;
  } else if (tagFilter && weightFilter) {
    const weightName = weightTagMap[weightFilter];
    // Ravelry search doesn't let you use parens, but just doing a space means "AND" so this is good enough
    query = `${tagFilter} ${weightName}${includeKnitTag ? ` OR ${tagFilter}-k ${weightName}` : ''} OR ${tagFilter} any-weight${includeKnitTag ? ` OR ${tagFilter}-k any-weight` : ''}`; 
  }
  console.log('query:', query);
  
  const queueSearchParams = {
    page_size: '500',
    query_type: 'tags',
    query,
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

  /**
   * Use queue entry IDs for ready-to-make/yarn-needed to handle entries that don't have
   * linked patterns. The linked pattern is the only way to add craft info though, so we
   * still need to use it for knitting/crochet. This isn't perfect since knitting entries
   * without a Ravelry pattern will be marked as crochet, but there's not much we can do.
   */
  const readyToMakeEntryIDs = readyToMakeQueueResult.queued_projects.map(entry => entry.id);
  const knittingPatternIDs = knittingPatternResult.patterns.map(pattern => pattern.id);
  const extendedQueue: ExtendedQueuedProjectSmall[] = [];

  for(const queueEntry of totalQueueResult.queued_projects) {
    extendedQueue.push({
      ...queueEntry,
      craft: knittingPatternIDs.indexOf(queueEntry.pattern_id || -1) > -1 ? 'knitting' : 'crochet',
      isReadyToMake: readyToMakeEntryIDs.indexOf(queueEntry.id || -1) > -1,
    });
  }

  return extendedQueue;
}

export default function QueueSortPage() {
  const queueEntries = useLoaderData() as ExtendedQueuedProjectSmall[];
  const [searchParams] = useSearchParams();
  const [linkTo, setLinkTo] = useState<CardLinkType>('queue');
  const [showCrochet, setShowCrochet] = useState(true);
  const [showKnitting, setShowKnitting] = useState(true);
  const [showReady, setShowReady] = useState(true);
  const [showYarnNeeded, setShowYarnNeeded] = useState(true);

  useEffect(() => {
    console.log(queueEntries);
  }, [queueEntries]);

  const handleLinkToChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLinkTo = e.target.value;
    if (!isCardLinkType(newLinkTo)) {
      console.warn('Invalid linkTo:', newLinkTo);
      return;
    }

    setLinkTo(newLinkTo);
  };

  return (
    <div id="queue-sort-page" className="page">
      <div className="sort-controls header header--sticky">
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
        <Form>
          <div className="sort-controls__option">
            <label htmlFor="filter">Filter by project type:</label>
            <input type="text" name="filter" id="filter" defaultValue={searchParams.get('filter') || undefined} />
          </div>
          <div className="sort-controls__option">
            <label htmlFor="weight">Filter by yarn weight:</label>
            <select name="weight" id="weight" defaultValue={searchParams.get('weight') || ''}>
              <option value="">-</option>
              <option value="1">Fingering</option>
              <option value="2">Sport</option>
              <option value="3">DK</option>
              <option value="4">Worsted</option>
              <option value="5">Bulky</option>
              <option value="6">Super Bulky</option>
              <option value="any">Any weight</option>
            </select>
          </div>
          <button type="submit">Go</button>
        </Form>
      </div>
      <div className="content card-grid">
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
