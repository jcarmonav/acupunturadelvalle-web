import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface HeaderProps {
  onOpenBooking?: (locationId?: 'vina' | 'limache') => void;
  onNavigateTo: (sectionId: string) => void;
}

export default function Header({ onOpenBooking, onNavigateTo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateTo(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E5D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full" style={{ justifyContent: 'space-between' }}>
          {/* Brand Logo & Name (Aligned to the Left) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 group"
            id="brand-logo-link"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#BDCF9A] flex items-center justify-center shadow-xs group-hover:border-[#56642B] transition-colors bg-white flex-shrink-0">
              <img
                src={CLINIC_INFO.logoUrl || "/Logo.webp"}
                alt="Logo Acupuntura del Valle"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2D3618] block leading-none">
                Acupuntura del Valle
              </span>
              <span className="text-[11px] font-sans tracking-wider text-[#6B7C41] uppercase font-medium mt-1 block">
                Centro de Bienestar Integral
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-[#46483C]">
            <a
              href="#terapeuta-certificada"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('terapeuta-certificada');
              }}
              className="hover:text-[#2D3618] transition-colors cursor-pointer py-1"
              id="header-desktop-nav-terapeuta"
            >
              Terapeuta Certificada
            </a>
            <a
              href="#servicios"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('servicios');
              }}
              className="hover:text-[#2D3618] transition-colors cursor-pointer py-1"
              id="header-desktop-nav-servicios"
            >
              Servicios
            </a>
            <a
              href="#horarios"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('horarios');
              }}
              className="hover:text-[#2D3618] transition-colors cursor-pointer py-1"
              id="header-desktop-nav-horarios"
            >
              Horarios y Sedes
            </a>
            <a
              href="#historia"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('historia');
              }}
              className="hover:text-[#2D3618] transition-colors cursor-pointer py-1"
              id="header-desktop-nav-historia"
            >
              Historia y Misión
            </a>
            <a
              href="#historias"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('historias');
              }}
              className="hover:text-[#2D3618] transition-colors cursor-pointer py-1"
              id="header-desktop-nav-historias"
            >
              Historias de Sanación
            </a>
          </nav>

          {/* Right Controls: Hamburger Menu Icon (Aligned to the Right) */}
          <div className="flex items-center">
            {/* Menu Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#46483C] hover:text-[#2D3618] hover:bg-[#ECF0DE] transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              id="header-btn-toggle-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="bg-[#FAF9F5] border-b border-[#E7E5D9] px-4 sm:px-6 lg:px-8 pt-3 pb-6 shadow-md transition-all">
          <div className="max-w-7xl mx-auto">
            <nav className="flex flex-col space-y-2.5 font-medium text-[#46483C] pt-1">
              <a
                href="#terapeuta-certificada"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('terapeuta-certificada');
                }}
                className="text-left px-3.5 py-2 rounded-lg hover:bg-[#ECF0DE] hover:text-[#2D3618] transition-colors text-sm block cursor-pointer"
                id="drawer-nav-terapeuta"
              >
                Terapeuta Certificada
              </a>
              <a
                href="#servicios"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('servicios');
                }}
                className="text-left px-3.5 py-2 rounded-lg hover:bg-[#ECF0DE] hover:text-[#2D3618] transition-colors text-sm block cursor-pointer"
                id="drawer-nav-servicios"
              >
                Nuestros Servicios
              </a>
              <a
                href="#horarios"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('horarios');
                }}
                className="text-left px-3.5 py-2 rounded-lg hover:bg-[#ECF0DE] hover:text-[#2D3618] transition-colors text-sm block cursor-pointer"
                id="drawer-nav-horarios"
              >
                Horarios y Sedes (Viña & Limache)
              </a>
              <a
                href="#historia"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('historia');
                }}
                className="text-left px-3.5 py-2 rounded-lg hover:bg-[#ECF0DE] hover:text-[#2D3618] transition-colors text-sm block cursor-pointer"
                id="drawer-nav-historia"
              >
                Historia y Misión
              </a>
              <a
                href="#historias"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('historias');
                }}
                className="text-left px-3.5 py-2 rounded-lg hover:bg-[#ECF0DE] hover:text-[#2D3618] transition-colors text-sm block cursor-pointer"
                id="drawer-nav-historias"
              >
                Historias de Sanación
              </a>
            </nav>

            <div className="pt-4 mt-3 border-t border-[#E7E5D9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[#56642B] text-xs font-semibold">
              <a
                href={`tel:${CLINIC_INFO.phoneClean}`}
                className="inline-flex items-center space-x-2 text-[#46483C] hover:text-[#2D3618] transition-colors py-1"
                id="drawer-contact-phone"
              >
                <div className="w-7 h-7 rounded-full bg-[#ECF0DE] border border-[#BDCF9A] flex items-center justify-center text-[#56642B] flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-sm">{CLINIC_INFO.phone}</span>
              </a>

              <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-semibold py-1">
                <a
                  href={CLINIC_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D3618] hover:underline transition-colors"
                >
                  Instagram
                </a>
                <span className="text-[#C6C8B8]">|</span>
                <a
                  href={CLINIC_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D3618] hover:underline transition-colors"
                >
                  Facebook
                </a>
                <span className="text-[#C6C8B8]">|</span>
                <a
                  href={CLINIC_INFO.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D3618] hover:underline transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
