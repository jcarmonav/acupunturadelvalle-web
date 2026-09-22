interface HeroProps {
  onOpenBooking?: () => void;
  onNavigateTo?: (sectionId: string) => void;
}

export default function Hero({ onOpenBooking, onNavigateTo }: HeroProps) {
  const handleScrollToSchedule = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateTo) {
      onNavigateTo('horarios-sedes');
      return;
    }
    const target = document.getElementById('horarios-sedes') || document.getElementById('horarios');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image: Centro Acupuntura del Valle */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.postimg.cc/v8ntDD0q/Centro-Vina.png"
          alt="Centro Acupuntura del Valle - Viña del Mar"
          className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[0.98]"
          referrerPolicy="no-referrer"
        />
        {/* Soft daylight ambient overlay preserving photographic depth while ensuring legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5]/85 via-[#FAF9F5]/65 to-[#FAF9F5]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24">
        {/* Decorative subtle badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ECF0DE]/90 border border-[#D9E2C0] text-[#56642B] text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#56642B] animate-pulse"></span>
          <span>Espacio de Sanación & Medicina China</span>
        </div>

        {/* Main Display Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D3618] tracking-tight leading-[1.18] mb-6">
          Bienvenido a este centro de <br className="hidden sm:inline" />
          <span className="text-[#56642B] italic font-normal">Bienestar Integral</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg lg:text-xl text-[#3A4033] max-w-2xl mx-auto leading-relaxed font-normal mb-9">
          Restaura tu equilibrio natural y renueva tu energía con terapias personalizadas de acupuntura y medicina tradicional china.
        </p>

        {/* Action Buttons: Reserva tu cita & Explorar Terapias */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#horarios-sedes"
            onClick={handleScrollToSchedule}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#56642B] hover:bg-[#465322] active:scale-[0.98] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-center inline-block"
            id="hero-btn-reserva"
          >
            Reserva tu cita
          </a>
          
          <a
            href="#servicios"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#FAF9F5]/80 hover:bg-[#FAF9F5] border border-[#BDCF9A] text-[#2D3618] font-medium text-sm transition-all text-center cursor-pointer"
            id="hero-btn-terapias"
          >
            Explorar Terapias
          </a>
        </div>
      </div>
    </section>
  );
}
