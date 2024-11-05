import { Outlet, useNavigation } from 'react-router-dom';

import SidebarLink from '../components/SidebarLink';

import './Root.scss';

export default function Root() {
  const navigation = useNavigation();

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
          <li>
            <SidebarLink to="/project-to-queue">Project to Queue Transfer</SidebarLink>
          </li>
        </ul>
      </div>
      <div id="content">
        {(navigation.state === 'loading' || navigation.state === 'submitting') && <div className="progress-bar">
          <div className="progress-bar-inner" />
        </div>}
        <Outlet />
      </div>
    </div>
  );
}
