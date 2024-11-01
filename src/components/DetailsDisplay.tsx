import { Fragment } from 'react/jsx-runtime';

import { DEFAULT_IMAGE } from '../utils';

import './DetailsDisplay.scss';

export default function DetailsDisplay(props: {
  photoURL?: string,
  linkURL?: string,
  name: string,
  details: Detail[],
}) {
  const { photoURL, linkURL, name, details } = props;

  const renderedImageURL = photoURL || DEFAULT_IMAGE;

  return (
    <a className="details-card block-link" href={linkURL} target="_blank" rel="noreferrer">
      <div className="details-card__image card-image" style={{
        backgroundImage: `url(${renderedImageURL})`,
      }} />
      <div className="details-card__content">
        <p className="details-card__name">{name}</p>
        <div className="details-card__details">
          {details.map((detail, i) => (
            <Fragment key={i}>
              <p>{detail.label}</p>
              <p>{detail.value}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </a>
  )
}

interface Detail {
  label: string,
  value: string,
}
