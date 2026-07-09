import React, { useState } from 'react';
import { useDatabase } from '../dbState';
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Send, Sparkles, Check, Globe, Building } from 'lucide-react';
import { InquiryType } from '../types';

export const Contact: React.FC = () => {
  const { addInquiry, settings } = useDatabase();

  const getSetting = (key: string, fallback: string) => {
    const found = settings?.find((s) => s.key === key);
    return found ? found.value : fallback;
  };

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<InquiryType>('General');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError('Please provide all required fields (*).');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    addInquiry(name, email, phone, type, message, company);
    setSubmitted(true);
    setError('');

    // Clear form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
  };

  // Safe parse social links
  let socialLinks = { instagram: 'https://instagram.com/mangobox', facebook: 'https://facebook.com/mangobox', twitter: 'https://twitter.com/mangobox' };
  try {
    const rawSocial = getSetting('settings_social_links', '');
    if (rawSocial) {
      socialLinks = { ...socialLinks, ...JSON.parse(rawSocial) };
    }
  } catch (e) {
    // Keep default
  }

  return (
    <div id="contact-page" className="pb-20 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-16">
      
      {/* Header */}
      <section className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D0542D]">
          <Sparkles size={14} />
          <span>Get in touch</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2F3B3B] tracking-tight uppercase">
          Co-Create
        </h1>
        <p className="text-sm text-[#685B53] max-w-md mx-auto">
          Unbox your next activation. Send us a message and our design teams will prepare a custom spatial blueprint.
        </p>
      </section>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact details + Stylized Mock Map */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-6">
            <h3 className="font-display font-black text-xl text-[#2F3B3B] tracking-tight uppercase">
              The Headquarters
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#685B53]">
              <div className="flex gap-3.5 items-start">
                <MapPin size={18} className="text-[#4ABA94] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2F3B3B]">MangoBox Experience HQ</strong>
                  <p className="mt-0.5">{getSetting('contact_address', '77 Curation Blvd, Suite 400, Creative District')}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-center">
                <Phone size={18} className="text-[#D0542D] shrink-0" />
                <span>{getSetting('contact_phone', '+1 (555) 987-CURA')}</span>
              </div>

              <div className="flex gap-3.5 items-center">
                <Mail size={18} className="text-[#4ABA94] shrink-0" />
                <span>{getSetting('contact_email', 'events@mangobox.curation')}</span>
              </div>
            </div>
          </div>

          {/* Stylized vector map representation */}
          <div className="relative border-2 border-[#685B53] bg-[#2F3B3B] rounded-3xl overflow-hidden p-6 h-60 flex flex-col justify-between shadow-inner">
            {/* Draw beautiful vector-like street guides */}
            <div className="absolute inset-0 opacity-10">
              {/* Vertical grids */}
              <div className="absolute left-[20%] top-0 bottom-0 w-1.5 bg-white"></div>
              <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-white"></div>
              <div className="absolute left-[80%] top-0 bottom-0 w-1 bg-white"></div>
              {/* Horizontal grids */}
              <div className="absolute top-[30%] left-0 right-0 h-1 bg-white"></div>
              <div className="absolute top-[60%] left-0 right-0 h-1.5 bg-white"></div>
              {/* Diagonals */}
              <div className="absolute top-0 bottom-0 left-[10%] right-[30%] border-l-2 border-white rotate-12"></div>
            </div>

            {/* Map Pin Anchor */}
            <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#4ABA94] flex items-center justify-center text-white border-2 border-[#FFEDB7] animate-bounce shadow-lg">
                <Building size={14} />
              </div>
              <div className="px-2.5 py-1 bg-[#FFEDB7] text-[#2F3B3B] border border-[#685B53] rounded-md text-[9px] font-black uppercase mt-1">
                MangoBox HQ
              </div>
            </div>

            <div className="relative text-white z-10 text-[9px] font-mono tracking-widest uppercase text-[#FFEDB7]/60">
              SENSORY MATRIX GRAPHIC MAP
            </div>
            
            <div className="relative text-white z-10 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-[#4ABA94] block">LATITUDE / LONGITUDE</span>
                <span className="font-mono text-[9px] text-[#FFEDB7]/60">37.7749° N, 122.4194° W</span>
              </div>
              <Globe size={18} className="text-[#FFEDB7]/40" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-display font-extrabold text-[#2F3B3B] text-xs uppercase tracking-widest text-[#D0542D]">
              Social Broadcast
            </h4>
            <div className="flex items-center gap-3">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-[#685B53]/25 text-xs font-bold text-[#685B53] hover:text-[#2F3B3B] hover:border-[#2F3B3B] transition-colors">
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-[#685B53]/25 text-xs font-bold text-[#685B53] hover:text-[#2F3B3B] hover:border-[#2F3B3B] transition-colors">
                <Twitter size={14} />
                <span>Twitter</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[40px] border-2 border-[#685B53] p-6 md:p-8 space-y-6 shadow-md">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#4ABA94] rounded-full flex items-center justify-center mx-auto text-[#FFEDB7] shadow-lg">
                  <Check size={36} className="stroke-[3]" />
                </div>
                <h3 className="font-display text-2xl font-black text-[#2F3B3B] uppercase">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-[#685B53] max-w-sm mx-auto leading-relaxed">
                  Thank you. Your dossier brief has been compiled and routed directly to our chief designer. We will contact you with mock proposals or schedules shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-[#2F3B3B] text-[#FFEDB7] font-bold rounded-full text-xs"
                >
                  Send another brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-[#2F3B3B] uppercase">
                    Submit Curation Brief
                  </h3>
                  <p className="text-xs text-[#685B53]">
                    Fields marked with (*) are required.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-bold">
                    {error}
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@domain.com"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 0100"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Company / Brand</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Dropdown Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Inquiry Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InquiryType)}
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Corporate">Corporate Activations</option>
                    <option value="Artist">Artist Bookings</option>
                    <option value="Venue">Venue Partnerships</option>
                    <option value="Sponsor">Sponsor relations</option>
                    <option value="Custom">Custom Event Planning</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Message Details *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the project scale, dates, target guest count, and creative mood..."
                    rows={5}
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-all group duration-200"
                >
                  Send Inquiry Brief
                  <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
