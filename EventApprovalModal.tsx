import React from 'react';
import { CalendarEvent, EventStatus } from '../types';
import { XMarkIcon, PRIMARY_COLOR, USERS } from '../constants';
import { useCalendarData } from '../contexts/CalendarDataContext';

interface EventApprovalModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventApprovalModal: React.FC<EventApprovalModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const { updateEventStatus, currentUser } = useCalendarData();

  if (!isOpen || !event) return null;

  const handleApprove = () => {
    updateEventStatus(event.id, EventStatus.APPROVED);
    onClose();
  };

  const handleReject = () => {
    updateEventStatus(event.id, EventStatus.REJECTED);
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  };

  const proposedByUserName = event.createdBy.id === USERS.karsen.id ? USERS.karsen.name : USERS.dalton.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Event Details & Approval</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close event details">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          <div>
            <strong className="text-slate-600 block mb-0.5">Title:</strong>
            <p className="text-slate-800">{event.title}</p>
          </div>
          {event.location && (
            <div>
              <strong className="text-slate-600 block mb-0.5">Location:</strong>
              <p className="text-slate-800">{event.location}</p>
            </div>
          )}
          <div>
            <strong className="text-slate-600 block mb-0.5">Start:</strong>
            <p className="text-slate-800">{event.allDay ? `${new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (All Day)` : formatDateTime(new Date(event.start))}</p>
          </div>
          <div>
            <strong className="text-slate-600 block mb-0.5">End:</strong>
            <p className="text-slate-800">{event.allDay ? `${new Date(event.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (All Day)` : formatDateTime(new Date(event.end))}</p>
          </div>
          {event.participantsCategory && (
             <div>
              <strong className="text-slate-600 block mb-0.5">Participants/Category:</strong>
              <p className="text-slate-800">{event.participantsCategory}</p>
            </div>
          )}
          {event.description && (
            <div>
              <strong className="text-slate-600 block mb-0.5">Description:</strong>
              <p className="text-slate-800 whitespace-pre-wrap">{event.description || "No description provided."}</p>
            </div>
          )}
           <div>
            <strong className="text-slate-600 block mb-0.5">Proposed by:</strong>
            <p className="text-slate-800">{proposedByUserName}</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={handleReject}
            className={`px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors`}
            aria-label={`Reject event: ${event.title}`}
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            className={`px-4 py-2 text-sm font-semibold text-white bg-${PRIMARY_COLOR}-500 hover:bg-${PRIMARY_COLOR}-600 rounded-md transition-colors`}
            aria-label={`Approve event: ${event.title}`}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventApprovalModal;