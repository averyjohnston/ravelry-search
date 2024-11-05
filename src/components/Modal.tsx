import type { PropsWithChildren } from 'react';

import './Modal.scss';

export default function Modal(props: PropsWithChildren<{
  handleClose: () => void,
  confirmButtonText?: string,
}>) {
  const { handleClose, confirmButtonText, children } = props;

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={handleClose} />
      <div className="modal__body">
        <div className="modal__close-btn" onClick={handleClose}>&times;</div>
        <div className="modal__contents">
          {children}
        </div>
        {confirmButtonText !== undefined &&
          <button className="modal__confirm-btn" onClick={handleClose}>{confirmButtonText}</button>
        }
      </div>
    </div>
  )
}
