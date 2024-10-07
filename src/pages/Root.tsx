import { Link, Outlet } from 'react-router-dom';

import './Root.scss';

// TODO: allow toggling of sidebar

export default function Root() {
  return (
    <div id="app-root">
      <div id="sidebar">
        <ul>
          <li>
            <Link to="/queue-sort">Sorted Queue</Link>
          </li>
          <li>Other links coming soon...</li>
        </ul>
      </div>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}
