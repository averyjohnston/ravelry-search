import type { PropsWithChildren } from 'react';

import { DEFAULT_IMAGE } from '../utils';

import './RavelryCard.scss';

export default function RavelryCard(props: PropsWithChildren<{
  headerText: string,
  imageURL?: string,
  linkURL: string,
  className: string,
}>) {
  const { headerText, imageURL, linkURL, className, children } = props;
  const renderedImageURL = imageURL || DEFAULT_IMAGE;

  return (
    <a className={`ravelry-card block-link ${className}`} href={linkURL} target="_blank" rel="noreferrer">
      <div className="ravelry-card__name">{headerText}</div>
      <div className="ravelry-card__image card-image" style={{
        backgroundImage: `url(${renderedImageURL})`,
      }} />
      <div className="ravelry-card__footer">
        {children}
      </div>
    </a>
  );
}
