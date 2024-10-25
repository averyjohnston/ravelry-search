import { Outlet, useNavigation } from 'react-router-dom';

import SidebarLink from '../components/SidebarLink';

import './Root.scss';

// TODO: reattempt moving a project into the queue?
// delete project, add queue entry, option to mark stash entries as available?
// carry over notes + private notes? (latter should be visible if you're the project owner)
// API doesn't have a way to assign stash entries to a queue entry programmatically

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
        </ul>
      </div>
      <div id="content">
        {navigation.state === 'loading' && <div className="progress-bar">
          <div className="progress-bar-inner" />
        </div>}
        <Outlet />
      </div>
    </div>
  );
}
