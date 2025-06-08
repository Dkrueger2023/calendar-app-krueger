
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PRIMARY_COLOR } from '../constants';

interface PopupCalendarProps {
  initialDate: Date; // Should always be a valid Date object from parent
  onDateSelect: (date: Date) => void;
  onClose?: () => void; 
}

const PopupCalendar: React.FC<PopupCalendarProps> = ({ initialDate, onDateSelect, onClose }) => {
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDateState, setSelectedDateState] = useState<Date>(initialDate);

  useEffect(() => {
    // This effect runs when the initialDate prop from the parent changes.
    // This typically happens when the associated form field (startDate or endDate) is updated,
    // or when the calendar is opened for a different field.
    setDisplayMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    setSelectedDateState(initialDate);
  }, [initialDate]); 


  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const generateDays = () => {
    const cells = [];
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth(); 

    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDateInfo = new Date(year, month, 0); 
    const daysInPrevMonth = prevMonthDateInfo.getDate();
    const prevMonthYear = prevMonthDateInfo.getFullYear();
    const prevMonthIndex = prevMonthDateInfo.getMonth();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const dayNumber = daysInPrevMonth - firstDayOfMonth + 1 + i;
        cells.push({
            day: dayNumber,
            isCurrentMonth: false,
            date: new Date(prevMonthYear, prevMonthIndex, dayNumber),
        });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        cells.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i),
        });
    }

    const nextMonthDateInfo = new Date(year, month + 1, 1);
    const nextMonthYear = nextMonthDateInfo.getFullYear();
    const nextMonthIndex = nextMonthDateInfo.getMonth();

    let dayNumberForNextMonth = 1;
    while (cells.length < 42) {
        cells.push({
            day: dayNumberForNextMonth,
            isCurrentMonth: false,
            date: new Date(nextMonthYear, nextMonthIndex, dayNumberForNextMonth),
        });
        dayNumberForNextMonth++;
    }
    return cells; 
  };

  const calendarDays = generateDays();

  const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (date: Date) => {
    onDateSelect(date);
  };

  return (
    <div className={`p-3 bg-white rounded-md shadow-xs w-full max-w-xs mx-auto border border-${PRIMARY_COLOR}-100`}>
      <div className="flex justify-between items-center mb-3">
        <button onClick={handlePrevMonth} className={`p-1.5 text-slate-500 hover:text-${PRIMARY_COLOR}-600 rounded-full hover:bg-${PRIMARY_COLOR}-50`} aria-label="Previous month">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className={`text-sm font-semibold text-${PRIMARY_COLOR}-700`}>{getMonthName(displayMonth)}</h3>
        <button onClick={handleNextMonth} className={`p-1.5 text-slate-500 hover:text-${PRIMARY_COLOR}-600 rounded-full hover:bg-${PRIMARY_COLOR}-50`} aria-label="Next month">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium text-slate-400 py-1">{day}</div>
        ))}
        {calendarDays.map((dayObj) => {
          const isSelected = dayObj.isCurrentMonth && isSameDay(dayObj.date, selectedDateState);
          const isToday = dayObj.isCurrentMonth && isSameDay(dayObj.date, new Date());

          let dayClasses = "py-1.5 rounded-full cursor-pointer flex items-center justify-center aspect-square ";
          if (dayObj.isCurrentMonth) {
            dayClasses += isSelected ? `bg-${PRIMARY_COLOR}-500 text-white font-semibold` : 
                          (isToday ? `text-${PRIMARY_COLOR}-600 bg-${PRIMARY_COLOR}-100 font-semibold` : `text-slate-700 hover:bg-${PRIMARY_COLOR}-100`);
          } else {
            dayClasses += "text-slate-300 cursor-default"; 
          }

          return (
            <div
              key={dayObj.date.toISOString()} 
              className={dayClasses}
              onClick={() => dayObj.isCurrentMonth && handleDayClick(dayObj.date)}
              role="button"
              tabIndex={dayObj.isCurrentMonth ? 0 : -1}
              aria-label={`${dayObj.isCurrentMonth ? 'Select date' : 'Date not in current month'}: ${dayObj.date.toLocaleDateString()}`}
              onKeyDown={(e) => { if (dayObj.isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) handleDayClick(dayObj.date);}}
            >
              {dayObj.day}
            </div>
          );
        })}
      </div>
      {onClose && ( 
        <button onClick={onClose} className={`mt-2 w-full text-xs text-${PRIMARY_COLOR}-600 hover:underline`} aria-label="Close calendar picker">Close</button>
      )}
    </div>
  );
};

export default PopupCalendar;
