import React, { useState, useEffect } from 'react';
import { useDatabase } from '../dbState';
import { X, Check, Ticket, Calendar, MapPin, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Event } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  const { createBooking, venues } = useDatabase();

  // Booking states
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<any>(null);
  
  // Clean states on open
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setName('');
      setEmail('');
      setError('');
      setSuccessBooking(null);
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const currentVenue = venues.find((v) => v.id === event.venueId);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please provide your name and email address to receive your ticket.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const result = createBooking(event.id, name, email, quantity);
    if (result.success && result.booking) {
      setSuccessBooking(result.booking);
      setError('');
    } else {
      setError(result.message || 'Booking failed.');
    }
  };

  const ticketPrice = event.price;
  const totalPrice = ticketPrice * quantity;

  return (
    <div id="ticket-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F3B3B]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="ticket-modal-container"
        className="relative w-full max-w-lg bg-[#FFEDB7] border-2 border-[#685B53] rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          id="close-ticket-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#685B53]/10 text-[#2F3B3B] transition-colors"
        >
          <X size={20} />
        </button>

        {successBooking ? (
          /* SUCCESS STUB SCREEN (Unbox Extraordinary Ticket) */
          <div id="ticket-unboxing-screen" className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1 text-[#4ABA94] bg-[#2F3B3B] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-bounce">
                <Sparkles size={14} />
                Extraordinary Unboxed
              </div>
              <h3 className="font-display text-2xl font-black text-[#2F3B3B]">
                Your Pass is Ready
              </h3>
              <p className="text-xs text-[#685B53]">
                Show this digital receipt or barcode at the venue checkpoint.
              </p>
            </div>

            {/* Visual Retro-Staged Pass Design */}
            <div className="relative border-2 border-dashed border-[#685B53] bg-white rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-sm">
              {/* Semi-circular notch details */}
              <div className="absolute -left-3 top-[65%] -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFEDB7] border-r-2 border-[#685B53]"></div>
              <div className="absolute -right-3 top-[65%] -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFEDB7] border-l-2 border-[#685B53]"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-[#685B53] uppercase tracking-widest block">Event Pass</span>
                    <h4 className="font-display font-extrabold text-[#2F3B3B] text-base leading-tight mt-1">{event.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-[#685B53] uppercase tracking-widest block">Access Type</span>
                    <span className="px-2.5 py-1 bg-[#4ABA94]/20 text-[#2F3B3B] text-[10px] font-extrabold rounded-md block mt-1">VIP Guest</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-[#685B53]/60 uppercase tracking-widest block">Date & Time</span>
                    <p className="font-semibold text-[#2F3B3B] mt-0.5">{event.date}</p>
                    <p className="text-[#685B53] text-[10px]">{event.time}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#685B53]/60 uppercase tracking-widest block">Venue</span>
                    <p className="font-semibold text-[#2F3B3B] mt-0.5">{currentVenue?.name || 'Curated Location'}</p>
                    <p className="text-[#685B53] text-[10px] truncate">{currentVenue?.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-[#685B53]/15 pt-3 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-[#685B53]/50 uppercase tracking-widest block">Quantity</span>
                    <p className="font-bold text-[#2F3B3B] mt-0.5">{successBooking.ticketQuantity} Ticket(s)</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#685B53]/50 uppercase tracking-widest block">Amount Paid</span>
                    <p className="font-bold text-[#D0542D] mt-0.5">${successBooking.totalPaid}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-[#685B53]/50 uppercase tracking-widest block">Pass Owner</span>
                    <p className="font-bold text-[#2F3B3B] mt-0.5 truncate">{successBooking.name}</p>
                  </div>
                </div>
              </div>

              {/* Dotted divide & Barcode */}
              <div className="border-t-2 border-dashed border-[#685B53]/30 mt-5 pt-4 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-stretch h-10 gap-0.5">
                  {/* Draw simple simulated barcode lines */}
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-[#2F3B3B] ${
                        i % 7 === 0 || i % 11 === 0 ? 'w-1.5' : i % 3 === 0 ? 'w-0.5' : 'w-1'
                      } ${i % 5 === 0 ? 'opacity-30' : 'opacity-100'}`}
                    ></div>
                  ))}
                </div>
                <span className="font-mono text-[9px] text-[#685B53] uppercase tracking-wider">
                  MNG-BK-${successBooking.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white/40 border border-[#685B53]/10 rounded-2xl">
              <Check className="text-[#4ABA94]" size={16} />
              <p className="text-[11px] text-[#685B53] leading-relaxed">
                A high-fidelity confirmation and calendar invite has been dispatched to <strong className="text-[#2F3B3B]">{successBooking.email}</strong>.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#2F3B3B] hover:bg-[#2F3B3B]/90 text-[#FFEDB7] font-bold rounded-xl transition-all text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* BOOKING CHECKOUT FORM */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#4ABA94]">
                <Ticket size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Immediate Booking</span>
              </div>
              <h3 className="font-display text-2xl font-black text-[#2F3B3B]">
                Secure Your Pass
              </h3>
              <p className="text-xs text-[#685B53]">
                {event.title}
              </p>
            </div>

            {/* Quick Event Summary Card */}
            <div className="p-4 bg-white/40 border border-[#685B53]/20 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#2F3B3B]">
                <Calendar size={14} className="text-[#D0542D]" />
                <span className="font-semibold">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-[#685B53]">
                <MapPin size={14} className="text-[#4ABA94]" />
                <span>{currentVenue?.name || 'To Be Announced'} ({currentVenue?.address})</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-[#685B53]/10">
                <span className="font-semibold text-[#685B53]">Single Ticket Price:</span>
                <span className="font-bold text-[#2F3B3B]">${ticketPrice} USD</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              {/* Ticket Quantity Picker */}
              <div className="space-y-1.5 bg-white/50 p-4 border border-[#685B53]/10 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Quantity</span>
                  <span className="text-[10px] text-[#685B53]/70">{event.ticketsLeft} ticket(s) remaining</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-[#685B53] flex items-center justify-center font-bold text-[#2F3B3B] hover:bg-[#2F3B3B]/10 select-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-display font-bold text-lg text-[#2F3B3B] min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(event.ticketsLeft, quantity + 1))}
                    className="w-8 h-8 rounded-full border border-[#685B53] flex items-center justify-center font-bold text-[#2F3B3B] hover:bg-[#2F3B3B]/10 select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter pass owner's full name"
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#685B53] uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white border border-[#685B53]/30 focus:border-[#4ABA94] outline-none rounded-xl px-4 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Price Calculation and Razorpay / Stripe Placeholder notification */}
              <div className="border-t border-[#685B53]/20 pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#685B53]">Total Balance:</span>
                  <span className="font-display font-black text-xl text-[#D0542D]">${totalPrice} USD</span>
                </div>
                
                <div className="flex gap-2 p-2.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-[10px] leading-relaxed">
                  <AlertTriangle className="shrink-0 text-amber-700" size={14} />
                  <span>
                    Sandbox Mode Enabled. In compliance with client requests, payments integration remains structurally prepared. Completing this order will directly book tickets instantly.
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-sm rounded-xl cursor-pointer hover:shadow transition-all group duration-200"
              >
                Complete Ticket Checkout
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
