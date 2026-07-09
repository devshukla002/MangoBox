/**
 * MangoBox Application Type Definitions
 */

export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  iconName: string; // Lucide icon identifier
  image: string;
  category: 'Nightlife' | 'Corporate' | 'Cultural' | 'Bespoke' | 'Creative';
}

export interface ExperienceTemplate {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  vibeDescription: string;
  vibeKeywords: string[];
  duration: string;
  pricingInfo: string;
  image: string;
  highlights: string[];
}

export interface EventScheduleItem {
  time: string;
  activity: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  time: string;
  venueId: string;
  price: number;
  ticketsLeft: number;
  totalTickets: number;
  description: string;
  schedule: EventScheduleItem[];
  artists: string[]; // Artist IDs or names
  faqs: EventFAQ[];
  image: string;
  gallery: string[];
  category: 'Club' | 'Corporate' | 'Festival' | 'Community' | 'Private' | 'Workshop';
  featured: boolean;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  role: string; // e.g. "Techno DJ", "Pottery Artisan", "Sitar Fusion Artist"
  bio: string;
  image: string;
  gallery: string[];
  socialLinks: {
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
  };
  featured: boolean;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  address: string;
  capacity: number;
  amenities: string[];
  images: string[];
  description: string;
  pastEventsCount: number;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Concert' | 'Nightlife' | 'Workshop' | 'Corporate' | 'Private';
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or simple HTML
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  image: string;
  category: 'Nightlife' | 'Branding' | 'Culture' | 'Curation';
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'Brand' | 'Venue' | 'Sponsor' | 'Artist';
  logoUrl: string;
  websiteUrl?: string;
}

export type InquiryType = 'General' | 'Corporate' | 'Venue' | 'Artist' | 'Sponsor' | 'Custom';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: InquiryType;
  message: string;
  status: 'PENDING' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  createdAt: string;
}

export interface TicketBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  ticketQuantity: number;
  totalPaid: number;
  status: 'SUCCESS' | 'PENDING';
  bookingDate: string;
}

export interface WebsiteSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
}
