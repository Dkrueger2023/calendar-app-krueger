
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface EventFormContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const EventFormContext = createContext<EventFormContextType | undefined>(undefined);

export const EventFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <EventFormContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </EventFormContext.Provider>
  );
};

export const useEventForm = (): EventFormContextType => {
  const context = useContext(EventFormContext);
  if (context === undefined) {
    throw new Error('useEventForm must be used within an EventFormProvider');
  }
  return context;
};
