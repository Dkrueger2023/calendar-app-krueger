import React from 'react';
import { CalendarEvent, EventStatus } from '../types';
import { CalendarDaysIcon, PRIMARY_COLOR, DocumentMagnifyingGlassIcon, XCircleIcon, USERS } from '../constants';
import { useCalendarData } from '../contexts/CalendarDataContext';

interface EventCardProps {
  event: CalendarEvent;
  showDayNumber?: boolean;
  isPendingRequest?: boolean;
  onCardClick?: (event: CalendarEvent) => void; // Added this line
}

const EventCard: React.FC<EventCardProps> = ({ event, showDayNumber = false, isPendingRequest = false, onCardClick }) => {
  const { updateEventStatus, deleteEvent, currentUser } = useCalendarData();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleApprove = () => {
    updateEventStatus(event.id, EventStatus.APPROVED);
  };

  const handleReject = () => {
    updateEventStatus(event.id, EventStatus.REJECTED);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
  };
  
  const eventDate = new Date(event.start);
  const dayOfMonth = eventDate.getDate();
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

  const isRejectedAndCreator = event.status === EventStatus.REJECTED && event.createdBy.id === currentUser.id;

  let iconBgColor = `bg-${PRIMARY_COLOR}-50`;
  let iconColor = `text-${PRIMARY_COLOR}-600`;
  let IconComponent: React.FC<{className?: string}> = CalendarDaysIcon;
  let borderColor = 'border-transparent';
  let cardInfo = null;
  let cardCursorClass = 'cursor-default';

  if (isPendingRequest) {
    iconBgColor = `bg-${PRIMARY_COLOR}-100`;
    iconColor = `text-${PRIMARY_COLOR}-700`;
    IconComponent = DocumentMagnifyingGlassIcon;
    borderColor = `border-${PRIMARY_COLOR}-500`;
    cardInfo = <p className="text-xs text-slate-500 mt-1">Proposed by: {event.createdBy.name}</p>;
    if (onCardClick) {
      cardCursorClass = 'cursor-pointer hover:shadow-lg transition-shadow';
    }
  } else if (isRejectedAndCreator) {
    iconBgColor = 'bg-red-50';
    iconColor = 'text-red-600';
    IconComponent = XCircleIcon;
    borderColor = 'border-red-500';
    // Determine who the "other user" is
    const otherUserName = currentUser.id === USERS.karsen.id ? USERS.dalton.name : USERS.karsen.name;
    cardInfo = <p className="text-xs text-red-500 mt-1">Status: Rejected by {otherUserName}</p>;
  }


  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow-md mb-3 flex items-start space-x-4 border-l-4 ${borderColor} ${cardCursorClass}`}
      onClick={isPendingRequest && onCardClick ? () => onCardClick(event) : undefined}
      onKeyDown={isPendingRequest && onCardClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onCardClick(event); } : undefined}
      role={isPendingRequest && onCardClick ? "button" : undefined}
      tabIndex={isPendingRequest && onCardClick ? 0 : undefined}
      aria-label={isPendingRequest && onCardClick ? `View details for event: ${event.title}` : undefined}
    >
      <div className={`p-2 rounded-lg ${iconBgColor} flex flex-col items-center justify-center w-12 h-12 text-center`}>
        {showDayNumber && !isPendingRequest && !isRejectedAndCreator && (
          <>
            <span className={`text-xs font-medium ${iconColor}`}>{dayOfWeek}</span>
            <span className={`text-lg font-bold ${iconColor}`}>{dayOfMonth}</span>
          </>
        )}
        {(!showDayNumber || isPendingRequest || isRejectedAndCreator) && <IconComponent className={`w-5 h-5 ${iconColor}`} />}
         {showDayNumber && (isPendingRequest || isRejectedAndCreator) && <span className={`text-xs font-medium ${iconColor} mt-0.5`}>{dayOfMonth}</span>}
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-slate-800">{event.title}</h3>
        <p className="text-sm text-slate-600">
          {event.allDay ? 'All Day' : `${formatTime(new Date(event.start))} - ${formatTime(new Date(event.end))}`}
        </p>
        {event.location && <p className="text-xs text-slate-500">{event.location}</p>}
        {cardInfo}
        
        {isPendingRequest && !onCardClick && ( // Only show inline buttons if onCardClick is NOT provided
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleApprove(); }}
              className={`px-3 py-1 text-xs font-semibold text-white bg-${PRIMARY_COLOR}-500 hover:bg-${PRIMARY_COLOR}-600 rounded-md transition-colors`}
              aria-label={`Approve ${event.title}`}
            >
              Approve
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleReject(); }}
              className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
              aria-label={`Reject ${event.title}`}
            >
              Reject
            </button>
          </div>
        )}

        {isRejectedAndCreator && (
          <div className="mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="px-3 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              aria-label={`Delete rejected event ${event.title}`}
            >
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;