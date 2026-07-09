import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useDatabase } from '../dbState';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenInquiry: (type?: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  onOpenInquiry
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useDatabase();

  const getSetting = (key: string, fallback: string) => {
    const found = settings?.find((s) => s.key === key);
    return found ? found.value : fallback;
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'events', label: 'Events' },
    { id: 'artists', label: 'Artists' },
    { id: 'venues', label: 'Venues' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-[#FFEDB7]/90 backdrop-blur-md border-b border-[#685B53]/20 px-4 md:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-[#4ABA94] flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
            <span className="font-display font-extrabold text-[#FFEDB7] text-lg">M</span>
          </div>
          <div>
            <span className="font-display font-extrabold text-[#2F3B3B] text-xl tracking-tight leading-none block">
              {getSetting('settings_logo', 'MangoBox')}
            </span>
            <span className="text-[#685B53] text-[9px] font-medium tracking-widest uppercase block mt-0.5">
              Unbox Extraordinary.
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2F3B3B] text-[#FFEDB7]'
                    : 'text-[#685B53] hover:text-[#2F3B3B] hover:bg-[#2F3B3B]/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Admin Dashboard shortcut */}
          <button
            id="nav-admin-link"
            onClick={() => handleNavClick('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-all ${
              currentPage === 'admin'
                ? 'bg-[#D0542D] border-[#D0542D] text-[#FFEDB7]'
                : 'border-[#685B53]/30 text-[#685B53] hover:border-[#2F3B3B] hover:text-[#2F3B3B]'
            }`}
          >
            <ShieldAlert size={13} />
            CMS Admin
          </button>

          <button
            id="nav-cta-partner"
            onClick={() => onOpenInquiry('General')}
            className="flex items-center gap-1.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] px-5 py-2 rounded-full text-sm font-bold shadow-sm cursor-pointer hover:shadow transition-all group duration-200"
          >
            Partner With Us
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="nav-mobile-admin"
            onClick={() => handleNavClick('admin')}
            className="p-2 rounded-full border border-[#685B53]/30 text-[#685B53]"
            title="CMS Admin Dashboard"
          >
            <ShieldAlert size={18} />
          </button>
          
          <button
            id="nav-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-[#2F3B3B]/5 text-[#2F3B3B] transition-colors cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="nav-mobile-menu" className="lg:hidden absolute top-[73px] left-0 right-0 bg-[#FFEDB7] border-b border-[#685B53]/30 px-6 py-8 flex flex-col gap-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 z-40">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#685B53]/60 tracking-wider uppercase">Menu Navigation</span>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-mobile-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2F3B3B] text-[#FFEDB7]'
                        : 'bg-white/40 text-[#685B53] hover:text-[#2F3B3B] hover:bg-white/75'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-[#685B53]/20" />

          <div className="flex flex-col gap-3">
            <button
              id="nav-mobile-cta-admin"
              onClick={() => handleNavClick('admin')}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#D0542D] text-[#FFEDB7]"
            >
              <ShieldAlert size={16} />
              Open CMS Admin Panel
            </button>
            <button
              id="nav-mobile-cta-inquiry"
              onClick={() => {
                setIsOpen(false);
                onOpenInquiry('General');
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-[#4ABA94] text-[#2F3B3B] shadow"
            >
              <Sparkles size={16} />
              Partner With Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
