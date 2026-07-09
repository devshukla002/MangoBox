import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_SERVICES,
  INITIAL_EXPERIENCES,
  INITIAL_VENUES,
  INITIAL_ARTISTS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_BLOG_POSTS,
  INITIAL_TESTIMONIALS,
  INITIAL_PARTNERS
} from '../src/data.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Clear database
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.artist.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.experienceTemplate.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.contactInquiry.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared.');

  // 2. Create admin user from environment variables or fallbacks
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mangobox.curation';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      name: 'MangoBox Admin',
      password: adminPasswordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
  });
  console.log(`Admin user created: ${adminUser.email}`);

  // 3. Seed Services
  for (const s of INITIAL_SERVICES) {
    await prisma.service.create({
      data: {
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        longDescription: s.longDescription,
        iconName: s.iconName,
        image: s.image,
        category: s.category,
      },
    });
  }
  console.log('Services seeded.');

  // 4. Seed ExperienceTemplates
  for (const exp of INITIAL_EXPERIENCES) {
    await prisma.experienceTemplate.create({
      data: {
        id: exp.id,
        title: exp.title,
        slug: exp.slug,
        tagline: exp.tagline,
        description: exp.description,
        vibeDescription: exp.vibeDescription,
        vibeKeywords: exp.vibeKeywords,
        duration: exp.duration,
        pricingInfo: exp.pricingInfo,
        image: exp.image,
        highlights: exp.highlights,
      },
    });
  }
  console.log('Experience templates seeded.');

  // 5. Seed Venues
  for (const v of INITIAL_VENUES) {
    await prisma.venue.create({
      data: {
        id: v.id,
        name: v.name,
        slug: v.slug,
        address: v.address,
        capacity: v.capacity,
        amenities: v.amenities,
        images: v.images,
        description: v.description,
        pastEventsCount: v.pastEventsCount,
        featured: v.featured,
      },
    });
  }
  console.log('Venues seeded.');

  // 6. Seed Artists
  for (const a of INITIAL_ARTISTS) {
    await prisma.artist.create({
      data: {
        id: a.id,
        name: a.name,
        slug: a.slug,
        role: a.role,
        bio: a.bio,
        image: a.image,
        gallery: a.gallery,
        socialLinks: a.socialLinks as any,
        featured: a.featured,
      },
    });
  }
  console.log('Artists seeded.');

  // 7. Seed Events
  for (const e of INITIAL_EVENTS) {
    await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: e.date,
        time: e.time,
        venueId: e.venueId,
        price: e.price,
        ticketsLeft: e.ticketsLeft,
        totalTickets: e.totalTickets,
        description: e.description,
        schedule: e.schedule as any,
        artists: e.artists,
        faqs: e.faqs as any,
        image: e.image,
        gallery: e.gallery,
        category: e.category,
        featured: e.featured,
      },
    });
  }
  console.log('Events seeded.');

  // 8. Seed Gallery
  for (const g of INITIAL_GALLERY) {
    await prisma.gallery.create({
      data: {
        id: g.id,
        title: g.title,
        description: g.description,
        imageUrl: g.imageUrl,
        category: g.category,
        date: g.date,
      },
    });
  }
  console.log('Gallery items seeded.');

  // 9. Seed Blogs
  for (const b of INITIAL_BLOG_POSTS) {
    await prisma.blog.create({
      data: {
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        date: b.date,
        readTime: b.readTime,
        authorName: b.author.name,
        authorRole: b.author.role,
        authorAvatarUrl: b.author.avatarUrl,
        image: b.image,
        category: b.category,
        featured: b.featured,
      },
    });
  }
  console.log('Blogs seeded.');

  // 10. Seed Testimonials
  for (const t of INITIAL_TESTIMONIALS) {
    await prisma.testimonial.create({
      data: {
        id: t.id,
        name: t.name,
        role: t.role,
        company: t.company,
        content: t.content,
        rating: t.rating,
        image: t.image,
      },
    });
  }
  console.log('Testimonials seeded.');

  // 11. Seed Partners
  for (const p of INITIAL_PARTNERS) {
    await prisma.partner.create({
      data: {
        id: p.id,
        name: p.name,
        type: p.type,
        logoUrl: p.logoUrl,
        websiteUrl: p.websiteUrl,
      },
    });
  }
  console.log('Partners seeded.');

  // 12. Seed WebsiteSettings
  const defaultSettings = [
    { key: 'home_hero_heading', value: 'Curation, Culture, & Premium Nightlife Experiences', description: 'Main hero title on home page' },
    { key: 'home_hero_description', value: 'We craft immersive cultural events, premium bespoke experiences, and highlight elite artistic talent across hand-selected luxury venues.', description: 'Hero sub-headline' },
    { key: 'home_hero_image', value: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200', description: 'Home hero background or featured image' },
    { key: 'home_cta_text', value: 'Explore Experiences', description: 'Home hero main button text' },
    { key: 'home_cta_link', value: '/experiences', description: 'Home hero button link' },

    { key: 'about_story', value: 'MangoBox was founded on the principle that nightlife and cultural gatherings should be curated works of art. We bring together musicians, visual artists, and culinary craftsmen in bespoke venues to build nights you never forget.', description: 'The company story' },
    { key: 'about_mission', value: 'To elevate the cultural fabric of premium events through strict curation, authentic talent matchmaking, and pristine design.', description: 'Corporate mission statement' },
    { key: 'about_vision', value: 'To be the global benchmark for bespoke entertainment and cultural curation.', description: 'Corporate vision statement' },
    { key: 'about_team', value: '[{"name":"Elena Vance","role":"Founder & Curation Director","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"},{"name":"Marcus Thorne","role":"Lead Sound Architect","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}]', description: 'JSON string listing team members' },

    { key: 'contact_address', value: '77 Curation Blvd, Suite 400, Creative District', description: 'Physical address' },
    { key: 'contact_email', value: 'events@mangobox.curation', description: 'Main support/inquiry email' },
    { key: 'contact_phone', value: '+1 (555) 987-CURA', description: 'Main phone number' },
    { key: 'contact_maps_url', value: 'https://maps.google.com/?q=Creative+District+Curation', description: 'Google Maps Link for contact page' },

    { key: 'seo_meta_title', value: 'MangoBox | Premium Nightlife, Bespoke Events & Cultural Curation', description: 'Meta Title of the website' },
    { key: 'seo_meta_description', value: 'Curating elite cultural experiences, artistic match-ups, and premium events in high-end venues.', description: 'Meta Description of the website' },
    { key: 'seo_keywords', value: 'nightlife, bespoke events, cultural curation, artists, music, boutique festival', description: 'Meta Keywords' },
    { key: 'seo_og_image', value: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200', description: 'Social share preview image' },

    { key: 'settings_logo', value: '🥭 MangoBox', description: 'Website logo text' },
    { key: 'settings_favicon', value: 'https://images.unsplash.com/photo-1598449356475-b9f71db7d847?auto=format&fit=crop&q=80&w=100', description: 'Favicon url' },
    { key: 'settings_theme_color', value: '#F5A623', description: 'Accent/theme primary hex color' },
    { key: 'settings_footer', value: '© 2026 MangoBox Curation Group. All rights reserved.', description: 'Copyright notice' },
    { key: 'settings_social_links', value: '{"instagram": "https://instagram.com/mangobox", "facebook": "https://facebook.com/mangobox", "twitter": "https://twitter.com/mangobox"}', description: 'JSON map of social handles' }
  ];

  for (const s of defaultSettings) {
    await prisma.websiteSettings.create({
      data: {
        key: s.key,
        value: s.value,
        description: s.description
      }
    });
  }
  console.log('Website settings seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
