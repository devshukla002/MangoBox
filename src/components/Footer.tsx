import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { ArrowRight, Mail, Instagram, Twitter, Youtube, Sparkles, Check } from 'lucide-react';

interface FooterProps {
  onPageChange: (pageId: string) => void;
  onOpenInquiry: (type?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange, onOpenInquiry }) => {
  const { addSubscriber, settings } = useDatabase();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const getSetting = (key: string, fallback: string) => {
    const found = settings?.find((s) => s.key === key);
    return found ? found.value : fallback;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const isNew = addSubscriber(email);
    if (isNew) {
      setSubscribed(true);
      setError('');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      setError('This email is already subscribed to our newsletter list.');
    }
  };

  // Safe parse social links
  let socialLinks = { instagram: 'https://instagram.com/mangobox', facebook: 'https://facebook.com/mangobox', twitter: 'https://twitter.com/mangobox', youtube: 'https://youtube.com/mangobox' };
  try {
    const rawSocial = getSetting('settings_social_links', '');
    if (rawSocial) {
      socialLinks = { ...socialLinks, ...JSON.parse(rawSocial) };
    }
  } catch (err) {
    // Keep defaults
  }

  const footerLinks = {
    company: [
      { label: 'About Us', id: 'about' },
      { label: 'Services', id: 'services' },
      { label: 'Curated Experiences', id: 'experiences' },
      { label: 'Past Portfolio Gallery', id: 'gallery' },
      { label: 'Editorial Blog', id: 'blog' }
    ],
    experiences: [
      { label: 'Coffee Raves', id: 'experiences' },
      { label: 'Pottery Nights', id: 'experiences' },
      { label: 'Obsidian Open Mics', id: 'experiences' },
      { label: 'Neon Velvet Lounges', id: 'experiences' }
    ],
    contact: [
      { label: 'Contact Panel', id: 'contact' },
      { label: 'Admin CMS Login', id: 'admin' }
    ]
  };

  return (
    <footer id="app-footer" className="bg-[#2F3B3B] text-[#FFEDB7] border-t border-[#685B53]/30 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Segment: Logo Blurb + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#FFEDB7]/10">
          
          {/* Logo & Blurb */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#4ABA94] flex items-center justify-center">
                <span className="font-display font-black text-[#FFEDB7] text-xl">M</span>
              </div>
              <div>
                <span className="font-display font-black text-white text-2xl tracking-tight leading-none block">
                  {getSetting('settings_logo', 'MangoBox')}
                </span>
                <span className="text-[#4ABA94] text-[10px] font-bold tracking-widest uppercase block mt-1">
                  Unbox Extraordinary.
                </span>
              </div>
            </div>
            <p className="text-[#FFEDB7]/70 text-sm max-w-sm leading-relaxed">
              We conceptualize, design, engineer, and execute sensory-focused micro-experiences, club nights, branding summits, and premium community activations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#4ABA94]/20 hover:text-[#4ABA94] text-[#FFEDB7] transition-all">
                <Instagram size={18} />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#4ABA94]/20 hover:text-[#4ABA94] text-[#FFEDB7] transition-all">
                <Twitter size={18} />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[#4ABA94]/20 hover:text-[#4ABA94] text-[#FFEDB7] transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 space-y-4 bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10">
            <div className="flex items-center gap-2 text-[#4ABA94]">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">The Dispatch Newsletter</span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-white">
              Get notified of secretive popup gatherings & new artist drops.
            </h3>
            <p className="text-[#FFEDB7]/60 text-xs">
              No spam. Only deep editorial articles, early tickets, and brand installation previews.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-4 flex items-center">
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFEDB7]/40" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to subscribe"
                  className="w-full bg-white/5 text-[#FFEDB7] placeholder:text-[#FFEDB7]/30 border border-white/10 hover:border-white/20 focus:border-[#4ABA94] outline-none rounded-2xl pl-12 pr-12 py-3.5 text-sm transition-all"
                  disabled={subscribed}
                />
              </div>
              <button
                type="submit"
                className={`absolute right-2 p-2.5 rounded-xl transition-all cursor-pointer ${
                  subscribed
                    ? 'bg-[#4ABA94] text-[#2F3B3B]'
                    : 'bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B]'
                }`}
                disabled={subscribed}
              >
                {subscribed ? <Check size={18} /> : <ArrowRight size={18} />}
              </button>
            </form>
            {error && <p className="text-[#D0542D] text-xs font-medium">{error}</p>}
            {subscribed && (
              <p className="text-[#4ABA94] text-xs font-semibold flex items-center gap-1.5">
                <Check size={14} /> Subscription successful! Welcome to the loop.
              </p>
            )}
          </div>
        </div>

        {/* Middle Segment: Site Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-white text-xs uppercase tracking-widest text-[#4ABA94]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#FFEDB7]/70">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      onPageChange(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-white text-xs uppercase tracking-widest text-[#4ABA94]">
              Concepts
            </h4>
            <ul className="space-y-2 text-sm text-[#FFEDB7]/70">
              {footerLinks.experiences.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      onPageChange(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-white text-xs uppercase tracking-widest text-[#4ABA94]">
              Contact & Panels
            </h4>
            <ul className="space-y-2 text-sm text-[#FFEDB7]/70">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      onPageChange(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-white text-xs uppercase tracking-widest text-[#4ABA94]">
              Our Tagline
            </h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="font-display italic font-extrabold text-white text-lg block">
                “Unbox Extraordinary.”
              </span>
              <p className="text-xs text-[#FFEDB7]/50 leading-relaxed">
                Life is comprised of boxes we put ourselves in. We are here to unbox experiences that linger in the skin and echo in the heart.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Segment: Copyright & Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#FFEDB7]/10 text-xs text-[#FFEDB7]/40 space-y-4 md:space-y-0">
          <p>{getSetting('settings_footer', `© ${new Date().getFullYear()} MangoBox Experience Design LLC. All rights reserved.`)}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button
              onClick={() => {
                onPageChange('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#4ABA94] transition-colors cursor-pointer"
            >
              CMS Admin Dashboard
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
