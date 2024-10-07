import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarLink(props: PropsWithChildren<{
  to: string
}>) {
  const { to, children } = props;

  return (
    <NavLink to={to} className={
      ({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''
    }>{children}</NavLink>
  )
}
