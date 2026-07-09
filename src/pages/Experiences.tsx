import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { Sparkles, ArrowRight, X, Clock, HelpCircle, Check, Award } from 'lucide-react';
import { ExperienceTemplate } from '../types';

interface ExperiencesProps {
  onOpenInquiry: (type?: string) => void;
}

export const Experiences: React.FC<ExperiencesProps> = ({ onOpenInquiry }) => {
  const { experiences } = useDatabase();
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

  const activeExp = experiences.find((e) => e.id === selectedExpId) || null;

  return (
    <div id="experiences-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-16">
      
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D0542D]">
          <Award size={14} />
          <span>The Concepts</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Curated Experiences
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          Intimate, scalable, modular blueprints designed by our artists, ready to be booked for brand takeovers, corporate networks, or elite private events.
        </p>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Cards List */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => {
            const isSelected = selectedExpId === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpId(isSelected ? null : exp.id)}
                className={`group rounded-[32px] border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#2F3B3B] bg-[#2F3B3B] text-[#FFEDB7] shadow-xl'
                    : 'border-[#685B53]/25 bg-white text-[#2F3B3B] hover:border-[#685B53]'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#2F3B3B]/10"></div>
                </div>

                <div className="p-6 space-y-3">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-[#4ABA94] text-[#2F3B3B]' : 'bg-[#4ABA94]/15 text-[#2F3B3B]'
                  }`}>
                    Concept Template
                  </span>
                  <h3 className="font-display font-black text-lg tracking-tight leading-tight mt-1">{exp.title}</h3>
                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-[#FFEDB7]/75' : 'text-[#685B53]'}`}>
                    {exp.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Concept Sensory Dashboard */}
        <div className="lg:col-span-6">
          {activeExp ? (
            <div className="bg-white rounded-[40px] border-2 border-[#685B53] p-6 md:p-8 space-y-6 shadow-xl sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-[#D0542D]">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Template</span>
                  </div>
                  <h2 className="font-display font-black text-3xl text-[#2F3B3B] tracking-tight mt-1">
                    {activeExp.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedExpId(null)}
                  className="p-1.5 rounded-full hover:bg-[#685B53]/10 text-[#685B53] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tagline */}
              <p className="font-display italic font-extrabold text-[#D0542D] text-lg leading-tight">
                “{activeExp.tagline}”
              </p>

              {/* Description */}
              <p className="text-xs text-[#685B53] leading-relaxed">
                {activeExp.description}
              </p>

              {/* Vibe Profile bento box */}
              <div className="bg-[#FFEDB7]/60 p-5 rounded-2xl border border-[#685B53]/15 space-y-3">
                <span className="text-[9px] font-black text-[#2F3B3B] uppercase tracking-widest block">Sensory Signature</span>
                <p className="text-xs text-[#685B53] leading-relaxed">{activeExp.vibeDescription}</p>
                
                {/* Keywords Capsule tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeExp.vibeKeywords.map((kw) => (
                    <span key={kw} className="bg-[#2F3B3B] text-[#FFEDB7] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#685B53]/20">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs & highlights */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#685B53]/10 py-3.5">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#4ABA94] shrink-0" />
                    <div>
                      <span className="text-[9px] text-[#685B53] uppercase block">Standard Duration</span>
                      <strong className="text-[#2F3B3B]">{activeExp.duration}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-[#D0542D] shrink-0" />
                    <div>
                      <span className="text-[9px] text-[#685B53] uppercase block">Typical Curation Fee</span>
                      <strong className="text-[#2F3B3B] text-[10px] truncate">{activeExp.pricingInfo}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#2F3B3B]">Execution Highlights</h4>
                  <ul className="space-y-2">
                    {activeExp.highlights.map((h, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-[#685B53]">
                        <Check size={14} className="text-[#4ABA94] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={() => onOpenInquiry('Custom')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-all group duration-200"
              >
                Request Experience Curation
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>

            </div>
          ) : (
            <div className="bg-white/40 rounded-[40px] border-2 border-dashed border-[#685B53]/25 sticky top-24 p-12 text-center flex flex-col justify-center items-center h-96 space-y-3">
              <Sparkles className="text-[#685B53]/40 animate-pulse" size={32} />
              <h4 className="font-display font-bold text-[#2F3B3B] text-base">Sensory Signature Box</h4>
              <p className="text-xs text-[#685B53] max-w-xs leading-relaxed">
                Click on any of our template concepts on the left to unbox its complete sensory profile, vibe keywords, duration metrics, execution highlights, and co-curation fees.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
