import React, { useState, useEffect } from 'react';
import { useDatabase } from '../dbState';
import { X, Check, Mail, Phone, Briefcase, User, MessageSquare, Send, Sparkles } from 'lucide-react';
import { InquiryType } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: InquiryType;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  initialType = 'General'
}) => {
  const { addInquiry, artists, venues } = useDatabase();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<InquiryType>(initialType);
  const [message, setMessage] = useState('');
  
  // Custom context helpers
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Sync type with prop
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setSubmitted(false);
      setError('');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Compose final message if artist or venue is selected
    let finalMessage = message;
    if (type === 'Artist' && selectedArtistId) {
      const art = artists.find((a) => a.id === selectedArtistId);
      if (art) {
        finalMessage = `[ARTIST BOOKING REQUEST: ${art.name}]\n\n${message}`;
      }
    } else if (type === 'Venue' && selectedVenueId) {
      const ven = venues.find((v) => v.id === selectedVenueId);
      if (ven) {
        finalMessage = `[VENUE PARTNERSHIP REQUEST: ${ven.name}]\n\n${message}`;
      }
    }

    addInquiry(name, email, phone, type, finalMessage, company);
    setSubmitted(true);
    setError('');

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
    setSelectedArtistId('');
    setSelectedVenueId('');
  };

  return (
    <div id="lead-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F3B3B]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="lead-modal-container"
        className="relative w-full max-w-lg bg-[#FFEDB7] border-2 border-[#685B53] rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          id="close-lead-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#685B53]/10 text-[#2F3B3B] transition-colors"
        >
          <X size={20} />
        </button>

        {submitted ? (
          /* Success Screen */
          <div id="lead-success-screen" className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-[#4ABA94] rounded-full flex items-center justify-center mx-auto text-[#FFEDB7] shadow-lg">
              <Check size={36} className="stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-black text-[#2F3B3B]">
                Inquiry Logged successfully
              </h3>
              <p className="text-sm text-[#685B53] max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to MangoBox. Our creative director has been notified, and we will get back to you with conceptual sketches or proposals within 24 hours.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/40 border border-[#685B53]/10 max-w-xs mx-auto">
              <p className="text-xs text-[#2F3B3B] font-mono uppercase tracking-wider">
                Status: Pending curation
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#2F3B3B] hover:bg-[#2F3B3B]/90 text-[#FFEDB7] font-bold rounded-full transition-all text-sm"
            >
              Back to site
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#D0542D]">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Experience Proposal</span>
              </div>
              <h3 className="font-display text-2xl font-black text-[#2F3B3B]">
                Unbox Your Next Event
              </h3>
              <p className="text-xs text-[#685B53]">
                Fill out the brief and our solution architects will design a premium immersive activation.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inquiry Type Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Inquiry Channel</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white/40 rounded-xl border border-[#685B53]/20">
                  {(['General', 'Corporate', 'Artist', 'Venue', 'Sponsor', 'Custom'] as InquiryType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                        type === t
                          ? 'bg-[#2F3B3B] text-[#FFEDB7] shadow-sm'
                          : 'text-[#685B53] hover:text-[#2F3B3B]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#685B53]/50" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#685B53]/50" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#685B53]/50" size={16} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555-0100"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Company / Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Company / Brand</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#685B53]/50" size={16} />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Options: Artists */}
              {type === 'Artist' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Select Artist Roster</label>
                  <select
                    value={selectedArtistId}
                    onChange={(e) => setSelectedArtistId(e.target.value)}
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option value="">-- General Artist Inquiry --</option>
                    {artists.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.name} ({art.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Options: Venues */}
              {type === 'Venue' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Select Venue Partner</label>
                  <select
                    value={selectedVenueId}
                    onChange={(e) => setSelectedVenueId(e.target.value)}
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option value="">-- General Venue Partnership --</option>
                    {venues.map((ven) => (
                      <option key={ven.id} value={ven.id}>
                        {ven.name} - Cap {ven.capacity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Brief / Details *</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3 text-[#685B53]/50" size={16} />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the desired date, volume of guests, theme requirements, acoustic desires..."
                    rows={4}
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] focus:ring-1 focus:ring-[#4ABA94] outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ABA94] hover:bg-[#4ABA94]/95 text-[#2F3B3B] font-extrabold text-sm rounded-xl cursor-pointer hover:shadow transition-all group duration-200"
              >
                Submit Curation Brief
                <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
