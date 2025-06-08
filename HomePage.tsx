
import React, { useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import TabButton from '../components/TabButton';
import { ViewMode, EventStatus } from '../types';
import { useCalendarData } from '../contexts/CalendarDataContext';
import { PRIMARY_COLOR } from '../constants';

// HomePageProps interface removed as openEventModal is no longer needed
// interface HomePageProps {
//   openEventModal: () => void;
// }

const HomePage: React.FC = () => { // Props removed
  const [activeTab, setActiveTab] = useState<ViewMode>(ViewMode.WEEK);
  const { getEventsFiltered } = useCalendarData();

  const upcomingEvents = useMemo(() => {
    return getEventsFiltered({ viewMode: activeTab, status: EventStatus.APPROVED, date: new Date() });
  }, [activeTab, getEventsFiltered]);

  return (
    <div className="space-y-6">
      <div className={`flex justify-center space-x-2 p-1 bg-${PRIMARY_COLOR}-100 rounded-lg shadow-inner`}>
        {(Object.keys(ViewMode) as Array<keyof typeof ViewMode>).map(key => (
          <TabButton
            key={ViewMode[key]}
            label={ViewMode[key]}
            isActive={activeTab === ViewMode[key]}
            onClick={() => setActiveTab(ViewMode[key])}
          />
        ))}
      </div>

      <div>
        <h2 className={`text-lg font-semibold text-slate-700 mb-3 border-b-2 border-${PRIMARY_COLOR}-300 pb-1`}>Upcoming</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} showDayNumber={activeTab !== ViewMode.DAY} />
          ))
        ) : (
          <p className="text-slate-500 text-center py-4">No upcoming events for this period.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
