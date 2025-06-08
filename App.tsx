
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import { EventFormProvider } from './contexts/EventFormContext';
import { CalendarDataProvider } from './contexts/CalendarDataContext';

const App: React.FC = () => {
  // Redundant modal state removed. EventFormProvider handles this.

  return (
    <CalendarDataProvider>
      <EventFormProvider>
        <Layout> {/* openEventModal prop removed */}
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* openEventModal prop removed */}
            <Route path="/calendar" element={<CalendarPage />} /> {/* openEventModal prop removed */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </EventFormProvider>
    </CalendarDataProvider>
  );
};

export default App;
