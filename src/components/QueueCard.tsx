import type { ExtendedQueuedProjectSmall } from '../types';

import './QueueCard.scss';

export default function QueueCard(props: {
  queueEntry: ExtendedQueuedProjectSmall,
}) {
  const { queueEntry } = props;
  const photoURL = queueEntry.best_photo?.small_url ||
    'https://www.ravelry.com/images/assets/illustrations/color/svg/blank-skein-herdwick.svg?v=6';

  return (
    <a className="queue-card" href={`https://www.ravelry.com/patterns/library/${queueEntry.pattern_id}`} target="_blank" rel="noreferrer">
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
