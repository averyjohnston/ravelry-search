import type { CardLinkType, ExtendedQueuedProjectSmall } from '../types';
import { buildQueueURL } from '../utils';

import './QueueCard.scss';
import RavelryCard from './RavelryCard';

export default function QueueCard(props: {
  queueEntry: ExtendedQueuedProjectSmall,
  linkTo: CardLinkType,
}) {
  const { queueEntry, linkTo } = props;

  let url = '';
  if (linkTo === 'queue') {
    url = buildQueueURL(queueEntry);
  } else if (linkTo === 'pattern') {
    url = `https://www.ravelry.com/patterns/library/${queueEntry.pattern_id}`;
  }

  return (
    <RavelryCard
      headerText={queueEntry.short_pattern_name}
      imageURL={queueEntry.best_photo?.small2_url}
      linkURL={url}
      className="queue-card"
    >
      <div className={`queue-card__craft queue-card__craft--${queueEntry.craft}`}>
        {queueEntry.craft.charAt(0).toUpperCase()}
      </div>
      <div className="queue-card__status">
        🧶{queueEntry.isReadyToMake ? '✔️' : '❌'}
      </div>
    </RavelryCard>
  );
}
