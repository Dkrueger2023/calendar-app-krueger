
import React, { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import EventFormModal from './EventFormModal';
import { useEventForm } from '../contexts/EventFormContext';

interface LayoutProps {
  children: ReactNode;
  // openEventModal: () => void; // Prop removed
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isModalOpen, closeModal } = useEventForm();

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-transparent shadow-lg">
      <Header /> {/* openEventModal prop removed */}
      <main className="flex-grow overflow-y-auto p-4 pb-20">
        {children}
      </main>
      <BottomNav />
      {isModalOpen && <EventFormModal onClose={closeModal} />}
    </div>
  );
};

export default Layout;
