import { Outlet } from 'react-router-dom';

import SidebarLink from '../components/SidebarLink';

import './Root.scss';

// TODO: allow toggling of sidebar

export default function Root() {
  return (
    <div id="app-root">
      <div id="sidebar">
        <ul>
          <li>
            <SidebarLink to="/queue-sort">Sorted Queue</SidebarLink>
          </li>
          <li>
            <SidebarLink to="/random-picker">Random Pickers</SidebarLink>
          </li>
        </ul>
      </div>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}
