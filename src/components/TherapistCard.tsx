import { THERAPIST_INFO } from '../data/clinicData';

interface TherapistCardProps {
  onSelectSpecialty?: (specialty: string) => void;
}

export default function TherapistCard({ onSelectSpecialty }: TherapistCardProps) {
  return (
    <section
      id="terapeuta-certificada"
      className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16 sm:mb-24 scroll-mt-24"
    >
      {/* Anchor alias for backwards compatibility */}
      <span id="terapeuta" className="absolute -top-24 pointer-events-none" />
      <div className="bg-white rounded-2xl border border-[#E7E5D9] shadow-lg p-6 sm:p-8 lg:p-10 transition-all hover:shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar and Certificate Badge */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#ECF0DE] shadow-sm">
                <img
                  src={THERAPIST_INFO.photoUrl}
                  alt={THERAPIST_INFO.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Tag directly below avatar matching screenshot */}
            <div className="mt-3 px-3 py-1 rounded-full bg-[#ECF0DE] border border-[#BDCF9A]/70 text-[#424E23] text-xs font-semibold text-center tracking-tight">
              {THERAPIST_INFO.badgeBottom}
            </div>
          </div>

          {/* Bio and Info details */}
          <div className="flex-1 text-center md:text-left">
            {/* Top Accreditation Badge */}
            <div className="inline-block px-3.5 py-1 rounded-md bg-[#F4F3EC] border border-[#E1E1C9] text-[#5E604D] text-xs font-medium tracking-wide mb-3">
              {THERAPIST_INFO.badgeTop}
            </div>

            {/* Therapist Name */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3618] tracking-tight mb-3">
              {THERAPIST_INFO.name}
            </h2>

            {/* Bio Paragraph */}
            <p className="font-sans text-sm sm:text-base text-[#46483C] leading-relaxed mb-6 font-normal">
              {THERAPIST_INFO.bio}
            </p>

            {/* Specialties & Clinical Therapies */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#56642B] mb-3">
                {THERAPIST_INFO.specialtiesHeading}
              </h3>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5">
                {THERAPIST_INFO.specialties.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSpecialty?.(item.label)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#BDCF9A] hover:bg-[#ECF0DE] hover:border-[#8A9A5B] text-[#2D3618] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
