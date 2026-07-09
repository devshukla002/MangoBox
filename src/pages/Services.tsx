import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { ArrowUpRight, Sparkles, X, ChevronRight, CheckCircle } from 'lucide-react';

interface ServicesProps {
  onOpenInquiry: (type?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenInquiry }) => {
  const { services } = useDatabase();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const activeService = services.find((s) => s.id === selectedServiceId) || null;

  // Curated package parameters representing case work or specs
  const getServiceSpecs = (slug: string) => {
    switch (slug) {
      case 'club-nightlife':
        return [
          'Full-scale visual rigging and mapping systems',
          'Intelligent sonic alignments (3-way active arrays)',
          'Lineup programming (Techno, House, experimental rosters)',
          'Guestlist and biometric gate security blueprints',
          'Atmospheric water-hazers and sensory laser alignments'
        ];
      case 'corporate-summits':
        return [
          'High-end keynotes and custom scenic stages',
          'Synchronous live-streaming and high-def broadcast AV',
          'Curated interactive botanical networking zones',
          'Organic farm-to-table culinary and craft pairing stations',
          'Intellectual panels and custom acoustic discussion rings'
        ];
      case 'brand-activations':
        return [
          'Interactive kinetic retail setups & popup builds',
          'Floating kinetic fabric rigs & 3D projection meshes',
          'Social-amplified scenic backdrops and studios',
          'Custom molecular mocktail and cocktail programs',
          'Sensory keycard triggers and RFID check-in integrations'
        ];
      case 'artist-booking':
        return [
          'Contracts, booking riders, and travel administration',
          'Professional on-site hospitality and stage managers',
          'Acoustic soundchecks and premium gear riders',
          'Multi-artist festival schedules and slot curations',
          'Post-event media kits and visual performance loops'
        ];
      case 'private-celebrations':
        return [
          'Chief Experience Director bespoke conceptual blueprints',
          'Elite gastronomical planning and private winery flights',
          'Candlelit spatial setups with imported olive trees',
          'Bespoke theatrical ambient performers',
          'Hand-calligraphed invite systems and VIP security'
        ];
      default:
        return [
          'Tactile manual crafting supplies and materials',
          'Intimate listening circles and acoustic spotlight rigs',
          'Local specialty coffee and matcha roasters coordination',
          'Kiln firing and custom home shipping services',
          'Intimate high-interaction crowd layouts'
        ];
    }
  };

  return (
    <div id="services-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-16">
      
      {/* Header section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#4ABA94]">
          <Sparkles size={14} />
          <span>Experiential Design</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Curation Capabilities
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          We don\'t do basic checklists. We approach events as comprehensive design puzzles where visual and spatial elements work together to forge indelible memories.
        </p>
      </section>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Service list cards */}
        <div className="lg:col-span-7 space-y-4">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <button
                key={service.id}
                id={`service-card-btn-${service.id}`}
                onClick={() => setSelectedServiceId(isSelected ? null : service.id)}
                className={`w-full text-left p-6 md:p-8 rounded-3xl border transition-all duration-300 flex items-center justify-between gap-6 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2F3B3B] text-[#FFEDB7] border-[#2F3B3B] shadow-lg'
                    : 'bg-white text-[#2F3B3B] border-[#685B53]/15 hover:border-[#4ABA94] hover:shadow-sm'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      isSelected ? 'bg-[#4ABA94] text-[#2F3B3B]' : 'bg-[#4ABA94]/15 text-[#2F3B3B]'
                    }`}>
                      {service.category}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl tracking-tight">
                    {service.title}
                  </h3>
                  <p className={`text-xs max-w-xl leading-relaxed ${isSelected ? 'text-[#FFEDB7]/80' : 'text-[#685B53]'}`}>
                    {service.description}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className={`shrink-0 transition-transform duration-300 ${
                    isSelected ? 'rotate-90 text-[#4ABA94]' : 'text-[#685B53]/50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Detail Panel */}
        <div className="lg:col-span-5">
          {activeService ? (
            <div className="bg-white rounded-[32px] border-2 border-[#685B53] overflow-hidden sticky top-24 p-6 md:p-8 space-y-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#685B53]/15">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D0542D] block">Curation Specifications</span>
                <h3 className="font-display font-black text-2xl text-[#2F3B3B] tracking-tight">{activeService.title}</h3>
                <p className="text-xs text-[#685B53] leading-relaxed pt-2 border-t border-[#685B53]/10">
                  {activeService.longDescription}
                </p>
              </div>

              {/* Specs Check List */}
              <div className="space-y-3 pt-3 border-t border-[#685B53]/10">
                <h4 className="text-[11px] font-bold text-[#2F3B3B] uppercase tracking-wider">What We Provide</h4>
                <ul className="space-y-2">
                  {getServiceSpecs(activeService.slug).map((spec, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-[#685B53]">
                      <CheckCircle size={15} className="text-[#4ABA94] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Inquiry CTA */}
              <button
                onClick={() => onOpenInquiry('Corporate')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-all group duration-200"
              >
                Inquire For This Service
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

            </div>
          ) : (
            <div className="bg-white/40 rounded-[32px] border-2 border-dashed border-[#685B53]/25 sticky top-24 p-12 text-center flex flex-col justify-center items-center h-80 space-y-3">
              <Sparkles className="text-[#685B53]/40 animate-pulse" size={32} />
              <h4 className="font-display font-bold text-[#2F3B3B] text-base">Method Specification</h4>
              <p className="text-xs text-[#685B53] max-w-xs leading-relaxed">
                Click on any of our curation capabilities on the left to unbox its blueprints, equipment setups, and package parameters.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
