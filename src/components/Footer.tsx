import { MessageCircle, Phone, Instagram } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export default function Footer() {
  return (
    <footer className="bg-[#ECEAE2] border-t border-[#D9E2C0] text-[#46483C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Bar matching screenshot */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-[#DCD9CE]">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#BDCF9A] flex items-center justify-center bg-white shadow-xs flex-shrink-0">
              <img
                src={CLINIC_INFO.logoUrl || "https://i.postimg.cc/rp2V9nSf/Logo.jpg"}
                alt="Logo Acupuntura del Valle"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-serif text-lg font-bold text-[#2D3618] tracking-tight">
                Acupuntura del Valle
              </span>
              <span className="hidden sm:inline text-[#B5B7A8]">|</span>
              <span className="hidden sm:inline text-xs text-[#6B7C41] font-medium">
                Medicina Tradicional China
              </span>
            </div>
          </div>

          {/* Contact & Social Links matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-[#56642B]">
            {/* Phone */}
            <a
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="flex items-center space-x-1.5 hover:text-[#2D3618] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#56642B]" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CLINIC_INFO.phoneClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-[#2D3618] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href={CLINIC_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-[#2D3618] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={CLINIC_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-[#2D3618] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.2 22 12z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* TikTok */}
            <a
              href={CLINIC_INFO.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-[#2D3618] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* Legal & Clinic locations info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#76786B] gap-4">
          <p className="text-center sm:text-left">
            Consultas en <strong>Viña del Mar</strong> (Diecinueve de Junio 1571) y <strong>Limache</strong> (Condell 115). Región de Valparaíso, Chile.
          </p>
          <p className="text-center sm:text-right">
            © 2026 Acupuntura del Valle. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
