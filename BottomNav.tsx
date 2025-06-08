import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, BellIcon, UserCircleIcon, PRIMARY_COLOR } from '../constants';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/calendar', label: 'Calendar', icon: CalendarDaysIcon },
    { path: '/notifications', label: 'Notifications', icon: BellIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  const activeClassName = `text-${PRIMARY_COLOR}-600`;
  const inactiveClassName = `text-slate-500 hover:text-${PRIMARY_COLOR}-500`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-slate-200 flex justify-around items-center shadow-top z-10">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center p-2 rounded-md transition-colors ${isActive ? activeClassName : inactiveClassName}`
          }
        >
          <item.icon className="w-6 h-6 mb-0.5" />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;