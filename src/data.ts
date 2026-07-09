import {
  Service,
  ExperienceTemplate,
  Venue,
  Artist,
  Event,
  GalleryItem,
  BlogPost,
  Testimonial,
  Partner
} from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'Club & Nightlife Events',
    slug: 'club-nightlife',
    description: 'Immersive sub-cultural soundscapes, dark ambient design, and boundary-pushing audio-visual systems.',
    longDescription: 'We redefine nightlife. From underground techno takeovers to premium club curations, MangoBox handles the artistic programming, sound engineering, custom light design, entry logistics, and sub-cultural marketing that make a club night legendary. We don\'t just throw parties; we curate sonic sanctuaries.',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    category: 'Nightlife'
  },
  {
    id: 's-2',
    title: 'Corporate Events & Summits',
    slug: 'corporate-summits',
    description: 'Ditching the boring conference rooms. Designing intellectual spaces where innovation meets human connection.',
    longDescription: 'Corporate gatherings shouldn\'t feel like chores. We transform brand conferences, panel sessions, and company retreats into engaging, sensory experiences. Our corporate events blend flawless technical execution (AV, staging, scheduling) with modern design sensibilities, craft food and beverage, and high-value networking zones.',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    category: 'Corporate'
  },
  {
    id: 's-3',
    title: 'Brand Activations & Launches',
    slug: 'brand-activations',
    description: 'High-concept physical setups and experiential environments that forge emotional connections with your audience.',
    longDescription: 'A product launch is a brand\'s physical manifesto. We build multi-sensory installations, interactive retail pop-ups, and brand activations that invite active participation rather than passive viewing. Perfect for fashion lines, technology products, design firms, and beverage brands.',
    iconName: 'Megaphone',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
    category: 'Bespoke'
  },
  {
    id: 's-4',
    title: 'Artist Booking & Management',
    slug: 'artist-booking',
    description: 'Exclusive rosters of DJs, fine artists, instrumentalists, and custom acts that elevate event atmospheres.',
    longDescription: 'Great art defines great spaces. We match your experience with the perfect creative talent, managing contracts, technical riders, travel, and on-site hospitality. From deep house DJs to classical fusion ensembles and pottery masters, we provide curators of energy.',
    iconName: 'Music',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    category: 'Creative'
  },
  {
    id: 's-5',
    title: 'Private Celebrations & Banquets',
    slug: 'private-celebrations',
    description: 'Elite private parties, milestone gatherings, and weddings conceptualized with high-end editorial flair.',
    longDescription: 'For those who view private celebrations as an extension of their personal style. We handle full-scale planning for select private parties, VIP dinners, and modern weddings. Our focus is on visual harmony, exceptional gastronomy, bespoke cocktail menus, and theatrical entertainment programming.',
    iconName: 'Wine',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    category: 'Bespoke'
  },
  {
    id: 's-6',
    title: 'Community Meetups & Workshops',
    slug: 'community-workshops',
    description: 'Connecting like-minded souls over curated pottery, sunrise coffee culture, and acoustic open-mics.',
    longDescription: 'Human beings crave tactile, genuine communities. MangoBox design-builds micro-workshops that allow guests to learn a craft, enjoy specialty brews, and engage with raw talent. These are intimate, low-pressure, high-interaction micro-events designed to foster deep relationships.',
    iconName: 'Users',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    category: 'Cultural'
  }
];

