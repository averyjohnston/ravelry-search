import type { CardLinkType, ExtendedQueuedProjectSmall } from '../types';
import { buildQueueURL, DEFAULT_IMAGE } from '../utils';

import './QueueCard.scss';

export default function QueueCard(props: {
  queueEntry: ExtendedQueuedProjectSmall,
  linkTo: CardLinkType,
}) {
  const { queueEntry, linkTo } = props;
  const photoURL = queueEntry.best_photo?.small_url || DEFAULT_IMAGE;

  let url = '';
  if (linkTo === 'queue') {
    url = buildQueueURL(queueEntry);
  } else if (linkTo === 'pattern') {
    url = `https://www.ravelry.com/patterns/library/${queueEntry.pattern_id}`;
  }

  return (
    <a className="queue-card block-link" href={url} target="_blank" rel="noreferrer">
      <div className="queue-card__name">{queueEntry.short_pattern_name}</div>
      <div className="queue-card__image card-image" style={{
        backgroundImage: `url(${photoURL})`,
      }} />
      <div className="queue-card__footer">
        <div className={`queue-card__craft queue-card__craft--${queueEntry.craft}`}>
          {queueEntry.craft.charAt(0).toUpperCase()}
        </div>
        <div className="queue-card__status">
          🧶{queueEntry.isReadyToMake ? '✔️' : '❌'}
        </div>
      </div>
    </a>
  );
}
