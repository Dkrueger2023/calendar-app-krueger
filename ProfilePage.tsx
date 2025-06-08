import React from 'react';
import { UserCircleIcon, USERS, PRIMARY_COLOR } from '../constants';
import { useCalendarData } from '../contexts/CalendarDataContext';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser } = useCalendarData();

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUser(event.target.value as keyof typeof USERS);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10 h-full p-4">
      <UserCircleIcon className={`w-24 h-24 mb-4 text-${PRIMARY_COLOR}-700`} />
      
      <h1 className="text-3xl font-semibold text-slate-800 mb-2">{currentUser.name}</h1>
      <p className="text-slate-600 mb-8 text-center">Welcome, {currentUser.name}!</p>

      <div className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="userSelect" className={`block text-sm font-medium text-slate-700 mb-1 text-center`}>
            Switch User:
          </label>
          <select
            id="userSelect"
            value={currentUser.id === USERS.karsen.id ? 'karsen' : 'dalton'}
            onChange={handleUserChange}
            className={`w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 outline-none text-slate-700 text-center appearance-none`}
          >
            {(Object.keys(USERS) as Array<keyof typeof USERS>).map((userKey) => (
              <option key={USERS[userKey].id} value={userKey}>
                {USERS[userKey].name}
              </option>
            ))}
          </select>
        </div>
        {/* Add any other profile information or actions here if needed in the future */}
      </div>
    </div>
  );
};

export default ProfilePage;