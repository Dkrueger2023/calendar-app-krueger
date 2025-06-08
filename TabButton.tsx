import React from 'react';
import { PRIMARY_COLOR } from '../constants';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
        ${isActive 
          ? `bg-${PRIMARY_COLOR}-500 text-white shadow-md` 
          : `text-slate-600 hover:bg-${PRIMARY_COLOR}-100 hover:text-${PRIMARY_COLOR}-600`
        }
      `}
    >
      {label}
    </button>
  );
};

export default TabButton;