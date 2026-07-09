import React from 'react';
import { ArrowUpRight, Sparkles, Target, Compass, Eye } from 'lucide-react';
import { useDatabase } from '../dbState';

interface AboutProps {
  onOpenInquiry: (type?: string) => void;
}

export const About: React.FC<AboutProps> = ({ onOpenInquiry }) => {
  const { settings } = useDatabase();

  const getSetting = (key: string, fallback: string) => {
    const found = settings.find((s) => s.key === key);
    return found ? found.value : fallback;
  };

  const creativePillars = [
    {
      icon: <Compass className="text-[#D0542D]" size={24} />,
      title: 'Sensory Curation',
      desc: 'We map atmospheric values down to specific mathematical frequencies—assigning colors to sound tempos, scent formulations to room temperatures, and craft menus to physical textures.'
    },
    {
      icon: <Target className="text-[#4ABA94]" size={24} />,
      title: 'Material Honesty',
      desc: 'No fake greenery, plastic barriers, or low-cost printing. We utilize real, unrefined materials: brutalist concrete, sand-cast clay, natural plant canopies, heavy canvas, and physical vinyl records.'
    },
    {
      icon: <Eye className="text-[#2F3B3B]" size={24} />,
      title: 'Atmospheric Architecture',
      desc: 'We treat environments as active canvases rather than simple containers. Every rigging point, lighting matrix, speaker placement, and food station is curated to direct optimal crowd energy.'
    }
  ];

  // Load team dynamically if available
  let team = [
    {
      name: 'Elena Rostova',
      role: 'Chief Experience Director',
      bio: 'Former spatial installation artist and scenography professor. Elena designs the emotional and physical blueprints of every MangoBox template.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Marcus Vance',
      role: 'Chief Sound & Visual Architect',
      bio: 'Electronic music scholar and acoustic engineer. Marcus directs DMX light mapping and high-fidelity sound synthesis across our partner venues.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Brand Relations',
      bio: 'Experiential marketing veteran. Sarah translates brand launch goals into custom immersive consumer installations and networking summits.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
    }
  ];

  try {
    const dbTeamVal = getSetting('about_team', '');
    if (dbTeamVal) {
      const parsed = JSON.parse(dbTeamVal);
      if (Array.isArray(parsed) && parsed.length > 0) {
        team = parsed.map((t: any) => ({
          name: t.name || 'Team Member',
          role: t.role || 'Curator',
          bio: t.bio || 'MangoBox Creative Curator',
          image: t.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
        }));
      }
    }
  } catch (err) {
    console.warn('Could not parse about_team JSON:', err);
  }

  return (
    <div id="about-page" className="space-y-24 pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12">
      
      {/* 1. Header segment */}
      <section className="text-center max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D0542D]">
          <Sparkles size={14} />
          <span>Our Manifesto</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#2F3B3B] tracking-tight leading-none uppercase">
          Unbox <br className="sm:hidden" />
          <span className="text-[#4ABA94]">Extraordinary.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#685B53] leading-relaxed font-sans max-w-2xl mx-auto mt-4">
          {getSetting('about_story', 'MangoBox was founded to combat the modern digital epidemic: predictable screens, anonymous feeds, and flat interactions. We believe humans deserve deeper, tactile, real-life occurrences that echo in the skin.')}
        </p>
      </section>

      {/* 2. Brand Story split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#4ABA94]">The Genesis</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#2F3B3B] tracking-tight leading-tight">
            Rejecting the standard checkbox checklist.
          </h2>
          <div className="space-y-4 text-sm text-[#685B53] leading-relaxed">
            <p>
              Traditional event agencies focus on standard spreadsheets: finding a generic ballroom, printing standard banners, setting up a routine food bar, and hiring a routine cover band. The results are forgettable, sterile, and cold.
            </p>
            <p>
              <strong>Mission:</strong> {getSetting('about_mission', 'To elevate the cultural fabric of premium events through strict curation, authentic talent matchmaking, and pristine design.')}
            </p>
            <p>
              <strong>Vision:</strong> {getSetting('about_vision', 'To be the global benchmark for bespoke entertainment and cultural curation.')}
            </p>
          </div>
        </div>

        <div className="relative aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden border-2 border-[#685B53]">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800"
            alt="Intimate workshop creation"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#2F3B3B]/10"></div>
        </div>
      </section>

      {/* 3. Creative Pillars Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#D0542D]">The Framework</span>
          <h2 className="font-display font-extrabold text-3xl text-[#2F3B3B] tracking-tight uppercase">
            Our Core Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creativePillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 bg-white/60 border border-[#685B53]/15 rounded-3xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  {pillar.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-[#2F3B3B] tracking-tight">{pillar.title}</h3>
                <p className="text-xs text-[#685B53] leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Team profiles */}
      <section className="space-y-12">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#4ABA94]">The Curators</span>
          <h2 className="font-display font-extrabold text-3xl text-[#2F3B3B] tracking-tight uppercase">
            The Creative Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-[32px] border border-[#685B53]/20 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#2F3B3B] tracking-tight">{member.name}</h3>
                  <p className="text-xs text-[#4ABA94] font-semibold tracking-wider uppercase mt-0.5">{member.role}</p>
                </div>
                <p className="text-xs text-[#685B53] leading-relaxed pt-2 border-t border-[#685B53]/10">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Callout Banner */}
      <section className="bg-[#2F3B3B] text-[#FFEDB7] p-8 md:p-12 rounded-[40px] border border-[#685B53]/20 text-center space-y-6 max-w-4xl mx-auto">
        <h3 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight uppercase">
          Let’s Curate Something Legendary
        </h3>
        <p className="text-sm text-[#FFEDB7]/70 max-w-xl mx-auto leading-relaxed">
          From full-scale national product launches to high-concept private banquets, we design experiential realities. Submit a brief and speak to a designer today.
        </p>
        <button
          onClick={() => onOpenInquiry('General')}
          className="inline-flex items-center gap-1.5 px-8 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-sm rounded-full transition-all cursor-pointer group"
        >
          Partner With Us
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </section>

    </div>
  );
};
