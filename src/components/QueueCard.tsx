import type { ExtendedQueuedProjectSmall } from '../types';
import { USERNAME } from '../utils';

import './QueueCard.scss';

export default function QueueCard(props: {
  queueEntry: ExtendedQueuedProjectSmall,
  linkTo: string,
}) {
  const { queueEntry, linkTo } = props;
  const photoURL = queueEntry.best_photo?.small_url ||
    'https://www.ravelry.com/images/assets/illustrations/color/svg/blank-skein-herdwick.svg?v=6';

  let url = '';
  if (linkTo === 'queue') {
    const queuePosition = queueEntry.position_in_queue;
    url = `https://www.ravelry.com/people/${USERNAME}/queue?view=thumblist&page=${Math.ceil(queuePosition / 30)}#q${queuePosition}`;
  } else if (linkTo === 'pattern') {
    url = `https://www.ravelry.com/patterns/library/${queueEntry.pattern_id}`;
  }

  return (
    <a className="queue-card" href={url} target="_blank" rel="noreferrer">
      <div className="queue-card__name">{queueEntry.short_pattern_name}</div>
      <div className="queue-card__image" style={{
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
