import { SERVICES } from '../data/clinicData';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
  onBookService?: (serviceId: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const topRow = SERVICES.slice(0, 3);
  const bottomRow = SERVICES.slice(3, 5);

  return (
    <section id="servicios" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-block px-3.5 py-1 rounded-full bg-[#ECF0DE] border border-[#D9E2C0] text-[#56642B] text-xs font-semibold uppercase tracking-wider mb-3">
          TRATAMIENTOS HOLÍSTICOS
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3618] tracking-tight">
          Nuestros Servicios
        </h2>

        {/* Decorative olive underline matching screenshot */}
        <div className="w-12 h-0.5 bg-[#8A9A5B] mx-auto my-3 rounded-full" />

        <p className="font-sans text-sm sm:text-base text-[#46483C] leading-relaxed">
          Técnicas terapéuticas orientadas a sanar el origen del dolor y restaurar el bienestar integral del cuerpo y la mente.
        </p>
      </div>

      {/* Top row: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {topRow.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="group bg-white rounded-2xl p-7 border border-[#E7E5D9] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-[#BDCF9A]"
            id={`card-service-${service.id}`}
          >
            <div>
              {/* Circular Treatment Photograph Thumbnail */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#D9E2C0] shadow-xs group-hover:border-[#8A9A5B] group-hover:scale-105 transition-all duration-300 bg-[#FAF9F5] flex-shrink-0">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt || service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tag / Badge */}
              <div className="text-center mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F4F3EC] border border-[#E1E1C9] text-[#5E604D] text-[11px] font-medium tracking-wide">
                  {service.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-center text-[#2D3618] mb-3 group-hover:text-[#56642B] transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#46483C] text-center leading-relaxed font-normal">
                {service.description}
              </p>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-[#F0EFEA] flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#56642B] group-hover:text-[#2D3618] group-hover:underline transition-colors py-0.5">
                Ver detalles y beneficios <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: 2 cards centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {bottomRow.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="group bg-white rounded-2xl p-7 border border-[#E7E5D9] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-[#BDCF9A]"
            id={`card-service-${service.id}`}
          >
            <div>
              {/* Circular Treatment Photograph Thumbnail */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#D9E2C0] shadow-xs group-hover:border-[#8A9A5B] group-hover:scale-105 transition-all duration-300 bg-[#FAF9F5] flex-shrink-0">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt || service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tag / Badge */}
              <div className="text-center mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F4F3EC] border border-[#E1E1C9] text-[#5E604D] text-[11px] font-medium tracking-wide">
                  {service.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-center text-[#2D3618] mb-3 group-hover:text-[#56642B] transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#46483C] text-center leading-relaxed font-normal">
                {service.description}
              </p>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-[#F0EFEA] flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#56642B] group-hover:text-[#2D3618] group-hover:underline transition-colors py-0.5">
                Ver detalles y beneficios <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
