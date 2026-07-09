import React, { useState } from 'react';
import { DatabaseProvider } from './dbState';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { TicketModal } from './components/TicketModal';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Experiences } from './pages/Experiences';
import { Events } from './pages/Events';
import { Artists } from './pages/Artists';
import { Venues } from './pages/Venues';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { Event } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<string>('General');
  const [selectedArtistId, setSelectedArtistId] = useState<string | undefined>(undefined);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInquiry = (type?: string, artistId?: string) => {
    setInquiryType(type || 'General');
    setSelectedArtistId(artistId);
    setInquiryOpen(true);
  };

  const handleBookEvent = (event: Event) => {
    setBookingEvent(event);
  };

  // Render current page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onPageChange={handlePageChange}
            onOpenInquiry={handleOpenInquiry}
            onBookEvent={handleBookEvent}
          />
        );
      case 'about':
        return <About onOpenInquiry={handleOpenInquiry} />;
      case 'services':
        return <Services onOpenInquiry={handleOpenInquiry} />;
      case 'experiences':
        return <Experiences onOpenInquiry={handleOpenInquiry} />;
      case 'events':
        return <Events onBookEvent={handleBookEvent} />;
      case 'artists':
        return <Artists onOpenInquiry={handleOpenInquiry} />;
      case 'venues':
        return <Venues onOpenInquiry={handleOpenInquiry} />;
      case 'gallery':
        return <Gallery />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <Home
            onPageChange={handlePageChange}
            onOpenInquiry={handleOpenInquiry}
            onBookEvent={handleBookEvent}
          />
        );
    }
  };

  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-[#FFEDB7] text-[#2F3B3B] font-sans antialiased selection:bg-[#4ABA94] selection:text-[#2F3B3B]">
        
        {/* Navigation Header */}
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onOpenInquiry={handleOpenInquiry}
        />

        {/* Core Content Area */}
        <main className="min-h-[75vh]">
          {renderPage()}
        </main>

        {/* Global Footer */}
        <Footer onPageChange={handlePageChange} />

        {/* Global Dialog Modals */}
        <LeadModal
          isOpen={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          initialType={inquiryType}
          artistId={selectedArtistId}
        />

        {bookingEvent && (
          <TicketModal
            isOpen={!!bookingEvent}
            onClose={() => setBookingEvent(null)}
            event={bookingEvent}
          />
        )}

      </div>
    </DatabaseProvider>
  );
}
