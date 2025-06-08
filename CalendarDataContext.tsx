
import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo } from 'react';
import { CalendarEvent, EventStatus, User, ViewMode } from '../types';
import { USERS } from '../constants';

interface CalendarDataContextType {
  events: CalendarEvent[];
  currentUser: User;
  setCurrentUser: (userId: keyof typeof USERS) => void;
  addEvent: (eventData: Omit<CalendarEvent, 'id' | 'status' | 'createdBy'>) => void;
  updateEventStatus: (eventId: string, status: EventStatus) => void;
  deleteEvent: (eventId: string) => void; // Added this line
  getEventsFiltered: (options: { viewMode?: ViewMode; date?: Date; status?: EventStatus; specificDay?: Date; createdByUserId?: string; notCreatedByUserId?: string }) => CalendarEvent[];
  getEventsForDate: (date: Date) => CalendarEvent[];
}

const CalendarDataContext = createContext<CalendarDataContextType | undefined>(undefined);

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Family Brunch',
    location: 'Home',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    description: 'Brunch with Karsen and Dalton.',
    createdBy: USERS.karsen,
    status: EventStatus.APPROVED,
    allDay: false,
    participantsCategory: 'Family',
  },
  {
    id: '2',
    title: 'Soccer Practice (Karsen)',
    location: 'Community Field',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(13, 0, 0, 0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)),
    description: 'Karsen\'s soccer practice.',
    createdBy: USERS.karsen,
    status: EventStatus.APPROVED,
    allDay: false,
    participantsCategory: 'Karsen',
  },
  {
    id: '3',
    title: 'Grocery Shopping (Dalton needs to approve)',
    location: 'Local Supermarket',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 0)).setHours(15, 0, 0, 0)), // Today
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 0)).setHours(16, 0, 0, 0)),
    createdBy: USERS.karsen, // Karsen created
    status: EventStatus.PENDING, // Dalton to approve
    allDay: false,
    participantsCategory: 'Dalton/Karsen',
  },
   {
    id: '4',
    title: 'Dinner with Grandparents',
    location: 'Their place',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(18,0,0,0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(19,30,0,0)),
    description: 'Visiting the grandparents for dinner.',
    createdBy: USERS.dalton,
    status: EventStatus.APPROVED,
    allDay: false,
    participantsCategory: 'Family',
  },
  {
    id: '5',
    title: 'Movie Night Proposal (Karsen needs to approve)',
    location: 'Living Room',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 4)).setHours(20,0,0,0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 4)).setHours(22,0,0,0)),
    description: 'Dalton suggests a new movie.',
    createdBy: USERS.dalton, // Dalton created
    status: EventStatus.PENDING, // Karsen to approve
    allDay: false,
    participantsCategory: 'Dalton/Karsen',
  },
  {
    id: '6',
    title: 'Project Deadline (Dalton)',
    location: 'Work/Home Office',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(9,0,0,0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(17,0,0,0)),
    description: 'Final day for project submission.',
    createdBy: USERS.dalton,
    status: EventStatus.APPROVED,
    allDay: false,
    participantsCategory: 'Dalton',
  },
  {
    id: '7',
    title: 'Book Club Meeting (Rejected by Karsen)',
    location: 'Online',
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(19, 0, 0, 0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(20, 0, 0, 0)),
    description: 'Dalton proposed, Karsen rejected.',
    createdBy: USERS.dalton, // Dalton created
    status: EventStatus.REJECTED, // Karsen rejected
    allDay: false,
    participantsCategory: 'Dalton/Karsen',
  }
];


export const CalendarDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentUser, setCurrentUserState] = useState<User>(USERS.karsen); // Default to Karsen

  const setCurrentUser = useCallback((userIdKey: keyof typeof USERS) => {
    const user = USERS[userIdKey];
    if (user) {
        setCurrentUserState(user);
    } else {
        console.warn(`User with key ${userIdKey} not found. Defaulting to Karsen.`);
        setCurrentUserState(USERS.karsen);
    }
  }, []);


  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id' | 'status' | 'createdBy'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        ...eventData,
        id: String(Date.now()),
        status: EventStatus.PENDING,
        createdBy: currentUser, // Use the current active user from context
        participantsCategory: eventData.participantsCategory, // Store participantsCategory
      },
    ]);
  }, [currentUser]);

  const updateEventStatus = useCallback((eventId: string, status: EventStatus) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status } : event
      )
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);
  
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    return events.filter(event => {
        const eventStartDate = new Date(event.start);
        return eventStartDate.getFullYear() === date.getFullYear() &&
               eventStartDate.getMonth() === date.getMonth() &&
               eventStartDate.getDate() === date.getDate() &&
               event.status === EventStatus.APPROVED;
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events]);

  const getEventsFiltered = useCallback((options: { viewMode?: ViewMode; date?: Date; status?: EventStatus; specificDay?: Date, createdByUserId?: string; notCreatedByUserId?: string }) => {
    let filtered = [...events];
    const today = options.date ? new Date(options.date) : new Date();
    today.setHours(0,0,0,0);

    if (options.status) {
      filtered = filtered.filter(event => event.status === options.status);
    }
    if (options.createdByUserId) {
      filtered = filtered.filter(event => event.createdBy.id === options.createdByUserId);
    }
    if (options.notCreatedByUserId) {
      filtered = filtered.filter(event => event.createdBy.id !== options.notCreatedByUserId);
    }

    if (options.specificDay) {
        const specific = new Date(options.specificDay);
        specific.setHours(0,0,0,0);
        filtered = filtered.filter(event => {
            const eventStart = new Date(event.start);
            eventStart.setHours(0,0,0,0);
            return eventStart.getTime() === specific.getTime();
        });
    } else if (options.viewMode) {
        switch (options.viewMode) {
            case ViewMode.DAY:
                filtered = filtered.filter(event => {
                    const eventStart = new Date(event.start);
                    eventStart.setHours(0,0,0,0);
                    return eventStart.getTime() === today.getTime();
                });
                break;
            case ViewMode.WEEK:
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
                endOfWeek.setHours(23,59,59,999);

                filtered = filtered.filter(event => {
                    const eventStart = new Date(event.start);
                    return eventStart >= startOfWeek && eventStart <= endOfWeek;
                });
                break;
            case ViewMode.MONTH:
                filtered = filtered.filter(event => {
                    const eventStart = new Date(event.start);
                    return eventStart.getFullYear() === today.getFullYear() && eventStart.getMonth() === today.getMonth();
                });
                break;
        }
    }
    
    return filtered.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [events]);


  const contextValue = useMemo(() => ({
    events,
    currentUser,
    setCurrentUser,
    addEvent,
    updateEventStatus,
    deleteEvent, // Added deleteEvent here
    getEventsFiltered,
    getEventsForDate,
  }), [events, currentUser, setCurrentUser, addEvent, updateEventStatus, deleteEvent, getEventsFiltered, getEventsForDate]);

  return (
    <CalendarDataContext.Provider value={contextValue}>
      {children}
    </CalendarDataContext.Provider>
  );
};

export const useCalendarData = (): CalendarDataContextType => {
  const context = useContext(CalendarDataContext);
  if (!context) {
    throw new Error('useCalendarData must be used within a CalendarDataProvider');
  }
  return context;
};