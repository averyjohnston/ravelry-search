import type { ExtendedQueuedProjectSmall } from '../types';

// TODO: show picture, name, and craft/ready to make maybe as icons?

export default function QueueCard(props: {
  queueEntry: ExtendedQueuedProjectSmall,
}) {
  const { queueEntry } = props;

  return (
    <p>{queueEntry.name}</p>
  )
}
