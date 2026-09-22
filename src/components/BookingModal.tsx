import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, AlertCircle, User, Sparkles, ChevronLeft, ChevronRight, ExternalLink, MessageCircle } from 'lucide-react';
import { LOCATIONS, SERVICES, CLINIC_INFO } from '../data/clinicData';
import { BookingFormData } from '../types';
import { openGoogleCalendarLimache, openGoogleCalendarVina } from '../utils/googleCalendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocationId?: 'vina' | 'limache';
  initialServiceId?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function BookingModal({
  isOpen,
  onClose,
  initialLocationId = 'vina',
  initialServiceId = 'acupuntura',
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    locationId: initialLocationId,
    serviceId: initialServiceId,
    date: '',
    timeSlot: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calendar month view state
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Sync state when modal is opened or location/service prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        locationId: initialLocationId,
        serviceId: initialServiceId || prev.serviceId,
        timeSlot: '',
        date: '',
      }));
      const now = new Date();
      setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setSubmitted(false);
      setErrorMessage('');
    }
  }, [isOpen, initialLocationId, initialServiceId]);

  if (!isOpen) return null;

  const currentLocation = LOCATIONS.find((l) => l.id === formData.locationId) || LOCATIONS[0];
  const currentService = SERVICES.find((s) => s.id === formData.serviceId) || SERVICES[0];
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al confirmar: desplazamiento automático hacia el borde superior
  useEffect(() => {
    if (submitted && modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
      try {
        modalContainerRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } catch {
        // Fallback
      }
    }
  }, [submitted]);

  // Determine available slots based on selected date and location
  const getSlotsForSelectedDate = (): string[] => {
    if (!formData.date) {
      return [];
    }

    const [y, m, d] = formData.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    if (formData.locationId === 'vina') {
      // Viña: Tuesday (2) or Thursday (4) -> 15:00 a 20:00 hrs
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        return ['15:00', '16:00', '17:00', '18:00', '19:00'];
      }
      return [];
    } else {
      // Limache: Friday (5: 16:00 - 19:00) or Saturday (6: 09:00 - 13:00)
      if (dayOfWeek === 5) {
        return ['16:00', '17:00', '18:00'];
      }
      if (dayOfWeek === 6) {
        return ['09:00', '10:00', '11:00', '12:00'];
      }
      return [];
    }
  };

  const availableSlots = getSlotsForSelectedDate();

  // Handle branch switch: reset date & time slot to enforce new valid selection
  const handleLocationChange = (newLocationId: 'vina' | 'limache') => {
    if (newLocationId !== formData.locationId) {
      setFormData((prev) => ({
        ...prev,
        locationId: newLocationId,
        date: '',
        timeSlot: '',
      }));
      setErrorMessage('');
    }
  };

  // Validate date selection
  const handleDateSelect = (selectedDateStr: string) => {
    if (!selectedDateStr) {
      setFormData((prev) => ({ ...prev, date: '', timeSlot: '' }));
      setErrorMessage('');
      return;
    }

    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    if (formData.locationId === 'vina' && dayOfWeek !== 2 && dayOfWeek !== 4) {
      setErrorMessage('En Viña del Mar, los días de atención son únicamente Martes y Jueves.');
      return;
    }

    if (formData.locationId === 'limache' && dayOfWeek !== 5 && dayOfWeek !== 6) {
      setErrorMessage('En Limache, los días de atención son únicamente Viernes y Sábados.');
      return;
    }

    setErrorMessage('');
    setFormData((prev) => ({ ...prev, date: selectedDateStr, timeSlot: '' }));
  };

  // Calendar month navigation
  const currentMonthDate = new Date();
  const isPastMonth =
    viewDate.getFullYear() < currentMonthDate.getFullYear() ||
    (viewDate.getFullYear() === currentMonthDate.getFullYear() &&
      viewDate.getMonth() <= currentMonthDate.getMonth());

  const handlePrevMonth = () => {
    if (isPastMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Calculate days for the month grid
  const viewYear = viewDate.getFullYear();
  const viewMonthIdx = viewDate.getMonth();
  const firstDayOfMonth = new Date(viewYear, viewMonthIdx, 1);
  const lastDayOfMonth = new Date(viewYear, viewMonthIdx + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Chilean / Latin American calendar starts on Monday (1):
  const rawFirstDay = firstDayOfMonth.getDay();
  const startDayOffset = rawFirstDay === 0 ? 6 : rawFirstDay - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper to get next 3 available dates for quick selection
  const getUpcomingAvailableDates = () => {
    const dates: { dateStr: string; label: string }[] = [];
    const cur = new Date();
    cur.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30 && dates.length < 3; i++) {
      const testDate = new Date(cur);
      testDate.setDate(cur.getDate() + i);
      const dow = testDate.getDay();
      const isValid =
        formData.locationId === 'vina'
          ? dow === 2 || dow === 4
          : dow === 5 || dow === 6;

      if (isValid) {
        const y = testDate.getFullYear();
        const m = String(testDate.getMonth() + 1).padStart(2, '0');
        const d = String(testDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const label = `${dayNames[dow]} ${testDate.getDate()} ${shortMonths[testDate.getMonth()]}`;
        dates.push({ dateStr, label });
      }
    }
    return dates;
  };

  const upcomingDates = getUpcomingAvailableDates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.patientPhone.trim()) {
      setErrorMessage('Por favor ingresa tu número de teléfono o WhatsApp.');
      return;
    }
    if (!formData.serviceId) {
      setErrorMessage('Por favor selecciona un servicio de la lista desplegable.');
      return;
    }
    if (!formData.date) {
      setErrorMessage('Por favor selecciona una fecha disponible en el calendario.');
      return;
    }

    const [y, m, d] = formData.date.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    if (formData.locationId === 'vina' && dayOfWeek !== 2 && dayOfWeek !== 4) {
      setErrorMessage('En Viña del Mar, los días de atención son únicamente Martes y Jueves.');
      return;
    }
    if (formData.locationId === 'limache' && dayOfWeek !== 5 && dayOfWeek !== 6) {
      setErrorMessage('En Limache, los días de atención son únicamente Viernes y Sábados.');
      return;
    }

    if (!formData.timeSlot) {
      setErrorMessage('Por favor selecciona un horario de atención.');
      return;
    }

    setErrorMessage('');
    setSubmitted(true);
  };

  const formatReservationDateTime = () => {
    if (formData.date) {
      const [y, m, d] = formData.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = dayNames[dateObj.getDay()];
      const monthName = MONTH_NAMES[dateObj.getMonth()];
      return `${dayName} ${d} de ${monthName} de ${y} a las ${formData.timeSlot} hrs`;
    }
    const defaultDays = formData.locationId === 'vina' ? 'Martes / Jueves' : 'Viernes / Sábado';
    return `${defaultDays} a las ${formData.timeSlot} hrs`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-5 bg-black/40 backdrop-blur-[2px] overflow-y-auto" style={{ paddingTop: '20px' }}>
      <div ref={modalContainerRef} className="bg-white rounded-xl max-w-lg w-full p-4 sm:p-5 shadow-lg border border-[#E9E7DF] relative mt-0 mb-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto text-[#2D3618] transition-all" style={{ marginTop: '0' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#888A7D] hover:text-[#2D3618] p-1 rounded-md hover:bg-[#F6F5F0] transition-colors cursor-pointer z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="overflow-y-auto max-h-[calc(92vh-80px)] pr-1 pb-7">
            {/* Header */}
            <div className="mb-3.5 pr-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D3618] tracking-tight">
                Agendamiento - Sede {currentLocation.name}
              </h3>
              <p className="text-xs text-[#737568] mt-0.5">
                Selecciona fecha y hora para registrar tu consulta.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3 p-2 rounded-lg bg-red-50/90 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs pb-4">
              {/* 1. Sede Selection (Minimalist Segmented Control) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-[#656758]">Sede de atención</span>
                  <span className="text-[10px] text-[#7A7C6E]">
                    {formData.locationId === 'vina' ? 'Martes y Jueves' : 'Viernes y Sábados'}
                  </span>
                </div>
                <div className="bg-[#F5F4EE] p-0.5 rounded-lg border border-[#E6E4DA] grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    id="btn-select-location-vina"
                    onClick={() => {
                      onClose();
                      openGoogleCalendarVina();
                    }}
                    className="py-1.5 px-2.5 rounded-md text-xs transition-all text-center cursor-pointer flex flex-col items-center justify-center text-[#2D402B] hover:bg-white/80 font-normal border border-dashed border-[#BDCF9A] bg-[#F2F7EB]"
                    title="Agendamiento en tiempo real con Google Calendar"
                  >
                    <div className="flex items-center gap-1 font-semibold text-[#2D402B]">
                      <Calendar className="w-3 h-3 text-[#2D402B]" />
                      <span>Viña del Mar (Google Calendar)</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </div>
                    <span className="text-[10px] text-[#4F5545] font-normal">
                      Tiempo real · Mar y Jue (15:00 - 20:00)
                    </span>
                  </button>

                  <button
                    type="button"
                    id="btn-select-location-limache"
                    onClick={() => {
                      onClose();
                      openGoogleCalendarLimache();
                    }}
                    className="py-1.5 px-2.5 rounded-md text-xs transition-all text-center cursor-pointer flex flex-col items-center justify-center text-[#2D402B] hover:bg-white/80 font-normal border border-dashed border-[#BDCF9A] bg-[#F2F7EB]"
                    title="Agendamiento en tiempo real con Google Calendar"
                  >
                    <div className="flex items-center gap-1 font-semibold text-[#2D402B]">
                      <Calendar className="w-3 h-3 text-[#2D402B]" />
                      <span>Limache (Google Calendar)</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </div>
                    <span className="text-[10px] text-[#4F5545] font-normal">
                      Tiempo real · Vie y Sáb
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Service Selection (Menú desplegable obligatorio con las 5 opciones) */}
              <div>
                <label htmlFor="select-servicio" className="text-[11px] font-medium text-[#656758] mb-1 flex items-center justify-between">
                  <span>Servicio</span>
                  <span className="text-[10px] text-red-600 font-semibold">* Requerido</span>
                </label>
                <select
                  id="select-servicio"
                  name="service"
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-[#2D3618] font-medium text-xs focus:border-[#56642B] focus:ring-1 focus:ring-[#56642B]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    -- Selecciona un servicio --
                  </option>
                  {SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} ({srv.price} · {srv.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Compact Calendar & Time Selector */}
              <div className="pt-2 border-t border-[#EFEFEA] space-y-2.5">
                {/* Fast Pick Chips (Discreet) */}
                {upcomingDates.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#7E8072] font-medium mr-0.5">Próximos cupos:</span>
                    {upcomingDates.map((up) => {
                      const isSelected = formData.date === up.dateStr;
                      return (
                        <button
                          type="button"
                          key={up.dateStr}
                          onClick={() => handleDateSelect(up.dateStr)}
                          className={`px-2 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#334017] text-white border-[#334017] font-medium shadow-2xs'
                              : 'bg-[#FCFBF8] border-[#E0DED4] text-[#404D1E] hover:bg-[#F2F7E8]'
                          }`}
                        >
                          {up.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Compact Stylized Calendar Card */}
                <div className="bg-[#FAF9F5] border border-[#E4E2D8] rounded-lg p-2 sm:p-2.5 shadow-2xs">
                  {/* Calendar Month Navigation Header */}
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <span className="font-serif font-bold text-xs text-[#2D3618] capitalize">
                      {MONTH_NAMES[viewMonthIdx]} {viewYear}
                    </span>
                    <div className="flex items-center space-x-0.5">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isPastMonth}
                        className={`p-1 rounded text-[#6E7060] transition-colors ${
                          isPastMonth ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#EAE8DD] cursor-pointer'
                        }`}
                        aria-label="Mes anterior"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 rounded text-[#6E7060] hover:bg-[#EAE8DD] transition-colors cursor-pointer"
                        aria-label="Mes siguiente"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weekdays Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[#8F9182] mb-1">
                    <span>Lu</span>
                    <span className={formData.locationId === 'vina' ? 'text-[#3E4D1A] font-semibold' : ''}>Ma</span>
                    <span>Mi</span>
                    <span className={formData.locationId === 'vina' ? 'text-[#3E4D1A] font-semibold' : ''}>Ju</span>
                    <span className={formData.locationId === 'limache' ? 'text-[#3E4D1A] font-semibold' : ''}>Vi</span>
                    <span className={formData.locationId === 'limache' ? 'text-[#3E4D1A] font-semibold' : ''}>Sá</span>
                    <span>Do</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Blank offset cells */}
                    {Array.from({ length: startDayOffset }).map((_, i) => (
                      <div key={`offset-${i}`} className="h-6 sm:h-7" />
                    ))}

                    {/* Active/Inactive Days */}
                    {Array.from({ length: totalDays }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateObj = new Date(viewYear, viewMonthIdx, dayNum);
                      dateObj.setHours(0, 0, 0, 0);

                      const isPast = dateObj < today;
                      const dayOfWeek = dateObj.getDay();

                      const isAllowedDay =
                        formData.locationId === 'vina'
                          ? dayOfWeek === 2 || dayOfWeek === 4
                          : dayOfWeek === 5 || dayOfWeek === 6;

                      const isSelectable = !isPast && isAllowedDay;
                      const mStr = String(viewMonthIdx + 1).padStart(2, '0');
                      const dStr = String(dayNum).padStart(2, '0');
                      const dayDateStr = `${viewYear}-${mStr}-${dStr}`;
                      const isSelected = formData.date === dayDateStr;

                      if (isSelectable) {
                        return (
                          <button
                            type="button"
                            key={dayDateStr}
                            onClick={() => handleDateSelect(dayDateStr)}
                            className={`h-6 sm:h-7 rounded text-[11px] flex items-center justify-center transition-all cursor-pointer font-medium relative ${
                              isSelected
                                ? 'bg-[#334017] text-white font-semibold shadow-2xs'
                                : 'bg-[#EDF4E2] text-[#2C3B12] hover:bg-[#DDEBCC] border border-[#CFDFB9]/70'
                            }`}
                            title={`Disponible: ${dayNum} de ${MONTH_NAMES[viewMonthIdx]}`}
                          >
                            <span>{dayNum}</span>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={`disabled-${dayNum}`}
                          className="h-6 sm:h-7 rounded text-[10px] flex items-center justify-center text-[#BDBFB2] opacity-35 select-none cursor-not-allowed"
                        >
                          <span>{dayNum}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Compact Legend */}
                  <div className="mt-1.5 pt-1.5 border-t border-[#EAE8DD] flex items-center justify-between text-[10px] text-[#7A7C6E]">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#526B25]" />
                      <span>Disponible ({formData.locationId === 'vina' ? 'Mar y Jue' : 'Vie y Sáb'})</span>
                    </div>
                    <span className="opacity-70">Atenuado: Sin atención</span>
                  </div>
                </div>

                {/* Time Slot Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#656758]">
                      Horario disponible:
                    </label>
                    {formData.date && (
                      <span className="text-[10px] text-[#3F4F19] font-medium">
                        Fecha: {formData.date}
                      </span>
                    )}
                  </div>

                  {formData.date ? (
                    availableSlots.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                        {availableSlots.map((slot) => {
                          const isSelected = formData.timeSlot === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => {
                                setFormData({ ...formData, timeSlot: slot });
                                setErrorMessage('');
                              }}
                              className={`py-1 px-1.5 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#334017] text-white border-[#334017] shadow-2xs'
                                  : 'bg-[#FCFBF8] border-[#E0DED4] text-[#2D3618] hover:bg-[#F2F7E8]'
                              }`}
                            >
                              <Clock className="w-2.5 h-2.5 inline mr-1 opacity-70" />
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-700 bg-amber-50/80 p-1.5 rounded border border-amber-200">
                        No hay horarios configurados para este día.
                      </p>
                    )
                  ) : (
                    <div className="py-1.5 px-2 rounded border border-dashed border-[#DDDBCF] bg-[#FCFBF8] text-center text-[#828475] text-[11px]">
                      Selecciona una fecha habilitada en el calendario para ver las horas.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Patient Information (Compact & Tidy) */}
              <div className="pt-2 border-t border-[#EFEFEA] space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#656758] mb-0.5 block">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carmen"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-xs focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#656758] mb-0.5 block">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Gloria Silva"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-xs focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#656758] mb-0.5 block">
                      Correo Electrónico (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="paciente@correo.cl"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-xs focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#656758] mb-0.5 block">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-xs focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#656758] mb-0.5 block">
                    Motivo de consulta (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Dolor lumbar, estrés, contractura..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDDBCF] bg-[#FCFBF8] text-xs focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons: Sticky / Accessible bottom footer with Blue Confirmation Button */}
              <div className="pt-3 pb-3 mt-4 flex items-center justify-end gap-2.5 border-t border-[#EFEFEA] sticky bottom-0 bg-white/95 backdrop-blur-xs z-20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-[#6E7062] hover:text-[#2D3618] hover:bg-[#F5F4EE] font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirmar-reserva"
                  className="px-5 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] active:scale-[0.98] text-white font-medium text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation View (¡Cita Agendada con Éxito!) */
          <div className="text-center py-2 sm:py-3">
            <div className="w-12 h-12 rounded-full bg-[#EDF4E2] border border-[#BDCF9A] flex items-center justify-center mx-auto mb-3 text-[#2D402B]">
              <CheckCircle className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D402B] mb-1">
              ¡Cita Agendada con Éxito!
            </h3>

            <p className="text-xs text-[#6A6C5D] max-w-sm mx-auto mb-3.5 leading-relaxed">
              Tu reserva ha quedado registrada en nuestro sistema de atención.
            </p>

            {/* Resumen de la Cita */}
            <div className="bg-[#FAF9F5] border border-[#E7E5D9] rounded-xl p-3.5 text-left mb-3.5 space-y-2 text-xs shadow-2xs max-w-sm mx-auto">
              <div className="text-[11px] font-bold text-[#56642B] uppercase tracking-wider pb-1 border-b border-[#ECEAE0]">
                Resumen de la Cita
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-[#ECEAE0]">
                <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-[#56642B]" />
                  Nombre del Paciente:
                </span>
                <span className="font-semibold text-[#2D3618]">{formData.patientName}</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-[#ECEAE0]">
                <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#56642B]" />
                  Servicio:
                </span>
                <span className="font-semibold text-[#2D3618]">{currentService?.title || 'Acupuntura'}</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-[#ECEAE0]">
                <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#56642B]" />
                  Sede seleccionada:
                </span>
                <span className="font-semibold text-[#2D3618]">{currentLocation.name}</span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[#6A6C5D] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#56642B]" />
                  Fecha y Hora agendada:
                </span>
                <span className="font-semibold text-[#244219] text-right">{formatReservationDateTime()}</span>
              </div>
            </div>

            {/* Indicación de puntualidad destacada */}
            <div className="mb-4 p-3 rounded-xl bg-[#F4F7EC] border border-[#BDCF9A] flex items-center gap-2 max-w-sm mx-auto text-left">
              <div className="w-6 h-6 rounded-full bg-[#E5EDD7] flex items-center justify-center flex-shrink-0 text-[#2D402B]">
                <Clock className="w-3.5 h-3.5 text-[#2D402B]" />
              </div>
              <p className="text-xs font-semibold text-[#2D402B] leading-snug">
                Por favor, procura llegar 5 minutos antes de tu hora agendada.
              </p>
            </div>

            {/* Acciones: Botón de WhatsApp (#25D366) y Botón de Cerrar */}
            <div className="w-full max-w-sm mx-auto space-y-2">
              <a
                href={`https://wa.me/${CLINIC_INFO.phoneClean}?text=${encodeURIComponent(
                  `Hola, acabo de agendar una cita. Adjunto el resumen de mi reserva:\n• Paciente: ${formData.patientName}\n• Servicio: ${currentService?.title || 'Acupuntura'}\n• Sede: ${currentLocation.name}\n• Fecha y Hora: ${formatReservationDateTime()}\nQuedo atento/a a su confirmación. ¡Muchas gracias!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-whatsapp-recordatorio-modal"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer no-underline"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Enviar recordatorio por WhatsApp</span>
              </a>

              <button
                type="button"
                id="btn-cerrar-confirmacion"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2D402B] hover:bg-[#1E2B1D] active:scale-[0.99] text-white font-semibold text-xs tracking-wide uppercase shadow-2xs transition-all cursor-pointer block"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
