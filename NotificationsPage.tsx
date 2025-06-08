import React, { useMemo, useState } from 'react';
import { BellIcon, XCircleIcon, PRIMARY_COLOR, USERS } from '../constants';
import { useCalendarData } from '../contexts/CalendarDataContext';
import { EventStatus, CalendarEvent } from '../types';
import EventCard from '../components/EventCard';
import EventApprovalModal from '../components/EventApprovalModal'; // Import the new modal

const NotificationsPage: React.FC = () => {
  const { currentUser, getEventsFiltered, updateEventStatus } = useCalendarData();

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedEventForApproval, setSelectedEventForApproval] = useState<CalendarEvent | null>(null);

  const pendingApprovalRequests = useMemo(() => {
    if (!currentUser) return [];
    return getEventsFiltered({ 
      status: EventStatus.PENDING, 
      notCreatedByUserId: currentUser.id 
    });
  }, [currentUser, getEventsFiltered]);

  const myRejectedProposals = useMemo(() => {
    if (!currentUser) return [];
    return getEventsFiltered({
      status: EventStatus.REJECTED,
      createdByUserId: currentUser.id
    });
  }, [currentUser, getEventsFiltered]);

  const otherUserName = currentUser ? (currentUser.id === USERS.karsen.id ? USERS.dalton.name : USERS.karsen.name) : '';

  const handleOpenApprovalModal = (event: CalendarEvent) => {
    setSelectedEventForApproval(event);
    setIsApprovalModalOpen(true);
  };

  const handleCloseApprovalModal = () => {
    setSelectedEventForApproval(null);
    setIsApprovalModalOpen(false);
  };

  // These handlers are now implicitly part of EventApprovalModal,
  // but you could pass them explicitly if needed e.g. for more complex logic
  // const handleApproveEvent = (eventId: string) => {
  //   updateEventStatus(eventId, EventStatus.APPROVED);
  //   handleCloseApprovalModal();
  // };

  // const handleRejectEvent = (eventId: string) => {
  //   updateEventStatus(eventId, EventStatus.REJECTED);
  //   handleCloseApprovalModal();
  // };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4 pt-2">
        <h1 className="text-2xl font-semibold text-slate-800">Notifications</h1>
      </div>

      {pendingApprovalRequests.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <BellIcon className={`w-6 h-6 text-${PRIMARY_COLOR}-600 mr-2`} />
            <h2 className="text-xl font-semibold text-slate-700">Pending Your Approval</h2>
          </div>
          <p className="text-sm text-slate-600 px-1 mb-2">
            These events were proposed by {otherUserName} and are awaiting your action. Click to view details.
          </p>
          <div className="space-y-3">
            {pendingApprovalRequests.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isPendingRequest={true} 
                showDayNumber={true}
                onCardClick={() => handleOpenApprovalModal(event)} // Pass the click handler
              />
            ))}
          </div>
        </div>
      )}

      {myRejectedProposals.length > 0 && (
        <div>
          <div className="flex items-center mb-3 mt-6">
            <XCircleIcon className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-slate-700">Your Rejected Proposals</h2>
          </div>
          <p className="text-sm text-slate-600 px-1 mb-2">
            These event proposals you created were rejected by {otherUserName}. You can delete them.
          </p>
          <div className="space-y-3">
            {myRejectedProposals.map(event => (
              <EventCard key={event.id} event={event} showDayNumber={true} /> 
            ))}
          </div>
        </div>
      )}

      {pendingApprovalRequests.length === 0 && myRejectedProposals.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          <BellIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No new notifications at this time.</p>
        </div>
      )}

      <EventApprovalModal
        event={selectedEventForApproval}
        isOpen={isApprovalModalOpen}
        onClose={handleCloseApprovalModal}
        // onApprove and onReject are handled inside EventApprovalModal using useCalendarData
      />
    </div>
  );
};

export default NotificationsPage;