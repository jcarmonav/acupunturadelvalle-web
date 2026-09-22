import { CheckCircle2, Clock, MapPin, User, X, MessageCircle } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export interface BookingDetails {
  patientName: string;
  locationName: string;
  dateTime: string;
  serviceName?: string;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  booking,
}: BookingConfirmationModalProps) {
  if (!isOpen || !booking) return null;

  // Pre-formatted message for WhatsApp
  const whatsappMessage = `Hola, acabo de agendar una cita. Adjunto el resumen de mi reserva:
• Paciente: ${booking.patientName}
• Sede: ${booking.locationName}
• Fecha y Hora: ${booking.dateTime}
Quedo atento/a a su confirmación. ¡Muchas gracias!`;

  const whatsappUrl = `https://wa.me/${CLINIC_INFO.phoneClean}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E7E5D9] relative text-[#2D3618] animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888A7D] hover:text-[#2D3618] p-1.5 rounded-lg hover:bg-[#F6F5F0] transition-colors cursor-pointer"
          aria-label="Cerrar modal"
          id="btn-cerrar-confirmacion-x"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title with Official Logo */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2.5 mx-auto mb-3">
            <img
              src="/Logo.jpg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = CLINIC_INFO.logoUrl;
              }}
              alt="Acupuntura del Valle"
              className="w-13 h-13 rounded-full object-cover border-2 border-[#BDCF9A] shadow-xs bg-white"
            />
            <div className="w-13 h-13 rounded-full bg-[#EDF4E2] border-2 border-[#BDCF9A] flex items-center justify-center text-[#2D402B] shadow-xs">
              <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#2D402B] tracking-tight">
            Reserva Confirmada
          </h3>

          <p className="text-xs text-[#6A6C5D] mt-1.5 leading-relaxed">
            Tu cita en Acupuntura del Valle ha quedado confirmada en nuestro sistema de atención.
          </p>
        </div>

        {/* Resumen de la Cita */}
        <div className="bg-[#FAF9F5] border border-[#E4E2D8] rounded-xl p-4 mb-4 text-xs space-y-2.5">
          <div className="text-[11px] font-bold text-[#56642B] uppercase tracking-wider pb-1 border-b border-[#ECEAE0]">
            Resumen de la Cita
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[#ECEAE0]">
            <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-[#56642B]" />
              Nombre del Paciente:
            </span>
            <span className="font-semibold text-[#2D3618]">{booking.patientName}</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[#ECEAE0]">
            <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#56642B]" />
              Sede seleccionada:
            </span>
            <span className="font-semibold text-[#2D3618]">{booking.locationName}</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#56642B]" />
              Fecha y Hora agendada:
            </span>
            <span className="font-semibold text-[#244219] text-right">{booking.dateTime}</span>
          </div>
        </div>

        {/* Indicación de Puntualidad Destacada */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#F4F7EC] border border-[#BDCF9A] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E5EDD7] flex items-center justify-center flex-shrink-0 text-[#2D402B]">
            <Clock className="w-4 h-4 text-[#2D402B]" />
          </div>
          <p className="text-xs font-semibold text-[#2D402B] leading-snug">
            Por favor, procura llegar 5 minutos antes de tu hora agendada.
          </p>
        </div>

        {/* Acciones: Botón de WhatsApp y Botón de Cerrar */}
        <div className="space-y-2">
          {/* Botón de WhatsApp (#25D366) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-whatsapp-recordatorio"
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer no-underline"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Enviar recordatorio por WhatsApp</span>
          </a>

          {/* Botón de Cerrar */}
          <button
            type="button"
            onClick={onClose}
            id="btn-cerrar-confirmacion-modal"
            className="w-full py-2.5 px-4 rounded-xl bg-[#2D402B] hover:bg-[#1E2B1D] active:scale-[0.99] text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-2xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
