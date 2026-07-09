import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { Award, ArrowRight, Instagram, Twitter, Music, Sparkles, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Artist } from '../types';

interface ArtistsProps {
  onOpenInquiry: (type?: string, artistId?: string) => void;
}

export const Artists: React.FC<ArtistsProps> = ({ onOpenInquiry }) => {
  const { artists } = useDatabase();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const activeArtist = artists.find((a) => a.id === selectedArtistId) || null;

  return (
    <div id="artists-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-16">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#4ABA94]">
          <Award size={14} />
          <span>The Roster</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Artistic Managers
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          We curate and represent unique visual artists, electronic music producers, contemporary potters, and acoustic visionaries that define great spaces.
        </p>
      </section>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Artist Grid Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {artists.map((art) => {
            const isSelected = selectedArtistId === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArtistId(isSelected ? null : art.id)}
                className={`group rounded-[32px] border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#2F3B3B] bg-[#2F3B3B] text-[#FFEDB7] shadow-xl'
                    : 'border-[#685B53]/20 bg-white text-[#2F3B3B] hover:border-[#685B53]'
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={art.image}
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#2F3B3B]/10"></div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      isSelected ? 'bg-[#4ABA94] text-[#2F3B3B]' : 'bg-[#4ABA94]/15 text-[#2F3B3B]'
                    }`}>
                      {art.role}
                    </span>
                    <h3 className="font-display font-black text-lg tracking-tight leading-tight mt-2">{art.name}</h3>
                  </div>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-[#FFEDB7]/80' : 'text-[#685B53]'}`}>
                    {art.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Artist detail dossier */}
        <div className="lg:col-span-6">
          {activeArtist ? (
            <div className="bg-white rounded-[40px] border-2 border-[#685B53] p-6 md:p-8 space-y-6 shadow-xl sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pb-6 border-b border-[#685B53]/15">
                <img
                  src={activeArtist.image}
                  alt={activeArtist.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#685B53]"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D0542D] px-2 py-0.5 bg-[#D0542D]/10 rounded-md">
                    Featured Curator
                  </span>
                  <h2 className="font-display font-black text-3xl text-[#2F3B3B] tracking-tight mt-1">{activeArtist.name}</h2>
                  <p className="text-xs font-semibold text-[#4ABA94]">{activeArtist.role}</p>
                </div>
              </div>

              {/* Bio block */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2F3B3B]">Biography</h4>
                <p className="text-xs text-[#685B53] leading-relaxed">
                  {activeArtist.bio}
                </p>
              </div>

              {/* Roster Socials */}
              <div className="flex items-center gap-3 pt-1">
                {activeArtist.socialLinks.instagram && (
                  <a
                    href={activeArtist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#685B53]/25 hover:border-[#2F3B3B] text-xs text-[#685B53] hover:text-[#2F3B3B] transition-colors"
                  >
                    <Instagram size={13} />
                    <span className="font-semibold">Instagram</span>
                  </a>
                )}
                {activeArtist.socialLinks.spotify && (
                  <a
                    href={activeArtist.socialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#685B53]/25 hover:border-[#2F3B3B] text-xs text-[#685B53] hover:text-[#2F3B3B] transition-colors"
                  >
                    <Music size={13} />
                    <span className="font-semibold">Spotify</span>
                  </a>
                )}
              </div>

              {/* Press Gallery Images Grid */}
              {activeArtist.gallery.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#685B53]/15">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2F3B3B] flex items-center gap-1">
                    <ImageIcon size={13} />
                    <span>Dossier Press Gallery</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {activeArtist.gallery.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-[#685B53]/15">
                        <img
                          src={url}
                          alt={`${activeArtist.name} press ${i}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Trigger CTA */}
              <button
                onClick={() => onOpenInquiry('Artist', activeArtist.id)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-all group duration-200"
              >
                Inquire For Booking {activeArtist.name}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>

            </div>
          ) : (
            <div className="bg-white/40 rounded-[40px] border-2 border-dashed border-[#685B53]/25 sticky top-24 p-12 text-center flex flex-col justify-center items-center h-96 space-y-3">
              <Sparkles className="text-[#685B53]/40 animate-pulse" size={32} />
              <h4 className="font-display font-bold text-[#2F3B3B] text-base">Artist Dossier Sheet</h4>
              <p className="text-xs text-[#685B53] max-w-xs leading-relaxed">
                Click on any of our managed curators or artists on the left to unbox their complete bio, music or craft reels, press portfolio gallery, and direct booking parameters.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
