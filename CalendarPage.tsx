
import React, { useState, useMemo } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import EventCard from '../components/EventCard';
import { useCalendarData } from '../contexts/CalendarDataContext';
import { EventStatus } from '../types';
import { PlusIcon, PRIMARY_COLOR } from '../constants'; 
import { useEventForm } from '../contexts/EventFormContext';

// CalendarPageProps interface removed as openEventModal is no longer needed
// interface CalendarPageProps {
//  openEventModal: () => void; 
// }

const CalendarPage: React.FC = () => { // Props removed
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getEventsFiltered, getEventsForDate, events, currentUser } = useCalendarData();
  const { openModal } = useEventForm();

  const approvedEventsForGrid = useMemo(() => {
    return events.filter(e => e.status === EventStatus.APPROVED);
  }, [events]);

  const eventsForSelectedDay = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, getEventsForDate]);

  const pendingRequestsForMe = useMemo(() => {
    if (!currentUser) return [];
    return getEventsFiltered({ status: EventStatus.PENDING, notCreatedByUserId: currentUser.id });
  }, [getEventsFiltered, currentUser]);
  
  const myPendingProposals = useMemo(() => {
    if (!currentUser) return [];
    return getEventsFiltered({ status: EventStatus.PENDING, createdByUserId: currentUser.id });
  }, [getEventsFiltered, currentUser]);


  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };
  
  const formatDateHeader = (date: Date): string => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6 relative">
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
        events={approvedEventsForGrid}
      />

      <div>
        <h2 className={`text-lg font-semibold text-slate-700 mb-3 border-b-2 border-${PRIMARY_COLOR}-300 pb-1`}>
            {formatDateHeader(selectedDate)}
        </h2>
        {eventsForSelectedDay.length > 0 ? (
          eventsForSelectedDay.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-slate-500 text-center py-4">No approved events for this day.</p>
        )}
      </div>

      {(pendingRequestsForMe.length > 0 || myPendingProposals.length > 0) && (
        <div>
          <h2 className={`text-lg font-semibold text-slate-700 mb-3 border-b-2 border-${PRIMARY_COLOR}-300 pb-1`}>Pending Items</h2>
          {pendingRequestsForMe.length > 0 && (
            <>
              <h3 className="text-md font-medium text-slate-600 mt-3 mb-1">For Your Approval:</h3>
              {pendingRequestsForMe.map(event => (
                <EventCard key={event.id} event={event} isPendingRequest={true} />
              ))}
            </>
          )}
          {myPendingProposals.length > 0 && (
             <>
              <h3 className="text-md font-medium text-slate-600 mt-3 mb-1">Your Pending Proposals:</h3>
              {myPendingProposals.map(event => (
                <EventCard key={event.id} event={event} isPendingRequest={false} /> 
              ))}
            </>
          )}
        </div>
      )}
       <button
        onClick={openModal}
        className={`fixed bottom-20 right-6 bg-${PRIMARY_COLOR}-500 hover:bg-${PRIMARY_COLOR}-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${PRIMARY_COLOR}-500 z-20`}
        aria-label="Add new event"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CalendarPage;
