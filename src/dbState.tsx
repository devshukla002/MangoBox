import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleAuthProvider, signInWithPopup } from './lib/firebase';
import {
  Service,
  ExperienceTemplate,
  Venue,
  Artist,
  Event,
  GalleryItem,
  BlogPost,
  Testimonial,
  Partner,
  ContactInquiry,
  NewsletterSubscriber,
  TicketBooking,
  User,
  InquiryType,
  WebsiteSetting,
  Faq
} from './types';

interface DatabaseContextType {
  // Data State
  services: Service[];
  experiences: ExperienceTemplate[];
  venues: Venue[];
  artists: Artist[];
  events: Event[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  partners: Partner[];
  inquiries: ContactInquiry[];
  subscribers: NewsletterSubscriber[];
  bookings: TicketBooking[];
  settings: WebsiteSetting[];
  faqs: Faq[];
  
  // Loading State
  isLoading: boolean;
  
  // Auth State
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  authError: string;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;

  // CRUD Actions
  addService: (service: Omit<Service, 'id' | 'slug'>) => Promise<void>;
  updateService: (id: string, updated: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addExperience: (experience: Omit<ExperienceTemplate, 'id' | 'slug'>) => Promise<void>;
  updateExperience: (id: string, updated: Partial<ExperienceTemplate>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  addVenue: (venue: Omit<Venue, 'id' | 'slug'>) => Promise<void>;
  updateVenue: (id: string, updated: Partial<Venue>) => Promise<void>;
  deleteVenue: (id: string) => Promise<void>;

  addArtist: (artist: Omit<Artist, 'id' | 'slug'>) => Promise<void>;
  updateArtist: (id: string, updated: Partial<Artist>) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;

  addEvent: (event: Omit<Event, 'id' | 'slug' | 'ticketsLeft'>) => Promise<void>;
  updateEvent: (id: string, updated: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  addBlogPost: (post: Omit<BlogPost, 'id' | 'slug'>) => Promise<void>;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (id: string, updated: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;

  addFaq: (faq: Omit<Faq, 'id'>) => Promise<void>;
  updateFaq: (id: string, updated: Partial<Faq>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;

  updateSetting: (key: string, value: string, description?: string) => Promise<void>;
  bulkUpdateSettings: (settings: { key: string, value: string, description?: string }[]) => Promise<void>;

  addInquiry: (name: string, email: string, phone: string, type: InquiryType, message: string, company?: string) => Promise<void>;
  updateInquiryStatus: (id: string, status: 'PENDING' | 'RESOLVED' | 'ARCHIVED') => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  addSubscriber: (email: string) => Promise<boolean>;
  deleteSubscriber: (id: string) => Promise<void>;

  createBooking: (eventId: string, name: string, email: string, quantity: number) => Promise<{ success: boolean; message?: string; booking?: TicketBooking }>;
  cancelBooking: (id: string) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<ExperienceTemplate[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<WebsiteSetting[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  
  // Protected states
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);

  // Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem('mb_auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Expose roles
  const isAdmin = user?.role === 'ADMIN';

  // --- FETCH HELPERS ---
  const fetchPublicData = async () => {
    try {
      const [
        resServices,
        resExperiences,
        resVenues,
        resArtists,
        resEvents,
        resGallery,
        resBlogs,
        resTestimonials,
        resPartners,
        resSettings,
        resFaqs
      ] = await Promise.all([
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/experiences').then((r) => r.json()),
        fetch('/api/venues').then((r) => r.json()),
        fetch('/api/artists').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()),
        fetch('/api/gallery').then((r) => r.json()),
        fetch('/api/blogs').then((r) => r.json()),
        fetch('/api/testimonials').then((r) => r.json()),
        fetch('/api/partners').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/faqs').then((r) => r.json())
      ]);

      setServices(resServices);
      setExperiences(resExperiences);
      setVenues(resVenues);
      setArtists(resArtists);
      setEvents(resEvents);
      setGallery(resGallery);
      setBlogs(resBlogs);
      setTestimonials(resTestimonials);
      setPartners(resPartners);
      setSettings(resSettings || []);
      setFaqs(resFaqs || []);
    } catch (err) {
      console.error('Failed to fetch public data:', err);
    }
  };

  const fetchAdminData = async (authToken: string) => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const [resBookings, resInquiries, resSubscribers] = await Promise.all([
        fetch('/api/admin/bookings', { headers }).then((r) => r.json()),
        fetch('/api/admin/inquiries', { headers }).then((r) => r.json()),
        fetch('/api/admin/subscribers', { headers }).then((r) => r.json())
      ]);

      if (!resBookings.error) setBookings(resBookings);
      if (!resInquiries.error) setInquiries(resInquiries);
      if (!resSubscribers.error) setSubscribers(resSubscribers);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  // On mount: load public data, verify JWT if present
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchPublicData();

      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
            if (data.user.role === 'ADMIN') {
              await fetchAdminData(token);
            }
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setIsLoading(false);
    };
    init();
  }, [token]);

  // --- AUTH ACTIONS ---
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('mb_auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        setAuthError(data.error || 'Authentication failed');
        return false;
      }
    } catch (err: any) {
      setAuthError('Network error during login');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError('');
    try {
      // 1. Authenticate with Google on Firebase Client
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      // 2. Authenticate on Express backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('mb_auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        setAuthError(data.error || 'Google authentication failed');
        return false;
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setAuthError(err.message || 'Firebase popup cancelled or failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mb_auth_token');
    setToken(null);
    setUser(null);
    setBookings([]);
    setInquiries([]);
    setSubscribers([]);
  };

  // --- PROTECTED ROUTE FETCH HEADER ---
  const getAdminHeaders = () => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // --- CRUD ACTIONS ---

  // Services
  const addService = async (service: Omit<Service, 'id' | 'slug'>) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(service),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addService error:', err);
    }
  };

  const updateService = async (id: string, updated: Partial<Service>) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateService error:', err);
    }
  };

  const deleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteService error:', err);
    }
  };

  // Experiences
  const addExperience = async (experience: Omit<ExperienceTemplate, 'id' | 'slug'>) => {
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(experience),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addExperience error:', err);
    }
  };

  const updateExperience = async (id: string, updated: Partial<ExperienceTemplate>) => {
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateExperience error:', err);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteExperience error:', err);
    }
  };

  // Venues
  const addVenue = async (venue: Omit<Venue, 'id' | 'slug'>) => {
    try {
      const res = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(venue),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addVenue error:', err);
    }
  };

  const updateVenue = async (id: string, updated: Partial<Venue>) => {
    try {
      const res = await fetch(`/api/admin/venues/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateVenue error:', err);
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/venues/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteVenue error:', err);
    }
  };

  // Artists
  const addArtist = async (artist: Omit<Artist, 'id' | 'slug'>) => {
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(artist),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addArtist error:', err);
    }
  };

  const updateArtist = async (id: string, updated: Partial<Artist>) => {
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateArtist error:', err);
    }
  };

  const deleteArtist = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteArtist error:', err);
    }
  };

  // Events
  const addEvent = async (event: Omit<Event, 'id' | 'slug' | 'ticketsLeft'>) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(event),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addEvent error:', err);
    }
  };

  const updateEvent = async (id: string, updated: Partial<Event>) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateEvent error:', err);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteEvent error:', err);
    }
  };

  // Gallery
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addGalleryItem error:', err);
    }
  };

  const updateGalleryItem = async (id: string, updated: Partial<GalleryItem>) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateGalleryItem error:', err);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteGalleryItem error:', err);
    }
  };

  // Blogs
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'slug'>) => {
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(post),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addBlogPost error:', err);
    }
  };

  const updateBlogPost = async (id: string, updated: Partial<BlogPost>) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateBlogPost error:', err);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteBlogPost error:', err);
    }
  };

  // Testimonials
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(testimonial),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addTestimonial error:', err);
    }
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateTestimonial error:', err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteTestimonial error:', err);
    }
  };

  // Partners
  const addPartner = async (partner: Omit<Partner, 'id'>) => {
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(partner),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addPartner error:', err);
    }
  };

  const updatePartner = async (id: string, updated: Partial<Partner>) => {
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updatePartner error:', err);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deletePartner error:', err);
    }
  };

  // FAQs CRUD
  const addFaq = async (faq: Omit<Faq, 'id'>) => {
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(faq),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('addFaq error:', err);
    }
  };

  const updateFaq = async (id: string, updated: Partial<Faq>) => {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateFaq error:', err);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('deleteFaq error:', err);
    }
  };

  // Website Settings
  const updateSetting = async (key: string, value: string, description?: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ key, value, description }),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('updateSetting error:', err);
    }
  };

  const bulkUpdateSettings = async (settingsList: { key: string, value: string, description?: string }[]) => {
    try {
      const res = await fetch('/api/admin/settings/bulk', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ settings: settingsList }),
      });
      if (res.ok) await fetchPublicData();
    } catch (err) {
      console.error('bulkUpdateSettings error:', err);
    }
  };

  // Contact Inquiry (Public submit, Admin fetch)
  const addInquiry = async (
    name: string,
    email: string,
    phone: string,
    type: InquiryType,
    message: string,
    company?: string
  ) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, type, message, company }),
      });
      if (res.ok && token) {
        await fetchAdminData(token);
      }
    } catch (err) {
      console.error('addInquiry error:', err);
    }
  };

  const updateInquiryStatus = async (id: string, status: 'PENDING' | 'RESOLVED' | 'ARCHIVED') => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok && token) {
        await fetchAdminData(token);
      }
    } catch (err) {
      console.error('updateInquiryStatus error:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok && token) {
        await fetchAdminData(token);
      }
    } catch (err) {
      console.error('deleteInquiry error:', err);
    }
  };

  // Newsletter
  const addSubscriber = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && token) {
        await fetchAdminData(token);
      }
      return data.success || false;
    } catch (err) {
      console.error('addSubscriber error:', err);
      return false;
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok && token) {
        await fetchAdminData(token);
      }
    } catch (err) {
      console.error('deleteSubscriber error:', err);
    }
  };

  // Bookings
  const createBooking = async (
    eventId: string,
    name: string,
    email: string,
    quantity: number
  ): Promise<{ success: boolean; message?: string; booking?: TicketBooking }> => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name, email, ticketQuantity: quantity }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Re-fetch public events to update remaining seats
        await fetchPublicData();
        if (token) {
          await fetchAdminData(token);
        }
        return { success: true, booking: data.booking };
      } else {
        return { success: false, message: data.error || 'Booking failed' };
      }
    } catch (err) {
      console.error('createBooking error:', err);
      return { success: false, message: 'Server communication error' };
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        await fetchPublicData();
        if (token) {
          await fetchAdminData(token);
        }
      }
    } catch (err) {
      console.error('cancelBooking error:', err);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        services,
        experiences,
        venues,
        artists,
        events,
        gallery,
        blogs,
        testimonials,
        partners,
        inquiries,
        subscribers,
        bookings,
        settings,
        faqs,
        isLoading,
        token,
        user,
        isAdmin,
        authError,
        loginWithEmail,
        loginWithGoogle,
        logout,

        addService,
        updateService,
        deleteService,
        addExperience,
        updateExperience,
        deleteExperience,
        addVenue,
        updateVenue,
        deleteVenue,
        addArtist,
        updateArtist,
        deleteArtist,
        addEvent,
        updateEvent,
        deleteEvent,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addPartner,
        updatePartner,
        deletePartner,
        addFaq,
        updateFaq,
        deleteFaq,
        updateSetting,
        bulkUpdateSettings,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        addSubscriber,
        deleteSubscriber,
        createBooking,
        cancelBooking
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