export const INITIAL_EXPERIENCES: ExperienceTemplate[] = [
  {
    id: 'exp-1',
    title: 'Coffee Rave',
    slug: 'coffee-rave',
    tagline: 'Sunrise beats & artisanal caffeine.',
    description: 'A morning revolution. Swapping dark club corners for sunrise sunlight, and alcohol for premium single-origin pour-overs, cold brews, and ceremonial matchas. Set to organic deep-house beats.',
    vibeDescription: 'Bright, energetic, mindful, clean, premium sensory wake-up.',
    vibeKeywords: ['Sunrise Set', 'Artisanal Coffee', 'Organic House', 'Matcha Bar', 'Mindful Awakening'],
    duration: '3-4 Hours (Morning 7:00 AM - 10:30 AM)',
    pricingInfo: 'Inquire for Custom Brand hosting / Corporate packages',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'Top-tier baristas showcasing manual brewing',
      'Ambient & organic house curation',
      'Healthy botanical snacks and wellness elixirs',
      'Interactive bean-roasting and tasting notes cards'
    ]
  },
  {
    id: 'exp-2',
    title: 'Pottery Night & Cabernet',
    slug: 'pottery-night-cabernet',
    tagline: 'Tactile creation meets fine vintage wine.',
    description: 'An intimate evening gathering where clay is spun on motorized wheels under low-lit ambient light. Accompanied by sommelier-guided organic wine flights and deep cinematic jazz.',
    vibeDescription: 'Tactile, sophisticated, cozy, candlelit, highly social.',
    vibeKeywords: ['Stoneware Clay', 'Wine Sommelier', 'Jazz Vinyl', 'Intimate Seating', 'Creative Craft'],
    duration: '3 Hours (Evening 7:00 PM - 10:00 PM)',
    pricingInfo: 'Starting at $85 per guest (inclusive of all clay materials, firing, and 3 wine flights)',
    image: 'https://images.unsplash.com/photo-1565192647048-f997ded8795c?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'Individual pottery wheels for each pair of guests',
      'Professional potter instruction & hand-glazing guide',
      'Curated organic wine pairing from biodynamic estates',
      'Shipping of completed, kiln-fired pottery pieces to your door'
    ]
  },
  {
    id: 'exp-3',
    title: 'Obsidian Open Mic',
    slug: 'obsidian-open-mic',
    tagline: 'Raw acoustics & unshielded stories.',
    description: 'A platform stripped of pretense. Writers, musicians, and poets speak directly from the heart in a blacked-out room lit only by a single warm spotlights. A sacred pact of silent, absolute listening.',
    vibeDescription: 'Editorial, raw, emotional, whisper-quiet, candlelit.',
    vibeKeywords: ['Acoustic Guitar', 'Spoken Word', 'Spotlight Only', 'Whiskey & Tonic', 'Absolute Silence'],
    duration: '3 Hours (Night 8:00 PM - 11:00 PM)',
    pricingInfo: 'Ticketed public show ($20) or Private brand hosting packages',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'Zero-amplification or high-fidelity analog microphones',
      'Strict no-phone policy inside the listening circle',
      'Craft dark-spirit cocktails and warm herbal infusions',
      'Live vinyl recording of selected sets'
    ]
  },
  {
    id: 'exp-4',
    title: 'Neon Velvet Lounge',
    slug: 'neon-velvet-lounge',
    tagline: 'Cyberpunk visual aesthetics with premium retro beats.',
    description: 'A visual spectacle that blends heavy industrial steel, lush velvet furniture, and customized cyan-magenta tube lighting. Featuring custom synthwave, dark disco, and custom sensory projection mapping.',
    vibeDescription: 'Cyberpunk, luxurious, high-contrast, moody, immersive.',
    vibeKeywords: ['LED Sculpture', 'Velvet Sofas', 'Synthwave Curation', 'Smoke Bubbles', 'Custom Gin Cocktails'],
    duration: '6 Hours (Night 9:00 PM - 3:00 AM)',
    pricingInfo: 'B2B Activations & Brand takeovers available',
    image: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'Interactive 3D projection mapping installations',
      'International synth-pop and disco artist lineup',
      'Bespoke culinary carts with neon molecular gastronomy',
      'Immersive glow portrait studios with professional photographers'
    ]
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'v-1',
    name: 'The Obsidian Warehouse',
    slug: 'obsidian-warehouse',
    address: '404 Industrial Lane, District 12',
    capacity: 1200,
    amenities: ['L-Acoustics Sound System', '3D Projection Infrastructure', 'Dual Industrial Bars', 'Custom Rigging Points', 'Secure VIP Lounge'],
    images: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A raw, brutalist industrial warehouse converted into a state-of-the-art sensory performance space. Features 12-meter ceilings, exposed concrete blocks, and absolute sound isolation.',
    pastEventsCount: 42,
    featured: true
  },
  {
    id: 'v-2',
    name: 'The Terracotta Rooftop',
    slug: 'terracotta-rooftop',
    address: '88 Skyline Boulevard, Penthouse Level',
    capacity: 350,
    amenities: ['Panoramic City Views', 'Bespoke Clay Pizza Oven', 'Adjustable Weather Canopy', 'Ambient Garden Lighting', 'Built-in DJ Console'],
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An elegant, Mediterranean-inspired open-air terrace with sweeping sunset views of the downtown skyline. Adorned with olive trees, string lights, and organic terracotta finishes.',
    pastEventsCount: 28,
    featured: true
  },
  {
    id: 'v-3',
    name: 'The Greenhouse Pavilion',
    slug: 'greenhouse-pavilion',
    address: 'Botanical Gardens, Gate C',
    capacity: 600,
    amenities: ['Climate-controlled Glass Arch', 'Natural Echo Acoustics', 'Exotic Plant Backdrops', 'Sustainable Hybrid Solar Power', 'Ample Parking Access'],
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A jaw-dropping glass structure hidden inside the city botanical gardens. Beautiful natural light by day, and fully star-lit glass ceiling reflections by night.',
    pastEventsCount: 15,
    featured: false
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    name: 'DJ Serum',
    slug: 'dj-serum',
    role: 'Progressive & Melodic Techno DJ',
    bio: 'Pioneering organic textures embedded in heavy synthesizers, DJ Serum has carved an international reputation for high-tension, hypnotic sound progressions. His sets are designed as sonic architectures that interact directly with room lighting.',
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
    ],
    socialLinks: {
      instagram: 'https://instagram.com',
      spotify: 'https://spotify.com',
      soundcloud: 'https://soundcloud.com'
    },
    featured: true
  },
  {
    id: 'art-2',
    name: 'Ananya Sen',
    slug: 'ananya-sen',
    role: 'Contemporary Ceramicist & Sculptor',
    bio: 'Ananya is an award-winning ceramic scholar known for integrating raw, unrefined sands and minerals into functional stoneware pottery. She curates tactile micro-communities where people rediscover the ancient art of wheel spinning.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1565192647048-f997ded8795c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    socialLinks: {
      instagram: 'https://instagram.com'
    },
    featured: true
  },
  {
    id: 'art-3',
    name: 'Kabir & The Clouds',
    slug: 'kabir-clouds',
    role: 'Electro-Sitar Fusion Trio',
    bio: 'Blending 19th-century classical sitar melodies with modern ambient synthesizers, sub-basses, and modular acoustic hand-percussions. The trio builds high-concept, hypnotic musical journeys that transcend traditional genres.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    ],
    socialLinks: {
      instagram: 'https://instagram.com',
      spotify: 'https://spotify.com',
      youtube: 'https://youtube.com'
    },
    featured: true
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'ev-1',
    title: 'Neon Velvet Night: DJ Serum Live',
    slug: 'neon-velvet-dj-serum',
    date: '2026-08-15',
    time: '21:00 - 03:00',
    venueId: 'v-1',
    price: 45,
    ticketsLeft: 84,
    totalTickets: 300,
    description: 'An premium immersive club night fusing heavy progressive techno under neon light matrices. MangoBox signature visual production meets the intense, architectural melodic techno of DJ Serum in a blacked-out warehouse environment.',
    category: 'Club',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    featured: true,
    artists: ['art-1'],
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800'
    ],
    schedule: [
      { time: '21:00', activity: 'Doors Open & Cyan-Magenta Ambient Laser Walk-in' },
      { time: '21:30', activity: 'Opening Set by DJ Spark (Warm-up Minimal House)' },
      { time: '23:30', activity: 'Unboxing the Stage: Custom MangoBox Motion Kinetic Show' },
      { time: '00:00', activity: 'DJ Serum Live Audio-Visual Progressive Headline Set' },
      { time: '02:30', activity: 'Ambient Cool-Down Lounge & Organic Botanical Tea Service' }
    ],
    faqs: [
      { question: 'What is the dress code?', answer: 'We suggest premium monochrome, futuristic black, or reflective silver to blend with the kinetic neon light projection mapping.' },
      { question: 'Is there an age limit?', answer: 'This event is strictly 21+ with government-issued photo ID required at the door.' },
      { question: 'Are tickets refundable?', answer: 'Tickets are non-refundable but can be fully transferred to another name via our customer inquiry panel up to 24 hours prior.' }
    ]
  },
  {
    id: 'ev-2',
    title: 'Clay & Cabernet: Candlelit Masterclass',
    slug: 'clay-cabernet-masterclass',
    date: '2026-08-22',
    time: '18:30 - 21:30',
    venueId: 'v-2',
    price: 90,
    ticketsLeft: 12,
    totalTickets: 40,
    description: 'An exclusive, high-concept pottery and wine evening. Spin stoneware clay under the starry roof of the Terracotta Rooftop, guided by master sculptor Ananya Sen, while sipping on biodynamic French Cabernet Sauvignon.',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1565192647048-f997ded8795c?auto=format&fit=crop&q=80&w=800',
    featured: true,
    artists: ['art-2'],
    gallery: [
      'https://images.unsplash.com/photo-1565192647048-f997ded8795c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    schedule: [
      { time: '18:30', activity: 'Welcome Sommelier Wine Flight & Biodynamic Grape Tasting' },
      { time: '19:00', activity: 'Wheel Spinning & Tactile Clay Foundations with Ananya' },
      { time: '19:45', activity: 'Hands-on Clay Throwing, Candlelit Jazz & Glass 2 Pouring' },
      { time: '21:00', activity: 'Glazing Choices, Personal Signature Markings & Photo Session' }
    ],
    faqs: [
      { question: 'Do I need prior pottery experience?', answer: 'Not at all. This is curated for complete beginners as well as intermediate hobbyists. Ananya provides direct, 1-on-1 guidance at your wheel.' },
      { question: 'Will my pot be usable for eating/drinking?', answer: 'Yes! We glaze and fire your creations in our high-temperature professional kiln. They will be fully food, dishwasher, and microwave safe, shipped directly to you.' },
      { question: 'Are wine alternatives available?', answer: 'Yes. We provide organic, cold-pressed fruit nectars and custom sparkling elderflower mocktails for non-alcoholic guests.' }
    ]
  },
  {
    id: 'ev-3',
    title: 'The Sunrise Coffee Rave',
    slug: 'sunrise-coffee-rave-botanical',
    date: '2026-09-05',
    time: '07:00 - 10:30',
    venueId: 'v-3',
    price: 35,
    ticketsLeft: 120,
    totalTickets: 250,
    description: 'A morning sensory experience inside the tropical glasshouse. Swapping standard nightlife parameters for natural daylight, custom pour-over coffee bars, wellness juices, and high-energy organic deep-house music.',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    featured: false,
    artists: ['art-3'],
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
    ],
    schedule: [
      { time: '07:00', activity: 'Doors Open, Herbal Wakeup Elixirs & Sunrise Visuals' },
      { time: '07:30', activity: 'Specialty Espresso Curation & Warm Pastry Service' },
      { time: '08:00', activity: 'Kabir & The Clouds (Sunrise Live Electro-Sitar Set)' },
      { time: '09:30', activity: 'Mindful Sound Bath, Cold Brew Flight & Organic Fruit Bowls' }
    ],
    faqs: [
      { question: 'Is coffee included in the ticket?', answer: 'Yes, your ticket grants you unlimited access to our custom single-origin coffee bar, matcha station, and all morning food carts.' },
      { question: 'Can I bring children?', answer: 'This is an adults-only morning experience. Minimum age is 18 years old.' }
    ]
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Industrial Melodic Night',
    description: 'Custom steel framing and heavy laser arrays for the 2025 opening night at Obsidian Warehouse.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    category: 'Nightlife',
    date: '2025-11-12'
  },
  {
    id: 'g-2',
    title: 'Sartorial Brand Pop-Up',
    description: 'Minimalist product launch designed for an sustainable streetwear brand utilizing floating fabrics.',
    imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800',
    category: 'Corporate',
    date: '2025-09-04'
  },
  {
    id: 'g-3',
    title: 'Clay & Jazz Under the Canopy',
    description: 'An intimate snapshot of candlelit spinning wheels during our pottery event series.',
    imageUrl: 'https://images.unsplash.com/photo-1565192647048-f997ded8795c?auto=format&fit=crop&q=80&w=800',
    category: 'Workshop',
    date: '2025-10-20'
  },
  {
    id: 'g-4',
    title: 'Luminous Glass Pavilion',
    description: 'A stellar evening setup inside the tropical dome for a select luxury product release.',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    category: 'Private',
    date: '2025-12-08'
  },
  {
    id: 'g-5',
    title: 'Acoustic Sitar Fusion Stage',
    description: 'Unplugged recording sessions focusing on micro-acoustics and raw ambient projections.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
    category: 'Concert',
    date: '2025-08-14'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    title: 'The Art of the Micro-Experience: Why Small Gatherings are the New Luxury',
    slug: 'art-of-micro-experience',
    excerpt: 'How giant festivals lost their soul, and why modern high-end brands are turning to pottery, vinyl, and select coffee raves to foster true brand fidelity.',
    content: `
# The Art of the Micro-Experience

For the last two decades, event marketing was dominated by a simple philosophy: **bigger is better**. Giant festival grounds, massive multi-stage corporate conferences, and multi-thousand-person general admission nightclub venues were seen as the pinnacle of cultural events.

But a tectonic shift has occurred.

As human lives become increasingly digitized, algorithmic, and detached, our real-world requirements have changed. We no longer want to be lost in an anonymous crowd of thousands, staring at a distant LED screen.

**We crave touch, intimacy, and presence.**

At **MangoBox**, we call this the **Micro-Experience Movement**.

## Tactile over Algorithmic

Consider our signature *Clay & Cabernet* series. It is a highly curated concept:
1. Only **30 to 40 guests** in a single open-air sky terrace.
2. Motorized pottery wheels positioned in concentric, candlelit circles.
3. Live cinematic jazz vinyl spinning on a physical turntables.
4. Slow, sommelier-guided tasting of natural biodynamic wines.

Under these conditions, guests do not just consume. They create. They get wet clay on their hands. They engage in unshielded, spontaneous conversations with their neighbors.

Brands who sponsor these events do not simply display a glowing logo on a screen. They become the curators of a highly memorable, deep cognitive memory. When a guest drinks from the kiln-fired mug they crafted themselves three weeks later, they are reminded of the sensory quality of that evening—and the brand that made it possible.

## The Morning Manifesto

The same applies to the *Sunrise Coffee Rave*. By stripping away the dark, toxic, alcohol-fueled connotations of traditional nightlife and replacing them with specialty pour-over coffee, glasshouse botany, and uplifting organic deep-house beats, we make club culture accessible to health-conscious professionals and creatives at 7:30 AM.

It is sensory curation designed for the modern intellectual.

## Scaling Down to Stand Out

As we design the next chapter of experiences for MangoBox, our directive to brand partners and corporate entities is clear:
*   Swap massive generic halls for architectural warehouses or green domes.
*   Trade generic catering for focused craft pairings (e.g. specialized olive oils, single-source matchas).
*   Prioritize modular, tactile interaction over passive screens.

In a world filled with digital noise, the most premium luxury is a quiet, authentic human connection.

**Unbox Extraordinary.**
    `,
    date: '2026-06-28',
    readTime: '5 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Chief Experience Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    category: 'Curation',
    featured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'b-2',
    title: 'Designing Sonic Architectures: Aligning Light and Sound in Dark Spaces',
    slug: 'designing-sonic-architectures',
    excerpt: 'A technical and artistic breakdown of how MangoBox programs lighting arrays to mirror real-time synthesizers and techno BPM changes.',
    content: `
# Designing Sonic Architectures

How do you make sound visible?

In standard club environments, lighting is often treated as an after-thought. A lighting technician is hired to randomly cycle through pre-loaded strobe patterns, occasionally hitting a button during a "drop."

At MangoBox, we believe that visual frequencies must be a direct mathematical and emotional extension of acoustic frequencies. We call this **Sonic Architecture**.

## The Hertz-to-Nanometer Translation

Every tone possesses a frequency measured in Hertz (Hz). Every color possesses a wavelength measured in nanometers (nm).

By constructing a proprietary middleware system, we translate key audio channels directly into DMX lighting commands:
*   **Sub-BPM (30Hz - 80Hz)**: Controls structural shadows and low-placed floor washes. When the kick drum hits, the ambient room lighting *diminishes* rather than strobe-flashes, creating a heavy, physical feeling of compression in the room.
*   **Melodic Synthesizers**: Translated directly into glowing tube matrices that travel horizontally through the warehouse ceiling, mimicking the visual movement of the sound waves.
*   **High Hats & Percussion**: Assigned to soft, hyper-focused white laser pinpoints that pierce through dry mist for fractions of a second.

## Materials Matter

Light needs something to collide with. Standard smoke machines produce generic, choking clouds that degrade the sensory experience.

We utilize premium water-based atmospheric hazers that split particles down to less than 1 micron. This creates a completely dry, translucent air-mass that catches light beams with crisp surgical precision, without creating a heavy fog.

Pair this with dark velvet wall panels that absorb sound reflections and eliminate light glare, and the club night becomes an immersive digital canvas.

Stay tuned for our upcoming Neon Velvet series where we launch our new interactive kinetic stage setups.
    `,
    date: '2026-07-02',
    readTime: '4 min read',
    author: {
      name: 'Marcus Vance',
      role: 'Lead Sound & Visual Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    category: 'Nightlife',
    featured: false,
    status: 'PUBLISHED'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Siddharth Mehta',
    role: 'VP of Global Brand Activations',
    company: 'Vertex Tech Corp',
    content: 'MangoBox completely shattered our expectations of a corporate summit. They turned a boring product release into an immersive botanical showroom with custom sitar electronic soundscapes. Our clients are still talking about it.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't-2',
    name: 'Clara Dubois',
    role: 'Creative Director',
    company: 'Maison de Couture',
    content: 'For our autumn streetwear line, MangoBox built a stunning industrial catwalk framed by kinetic lighting and deep techno curation. Their attention to material textures, atmospheric mist, and pacing is peerless.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't-3',
    name: 'Vikram Malhotra',
    role: 'General Partner',
    company: 'SlingShot Capital',
    content: 'The Coffee Rave is a masterclass in community design. Fusing early-morning artisanal coffee culture with melodic house beats inside botanical glasshouses is brilliant. Extremely high-end execution.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  }
];

export const INITIAL_PARTNERS: Partner[] = [
  { id: 'p-1', name: 'Oatly Premium Milk', type: 'Brand', logoUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=100' },
  { id: 'p-2', name: 'Leica Cameras', type: 'Brand', logoUrl: 'https://images.unsplash.com/photo-1502920917128-1aa34b774300?auto=format&fit=crop&q=80&w=100' },
  { id: 'p-3', name: 'The Obsidian Group', type: 'Venue', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=100' },
  { id: 'p-4', name: 'Vanguard Sound Systems', type: 'Sponsor', logoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=100' }
];

export const INITIAL_FAQS = [
  {
    question: 'What is the philosophy behind MangoBox experience design?',
    answer: 'We believe events shouldn\'t be passive consumption blocks. Every experience we curate involves sensory design: tactile elements (spinning clay, manual brewing), acoustic architecture (custom audio-visual mapping, sonic translation), and high-quality local gastronomy in architecturally significant venues.'
  },
  {
    question: 'How do you collaborate with corporate clients and brands?',
    answer: 'We design complete bespoke experiences from scratch. We don\'t offer standardized "event packages." Instead, our team studies your brand manifesto, target demographics, and psychological goals to build a custom interactive installation, summit layout, or launch activation that feels authentic to your core values.'
  },
  {
    question: 'Can we book individual artists from your roster?',
    answer: 'Yes. We manage a boutique group of handpicked DJs, visual sculptors, musicians, and workshop craftsmen. We handle all contract negotiations, custom sound setups, and on-site event logistics to ensure their performance matches your environment seamlessly.'
  },
  {
    question: 'What is your ticketing and booking policy?',
    answer: 'For our public experiences (Coffee Raves, Pottery Workshops, Acoustic Mic Circles), tickets are available directly on our website. While we keep Razorpay integrations ready for local transactions, all tickets represent limited-run, highly exclusive slots designed for maximum comfort and human interaction.'
  }
];
