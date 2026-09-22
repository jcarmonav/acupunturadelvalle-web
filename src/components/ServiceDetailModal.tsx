import { Service } from '../types';
import { X, Check, Clock, Sparkles, CreditCard } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onBook?: (serviceId: string) => void;
}

export default function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5D9] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#76786B] hover:text-[#2D3618] p-1.5 rounded-full hover:bg-[#F4F3EC] transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#BDCF9A] shadow-xs flex-shrink-0 bg-[#ECF0DE]">
            {service.imageUrl ? (
              <img
                src={service.imageUrl}
                alt={service.imageAlt || service.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#56642B]">
                <Sparkles className="w-7 h-7" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F4F3EC] text-[#5E604D] text-xs font-semibold">
                {service.badge}
              </span>
              {service.subtitle && (
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#ECF0DE] text-[#424E23] text-xs font-medium">
                  {service.subtitle}
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3618] leading-tight">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Long Description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#56642B] mb-2">
            ¿En qué consiste el tratamiento?
          </h4>
          <p className="font-sans text-sm text-[#46483C] leading-relaxed">
            {service.longDescription}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#56642B] mb-3">
            Beneficios Principales
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {service.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-[#2D3618]">
                <div className="w-4 h-4 rounded-full bg-[#ECF0DE] text-[#56642B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN DESTACADA: Valor Oficial y Duración de la Sesión */}
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#F4F7EC] via-[#FAF9F5] to-[#F4F7EC] border border-[#D9E2C0] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-around gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECF0DE] border border-[#BDCF9A] flex items-center justify-center text-[#46571F] flex-shrink-0">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687747] block">
                  Duración de la Sesión
                </span>
                <span className="font-sans text-sm sm:text-base font-bold text-[#2D3618]">
                  {service.duration}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-[#D9E2C0]" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECF0DE] border border-[#BDCF9A] flex items-center justify-center text-[#46571F] flex-shrink-0">
                <CreditCard className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687747] block">
                  Valor del Tratamiento
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-lg sm:text-xl font-extrabold text-[#2D3618]">
                    {service.price}
                  </span>
                  <span className="text-xs font-semibold text-[#56642B]">CLP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indications */}
        <div className="mb-6 p-4 rounded-xl bg-[#FAF9F5] border border-[#E7E5D9]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#56642B] mb-2">
            Recomendado para:
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {service.indications.map((ind, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white border border-[#D9E2C0] text-[#3E4C16] text-xs font-medium"
              >
                • {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions - Solo botón Volver */}
        <div className="flex items-center justify-end pt-4 border-t border-[#F0EFEA]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#D9E2C0] text-[#46483C] hover:text-[#2D3618] hover:bg-[#F4F3EC] hover:border-[#BDCF9A] text-sm font-medium transition-colors cursor-pointer text-center"
            id="modal-btn-volver"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
