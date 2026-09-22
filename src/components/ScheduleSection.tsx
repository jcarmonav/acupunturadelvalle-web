import { LOCATIONS } from '../data/clinicData';
import { ClinicLocation } from '../types';
import { Calendar, MapPin, ExternalLink, Camera, CheckCircle2 } from 'lucide-react';
import { openGoogleCalendarLimache, openGoogleCalendarVina } from '../utils/googleCalendar';

interface ScheduleSectionProps {
  onOpenBooking: (locationId: 'vina' | 'limache') => void;
  onOpenLocationModal: (location: ClinicLocation) => void;
}

export default function ScheduleSection({ onOpenBooking, onOpenLocationModal }: ScheduleSectionProps) {
  return (
    <section id="horarios" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-mt-24 relative">
      {/* Anchor for smooth scroll targeting */}
      <div id="horarios-sedes" className="absolute -top-24 left-0 pointer-events-none" />
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-block px-3.5 py-1 rounded-full bg-[#ECF0DE] border border-[#D9E2C0] text-[#56642B] text-xs font-semibold uppercase tracking-wider mb-3">
          Temporada 2026
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3618] tracking-tight">
          Horarios de Atención
        </h2>

        {/* Decorative olive underline matching screenshot */}
        <div className="w-12 h-0.5 bg-[#8A9A5B] mx-auto my-3 rounded-full" />

        <p className="font-sans text-sm sm:text-base text-[#46483C] leading-relaxed">
          Encuéntranos en nuestras dos cómodas consultas para acompañarte en tu proceso de sanación.
        </p>
      </div>

      {/* Two Location Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {LOCATIONS.map((location) => {
          const isLimache = location.id === 'limache';

          return (
            <div
              key={location.id}
              className="bg-white rounded-2xl border border-[#E7E5D9] shadow-sm overflow-hidden flex flex-col justify-between location-schedule-card relative group"
              id={`card-location-${location.id}`}
            >
              {/* Card Image with Badge */}
              <div className="relative h-56 sm:h-64 overflow-hidden group">
                <img
                  src={location.imageUrl}
                  alt={location.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500"
                  style={{
                    filter: 'blur(6px)',
                    transform: 'scale(1.08)',
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                
                {/* Photo Badge in Bottom Right corner - crisp and high z-index */}
                <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-xs text-[#56642B] border border-[#D9E2C0] text-xs font-semibold flex items-center space-x-1.5 shadow-md">
                  <Camera className="w-3.5 h-3.5 text-[#56642B] flex-shrink-0" />
                  <span>Consulta {location.name}</span>
                </div>
              </div>

              {/* Location Details Container */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Bar: Icon, Name, Type, Year Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#ECF0DE] border border-[#BDCF9A] flex items-center justify-center text-[#56642B] flex-shrink-0 mt-0.5 transition-transform duration-300 ease-out group-hover:scale-110">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-[#2D3618] leading-tight">
                          {location.name}
                        </h3>
                        <p className="text-xs text-[#46483C] mt-1 flex items-center gap-1 font-normal">
                          <span>📍</span> {location.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4F3EC] border border-[#E1E1C9] text-[#5E604D] text-xs font-semibold">
                        {location.yearBadge}
                      </span>
                    </div>
                  </div>

                  {/* Google Maps Link */}
                  <div className="mb-6 pl-13">
                    <a
                      href={location.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-[#56642B] hover:text-[#2D3618] font-medium hover:underline cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>

                  {/* Main Booking Button (Replaces the fixed schedule boxes) */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F6F8EF] border border-[#D9E2C0]">
                    {isLimache ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => openGoogleCalendarLimache()}
                          className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center space-x-2.5 cursor-pointer bg-[#2D402B] hover:bg-[#1E2B1D] text-white"
                          id="btn-agendar-limache"
                        >
                          <Calendar className="w-5 h-5 text-white flex-shrink-0" />
                          <span>Agendar Cita en Limache</span>
                        </button>

                        <div className="mt-2.5 flex items-center justify-center space-x-1.5 text-xs text-[#46483C]">
                          <span className="w-2 h-2 rounded-full bg-[#2D402B] animate-pulse flex-shrink-0"></span>
                          <span className="font-medium text-[#2D3618]">
                            {location.googleCalendarHours}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#E2EBD0] grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#4F5545]">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D402B] flex-shrink-0" />
                            <span>Bloqueo automático de horas ocupadas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D402B] flex-shrink-0" />
                            <span>Confirmación inmediata por correo</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => openGoogleCalendarVina()}
                          className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center space-x-2.5 cursor-pointer bg-[#2D402B] hover:bg-[#1E2B1D] text-white"
                          id="btn-agendar-vina"
                        >
                          <Calendar className="w-5 h-5 text-white flex-shrink-0" />
                          <span>Agendar Cita en Viña del Mar</span>
                        </button>

                        <div className="mt-2.5 flex items-center justify-center space-x-1.5 text-xs text-[#46483C]">
                          <span className="w-2 h-2 rounded-full bg-[#2D402B] animate-pulse flex-shrink-0"></span>
                          <span className="font-medium text-[#2D3618]">
                            {location.googleCalendarHours}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#E2EBD0] grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#4F5545]">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D402B] flex-shrink-0" />
                            <span>Bloqueo automático de horas ocupadas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D402B] flex-shrink-0" />
                            <span>Confirmación inmediata por correo</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services Available in this Location */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#56642B] mb-2.5">
                      SERVICIOS DISPONIBLES EN SEDE:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {location.servicesAvailable.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] text-xs font-medium"
                        >
                          🌿 {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
