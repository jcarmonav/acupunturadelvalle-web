import { MessageCircle, Phone, Instagram } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export default function ContactBanner() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Blurred herbal/clinic backdrop card matching the screenshot */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D9E2C0] shadow-md p-8 sm:p-12 lg:p-14 text-center">
        {/* Background Image with blur and olive warm tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
            alt="Fondo de bienestar"
            className="w-full h-full object-cover filter blur-[6px] scale-105"
          />
          {/* Warm herbal wash */}
          <div className="absolute inset-0 bg-[#E8EED8]/85 backdrop-blur-xs" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Chat Icon in white circle matching screenshot */}
          <div className="w-14 h-14 rounded-full bg-white border border-[#D9E2C0] shadow-xs flex items-center justify-center mx-auto mb-5 text-[#56642B]">
            <MessageCircle className="w-7 h-7 stroke-[1.8]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D3618] tracking-tight mb-3">
            ¿Tienes dudas? Estamos aquí para ayudarte
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-[#46483C] leading-relaxed mb-7 font-normal">
            Nuestro equipo está disponible para responder cualquier pregunta sobre tus tratamientos o ayudarte a coordinar tu visita.
          </p>

          {/* Contact Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-7">
            {/* Phone */}
            <a
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
              id="contact-pill-phone"
            >
              <Phone className="w-3.5 h-3.5 text-[#56642B]" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            {/* Instagram */}
            <a
              href={CLINIC_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
              id="contact-pill-instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-[#56642B]" />
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={CLINIC_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
              id="contact-pill-facebook"
            >
              <svg className="w-3.5 h-3.5 text-[#56642B] fill-currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.2 22 12z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* TikTok */}
            <a
              href={CLINIC_INFO.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
              id="contact-pill-tiktok"
            >
              <svg className="w-3.5 h-3.5 text-[#56642B] fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <span>TikTok</span>
            </a>
          </div>

          {/* Prominent WhatsApp button matching screenshot */}
          <div>
            <a
              href={`https://wa.me/${CLINIC_INFO.phoneClean}?text=${encodeURIComponent('Hola María Ignacia, tengo una consulta sobre las terapias de Acupuntura del Valle.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              id="btn-whatsapp-banner"
            >
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              <span>Habla con nosotros por WhatsApp (+56 9 7911 9374)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
