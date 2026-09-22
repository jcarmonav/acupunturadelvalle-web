import { HISTORY_MISSION } from '../data/clinicData';
import { Flag } from 'lucide-react';

export default function HistoryMission() {
  return (
    <section id="historia" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-[#E7E5D9] shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#ECF0DE]/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#ECF0DE]/50 blur-2xl pointer-events-none" />

        {/* Historia Title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3618] tracking-tight">
          {HISTORY_MISSION.title}
        </h2>

        {/* Decorative olive underline matching screenshot */}
        <div className="w-12 h-0.5 bg-[#8A9A5B] mx-auto my-3.5 rounded-full" />

        {/* Historia Text */}
        <p className="font-sans text-sm sm:text-base text-[#46483C] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          {HISTORY_MISSION.history}
        </p>

        {/* Decorative Flag / Icon in circle */}
        <div className="w-12 h-12 rounded-full bg-[#F4F3EC] border border-[#D9E2C0] flex items-center justify-center mx-auto mb-3 text-[#56642B] shadow-2xs">
          <Flag className="w-5 h-5 fill-[#56642B]/20 stroke-[#56642B] stroke-[1.8]" />
        </div>

        {/* Misión Title */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D3618] mb-2">
          {HISTORY_MISSION.missionTitle}
        </h3>

        {/* Misión Text */}
        <p className="font-sans text-sm sm:text-base text-[#46483C] max-w-xl mx-auto leading-relaxed font-normal">
          {HISTORY_MISSION.mission}
        </p>
      </div>
    </section>
  );
}
