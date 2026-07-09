import React, { useState, useEffect } from 'react';
import { useDatabase } from '../dbState';
import {
  TrendingUp, Users, Ticket, Mail, Calendar, Sparkles, Plus, Edit, Trash2, CheckCircle2,
  AlertCircle, ShieldCheck, Lock, LogIn, ChevronRight, Settings, Sliders, Music, MapPin, Briefcase,
  Image as ImageIcon, BookOpen, MessageSquare, Building2, HelpCircle, Upload, Check, Loader2
} from 'lucide-react';
import { Event, Service, Artist, Venue, ContactInquiry, TicketBooking, InquiryType } from '../types';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess, currentUrl, label }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mb_auth_token')}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.url) {
        onUploadSuccess(data.url);
      } else {
        throw new Error('No URL in response');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="font-bold text-[#685B53] uppercase tracking-wider block">{label}</label>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative flex flex-col items-center justify-center min-h-[100px] ${
          dragActive ? 'border-[#4ABA94] bg-[#4ABA94]/5' : 'border-[#685B53]/30 hover:border-[#685B53]/50 bg-white'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#4ABA94] animate-spin" />
            <span className="text-[11px] font-bold text-[#685B53]">Uploading to Cloudinary...</span>
          </div>
        ) : currentUrl ? (
          <div className="flex items-center gap-3">
            <img src={currentUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#685B53]/20" />
            <div className="text-left">
              <span className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                <Check size={12} /> Uploaded Successfully
              </span>
              <span className="text-[10px] text-[#685B53] block truncate max-w-[150px]">{currentUrl}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload size={20} className="text-[#685B53]/60" />
            <span className="text-[11px] text-[#685B53] font-medium">
              Drag & drop image here or <span className="text-[#4ABA94] underline font-bold">browse</span>
            </span>
            <span className="text-[9px] text-[#685B53]/60">Supports JPG, PNG, WEBP</span>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-red-600 font-bold">{error}</p>}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  // DB State Hooks
  const {
    services, addService, updateService, deleteService,
    experiences, addExperience, updateExperience, deleteExperience,
    venues, addVenue, updateVenue, deleteVenue,
    artists, addArtist, updateArtist, deleteArtist,
    events, addEvent, updateEvent, deleteEvent,
    gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
    blogs, addBlogPost, updateBlogPost, deleteBlogPost,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    partners, addPartner, updatePartner, deletePartner,
    faqs, addFaq, updateFaq, deleteFaq,
    inquiries, updateInquiryStatus, deleteInquiry,
    subscribers, deleteSubscriber,
    bookings, cancelBooking,
    settings, updateSetting,
    // Real Auth props
    isAdmin, loginWithEmail, loginWithGoogle, logout, authError: dbAuthError
  } = useDatabase();

  // AUTH STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/config')
      .then((res) => res.json())
      .then((data) => {
        setIsGoogleConfigured(!!data.googleConfigured);
      })
      .catch((err) => {
        console.error('Failed to fetch auth configuration:', err);
        setIsGoogleConfigured(false);
      });
  }, []);

  // TABS & FORMS STATE
  const [activeTab, setActiveTab] = useState<'kpis' | 'events' | 'services' | 'artists' | 'venues' | 'gallery' | 'blogs' | 'testimonials' | 'partners' | 'faqs' | 'leads' | 'bookings' | 'settings'>('kpis');
  
  // Modals / Editors state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // AUTH TRIGGER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    await loginWithEmail(email, password);
    setAuthLoading(false);
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    await loginWithGoogle();
    setAuthLoading(false);
  };

  // KPI STATS CALCULATION
  const totalSalesRevenue = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const totalTicketsBooked = bookings.reduce((sum, b) => sum + b.ticketQuantity, 0);
  const pendingInquiries = inquiries.filter((i) => i.status === 'PENDING').length;
  const activeSubscriberCount = subscribers.filter((s) => s.status === 'ACTIVE').length;

  // --- CRUD FORM SUBMISSION HANDLING ---
  const [eventForm, setEventForm] = useState({
    title: '', category: 'Club' as Event['category'], date: '', time: '',
    venueId: '', price: 30, totalTickets: 100, description: '', artists: [] as string[]
  });

  const [artistForm, setArtistForm] = useState({
    name: '', role: '', bio: '', image: '', gallery: [] as string[],
    socialLinks: { instagram: '', spotify: '' }
  });

  const [serviceForm, setServiceForm] = useState({
    title: '', category: 'Nightlife' as Service['category'],
    description: '', longDescription: '', iconName: 'Sparkles', image: ''
  });

  const [venueForm, setVenueForm] = useState({
    name: '', address: '', capacity: 100, amenities: '', description: '', images: [] as string[]
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '', description: '', imageUrl: '', category: 'Concert' as 'Concert' | 'Nightlife' | 'Workshop' | 'Corporate' | 'Private', date: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', date: '', readTime: '',
    authorName: '', authorRole: '', authorAvatarUrl: '', image: '',
    category: 'Nightlife' as 'Nightlife' | 'Branding' | 'Culture' | 'Curation', featured: false, status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED'
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', company: '', content: '', rating: 5, image: ''
  });

  const [partnerForm, setPartnerForm] = useState({
    name: '', logo: '', website: '', type: ''
  });

  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', order: 0
  });

  // Trigger forms population on Edit mode
  const populateEventForm = (ev: Event) => {
    setEventForm({
      title: ev.title, category: ev.category, date: ev.date, time: ev.time,
      venueId: ev.venueId, price: ev.price, totalTickets: ev.totalTickets,
      description: ev.description, artists: ev.artists
    });
    setEditingItemId(ev.id);
    setIsCreating(true);
  };

  const populateArtistForm = (a: Artist) => {
    setArtistForm({
      name: a.name, role: a.role, bio: a.bio, image: a.image, gallery: a.gallery,
      socialLinks: { instagram: a.socialLinks.instagram || '', spotify: a.socialLinks.spotify || '' }
    });
    setEditingItemId(a.id);
    setIsCreating(true);
  };

  const populateServiceForm = (s: Service) => {
    setServiceForm({
      title: s.title, category: s.category, description: s.description,
      longDescription: s.longDescription, iconName: s.iconName, image: s.image
    });
    setEditingItemId(s.id);
    setIsCreating(true);
  };

  const populateVenueForm = (v: Venue) => {
    setVenueForm({
      name: v.name, address: v.address, capacity: v.capacity,
      amenities: v.amenities.join(', '), description: v.description, images: v.images
    });
    setEditingItemId(v.id);
    setIsCreating(true);
  };

  const populateGalleryForm = (item: any) => {
    setGalleryForm({
      title: item.title, description: item.description, imageUrl: item.imageUrl,
      category: item.category, date: item.date
    });
    setEditingItemId(item.id);
    setIsCreating(true);
  };

  const populateBlogForm = (post: any) => {
    setBlogForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      date: post.date, readTime: post.readTime,
      authorName: post.author?.name || post.authorName || '',
      authorRole: post.author?.role || post.authorRole || '',
      authorAvatarUrl: post.author?.avatarUrl || post.authorAvatarUrl || '',
      image: post.image, category: post.category, featured: !!post.featured,
      status: post.status || 'PUBLISHED'
    });
    setEditingItemId(post.id);
    setIsCreating(true);
  };

  const populateTestimonialForm = (t: any) => {
    setTestimonialForm({
      name: t.name, role: t.role, company: t.company, content: t.content,
      rating: Number(t.rating), image: t.image
    });
    setEditingItemId(t.id);
    setIsCreating(true);
  };

  const populatePartnerForm = (p: any) => {
    setPartnerForm({
      name: p.name, logo: p.logo, website: p.website, type: p.type
    });
    setEditingItemId(p.id);
    setIsCreating(true);
  };

  const populateFaqForm = (f: any) => {
    setFaqForm({
      question: f.question, answer: f.answer, order: Number(f.order)
    });
    setEditingItemId(f.id);
    setIsCreating(true);
  };

  const resetForms = () => {
    setIsCreating(false);
    setEditingItemId(null);
    setEventForm({ title: '', category: 'Club', date: '', time: '', venueId: '', price: 30, totalTickets: 100, description: '', artists: [] });
    setArtistForm({ name: '', role: '', bio: '', image: '', gallery: [], socialLinks: { instagram: '', spotify: '' } });
    setServiceForm({ title: '', category: 'Nightlife', description: '', longDescription: '', iconName: 'Sparkles', image: '' });
    setVenueForm({ name: '', address: '', capacity: 100, amenities: '', description: '', images: [] });
    setGalleryForm({ title: '', description: '', imageUrl: '', category: 'Concert', date: '' });
    setBlogForm({
      title: '', excerpt: '', content: '', date: '', readTime: '',
      authorName: '', authorRole: '', authorAvatarUrl: '', image: '',
      category: 'Nightlife', featured: false, status: 'PUBLISHED'
    });
    setTestimonialForm({ name: '', role: '', company: '', content: '', rating: 5, image: '' });
    setPartnerForm({ name: '', logo: '', website: '', type: '' });
    setFaqForm({ question: '', answer: '', order: 0 });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'events') {
      if (!eventForm.title || !eventForm.venueId || !eventForm.date || !eventForm.time) return;
      const dataPayload = {
        title: eventForm.title,
        category: eventForm.category,
        date: eventForm.date,
        time: eventForm.time,
        venueId: eventForm.venueId,
        price: Number(eventForm.price),
        totalTickets: Number(eventForm.totalTickets),
        description: eventForm.description,
        artists: eventForm.artists,
        schedule: [
          { time: '21:00', activity: 'Doors Open' },
          { time: '23:30', activity: 'Main Act Set' }
        ],
        faqs: [
          { question: 'Is parking available?', answer: 'Yes, full security parking is provided on-site.' }
        ],
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
        gallery: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
        ],
        featured: true
      };

      if (editingItemId) {
        updateEvent(editingItemId, dataPayload);
      } else {
        addEvent(dataPayload);
      }
    } else if (activeTab === 'artists') {
      if (!artistForm.name || !artistForm.role) return;
      const dataPayload = {
        name: artistForm.name,
        role: artistForm.role,
        bio: artistForm.bio,
        image: artistForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        gallery: artistForm.gallery.length > 0 ? artistForm.gallery : ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'],
        socialLinks: artistForm.socialLinks,
        featured: true
      };

      if (editingItemId) {
        updateArtist(editingItemId, dataPayload);
      } else {
        addArtist(dataPayload);
      }
    } else if (activeTab === 'services') {
      if (!serviceForm.title || !serviceForm.description) return;
      const dataPayload = {
        title: serviceForm.title,
        category: serviceForm.category,
        description: serviceForm.description,
        longDescription: serviceForm.longDescription || serviceForm.description,
        iconName: serviceForm.iconName,
        image: serviceForm.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
      };

      if (editingItemId) {
        updateService(editingItemId, dataPayload);
      } else {
        addService(dataPayload);
      }
    } else if (activeTab === 'venues') {
      if (!venueForm.name || !venueForm.address) return;
      const amenitiesList = venueForm.amenities.split(',').map((item) => item.trim()).filter(Boolean);
      const dataPayload = {
        name: venueForm.name,
        address: venueForm.address,
        capacity: Number(venueForm.capacity),
        amenities: amenitiesList,
        description: venueForm.description,
        images: venueForm.images.length > 0 ? venueForm.images : ['https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800'],
        pastEventsCount: 0,
        featured: true
      };

      if (editingItemId) {
        updateVenue(editingItemId, dataPayload);
      } else {
        addVenue(dataPayload);
      }
    } else if (activeTab === 'gallery') {
      if (!galleryForm.title || !galleryForm.imageUrl) return;
      const dataPayload = {
        title: galleryForm.title,
        description: galleryForm.description,
        imageUrl: galleryForm.imageUrl,
        category: galleryForm.category,
        date: galleryForm.date || new Date().toISOString().split('T')[0]
      };
      if (editingItemId) {
        updateGalleryItem(editingItemId, dataPayload);
      } else {
        addGalleryItem(dataPayload);
      }
    } else if (activeTab === 'blogs') {
      if (!blogForm.title || !blogForm.content) return;
      const dataPayload = {
        title: blogForm.title,
        excerpt: blogForm.excerpt || blogForm.content.slice(0, 150) + '...',
        content: blogForm.content,
        date: blogForm.date || new Date().toISOString().split('T')[0],
        readTime: blogForm.readTime || '5 min read',
        authorName: blogForm.authorName || 'Editor',
        authorRole: blogForm.authorRole || 'Content Manager',
        authorAvatarUrl: blogForm.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        image: blogForm.image || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800',
        category: blogForm.category,
        featured: !!blogForm.featured,
        status: blogForm.status
      };
      if (editingItemId) {
        updateBlogPost(editingItemId, dataPayload);
      } else {
        addBlogPost(dataPayload);
      }
    } else if (activeTab === 'testimonials') {
      if (!testimonialForm.name || !testimonialForm.content) return;
      const dataPayload = {
        name: testimonialForm.name,
        role: testimonialForm.role,
        company: testimonialForm.company,
        content: testimonialForm.content,
        rating: Number(testimonialForm.rating),
        image: testimonialForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      };
      if (editingItemId) {
        updateTestimonial(editingItemId, dataPayload);
      } else {
        addTestimonial(dataPayload);
      }
    } else if (activeTab === 'partners') {
      if (!partnerForm.name || !partnerForm.logo) return;
      const dataPayload = {
        name: partnerForm.name,
        logo: partnerForm.logo,
        website: partnerForm.website,
        type: partnerForm.type
      };
      if (editingItemId) {
        updatePartner(editingItemId, dataPayload);
      } else {
        addPartner(dataPayload);
      }
    } else if (activeTab === 'faqs') {
      if (!faqForm.question || !faqForm.answer) return;
      const dataPayload = {
        question: faqForm.question,
        answer: faqForm.answer,
        order: Number(faqForm.order)
      };
      if (editingItemId) {
        updateFaq(editingItemId, dataPayload);
      } else {
        addFaq(dataPayload);
      }
    }
    resetForms();
  };

  // --- CMS REAL AUTH GATEWAY LOGIN SCREEN ---
  if (!isAdmin) {
    return (
      <div id="admin-login-screen" className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white border-2 border-[#685B53] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D0542D] text-[#FFEDB7] flex items-center justify-center mx-auto shadow-sm animate-pulse">
              <Lock size={24} />
            </div>
            <h2 className="font-display font-black text-2xl text-[#2F3B3B] uppercase tracking-tight">
              CMS Gateway
            </h2>
            <p className="text-xs text-[#685B53]">
              Authorize to access active events, client briefs, and ticket transactions.
            </p>
          </div>

          {dbAuthError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{dbAuthError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#685B53] block">
                Administrative Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@mangobox.curation"
                className="w-full bg-white border border-[#685B53]/30 focus:border-[#D0542D] outline-none rounded-xl px-4 py-2.5 text-sm"
                required
                disabled={authLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#685B53] block">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white border border-[#685B53]/30 focus:border-[#D0542D] outline-none rounded-xl px-4 py-2.5 text-sm"
                required
                disabled={authLoading}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F3B3B] hover:bg-black text-[#FFEDB7] font-bold text-xs rounded-xl cursor-pointer uppercase tracking-wider shadow-sm transition-all disabled:opacity-55"
            >
              <LogIn size={15} />
              {authLoading ? 'Verifying Session...' : 'Sign In With Email'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#685B53]/20" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-[#685B53]/60 font-black tracking-widest text-[9px]">Or Continue With</span></div>
          </div>

          {isGoogleConfigured === false ? (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-[11px] leading-normal flex flex-col gap-1 text-center">
              <span className="font-semibold text-xs flex items-center justify-center gap-1">
                <AlertCircle size={14} className="text-blue-600" />
                Google Sign-In Disabled
              </span>
              <span>
                Google OAuth is not configured on this server. Configure <strong>GOOGLE_CLIENT_ID</strong> and <strong>GOOGLE_CLIENT_SECRET</strong> in your environment to enable single sign-on.
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authLoading || isGoogleConfigured === null}
              className="w-full flex items-center justify-center gap-2 py-3 border border-[#685B53]/40 hover:bg-[#FFEDB7]/10 text-[#2F3B3B] font-bold text-xs rounded-xl cursor-pointer uppercase tracking-wider shadow-sm transition-all disabled:opacity-55"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google OAuth Sign In
            </button>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-900 leading-relaxed text-center">
            🔐 Sandboxed Admin Creds: <strong className="text-[#D0542D]">admin@mangobox.curation</strong> / <strong className="text-[#D0542D]">adminpassword123</strong>
          </div>
        </div>
      </div>
    );
  }

  // --- CMS AUTHORIZED VIEW LAYOUT ---
  return (
    <div id="admin-cms-workspace" className="pb-20 pt-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#685B53]/25 pb-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center gap-1.5 justify-center md:justify-start text-[#4ABA94] font-black text-xs uppercase tracking-widest">
            <ShieldCheck size={16} />
            <span>Secured Workspace Session</span>
          </div>
          <h1 className="font-display font-black text-3xl text-[#2F3B3B] tracking-tight uppercase">
            MangoBox CMS Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-transparent border border-[#685B53]/40 text-xs font-bold text-[#685B53] hover:border-[#D0542D] hover:text-[#D0542D] rounded-full transition-all cursor-pointer"
          >
            Lock Terminal
          </button>
          <div className="px-4 py-2 bg-[#4ABA94]/25 text-[#2F3B3B] border border-[#4ABA94]/40 rounded-full text-xs font-black uppercase tracking-wider">
            Role: SuperAdmin
          </div>
        </div>
      </div>

      {/* Grid Dashboard Sidebar + Content Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Tabs Controls */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar p-1.5 bg-white/50 border border-[#685B53]/15 rounded-[24px]">
          {[
            { id: 'kpis', label: 'Overview Metrics', icon: <TrendingUp size={16} /> },
            {id: 'events', label: 'Ticketing Events', icon: <Ticket size={16} /> },
            { id: 'services', label: 'Curation Services', icon: <Briefcase size={16} /> },
            { id: 'artists', label: 'Artist Managers', icon: <Music size={16} /> },
            { id: 'venues', label: 'Partner Venues', icon: <MapPin size={16} /> },
            { id: 'gallery', label: 'Gallery Showcase', icon: <ImageIcon size={16} /> },
            { id: 'blogs', label: 'Blogs & Articles', icon: <BookOpen size={16} /> },
            { id: 'testimonials', label: 'Client Feedback', icon: <MessageSquare size={16} /> },
            { id: 'partners', label: 'Sponsor Partners', icon: <Building2 size={16} /> },
            { id: 'faqs', label: 'General FAQs', icon: <HelpCircle size={16} /> },
            { id: 'leads', label: 'Brief Inquiries', icon: <Mail size={16} /> },
            { id: 'bookings', label: 'Billing Audits', icon: <Sliders size={16} /> },
            { id: 'settings', label: 'Website CMS / Settings', icon: <Settings size={16} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  resetForms();
                }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 text-left ${
                  isActive
                    ? 'bg-[#2F3B3B] text-[#FFEDB7]'
                    : 'text-[#685B53] hover:text-[#2F3B3B] hover:bg-[#2F3B3B]/5'
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Canvas */}
        <div className="lg:col-span-9 space-y-6">

          {/* KPI MODULE */}
          {activeTab === 'kpis' && (
            <div id="cms-kpi-panel" className="space-y-8 animate-in fade-in duration-200">
              
              {/* KPIs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Sales */}
                <div className="bg-white p-5 rounded-2xl border border-[#685B53]/15 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#685B53] tracking-widest block">Total Sales</span>
                  <p className="font-display font-black text-2xl text-[#D0542D]">${totalSalesRevenue} USD</p>
                  <p className="text-[9px] text-[#685B53]/60">Checkout conversions synced</p>
                </div>

                {/* Tickets Sold */}
                <div className="bg-white p-5 rounded-2xl border border-[#685B53]/15 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#685B53] tracking-widest block">Tickets Issued</span>
                  <p className="font-display font-black text-2xl text-[#2F3B3B]">{totalTicketsBooked} Passes</p>
                  <p className="text-[9px] text-[#685B53]/60">At security gates</p>
                </div>

                {/* Pending Briefs */}
                <div className="bg-white p-5 rounded-2xl border border-[#685B53]/15 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#685B53] tracking-widest block">Active Briefs</span>
                  <p className="font-display font-black text-2xl text-[#4ABA94]">{pendingInquiries} Proposals</p>
                  <p className="text-[9px] text-[#685B53]/60">Require curation blueprints</p>
                </div>

                {/* Subscribers */}
                <div className="bg-white p-5 rounded-2xl border border-[#685B53]/15 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#685B53] tracking-widest block">Subscribers</span>
                  <p className="font-display font-black text-2xl text-[#2F3B3B]">{activeSubscriberCount} Mailers</p>
                  <p className="text-[9px] text-[#685B53]/60">Dispatch loop readers</p>
                </div>

              </div>

              {/* Sales Curve Graphic Chart */}
              <div className="bg-white p-6 rounded-[32px] border border-[#685B53]/20 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#2F3B3B] tracking-tight">Sales Velocity</h3>
                    <p className="text-[11px] text-[#685B53]">Daily transaction indices</p>
                  </div>
                  <span className="text-[10px] font-black text-[#4ABA94] uppercase bg-[#4ABA94]/15 px-2 py-0.5 rounded-md">
                    Live telemetry
                  </span>
                </div>

                {/* SVG vector chart line */}
                <div className="w-full h-44 bg-[#FFEDB7]/20 border border-[#685B53]/10 rounded-xl relative overflow-hidden p-2 flex items-end">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ABA94" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4ABA94" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area under curve */}
                    <path
                      d="M 0 100 L 0 85 Q 50 60 100 70 T 200 40 T 300 25 T 400 15 L 400 100 Z"
                      fill="url(#salesGrad)"
                    />
                    {/* Line path */}
                    <path
                      d="M 0 85 Q 50 60 100 70 T 200 40 T 300 25 T 400 15"
                      fill="none"
                      stroke="#4ABA94"
                      strokeWidth="2.5"
                    />
                  </svg>
                  
                  {/* Grid Labels */}
                  <div className="w-full flex justify-between text-[9px] text-[#685B53]/60 font-mono relative z-10 px-2">
                    <span>Q3 Starts</span>
                    <span>Mid July</span>
                    <span>Peak Aug</span>
                    <span>Sept Projection</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* DYNAMIC CRUD ENGINE FOR EVENTS, SERVICES, ARTISTS, VENUES, GALLERY, BLOGS, TESTIMONIALS, PARTNERS, FAQS */}
          {activeTab !== 'kpis' && activeTab !== 'leads' && activeTab !== 'bookings' && activeTab !== 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xl text-[#2F3B3B] uppercase tracking-tight">
                  {activeTab === 'faqs' ? 'FAQ' : activeTab === 'gallery' ? 'Gallery' : activeTab} Management Panel
                </h3>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    Add New {activeTab === 'gallery' ? 'Gallery Item' : activeTab === 'blogs' ? 'Blog Post' : activeTab === 'testimonials' ? 'Testimonial' : activeTab === 'partners' ? 'Partner' : activeTab === 'faqs' ? 'FAQ' : activeTab.slice(0, -1)}
                  </button>
                )}
              </div>

              {/* Conditional Add / Edit Forms */}
              {isCreating && (
                <div className="bg-white border-2 border-[#685B53] rounded-3xl p-6 md:p-8 space-y-6 shadow-md animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center border-b border-[#685B53]/15 pb-3">
                    <h4 className="font-display font-extrabold text-base text-[#2F3B3B]">
                      {editingItemId ? `Edit ${activeTab === 'gallery' ? 'Gallery Item' : activeTab === 'blogs' ? 'Blog Post' : activeTab === 'testimonials' ? 'Testimonial' : activeTab === 'partners' ? 'Partner' : activeTab === 'faqs' ? 'FAQ' : activeTab.slice(0, -1)} Details` : `Create New ${activeTab === 'gallery' ? 'Gallery Item' : activeTab === 'blogs' ? 'Blog Post' : activeTab === 'testimonials' ? 'Testimonial' : activeTab === 'partners' ? 'Partner' : activeTab === 'faqs' ? 'FAQ' : activeTab.slice(0, -1)}`}
                    </h4>
                    <button onClick={resetForms} className="text-xs text-[#685B53] hover:text-[#D0542D]">Cancel</button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                    
                    {/* 1. Event CRUD Forms */}
                    {activeTab === 'events' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Event Title</label>
                            <input
                              type="text"
                              value={eventForm.title}
                              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                              placeholder="e.g. Neon Velvet Special Edition"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Category Channel</label>
                            <select
                              value={eventForm.category}
                              onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            >
                              <option value="Club">Club night</option>
                              <option value="Workshop">Creative workshop</option>
                              <option value="Festival">Creative festival</option>
                              <option value="Private">Private banquet</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Date (YYYY-MM-DD)</label>
                            <input
                              type="date"
                              value={eventForm.date}
                              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Duration Time slot</label>
                            <input
                              type="text"
                              value={eventForm.time}
                              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                              placeholder="e.g. 21:00 - 03:00"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Select Venue Location</label>
                            <select
                              value={eventForm.venueId}
                              onChange={(e) => setEventForm({ ...eventForm, venueId: e.target.value })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            >
                              <option value="">-- Choose Venue --</option>
                              {venues.map((v) => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Ticket Price (USD)</label>
                            <input
                              type="number"
                              value={eventForm.price}
                              onChange={(e) => setEventForm({ ...eventForm, price: Number(e.target.value) })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Total Reservation slots</label>
                            <input
                              type="number"
                              value={eventForm.totalTickets}
                              onChange={(e) => setEventForm({ ...eventForm, totalTickets: Number(e.target.value) })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        {/* Artists array select check */}
                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Assign Roster Artists</label>
                          <div className="grid grid-cols-2 gap-2 bg-white/50 p-3 rounded-xl border border-[#685B53]/15">
                            {artists.map((art) => {
                              const checked = eventForm.artists.includes(art.id);
                              return (
                                <label key={art.id} className="flex gap-2 items-center font-semibold text-[#685B53]">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const newList = checked
                                        ? eventForm.artists.filter((id) => id !== art.id)
                                        : [...eventForm.artists, art.id];
                                      setEventForm({ ...eventForm, artists: newList });
                                    }}
                                  />
                                  <span>{art.name} ({art.role})</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Event Description Brief</label>
                          <textarea
                            value={eventForm.description}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Artist CRUD Forms */}
                    {activeTab === 'artists' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Artist Name</label>
                            <input
                              type="text"
                              value={artistForm.name}
                              onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                              placeholder="e.g. DJ Serum"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Artistic Specialty Role</label>
                            <input
                              type="text"
                              value={artistForm.role}
                              onChange={(e) => setArtistForm({ ...artistForm, role: e.target.value })}
                              placeholder="e.g. Techno DJ & Synthesizer Maker"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Avatar Portrait URL</label>
                            <input
                              type="text"
                              value={artistForm.image}
                              onChange={(e) => setArtistForm({ ...artistForm, image: e.target.value })}
                              placeholder="Enter image link"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            />
                          </div>

                          <div className="space-y-1 font-semibold">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Instagram Page</label>
                            <input
                              type="text"
                              value={artistForm.socialLinks.instagram}
                              onChange={(e) => setArtistForm({
                                ...artistForm,
                                socialLinks: { ...artistForm.socialLinks, instagram: e.target.value }
                              })}
                              placeholder="https://instagram.com/handle"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Dossier Biography</label>
                          <textarea
                            value={artistForm.bio}
                            onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. Service CRUD Forms */}
                    {activeTab === 'services' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Service Title</label>
                            <input
                              type="text"
                              value={serviceForm.title}
                              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                              placeholder="e.g. Club & Nightlife Events"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Service Category</label>
                            <select
                              value={serviceForm.category}
                              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            >
                              <option value="Nightlife">Nightlife</option>
                              <option value="Corporate">Corporate</option>
                              <option value="Cultural">Cultural</option>
                              <option value="Bespoke">Bespoke</option>
                              <option value="Creative">Creative</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Service Tagline Description</label>
                          <input
                            type="text"
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            placeholder="Brief blurb displayed on the grid"
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Long Curation Description Methods</label>
                          <textarea
                            value={serviceForm.longDescription}
                            onChange={(e) => setServiceForm({ ...serviceForm, longDescription: e.target.value })}
                            rows={3}
                            placeholder="Full detailed text shown when the panel is unboxed"
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* 4. Venue CRUD Forms */}
                    {activeTab === 'venues' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Venue Name</label>
                            <input
                              type="text"
                              value={venueForm.name}
                              onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                              placeholder="e.g. The Obsidian Warehouse"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Max Capacity</label>
                            <input
                              type="number"
                              value={venueForm.capacity}
                              onChange={(e) => setVenueForm({ ...venueForm, capacity: Number(e.target.value) })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Physical Address</label>
                          <input
                            type="text"
                            value={venueForm.address}
                            onChange={(e) => setVenueForm({ ...venueForm, address: e.target.value })}
                            placeholder="e.g. 404 Industrial Lane, District 12"
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Amenities (comma separated list)</label>
                          <input
                            type="text"
                            value={venueForm.amenities}
                            onChange={(e) => setVenueForm({ ...venueForm, amenities: e.target.value })}
                            placeholder="e.g. L-Acoustics Sound, projection mapping, dual bars"
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Venue Curation Description</label>
                          <textarea
                            value={venueForm.description}
                            onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 5. Gallery CRUD Forms */}
                    {activeTab === 'gallery' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Title</label>
                            <input
                              type="text"
                              value={galleryForm.title}
                              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                              placeholder="e.g. Backstage at MangoBox Showcase"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Category Channel</label>
                            <select
                              value={galleryForm.category}
                              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            >
                              <option value="Concert">Concert</option>
                              <option value="Nightlife">Nightlife</option>
                              <option value="Workshop">Workshop</option>
                              <option value="Corporate">Corporate</option>
                              <option value="Private">Private</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Date (YYYY-MM-DD)</label>
                            <input
                              type="date"
                              value={galleryForm.date}
                              onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <ImageUploader
                            label="Gallery Image"
                            currentUrl={galleryForm.imageUrl}
                            onUploadSuccess={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Curation Description</label>
                          <textarea
                            value={galleryForm.description}
                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                            rows={3}
                            placeholder="Brief context or story behind this capture..."
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 6. Blog CRUD Forms */}
                    {activeTab === 'blogs' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Blog Title</label>
                            <input
                              type="text"
                              value={blogForm.title}
                              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                              placeholder="e.g. The Architecture of Sound Curation"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Category</label>
                            <select
                              value={blogForm.category}
                              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            >
                              <option value="Nightlife">Nightlife</option>
                              <option value="Branding">Branding</option>
                              <option value="Culture">Culture</option>
                              <option value="Curation">Curation</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Publishing Status</label>
                            <select
                              value={blogForm.status}
                              onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2 font-bold text-[#D0542D]"
                            >
                              <option value="DRAFT">DRAFT (Hidden from Public)</option>
                              <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                              <option value="UNPUBLISHED">UNPUBLISHED (Archived)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Estimated Read Time</label>
                            <input
                              type="text"
                              value={blogForm.readTime}
                              onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                              placeholder="e.g. 5 min read"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Publish Date (YYYY-MM-DD)</label>
                            <input
                              type="date"
                              value={blogForm.date}
                              onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ImageUploader
                            label="Blog Hero Cover Image"
                            currentUrl={blogForm.image}
                            onUploadSuccess={(url) => setBlogForm({ ...blogForm, image: url })}
                          />

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="font-bold text-[#685B53] uppercase tracking-wider block">Author Name</label>
                                <input
                                  type="text"
                                  value={blogForm.authorName}
                                  onChange={(e) => setBlogForm({ ...blogForm, authorName: e.target.value })}
                                  placeholder="e.g. Leo Mango"
                                  className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-[#685B53] uppercase tracking-wider block">Author Role</label>
                                <input
                                  type="text"
                                  value={blogForm.authorRole}
                                  onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                                  placeholder="e.g. Principal Curator"
                                  className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                                />
                              </div>
                            </div>
                            <ImageUploader
                              label="Author Avatar"
                              currentUrl={blogForm.authorAvatarUrl}
                              onUploadSuccess={(url) => setBlogForm({ ...blogForm, authorAvatarUrl: url })}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Short Abstract/Excerpt</label>
                          <input
                            type="text"
                            value={blogForm.excerpt}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="An eye-catching 1-2 sentence preview text..."
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Markdown / Content body</label>
                          <textarea
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            rows={8}
                            placeholder="Draft your full-length article here. Markdown syntax is fully supported."
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2.5 font-mono text-xs leading-relaxed"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 7. Testimonial CRUD Forms */}
                    {activeTab === 'testimonials' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Client Name</label>
                            <input
                              type="text"
                              value={testimonialForm.name}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                              placeholder="e.g. Samantha Vance"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Designation/Role</label>
                            <input
                              type="text"
                              value={testimonialForm.role}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                              placeholder="e.g. Lead Brand Producer"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Company</label>
                            <input
                              type="text"
                              value={testimonialForm.company}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                              placeholder="e.g. Solis Digital"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Feedback Rating (1-5)</label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={testimonialForm.rating}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <ImageUploader
                            label="Client Avatar Photo"
                            currentUrl={testimonialForm.image}
                            onUploadSuccess={(url) => setTestimonialForm({ ...testimonialForm, image: url })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Testimonial Content</label>
                          <textarea
                            value={testimonialForm.content}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                            rows={4}
                            placeholder="Paste the review or direct feedback quote here..."
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* 8. Partner CRUD Forms */}
                    {activeTab === 'partners' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Sponsor Name</label>
                            <input
                              type="text"
                              value={partnerForm.name}
                              onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                              placeholder="e.g. RedBull Media"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Partner Category / Type</label>
                            <input
                              type="text"
                              value={partnerForm.type}
                              onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })}
                              placeholder="e.g. Title Sponsor, Beverage Partner, Media Associate"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Website URL</label>
                            <input
                              type="url"
                              value={partnerForm.website}
                              onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                              placeholder="e.g. https://redbull.com"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            />
                          </div>

                          <ImageUploader
                            label="Brand Logo"
                            currentUrl={partnerForm.logo}
                            onUploadSuccess={(url) => setPartnerForm({ ...partnerForm, logo: url })}
                          />
                        </div>
                      </div>
                    )}

                    {/* 9. FAQ CRUD Forms */}
                    {activeTab === 'faqs' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Question</label>
                            <input
                              type="text"
                              value={faqForm.question}
                              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                              placeholder="e.g. Is there a dress code for MangoBox events?"
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#685B53] uppercase tracking-wider block">Display Order</label>
                            <input
                              type="number"
                              value={faqForm.order}
                              onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                              className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#685B53] uppercase tracking-wider block">Detailed Answer</label>
                          <textarea
                            value={faqForm.answer}
                            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                            rows={4}
                            placeholder="Write a clear, professional answer..."
                            className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t border-[#685B53]/15">
                      <button
                        type="button"
                        onClick={resetForms}
                        className="px-5 py-2.5 bg-transparent border border-[#685B53]/40 rounded-xl font-bold text-[#685B53]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#4ABA94] hover:bg-[#4ABA94]/90 text-[#2F3B3B] font-extrabold rounded-xl"
                      >
                        {editingItemId ? 'Update Entry' : 'Create Entry'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* READ / TABLE GRID LISTS */}
              <div className="bg-white rounded-[32px] border border-[#685B53]/25 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FFEDB7]/30 border-b border-[#685B53]/20 font-bold text-[#2F3B3B] uppercase tracking-widest text-[9px]">
                    <tr>
                      <th className="p-4">Reference Title</th>
                      <th className="p-4">Category Details</th>
                      <th className="p-4">Key Metrics</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#685B53]/10 font-semibold text-[#685B53]">
                    
                    {/* Events list */}
                    {activeTab === 'events' && events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold">{ev.title}</td>
                        <td className="p-4">{ev.category} Set</td>
                        <td className="p-4 font-mono">${ev.price} | {ev.ticketsLeft} / {ev.totalTickets} left</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateEventForm(ev)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteEvent(ev.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Services list */}
                    {activeTab === 'services' && services.map((s) => (
                      <tr key={s.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold">{s.title}</td>
                        <td className="p-4">{s.category} channel</td>
                        <td className="p-4 font-normal truncate max-w-[200px]">{s.description}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateServiceForm(s)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteService(s.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Artists list */}
                    {activeTab === 'artists' && artists.map((a) => (
                      <tr key={a.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold">{a.name}</td>
                        <td className="p-4">{a.role}</td>
                        <td className="p-4 font-normal truncate max-w-[200px]">{a.bio}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateArtistForm(a)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteArtist(a.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Venues list */}
                    {activeTab === 'venues' && venues.map((v) => (
                      <tr key={v.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold">{v.name}</td>
                        <td className="p-4">{v.address}</td>
                        <td className="p-4 font-mono">Cap: {v.capacity} guests</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateVenueForm(v)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteVenue(v.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Gallery list */}
                    {activeTab === 'gallery' && gallery.map((g: any) => (
                      <tr key={g.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold flex items-center gap-3">
                          <img src={g.imageUrl} alt="" className="w-8 h-8 object-cover rounded-lg border border-[#685B53]/20" />
                          <span>{g.title}</span>
                        </td>
                        <td className="p-4">{g.category} showcase</td>
                        <td className="p-4 font-mono">{g.date}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateGalleryForm(g)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteGalleryItem(g.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Blogs list */}
                    {activeTab === 'blogs' && blogs.map((b: any) => (
                      <tr key={b.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold flex items-center gap-3">
                          <img src={b.image} alt="" className="w-8 h-8 object-cover rounded-lg border border-[#685B53]/20" />
                          <div>
                            <span className="block">{b.title}</span>
                            <span className="text-[10px] text-[#685B53]/70 font-normal">By {b.authorName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                            b.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'UNPUBLISHED' ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {b.status || 'PUBLISHED'}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{b.category} | {b.readTime}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateBlogForm(b)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteBlogPost(b.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Testimonials list */}
                    {activeTab === 'testimonials' && testimonials.map((t: any) => (
                      <tr key={t.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold flex items-center gap-3">
                          <img src={t.image} alt="" className="w-8 h-8 object-cover rounded-lg border border-[#685B53]/20" />
                          <span>{t.name}</span>
                        </td>
                        <td className="p-4">{t.role} ({t.company})</td>
                        <td className="p-4 font-mono">Rating: {t.rating}/5 stars</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateTestimonialForm(t)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteTestimonial(t.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* Partners list */}
                    {activeTab === 'partners' && partners.map((p: any) => (
                      <tr key={p.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold flex items-center gap-3">
                          <img src={p.logo} alt="" className="w-8 h-8 object-contain rounded border border-[#685B53]/15" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4">{p.type}</td>
                        <td className="p-4 font-mono text-[10px] max-w-[150px] truncate">{p.website || 'No website'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populatePartnerForm(p)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deletePartner(p.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                    {/* FAQs list */}
                    {activeTab === 'faqs' && faqs.map((f: any) => (
                      <tr key={f.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 text-[#2F3B3B] font-extrabold max-w-[250px] truncate">{f.question}</td>
                        <td className="p-4">Order: {f.order}</td>
                        <td className="p-4 font-normal truncate max-w-[200px]">{f.answer}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => populateFaqForm(f)} className="p-2 bg-[#4ABA94]/15 hover:bg-[#4ABA94] hover:text-[#2F3B3B] rounded-lg text-[#2F3B3B] transition-colors"><Edit size={14} /></button>
                          <button onClick={() => deleteFaq(f.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* LEADS / BRIEF INQUIRIES LIST PANEL */}
          {activeTab === 'leads' && (
            <div id="cms-leads-panel" className="space-y-6 animate-in fade-in duration-200">
              <h3 className="font-display font-black text-xl text-[#2F3B3B] uppercase tracking-tight">
                Customer briefs ({inquiries.length})
              </h3>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center bg-white/40 border border-[#685B53]/20 rounded-3xl text-[#685B53]">
                  No inquiries logged. Fill out Contact/Partner forms to generate.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-2xl border-2 border-[#685B53] p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#685B53]/10">
                        <div>
                          <strong className="text-[#2F3B3B] text-base">{lead.name}</strong>
                          <span className="text-xs text-[#685B53] ml-2 font-normal">({lead.company || 'Private Party'})</span>
                        </div>
                        
                        {/* Status badge capsules */}
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                            lead.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-green-100 text-green-900 border border-green-300'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#685B53]">
                        <div>Email: <strong className="text-[#2F3B3B]">{lead.email}</strong></div>
                        <div>Phone: <strong className="text-[#2F3B3B]">{lead.phone}</strong></div>
                        <div>Channel Type: <strong className="text-[#D0542D] uppercase">{lead.type}</strong></div>
                      </div>

                      <p className="p-3 bg-[#FFEDB7]/30 text-[#685B53] rounded-xl text-xs leading-relaxed border border-[#685B53]/10 font-sans whitespace-pre-wrap">
                        {lead.message}
                      </p>

                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono text-[#685B53]/50">Received: {new Date(lead.createdAt).toLocaleDateString()}</span>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {lead.status === 'PENDING' && (
                            <button
                              onClick={() => updateInquiryStatus(lead.id, 'RESOLVED')}
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-900 font-bold border border-green-300 rounded-lg cursor-pointer"
                            >
                              Resolve Brief
                            </button>
                          )}
                          <button
                            onClick={() => deleteInquiry(lead.id)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 font-bold border border-red-300 rounded-lg cursor-pointer"
                          >
                            Delete Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BILLING AUDITS / BOOKINGS LEDGER */}
          {activeTab === 'bookings' && (
            <div id="cms-bookings-panel" className="space-y-6 animate-in fade-in duration-200">
              <h3 className="font-display font-black text-xl text-[#2F3B3B] uppercase tracking-tight">
                Billing Transaction Ledger ({bookings.length})
              </h3>

              <div className="bg-white rounded-[32px] border border-[#685B53]/25 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FFEDB7]/30 border-b border-[#685B53]/20 font-bold text-[#2F3B3B] uppercase tracking-widest text-[9px]">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Buyer Pass Owner</th>
                      <th className="p-4">Experience Active</th>
                      <th className="p-4">Paid Total</th>
                      <th className="p-4 text-right">Audit Trigger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#685B53]/10 font-semibold text-[#685B53]">
                    {bookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-[#FFEDB7]/10">
                        <td className="p-4 font-mono font-bold text-[#2F3B3B] uppercase">{bk.id.slice(0, 10)}...</td>
                        <td className="p-4">
                          <div>{bk.name}</div>
                          <div className="text-[10px] text-[#685B53]/60 font-normal">{bk.email}</div>
                        </td>
                        <td className="p-4 text-[#2F3B3B]">{bk.eventTitle} ({bk.ticketQuantity} ticket(s))</td>
                        <td className="p-4 font-display font-black text-[#D0542D]">${bk.totalPaid} USD</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => cancelBooking(bk.id)}
                            className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg border border-red-300 font-bold cursor-pointer"
                          >
                            Revoke/Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">
                          No active checkout tickets issued. Go to Events page to book.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WEBSITE CMS SETTINGS FORM */}
          {activeTab === 'settings' && (
            <div id="cms-settings-panel" className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xl text-[#2F3B3B] uppercase tracking-tight">
                  Website CMS Content Curation
                </h3>
                <span className="text-xs text-[#685B53] font-medium bg-white/50 border border-[#685B53]/15 px-3 py-1 rounded-full">
                  Real-time Database Sync Active
                </span>
              </div>

              {/* Grouped Settings Forms */}
              <div className="space-y-8">
                {[
                  {
                    title: "Home Page Hero",
                    keys: ["home_hero_heading", "home_hero_description", "home_hero_image", "home_cta_text", "home_cta_link"]
                  },
                  {
                    title: "About Us Manifesto",
                    keys: ["about_story", "about_mission", "about_vision", "about_team"]
                  },
                  {
                    title: "Contact Center details",
                    keys: ["contact_address", "contact_phone", "contact_email", "contact_maps_url"]
                  },
                  {
                    title: "SEO Metadata & Performance Tags",
                    keys: ["seo_meta_title", "seo_meta_description", "seo_keywords", "seo_og_image"]
                  },
                  {
                    title: "General Branding Parameters",
                    keys: ["settings_logo", "settings_favicon", "settings_theme_color", "settings_footer", "settings_social_links"]
                  }
                ].map((group) => (
                  <div key={group.title} className="bg-white border border-[#685B53]/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                    <h4 className="font-display font-black text-base text-[#2F3B3B] uppercase tracking-tight border-b border-[#685B53]/10 pb-3">
                      {group.title}
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {group.keys.map((key) => {
                        const setting = settings?.find((s) => s.key === key) || { key, value: "", description: "" };
                        return (
                          <div key={key} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <label className="font-bold text-[#2F3B3B] uppercase tracking-wider block font-mono">
                                {key}
                              </label>
                              <span className="text-[10px] text-[#685B53]/60 italic">
                                {setting.description || "Website configuration parameter"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {key.includes("description") || key.includes("story") || key.includes("team") || key.includes("links") ? (
                                <textarea
                                  defaultValue={setting.value}
                                  onBlur={(e) => updateSetting(key, e.target.value)}
                                  className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2.5 font-sans leading-relaxed text-sm focus:border-[#4ABA94] outline-none"
                                  rows={key.includes("team") || key.includes("links") ? 3 : 2}
                                />
                              ) : (
                                <input
                                  type="text"
                                  defaultValue={setting.value}
                                  onBlur={(e) => updateSetting(key, e.target.value)}
                                  className="w-full bg-white border border-[#685B53]/30 rounded-xl px-3 py-2.5 text-sm focus:border-[#4ABA94] outline-none"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
