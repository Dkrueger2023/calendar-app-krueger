
import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, ChevronUpDownIcon, PRIMARY_COLOR } from '../constants';
import { useCalendarData } from '../contexts/CalendarDataContext';
import { FormData } from '../types';
import PopupCalendar from './PopupCalendar';

interface EventFormModalProps {
  onClose: () => void;
}

// Helper to get a valid Date object for PopupCalendar's initialDate
const getValidInitialCalendarDate = (dateString: string): Date => {
  // Check if the dateString is in YYYY-MM-DD format.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(); // Default to today if format is incorrect
  }
  // Attempt to parse in a way that respects local timezone context for the date part
  const [year, month, day] = dateString.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed

  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};


const EventFormModal: React.FC<EventFormModalProps> = ({ onClose }) => {
  const { addEvent } = useCalendarData();
  const today = new Date();

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    startDate: formatDateForInput(today),
    startTime: formatTimeForInput(new Date(new Date().setHours(today.getHours() + 1, 0, 0, 0))),
    endDate: formatDateForInput(today),
    endTime: formatTimeForInput(new Date(new Date().setHours(today.getHours() + 2, 0, 0, 0))),
    description: '',
    allDay: false,
    participantsCategory: '',
  });

  const [activeCalendarFor, setActiveCalendarFor] = useState<'startDate' | 'endDate' | null>(null);

  const participantOptions = ['Dalton', 'Karsen', 'Dalton/Karsen', 'Family'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
        if (name === 'allDay' && checked) {
             setFormData(prev => ({
                ...prev,
                startTime: '00:00',
                endTime: '23:59',
            }));
        }
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCalendarToggle = (target: 'startDate' | 'endDate') => {
    if (activeCalendarFor === target) {
      setActiveCalendarFor(null); 
    } else {
      setActiveCalendarFor(target);
    }
  };

  const handleDatePicked = (date: Date) => {
    if (activeCalendarFor) {
      const formattedDate = formatDateForInput(date);
      setFormData(prev => {
        const newFormData = { ...prev, [activeCalendarFor]: formattedDate };
        
        const newStartDate = getValidInitialCalendarDate(newFormData.startDate);
        const newEndDate = getValidInitialCalendarDate(newFormData.endDate);

        if (activeCalendarFor === 'startDate' && newStartDate > newEndDate) {
            newFormData.endDate = formattedDate; 
        }
        
        if (activeCalendarFor === 'endDate' && newEndDate < newStartDate) {
           newFormData.endDate = newFormData.startDate; 
        }
        return newFormData;
      });
    }
    setActiveCalendarFor(null); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateObj = getValidInitialCalendarDate(formData.startDate);
    const endDateObj = getValidInitialCalendarDate(formData.endDate);

    // This check might be redundant if getValidInitialCalendarDate always returns a valid date
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        alert("Invalid date in Start Date or End Date field. Please pick from the calendar.");
        return;
    }

    const startDateTime = new Date(startDateObj);
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);
    
    const endDateTime = new Date(endDateObj);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (endDateTime < startDateTime) {
        alert("End date/time cannot be before start date/time.");
        return;
    }

    addEvent({
      title: formData.title,
      location: formData.location,
      start: startDateTime,
      end: endDateTime,
      description: formData.description,
      allDay: formData.allDay,
      participantsCategory: formData.participantsCategory,
    });
    onClose();
  };
  
  const inputBaseClass = `w-full p-3 bg-${PRIMARY_COLOR}-50 border border-${PRIMARY_COLOR}-200 rounded-md focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 outline-none placeholder-slate-400 text-slate-700`;
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  const calendarInitialDate = useMemo(() => {
    if (activeCalendarFor === 'startDate') return getValidInitialCalendarDate(formData.startDate);
    if (activeCalendarFor === 'endDate') return getValidInitialCalendarDate(formData.endDate);
    // Default for when no calendar is active, though PopupCalendar won't be rendered then.
    // Still, good to have a fallback.
    return getValidInitialCalendarDate(formData.startDate) || new Date();
  }, [activeCalendarFor, formData.startDate, formData.endDate]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">New event</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close new event form">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} placeholder="Add title" className={inputBaseClass} required />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} placeholder="Add location" className={inputBaseClass} required />
          </div>
          
          <div>
            <label htmlFor="participantsCategory" className={labelClass}>Participants/Category</label>
            <div className="relative">
              <select
                name="participantsCategory"
                id="participantsCategory"
                value={formData.participantsCategory}
                onChange={handleChange}
                className={`${inputBaseClass} appearance-none pr-10`}
                required
              >
                <option value="" disabled>Select an option</option>
                {participantOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronUpDownIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-${PRIMARY_COLOR}-400 pointer-events-none`} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="allDay" id="allDay" checked={formData.allDay} onChange={handleChange} className={`h-4 w-4 text-${PRIMARY_COLOR}-600 border-slate-300 rounded focus:ring-${PRIMARY_COLOR}-500`} />
            <label htmlFor="allDay" className="text-sm text-slate-700">All day event</label>
          </div>

          <div>
            <label className={labelClass}>Start</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                name="startDate" 
                value={formData.startDate} 
                onClick={() => handleCalendarToggle('startDate')}
                readOnly 
                placeholder="YYYY-MM-DD"
                className={`${inputBaseClass} flex-1 cursor-pointer`} required 
                aria-label="Start date, click to open calendar"
                />
              {!formData.allDay && <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={`${inputBaseClass} flex-1`} required />}
            </div>
            {activeCalendarFor === 'startDate' && (
              <div className="mt-2 rounded-md shadow-lg border border-slate-200 bg-white z-10">
                <PopupCalendar
                  initialDate={calendarInitialDate}
                  onDateSelect={handleDatePicked}
                  onClose={() => setActiveCalendarFor(null)}
                />
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>End</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                name="endDate" 
                value={formData.endDate} 
                onClick={() => handleCalendarToggle('endDate')}
                readOnly
                placeholder="YYYY-MM-DD"
                className={`${inputBaseClass} flex-1 cursor-pointer`} required 
                aria-label="End date, click to open calendar"
                />
              {!formData.allDay && <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={`${inputBaseClass} flex-1`} required />}
            </div>
             {activeCalendarFor === 'endDate' && (
              <div className="mt-2 rounded-md shadow-lg border border-slate-200 bg-white z-10">
                <PopupCalendar
                  initialDate={calendarInitialDate}
                  onDateSelect={handleDatePicked}
                  onClose={() => setActiveCalendarFor(null)}
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} placeholder="Add description" rows={3} className={inputBaseClass} required></textarea>
          </div>
          <button type="submit" className={`w-full bg-${PRIMARY_COLOR}-500 hover:bg-${PRIMARY_COLOR}-600 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${PRIMARY_COLOR}-500`}>
            Propose
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
