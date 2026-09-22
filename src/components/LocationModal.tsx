import { ClinicLocation } from '../types';
import { X, MapPin, Calendar, ExternalLink, Clock, Navigation, Camera } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface LocationModalProps {
  location: ClinicLocation | null;
  onClose: () => void;
  onBook: (locationId: 'vina' | 'limache') => void;
}

export default function LocationModal({ location, onClose, onBook }: LocationModalProps) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5D9] relative animate-in fade-in zoom-in-95 duration-200 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#76786B] hover:text-[#2D3618] p-1.5 rounded-full hover:bg-[#F4F3EC] transition-colors cursor-pointer z-10 bg-white/80"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Location Image */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-5 border border-[#E7E5D9]">
          <img
            src={location.imageUrl}
            alt={location.imageAlt}
            className="w-full h-full object-cover"
            style={{
              filter: 'blur(6px)',
              transform: 'scale(1.08)',
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-xs text-[#56642B] border border-[#D9E2C0] text-xs font-semibold flex items-center space-x-1.5 shadow-md">
            <Camera className="w-3.5 h-3.5 text-[#56642B] flex-shrink-0" />
            <span>Consulta {location.name}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#56642B] uppercase tracking-wider">
              {location.typeLabel}
            </span>
            <span className="text-xs text-[#9FA094]">•</span>
            <span className="text-xs text-[#5E604D]">Temporada {location.yearBadge}</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3618]">
            Sede {location.name}
          </h3>
          <p className="text-sm text-[#46483C] flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-[#56642B] flex-shrink-0" />
            <span>{location.address}</span>
          </p>
        </div>

        {/* Directions & Access */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E7E5D9] text-xs text-[#46483C] leading-relaxed mb-5 flex items-start gap-2.5">
          <Navigation className="w-4 h-4 text-[#56642B] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#2D3618] block mb-0.5">Cómo llegar y entorno:</span>
            <span>{location.directions}</span>
          </div>
        </div>

        {/* Schedules */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#56642B] mb-2.5">
            Días y Horarios de Atención:
          </h4>
          <div className="space-y-2">
            {location.schedules.map((sched, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#F2FBF9] border border-[#D5EFEA] text-xs text-[#1D4A41]"
              >
                <div className="flex items-center space-x-2 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#2E7A6B]" />
                  <span>{sched.day}</span>
                </div>
                <span className="font-bold">{sched.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0EFEA]">
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#BDCF9A] text-[#2D3618] hover:bg-[#ECF0DE] text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <span>Abrir en Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#56642B]" />
          </a>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-3.5 py-2.5 rounded-lg border border-[#D9E2C0] text-[#5E604D] text-xs font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(location.id);
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-lg bg-[#56642B] hover:bg-[#465322] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar en {location.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
