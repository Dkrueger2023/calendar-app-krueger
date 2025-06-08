
export interface User {
  id: string;
  name: string;
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CalendarEvent {
  id: string;
  title: string;
  location?: string;
  start: Date;
  end: Date;
  description?: string;
  createdBy: User;
  status: EventStatus;
  allDay: boolean;
  participantsCategory?: string; // Added this line
}

export enum ViewMode {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
}

export interface FormData {
  title: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  allDay: boolean;
  participantsCategory: string; // Added this line
}