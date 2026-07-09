import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { Search, Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const { gallery } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Concert', 'Nightlife', 'Workshop', 'Corporate', 'Private'];

  const filteredPhotos = gallery.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <div id="gallery-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-12">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#4ABA94]">
          <ImageIcon size={14} />
          <span>The Portfolio</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Past Assemblies
        </h1>
        <p className="text-sm text-[#685B53] leading-relaxed max-w-xl mx-auto">
          Take a look at the atmospheric visuals, sensory structures, and custom setups crafted for our corporate clients and communities.
        </p>
      </section>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-1.5 justify-center overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2F3B3B] text-[#FFEDB7] border border-[#2F3B3B] shadow-sm'
                : 'bg-white/50 text-[#685B53] border border-[#685B53]/10 hover:border-[#2F3B3B]'
            }`}
          >
            {cat === 'All' ? 'All Portfolio' : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Photo Bento Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-16 text-center bg-white/40 border-2 border-dashed border-[#685B53]/20 rounded-[32px] max-w-md mx-auto space-y-3">
          <ImageIcon className="text-[#685B53]/30 mx-auto" size={32} />
          <h4 className="font-display font-bold text-[#2F3B3B] text-base">Empty Portfolio Segment</h4>
          <p className="text-xs text-[#685B53] leading-relaxed">
            There are no documented items in this category yet. Access the CMS panel to upload past event snapshots.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="break-inside-avoid bg-white rounded-3xl border-2 border-[#685B53]/20 hover:border-[#685B53] overflow-hidden group cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Zoom Indicator */}
                <div className="absolute inset-0 bg-[#2F3B3B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
                    <ZoomIn size={14} />
                    <span>Zoom Assembly</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-[#685B53] uppercase tracking-wider">
                  <span>{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#2F3B3B] tracking-tight">{item.title}</h3>
                <p className="text-[11px] text-[#685B53] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {activePhoto && (
        <div
          id="gallery-lightbox"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-[#2F3B3B]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#FFEDB7] border-2 border-[#685B53] rounded-[36px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#2F3B3B] text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Img portion */}
            <div className="md:w-3/5 bg-black/90 flex items-center justify-center aspect-square md:aspect-auto">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Portion */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-[#D0542D] uppercase tracking-widest">
                  <span>{activePhoto.category} Segment</span>
                  <span>{activePhoto.date}</span>
                </div>
                
                <h3 className="font-display font-black text-2xl text-[#2F3B3B] tracking-tight leading-tight">
                  {activePhoto.title}
                </h3>
                
                <p className="text-xs text-[#685B53] leading-relaxed pt-3 border-t border-[#685B53]/15">
                  {activePhoto.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#4ABA94]/10 border border-[#4ABA94]/20 space-y-1 text-[11px] text-[#685B53]">
                <strong className="text-[#2F3B3B] flex items-center gap-1 font-bold">
                  <Sparkles size={12} className="text-[#D0542D]" />
                  MangoBox Curation Stamp
                </strong>
                <span>All portfolio items depict real event setups engineered and designed by MangoBox and our local spatial production crew.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
