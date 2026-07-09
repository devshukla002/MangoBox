import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { MapPin, Users, Sparkles, Building, Check, ArrowRight } from 'lucide-react';

interface VenuesProps {
  onOpenInquiry: (type?: string) => void;
}

export const Venues: React.FC<VenuesProps> = ({ onOpenInquiry }) => {
  const { venues } = useDatabase();
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const activeVenue = venues.find((v) => v.id === selectedVenueId) || null;

  return (
    <div id="venues-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-16">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D0542D]">
          <Building size={14} />
          <span>The Spaces</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Partner Venues
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          We hold exclusive hosting agreements with architectural warehouses, starry sky terraces, and solar-hybrid green pavilions that offer pristine sound isolations.
        </p>
      </section>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Venue list cards */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((ven) => {
            const isSelected = selectedVenueId === ven.id;
            return (
              <div
                key={ven.id}
                onClick={() => setSelectedVenueId(isSelected ? null : ven.id)}
                className={`group rounded-[32px] border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#2F3B3B] bg-[#2F3B3B] text-[#FFEDB7] shadow-xl'
                    : 'border-[#685B53]/20 bg-white text-[#2F3B3B] hover:border-[#685B53]'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={ven.images[0]}
                    alt={ven.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#2F3B3B]/10"></div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase ${
                      isSelected ? 'bg-[#4ABA94] text-[#2F3B3B]' : 'bg-[#4ABA94]/15 text-[#2F3B3B]'
                    }`}>
                      Capacity: {ven.capacity} max
                    </span>
                    <h3 className="font-display font-black text-lg tracking-tight mt-1.5">{ven.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin size={12} className={isSelected ? 'text-[#4ABA94]' : 'text-[#4ABA94]'} />
                    <span className="truncate">{ven.address}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Venue details panel */}
        <div className="lg:col-span-6">
          {activeVenue ? (
            <div className="bg-white rounded-[40px] border-2 border-[#685B53] p-6 md:p-8 space-y-6 shadow-xl sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="aspect-video rounded-2xl overflow-hidden border border-[#685B53]/15 relative">
                <img
                  src={activeVenue.images[1] || activeVenue.images[0]}
                  alt={activeVenue.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D0542D] block">Space Blueprints</span>
                <h2 className="font-display font-black text-2xl text-[#2F3B3B] tracking-tight">{activeVenue.name}</h2>
                <div className="flex items-center gap-4 text-xs font-bold text-[#685B53]">
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-[#4ABA94]" />
                    <span>Capacity Limit: {activeVenue.capacity} guests</span>
                  </div>
                  <span>•</span>
                  <span>{activeVenue.pastEventsCount} Events hosted</span>
                </div>
                <p className="text-xs text-[#685B53] leading-relaxed pt-2 border-t border-[#685B53]/10">
                  {activeVenue.description}
                </p>
              </div>

              {/* Amenities block */}
              <div className="space-y-3 pt-3 border-t border-[#685B53]/10">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#2F3B3B]">Technical Specifications</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#685B53]">
                  {activeVenue.amenities.map((amenity) => (
                    <li key={amenity} className="flex gap-2 items-center">
                      <Check size={14} className="text-[#4ABA94] shrink-0" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partner CTA */}
              <button
                onClick={() => onOpenInquiry('Venue')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-all group duration-200"
              >
                Inquire For Venue Partnership
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>

            </div>
          ) : (
            <div className="bg-white/40 rounded-[40px] border-2 border-dashed border-[#685B53]/25 sticky top-24 p-12 text-center flex flex-col justify-center items-center h-96 space-y-3">
              <Sparkles className="text-[#685B53]/40 animate-pulse" size={32} />
              <h4 className="font-display font-bold text-[#2F3B3B] text-base">Space Blueprints Box</h4>
              <p className="text-xs text-[#685B53] max-w-xs leading-relaxed">
                Click on any of our contracted spaces on the left to unbox its capacities, structural blueprints, layout amenities, and technical speaker rigs.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
