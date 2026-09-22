import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TherapistCard from './components/TherapistCard';
import ServicesSection from './components/ServicesSection';
import ScheduleSection from './components/ScheduleSection';
import HistoryMission from './components/HistoryMission';
import TestimonialsSection from './components/TestimonialsSection';
import ContactBanner from './components/ContactBanner';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import LocationModal from './components/LocationModal';
import BookingConfirmationModal, { BookingDetails } from './components/BookingConfirmationModal';
import { CLINIC_INFO, SERVICES, LOCATIONS } from './data/clinicData';
import { Service, ClinicLocation } from './types';
import { MessageCircle } from 'lucide-react';
import { openGoogleCalendarLimache, openGoogleCalendarVina } from './utils/googleCalendar';

export default function App() {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLocation, setBookingLocation] = useState<'vina' | 'limache'>('vina');
  const [bookingServiceId, setBookingServiceId] = useState('acupuntura');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ClinicLocation | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  // Listen for global confirmation triggers (e.g. from Google Calendar)
  useEffect(() => {
    const handleShowConfirmation = (e: Event) => {
      const customEvent = e as CustomEvent<BookingDetails>;
      if (customEvent.detail) {
        setConfirmedBooking(customEvent.detail);
      }
    };
    window.addEventListener('show-booking-confirmation', handleShowConfirmation);
    return () => {
      window.removeEventListener('show-booking-confirmation', handleShowConfirmation);
    };
  }, []);

  // Navigation helper with smooth scrolling
  const handleNavigateTo = (sectionId: string) => {
    const cleanId = sectionId.replace(/^#/, '');
    const el =
      document.getElementById(cleanId) ||
      (cleanId === 'terapeuta' || cleanId === 'terapeuta-certificada'
        ? document.getElementById('terapeuta-certificada') || document.getElementById('terapeuta')
        : null) ||
      (cleanId === 'horarios-sedes' || cleanId === 'horarios'
        ? document.getElementById('horarios-sedes') || document.getElementById('horarios')
        : null);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open official Google Calendar for Limache or Viña del Mar
  const handleOpenBooking = (locationId?: 'vina' | 'limache', _serviceId?: string) => {
    if (locationId === 'limache') {
      openGoogleCalendarLimache();
      return;
    }
    // Default to Viña del Mar Google Calendar
    openGoogleCalendarVina();
  };

  const handleSelectSpecialty = (label: string) => {
    // Match specialty to service if applicable
    const found = SERVICES.find(
      (s) =>
        s.title.toLowerCase().includes(label.toLowerCase()) ||
        label.toLowerCase().includes(s.title.toLowerCase())
    );
    if (found) {
      setSelectedService(found);
    } else {
      handleOpenBooking('vina');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col selection:bg-[#BDCF9A] selection:text-[#2D3618]">
      {/* Top sticky Navigation */}
      <Header onOpenBooking={() => handleOpenBooking()} onNavigateTo={handleNavigateTo} />

      {/* Main Landing Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking('vina')} onNavigateTo={handleNavigateTo} />

        {/* Floating Therapist Profile Card */}
        <TherapistCard onSelectSpecialty={handleSelectSpecialty} />

        {/* Holistic Services Section */}
        <ServicesSection
          onSelectService={(srv) => setSelectedService(srv)}
          onBookService={(srvId) => handleOpenBooking('vina', srvId)}
        />

        {/* Clinic Schedules and Locations (Viña del Mar & Limache) */}
        <ScheduleSection
          onOpenBooking={(locId) => handleOpenBooking(locId)}
          onOpenLocationModal={(loc) => setSelectedLocation(loc)}
        />

        {/* History and Mission Card */}
        <HistoryMission />

        {/* Patient Healing Stories / Testimonials */}
        <TestimonialsSection />

        {/* Contact Support Banner with direct WhatsApp */}
        <ContactBanner />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button on bottom right */}
      <aside className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${CLINIC_INFO.phoneClean}?text=${encodeURIComponent(
            'Hola María Ignacia, me comunico desde la web de Acupuntura del Valle para consultar por una hora.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
          title="Consultar por WhatsApp"
          id="floating-whatsapp-btn"
        >
          <MessageCircle className="w-5 h-5 fill-white stroke-none group-hover:rotate-12 transition-transform" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide hidden sm:inline">
            WhatsApp
          </span>
        </a>
      </aside>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialLocationId={bookingLocation}
        initialServiceId={bookingServiceId}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(srvId) => {
          setSelectedService(null);
          handleOpenBooking(undefined, srvId);
        }}
      />

      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onBook={(locId) => {
          setSelectedLocation(null);
          handleOpenBooking(locId);
        }}
      />

      {/* Booking Confirmation Modal (¡Cita Agendada con Éxito!) */}
      <BookingConfirmationModal
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        booking={confirmedBooking}
      />
    </div>
  );
}
