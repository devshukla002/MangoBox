import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { ArrowRight, Sparkles, Calendar, MapPin, Users, Ticket, Check, ChevronDown } from 'lucide-react';
import { Event } from '../types';

interface HomeProps {
  onPageChange: (pageId: string) => void;
  onOpenInquiry: (type?: string) => void;
  onBookEvent: (event: Event) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange, onOpenInquiry, onBookEvent }) => {
  const { experiences, services, events, artists, venues, testimonials } = useDatabase();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Get active upcoming events (max 3)
  const featuredEvents = events.filter((e) => e.featured).slice(0, 3);
  // Get active testimonials
  const activeTestimonials = testimonials.slice(0, 3);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const whyMangoBox = [
    {
      title: 'Sensory Curation',
      desc: 'We map light wavelengths to acoustic frequencies and curate tactile workshop ingredients to create comprehensive neurological experiences.'
    },
    {
      title: 'Architectural Adaptation',
      desc: 'We transform industrial warehouses, open sky decks, and botanical glass domes into fully customized spatial manifestos.'
    },
    {
      title: 'Elite Artistic Roster',
      desc: 'Get exclusive access to underground techno producers, classical sitar fusionists, water-glazing potters, and culinary molecular architects.'
    }
  ];

  const faqs = [
    {
      q: 'What does "Unbox Extraordinary" mean?',
      a: 'Human life is often categorized into predictable boxes: work, commute, screen-time, sleep. MangoBox is designed to shatter those boundaries. We unbox extraordinary memories through tactile creation, acoustic harmony, and intimate community spaces.'
    },
    {
      q: 'Can MangoBox coordinate brand activations in other cities?',
      a: 'Absolutely. While our primary partner venues are localized, our technical templates, production equipment, and artist managers are built for global mobilization. We coordinate activations of every scale.'
    },
    {
      q: 'Do you offer custom planning for select private parties?',
      a: 'Yes. We curate a select number of high-end private celebrations, VIP banquets, and modern weddings. These are custom-designed from scratch by our chief experience director to match your personal style.'
    }
  ];

  return (
    <div id="home-page" className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section id="hero-segment" className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-8 py-16 text-center max-w-7xl mx-auto space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F3B3B] text-[#FFEDB7] text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles size={13} className="text-[#4ABA94]" />
            <span>Unbox Extraordinary</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-[#2F3B3B] tracking-tight leading-none max-w-5xl mx-auto uppercase">
            Experiences <br />
            <span className="text-[#4ABA94]">Unleashed.</span>
          </h1>

          {/* Subtext */}
          <p className="font-sans text-base sm:text-xl text-[#685B53] max-w-2xl mx-auto leading-relaxed">
            MangoBox is a premium experience curation agency. We design, program, and execute unforgettable nightlife events, brand launches, and tactile community gatherings.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <button
            id="hero-cta-events"
            onClick={() => onPageChange('events')}
            className="w-full sm:w-auto px-8 py-4 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-base rounded-full shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            Secure Event Passes
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            id="hero-cta-inquiry"
            onClick={() => onOpenInquiry('Corporate')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#2F3B3B] text-[#2F3B3B] font-extrabold text-base rounded-full hover:bg-[#2F3B3B] hover:text-[#FFEDB7] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Co-Create Experience
          </button>
        </div>

        {/* Background ambient shape to fit modern Stripe vibe */}
        <div className="absolute top-[20%] left-[10%] -z-10 w-48 h-48 rounded-full bg-[#4ABA94]/15 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] -z-10 w-64 h-64 rounded-full bg-[#D0542D]/10 filter blur-3xl animate-pulse duration-5000"></div>
      </section>

      {/* 2. CORE CONCEPTS (EXPERIENCES) */}
      <section id="experiences-segment" className="px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#685B53]/25 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#D0542D]">The Templates</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[#2F3B3B] tracking-tight">
              Curated Concepts
            </h2>
            <p className="text-sm text-[#685B53]">
              Reusable sensory templates ready to be activated for your brand, community, or private group.
            </p>
          </div>
          <button
            onClick={() => onPageChange('experiences')}
            className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2F3B3B] hover:text-[#4ABA94] transition-colors"
          >
            Explore all concepts
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Slider list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.slice(0, 4).map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-3xl border border-[#685B53]/20 overflow-hidden hover:shadow-xl hover:border-[#685B53] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#FFEDB7] border border-[#685B53] text-[#2F3B3B] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  Concept
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-[#2F3B3B] tracking-tight">{exp.title}</h3>
                  <p className="text-xs text-[#685B53] line-clamp-3">{exp.description}</p>
                </div>
                <div className="pt-3 border-t border-[#685B53]/10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D0542D] uppercase tracking-wider">{exp.duration}</span>
                  <button
                    onClick={() => onPageChange('experiences')}
                    className="p-2 bg-[#2F3B3B]/5 hover:bg-[#2F3B3B] hover:text-[#FFEDB7] rounded-full text-[#2F3B3B] transition-all cursor-pointer"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section id="services-segment" className="px-4 md:px-8 max-w-7xl mx-auto space-y-12 bg-white/20 p-8 md:p-12 rounded-[40px] border border-[#685B53]/15">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#4ABA94]">What We Do</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[#2F3B3B] tracking-tight uppercase">
            Experiential Curation
          </h2>
          <p className="text-sm text-[#685B53]">
            From local sound design to large-scale marketing activations, we manage the entire lifecycle of memorable gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-3xl border border-[#685B53]/10 hover:border-[#4ABA94] transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 bg-[#4ABA94]/20 rounded-xl flex items-center justify-center text-[#2F3B3B]">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-[#2F3B3B] tracking-tight">{service.title}</h3>
                <p className="text-xs text-[#685B53] leading-relaxed">{service.description}</p>
              </div>
              <button
                onClick={() => onPageChange('services')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#4ABA94] hover:text-[#2F3B3B] transition-colors cursor-pointer pt-2"
              >
                Learn Curation Methods <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPCOMING EVENTS BLOCK */}
      <section id="events-segment" className="px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#685B53]/25 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#4ABA94]">Checkpoints</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[#2F3B3B] tracking-tight">
              Active Experiences
            </h2>
            <p className="text-sm text-[#685B53]">
              Secure custom entrance tickets and participate in our scheduled community activations.
            </p>
          </div>
          <button
            onClick={() => onPageChange('events')}
            className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2F3B3B] hover:text-[#4ABA94] transition-colors"
          >
            View all tickets
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Event Cards */}
        {featuredEvents.length === 0 ? (
          <div className="p-8 text-center bg-white/40 border border-dashed border-[#685B53]/30 rounded-3xl">
            <p className="text-sm text-[#685B53] font-mono">No active popup shows scheduled. Launch CMS Admin to seed events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((ev) => {
              const evVenue = venues.find((v) => v.id === ev.venueId);
              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-[32px] border-2 border-[#685B53] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 right-3 bg-[#4ABA94] text-[#2F3B3B] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-[#685B53]">
                      ${ev.price} USD
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#2F3B3B] text-[#FFEDB7] text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                      {ev.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#D0542D] uppercase tracking-wider">
                        <Calendar size={12} />
                        <span>{ev.date} • {ev.time}</span>
                      </div>
                      <h3 className="font-display font-black text-xl text-[#2F3B3B] tracking-tight leading-tight">
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[#685B53] text-xs">
                        <MapPin size={12} className="text-[#4ABA94]" />
                        <span className="truncate">{evVenue?.name || 'Curated Space'}</span>
                      </div>
                      <p className="text-xs text-[#685B53] leading-relaxed line-clamp-3">
                        {ev.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#685B53]/15 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-[#685B53]">Availability:</span>
                        <span className={`font-bold ${ev.ticketsLeft < 20 ? 'text-[#D0542D]' : 'text-[#4ABA94]'}`}>
                          {ev.ticketsLeft === 0 ? 'SOLD OUT' : `${ev.ticketsLeft} / ${ev.totalTickets} slots left`}
                        </span>
                      </div>

                      <button
                        onClick={() => onBookEvent(ev)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black cursor-pointer uppercase tracking-wider transition-all border ${
                          ev.ticketsLeft === 0
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-[#4ABA94] border-[#2F3B3B] hover:bg-[#4ABA94]/95 text-[#2F3B3B] hover:shadow-sm'
                        }`}
                        disabled={ev.ticketsLeft === 0}
                      >
                        <Ticket size={14} />
                        {ev.ticketsLeft === 0 ? 'Full capacity' : 'Secure Entrance Passes'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. WHY MANGOBOX segment */}
      <section id="why-segment" className="px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#D0542D]">Brand Philosophy</span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-[#2F3B3B] tracking-tight uppercase leading-none">
            Why We Are Different.
          </h2>
          <p className="text-sm text-[#685B53] leading-relaxed">
            We don\'t do basic checklists, template websites, or standard event management. We handle experiences as spatial and acoustic designs, translating brands into human sensory memories.
          </p>
          <button
            onClick={() => onPageChange('about')}
            className="flex items-center gap-2 px-6 py-3 bg-[#2F3B3B] hover:bg-[#2F3B3B]/90 text-[#FFEDB7] font-bold text-sm rounded-full transition-all cursor-pointer"
          >
            Read Our Manifesto
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {whyMangoBox.map((w, idx) => (
            <div
              key={w.title}
              className="p-6 bg-white rounded-3xl border border-[#685B53]/15 flex gap-4 items-start shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#4ABA94]/15 flex items-center justify-center font-display font-black text-[#2F3B3B] shrink-0">
                0{idx + 1}
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-base text-[#2F3B3B] tracking-tight">{w.title}</h4>
                <p className="text-xs text-[#685B53] leading-relaxed">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SLIDER */}
      <section id="testimonials-segment" className="bg-[#2F3B3B] text-[#FFEDB7] py-20 px-4 md:px-8 border-y border-[#685B53]/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#4ABA94]">The Echoes</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">
              What Partners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTestimonials.map((test) => (
              <div
                key={test.id}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i} className="text-[#4ABA94] text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-white/80 italic text-sm leading-relaxed">
                    “{test.content}”
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{test.name}</h4>
                    <p className="text-white/50 text-[11px] font-medium mt-0.5">{test.role}, {test.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ COMPONENT */}
      <section id="faq-segment" className="px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#D0542D]">Knowledge Base</span>
          <h2 className="font-display font-black text-3xl md:text-4xl text-[#2F3B3B] tracking-tight uppercase">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#685B53]/20 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-display font-bold text-[#2F3B3B] hover:bg-[#685B53]/5 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#685B53] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#4ABA94]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-[#685B53]/10 text-xs text-[#685B53] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
