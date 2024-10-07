import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

import './SidebarLink.scss';

export default function SidebarLink(props: PropsWithChildren<{
  to: string
}>) {
  const { to, children } = props;

  return (
    <NavLink to={to} className={({ isActive, isPending }) => {
      const defaultClass = 'sidebar-link';
      const stateClass = isActive ? 'active' : isPending ? 'pending' : '';
      return `${defaultClass} ${stateClass}`;
    }}>{children}</NavLink>
  )
}
