
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlusIcon, Bars3Icon, PRIMARY_COLOR } from '../constants';
import { useEventForm } from '../contexts/EventFormContext';

// HeaderProps interface removed as openEventModal prop is no longer needed
// interface HeaderProps {
//   openEventModal: () => void; 
// }

const Header: React.FC = () => { // Props removed
  const location = useLocation();
  const { openModal } = useEventForm();

  let title = "Family Calendar";
  let leftIcon: React.ReactNode = null;
  let rightIcon: React.ReactNode = null;

  if (location.pathname === '/') {
    rightIcon = (
      <button onClick={openModal} className={`p-2 text-slate-700 hover:text-${PRIMARY_COLOR}-600`} aria-label="Add new event">
        <PlusIcon className="w-7 h-7" />
      </button>
    );
  } else if (location.pathname === '/calendar') {
     leftIcon = (
      <button className={`p-2 text-slate-700 hover:text-${PRIMARY_COLOR}-600`} aria-label="Menu">
        <Bars3Icon className="w-7 h-7" />
      </button>
    );
  }
  // Other pages might have different headers, handled by their own structure or a more complex Header

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-md mx-auto h-16 flex items-center justify-between px-4">
        <div className="w-10">
          {leftIcon}
        </div>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <div className="w-10">
          {rightIcon}
        </div>
      </div>
    </header>
  );
};

export default Header;
