import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { Search, SlidersHorizontal, Calendar, MapPin, Users, Ticket, ChevronDown, Sparkles, Clock, Compass } from 'lucide-react';
import { Event } from '../types';

interface EventsProps {
  onBookEvent: (event: Event) => void;
}

export const Events: React.FC<EventsProps> = ({ onBookEvent }) => {
  const { events, venues, artists } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const categories = ['All', 'Club', 'Workshop', 'Festival', 'Private'];

  // Filter & Search logic
  const filteredEvents = events.filter((ev) => {
    const venueName = venues.find((v) => v.id === ev.venueId)?.name || '';
    const artistNames = ev.artists.map((id) => artists.find((a) => a.id === id)?.name || '').join(' ');
    
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artistNames.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div id="events-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-12">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#4ABA94]">
          <Compass size={14} />
          <span>Active Checkpoints</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Ticketing Schedule
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          Secure active reservation slots for our highly anticipated underground club nights, creative masterclasses, and sensory coffee raves.
        </p>
      </section>

      {/* Filter and Search Panel */}
      <div className="bg-white/60 p-4 border-2 border-[#685B53]/20 rounded-[24px] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#685B53]/50" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="w-full bg-white border border-[#685B53]/20 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2F3B3B] text-[#FFEDB7]'
                  : 'bg-white/50 text-[#685B53] border border-[#685B53]/15 hover:border-[#2F3B3B]'
              }`}
            >
              {cat === 'All' ? 'All Channels' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main List Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-16 text-center bg-white/40 border-2 border-dashed border-[#685B53]/20 rounded-3xl space-y-4">
          <Sparkles className="text-[#685B53]/30 mx-auto" size={32} />
          <h3 className="font-display font-bold text-[#2F3B3B] text-lg">No Checkpoints Found</h3>
          <p className="text-xs text-[#685B53] max-w-xs mx-auto leading-relaxed">
            Try adjusting your search terms or filters. If you are an admin, head to the CMS panel to seed new entries!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((ev) => {
            const evVenue = venues.find((v) => v.id === ev.venueId);
            const isExpanded = expandedEventId === ev.id;
            
            // Look up performing artists names
            const performingArtists = ev.artists
              .map((artId) => artists.find((a) => a.id === artId))
              .filter((a): a is any => !!a);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-[32px] border-2 border-[#685B53] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Top split block */}
                <div className="flex flex-col lg:flex-row">
                  {/* Event Thumbnail */}
                  <div className="lg:w-1/3 aspect-[4/3] lg:aspect-auto relative overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#FFEDB7] border border-[#685B53] text-[#2F3B3B] text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {ev.category}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 md:p-8 lg:w-2/3 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-[#D0542D] font-bold uppercase tracking-wider">
                          <Calendar size={13} />
                          <span>{ev.date}</span>
                        </div>
                        <span className="text-[#685B53]/40">•</span>
                        <div className="flex items-center gap-1.5 text-[#685B53] font-semibold">
                          <Clock size={13} />
                          <span>{ev.time}</span>
                        </div>
                      </div>

                      <h3 className="font-display font-black text-2xl md:text-3xl text-[#2F3B3B] tracking-tight leading-none">
                        {ev.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#2F3B3B] font-semibold">
                        <MapPin size={13} className="text-[#4ABA94]" />
                        <span>{evVenue?.name} ({evVenue?.address})</span>
                      </div>

                      <p className="text-xs text-[#685B53] leading-relaxed max-w-2xl">
                        {ev.description}
                      </p>

                      {/* Display Performing Artists */}
                      {performingArtists.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#685B53]/80">Artists:</span>
                          {performingArtists.map((art) => (
                            <span key={art.id} className="bg-[#4ABA94]/10 border border-[#4ABA94]/20 text-[#2F3B3B] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              {art.name} ({art.role})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom segment */}
                    <div className="pt-6 border-t border-[#685B53]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-6 text-xs w-full sm:w-auto">
                        <div>
                          <span className="text-[9px] text-[#685B53] uppercase block">Price per ticket</span>
                          <strong className="text-xl text-[#D0542D] font-display font-black">${ev.price} USD</strong>
                        </div>
                        <div className="h-8 w-px bg-[#685B53]/20"></div>
                        <div>
                          <span className="text-[9px] text-[#685B53] uppercase block">Capacity Remaining</span>
                          <strong className={`font-semibold ${ev.ticketsLeft < 20 ? 'text-[#D0542D]' : 'text-[#4ABA94]'}`}>
                            {ev.ticketsLeft === 0 ? 'SOLD OUT' : `${ev.ticketsLeft} / ${ev.totalTickets} slots`}
                          </strong>
                        </div>
                      </div>

                      <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => toggleExpand(ev.id)}
                          className="px-4 py-3 border border-[#685B53]/40 rounded-xl text-xs font-bold text-[#685B53] hover:border-[#2F3B3B] hover:text-[#2F3B3B] flex items-center gap-1 cursor-pointer"
                        >
                          Show Timeline
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => onBookEvent(ev)}
                          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                            ev.ticketsLeft === 0
                              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                              : 'bg-[#4ABA94] border-[#2F3B3B] hover:bg-[#4ABA94]/90 text-[#2F3B3B] shadow-sm'
                          }`}
                          disabled={ev.ticketsLeft === 0}
                        >
                          <Ticket size={14} />
                          {ev.ticketsLeft === 0 ? 'SOLD OUT' : 'Secure Pass'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content details (Schedule & FAQs) */}
                {isExpanded && (
                  <div className="border-t border-[#685B53]/20 bg-[#FFEDB7]/30 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Timeline */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#2F3B3B] flex items-center gap-1.5">
                          <Clock size={14} className="text-[#4ABA94]" />
                          <span>Event Schedule Timeline</span>
                        </h4>
                        
                        <div className="space-y-3.5 relative pl-4 border-l-2 border-[#685B53]/25">
                          {ev.schedule.map((item, idx) => (
                            <div key={idx} className="relative space-y-1">
                              {/* Dotted point anchor */}
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#4ABA94] border border-[#2F3B3B]"></div>
                              <span className="font-mono text-[10px] font-bold text-[#D0542D] block">{item.time}</span>
                              <span className="text-xs font-semibold text-[#2F3B3B] block">{item.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FAQs */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#2F3B3B] flex items-center gap-1.5">
                          <Sparkles size={14} className="text-[#D0542D]" />
                          <span>Frequently Asked</span>
                        </h4>

                        <div className="space-y-4">
                          {ev.faqs.map((faq, idx) => (
                            <div key={idx} className="space-y-1.5 bg-white/40 p-4 rounded-xl border border-[#685B53]/10">
                              <h5 className="font-display font-bold text-[#2F3B3B] text-xs">Q: {faq.question}</h5>
                              <p className="text-xs text-[#685B53] leading-relaxed">A: {faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
