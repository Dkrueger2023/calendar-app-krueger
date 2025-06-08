import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PRIMARY_COLOR } from '../constants';
import { CalendarEvent } from '../types';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (newMonth: Date) => void;
  events: CalendarEvent[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, selectedDate, onDateSelect, onMonthChange, events }) => {
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const generateDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month's trailing days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: prevMonthDays - firstDayOfMonth + 1 + i, isCurrentMonth: false, date: new Date(year, month -1, prevMonthDays - firstDayOfMonth + 1 + i) });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Next month's leading days
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    return days;
  };

  const calendarDays = generateDays();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };
  
  const hasEvents = (date: Date): boolean => {
    return events.some(event => isSameDay(new Date(event.start), date));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`p-2 text-slate-600 hover:text-${PRIMARY_COLOR}-600`}>
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-md font-semibold text-slate-700">{getMonthName(currentMonth)}</h3>
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`p-2 text-slate-600 hover:text-${PRIMARY_COLOR}-600`}>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium text-slate-500 py-1">{day}</div>
        ))}
        {calendarDays.map((dayObj, index) => {
          const isSelected = dayObj.isCurrentMonth && isSameDay(dayObj.date, selectedDate);
          const isToday = dayObj.isCurrentMonth && isSameDay(dayObj.date, new Date());
          const dayHasEvents = dayObj.isCurrentMonth && hasEvents(dayObj.date);

          let dayClasses = "py-2 rounded-full cursor-pointer relative ";
          if (dayObj.isCurrentMonth) {
            dayClasses += isSelected ? `bg-${PRIMARY_COLOR}-500 text-white font-semibold` : (isToday ? `text-${PRIMARY_COLOR}-600 font-semibold` : `text-slate-700 hover:bg-${PRIMARY_COLOR}-100`);
          } else {
            dayClasses += "text-slate-300";
          }

          return (
            <div
              key={index}
              className={dayClasses}
              onClick={() => dayObj.isCurrentMonth && onDateSelect(dayObj.date)}
            >
              {dayObj.day}
              {dayHasEvents && !isSelected && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-${PRIMARY_COLOR}-500 rounded-full`}></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;