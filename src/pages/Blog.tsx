import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { BookOpen, Sparkles, Calendar, Clock, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';

export const Blog: React.FC = () => {
  const { blogs } = useDatabase();
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const activePost = blogs.find((b) => b.id === activePostId) || null;

  const handleBack = () => {
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="blog-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12">
      
      {activePost ? (
        /* EDITORIAL READER VIEW */
        <article id="blog-reader" className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#685B53] hover:text-[#2F3B3B] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back to dispatch
          </button>

          {/* Hero Image */}
          <div className="aspect-video w-full rounded-[40px] overflow-hidden border-2 border-[#685B53] relative">
            <img
              src={activePost.image}
              alt={activePost.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Meta */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 bg-[#4ABA94]/15 text-[#2F3B3B] font-bold uppercase rounded-full">
                {activePost.category}
              </span>
              <span className="text-[#685B53]/40">•</span>
              <div className="flex items-center gap-1 text-[#685B53]">
                <Calendar size={13} />
                <span>{activePost.date}</span>
              </div>
              <span className="text-[#685B53]/40">•</span>
              <div className="flex items-center gap-1 text-[#685B53]">
                <Clock size={13} />
                <span>{activePost.readTime}</span>
              </div>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2F3B3B] tracking-tight leading-tight uppercase">
              {activePost.title}
            </h1>
          </div>

          {/* Author Block */}
          <div className="flex items-center gap-3 py-4 border-y border-[#685B53]/15">
            <img
              src={activePost.authorAvatarUrl || activePost.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={activePost.authorName || activePost.author?.name || 'Editor'}
              className="w-11 h-11 rounded-full object-cover border border-[#685B53]/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-[#2F3B3B] text-sm">{activePost.authorName || activePost.author?.name || 'Editor'}</h4>
              <p className="text-xs text-[#685B53]">{activePost.authorRole || activePost.author?.role || 'Staff Curator'}</p>
            </div>
          </div>

          {/* Markdown Content Parser */}
          <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[#2F3B3B]/90 leading-relaxed font-sans space-y-6">
            {activePost.content.split('\n\n').map((para, i) => {
              const text = para.trim();
              if (!text) return null;

              if (text.startsWith('# ')) {
                return (
                  <h2 key={i} className="font-display font-black text-2xl sm:text-3xl text-[#2F3B3B] tracking-tight pt-4">
                    {text.replace('# ', '')}
                  </h2>
                );
              }
              if (text.startsWith('## ')) {
                return (
                  <h3 key={i} className="font-display font-extrabold text-xl text-[#2F3B3B] tracking-tight pt-3">
                    {text.replace('## ', '')}
                  </h3>
                );
              }
              if (text.startsWith('*   ') || text.startsWith('* ')) {
                const items = text.split('\n');
                return (
                  <ul key={i} className="list-disc pl-5 space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx}>
                        {item.replace(/^\*\s*/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (text.startsWith('1. ') || text.startsWith('2. ') || text.startsWith('3. ')) {
                const items = text.split('\n');
                return (
                  <ol key={i} className="list-decimal pl-5 space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx}>
                        {item.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={i} className="leading-relaxed">
                  {text}
                </p>
              );
            })}
          </div>

          {/* Sticky back CTA */}
          <div className="pt-8 border-t border-[#685B53]/15 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 bg-[#2F3B3B] text-[#FFEDB7] font-bold text-xs rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              Back to listings
            </button>
            <span className="text-[10px] font-mono text-[#685B53]">MANGOBOX DISPATCH LOG</span>
          </div>

        </article>
      ) : (
        /* EDITORIAL BLOG CATALOG */
        <div className="space-y-16 animate-in fade-in duration-200">
          {/* Header */}
          <section className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D0542D]">
              <BookOpen size={14} />
              <span>The Dispatch</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
              Editorial Blog
            </h1>
            <p className="text-sm text-[#685B53] max-w-xl mx-auto">
              Behind the curtain of our sensory curation. Reading material concerning the physics of sound isolation, micro-communities, and physical material honesties.
            </p>
          </section>

          {/* Blog catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setActivePostId(post.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-[32px] border-2 border-[#685B53]/20 hover:border-[#685B53] overflow-hidden flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#2F3B3B]/10"></div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-[#685B53] uppercase tracking-wider">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-display font-extrabold text-xl text-[#2F3B3B] group-hover:text-[#4ABA94] transition-colors leading-snug tracking-tight">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#685B53] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#685B53]/10 flex items-center justify-between text-xs font-semibold text-[#2F3B3B]">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatarUrl || post.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                        alt={post.authorName || post.author?.name || 'Editor'}
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] text-[#685B53]">{post.authorName || post.author?.name || 'Editor'}</span>
                    </div>

                    <span className="flex items-center gap-1 text-[#4ABA94] hover:text-[#2F3B3B] group-hover:translate-x-0.5 transition-transform">
                      Read dispatch
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
