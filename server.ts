import 'dotenv/config';
import express from 'express';
import path from 'path';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

// Dynamic import of Prisma Client helper
import { prisma, isDatabaseConfigured } from './src/lib/prisma.ts';
import { uploadToCloudinary } from './src/lib/cloudinary.ts';
import { sendInquiryEmail } from './src/lib/resend.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mangobox_fallback_jwt_secret_key';

// Trust proxy for secure and accurate rate limiting under Render and Cloud Run containers
app.set('trust proxy', 1);

// Configure CORS policy dynamically to allow requests matching specific security rules
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests, or server-to-server/health checks)
      if (!origin) return callback(null, true);

      // Parse ALLOWED_ORIGINS environment variable
      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
        : [];

      // Allow production APP_URL if configured
      const appUrl = process.env.APP_URL ? process.env.APP_URL.trim() : '';

      // Check for exact matches
      if (allowedOrigins.includes(origin) || (appUrl && origin === appUrl)) {
        return callback(null, true);
      }

      // Check for localhost, 127.0.0.1, and Render domains (*.onrender.com)
      try {
        const parsedUrl = new URL(origin);
        const hostname = parsedUrl.hostname;

        // Allow localhost and 127.0.0.1 (any port)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return callback(null, true);
        }

        // Allow all Render domains (*.onrender.com)
        if (hostname === 'onrender.com' || hostname.endsWith('.onrender.com')) {
          return callback(null, true);
        }
      } catch (err) {
        // Fallback if URL parsing fails
      }

      // Otherwise, block the request
      callback(new Error('Blocked by CORS'));
    },
    credentials: true,
  })
);

// Apply Helmet security headers with custom CSP ensuring CDNs and dynamic media work perfectly
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.tailwindcss.com",
          "https://apis.google.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://images.unsplash.com",
          "https://res.cloudinary.com",
          "https://*.googleusercontent.com",
        ],
        connectSrc: [
          "'self'",
          "https://*.googleapis.com",
          "https://identitytoolkit.googleapis.com",
          "wss://*",
          "https://res.cloudinary.com",
          "https://*.run.app",
        ],
        frameSrc: ["'self'", "https://*.firebaseapp.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());

// Protect public APIs against denial-of-service (DoS) and brute force
const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // max 300 requests per minute
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 authentication attempts per 15 mins
  message: { error: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/', generalRateLimiter);
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/google', authRateLimiter);

// HTML Template for Database Setup Required
function getDatabaseSetupHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Database Configuration Required | MangoBox</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0F1212;
      color: #FFEDB7;
    }
    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 md:p-8">
  <div class="max-w-3xl w-full bg-[#171B1B] border border-[#FFEDB7]/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
    <!-- Accent gradients -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-[#4ABA94]/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#685B53]/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 space-y-8">
      <!-- Header -->
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4ABA94]/15 border border-[#4ABA94]/30 text-[#4ABA94] text-xs font-bold tracking-widest uppercase">
          ⚠️ Action Required
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display uppercase leading-none">
          Database Configuration Required
        </h1>
        <p class="text-[#FFEDB7]/60 text-sm md:text-base leading-relaxed">
          Welcome to <strong class="text-white">MangoBox Experience Curation</strong>. To launch the full-stack application, you must connect a PostgreSQL database. We recommend using a free <strong class="text-[#4ABA94]">Supabase</strong> project.
        </p>
      </div>

      <!-- Steps -->
      <div class="space-y-6">
        <h2 class="text-lg font-bold text-white uppercase tracking-wider border-b border-[#FFEDB7]/10 pb-2">
          Setup Instructions
        </h2>

        <!-- Step 1 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#4ABA94]/15 border border-[#4ABA94]/30 flex items-center justify-center text-[#4ABA94] font-bold text-sm">
            1
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Create a Supabase Database</h3>
            <p class="text-[#FFEDB7]/60 text-xs leading-relaxed">
              Sign up or log in at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" class="text-[#4ABA94] underline hover:text-[#4ABA94]/80">supabase.com</a>. Create a new project and select your preferred region.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#4ABA94]/15 border border-[#4ABA94]/30 flex items-center justify-center text-[#4ABA94] font-bold text-sm">
            2
          </div>
          <div class="space-y-1.5">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Obtain Connection String</h3>
            <p class="text-[#FFEDB7]/60 text-xs leading-relaxed">
              Navigate to <strong class="text-white">Project Settings</strong> → <strong class="text-white">Database</strong>. Under the <strong class="text-white">Connection string</strong> section, select <strong class="text-white">URI</strong> and copy the URL. It should look like:
            </p>
            <div class="bg-black/40 border border-[#FFEDB7]/10 rounded-xl p-3 text-[11px] text-[#FFEDB7]/80 mono break-all">
              postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#4ABA94]/15 border border-[#4ABA94]/30 flex items-center justify-center text-[#4ABA94] font-bold text-sm">
            3
          </div>
          <div class="space-y-2">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Create .env file</h3>
            <p class="text-[#FFEDB7]/60 text-xs leading-relaxed">
              Create a new file named <code class="bg-[#FFEDB7]/10 text-[#FFEDB7] px-1.5 py-0.5 rounded text-[11px] mono">.env</code> in the project's root directory and paste your connection string there:
            </p>
            <pre class="bg-black/40 border border-[#FFEDB7]/10 rounded-xl p-3.5 text-xs text-[#FFEDB7]/90 mono">DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"</pre>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#4ABA94]/15 border border-[#4ABA94]/30 flex items-center justify-center text-[#4ABA94] font-bold text-sm">
            4
          </div>
          <div class="space-y-2">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Initialize Schema & Seed Database</h3>
            <p class="text-[#FFEDB7]/60 text-xs leading-relaxed">
              Run the following terminal commands to generate the Prisma Client, deploy the migrations, and seed the initial data:
            </p>
            <div class="bg-black/40 border border-[#FFEDB7]/10 rounded-xl p-3.5 text-xs text-[#FFEDB7]/90 mono space-y-1">
              <div>npx prisma generate</div>
              <div>npx prisma migrate deploy</div>
              <div>npm run seed</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info/Alert -->
      <div class="p-4 rounded-2xl bg-[#FFEDB7]/5 border border-[#FFEDB7]/10 text-xs text-[#FFEDB7]/60 leading-relaxed">
        <strong>Note:</strong> Once the <code class="bg-black/40 px-1 py-0.5 rounded mono">.env</code> file is created and the database is seeded, please restart your development server or wait for it to reload to see the fully functional MangoBox interface.
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Fallback/Graceful Database missing interceptor
if (!isDatabaseConfigured) {
  console.warn('\n================================================================');
  console.warn('⚠️  DATABASE_URL IS MISSING OR INVALID!');
  console.warn('Please set DATABASE_URL in your .env file to configure PostgreSQL.');
  console.warn('================================================================\n');

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'The DATABASE_URL environment variable is missing or invalid. Please check your .env file and configure your database connection.',
        instructionsUrl: '/db-setup-instructions'
      });
    }
    next();
  });

  app.get('/db-setup-instructions', (req, res) => {
    res.send(getDatabaseSetupHTML());
  });

  app.get('*', (req, res) => {
    res.send(getDatabaseSetupHTML());
  });
}

// Set up Multer for handling file uploads (in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper: Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper: Admin Check Middleware
const requireAdmin = (req: any, res: any, next: any) => {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Require Admin role' });
    }
    next();
  });
};

// ==========================================
// PUBLIC ENDPOINTS (Read-Only & Submissions)
// ==========================================

// Get Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { title: 'asc' },
    });
    res.json(services);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Experience Templates
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await prisma.experienceTemplate.findMany({
      orderBy: { title: 'asc' },
    });
    res.json(experiences);
  } catch (error: any) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Venues
app.get('/api/venues', async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(venues);
  } catch (error: any) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(artists);
  } catch (error: any) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { venue: true },
      orderBy: { date: 'asc' },
    });
    res.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(gallery);
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const { includeDrafts } = req.query;
    const where: any = {};
    if (includeDrafts !== 'true') {
      where.status = 'PUBLISHED';
    }
    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    res.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(faqs);
  } catch (error: any) {
    console.error('Error fetching faqs:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany();
    res.json(testimonials);
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Partners
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.json(partners);
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get Website Settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.websiteSettings.findMany();
    res.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Helper validation functions
const isValidEmail = (email: any): boolean => {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

const isNonEmptyString = (str: any): boolean => {
  return typeof str === 'string' && str.trim().length > 0;
};

// Create Contact Inquiry
app.post('/api/contact', async (req, res, next) => {
  const { name, email, phone, company, type, message } = req.body;

  // Rigorous payload validation
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: 'Name is required and must be a valid text string.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!isNonEmptyString(type)) {
    return res.status(400).json({ error: 'Inquiry type is required.' });
  }
  if (!isNonEmptyString(message) || message.trim().length < 5) {
    return res.status(400).json({ error: 'Message must be at least 5 characters long.' });
  }

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: typeof phone === 'string' ? phone.trim() : '',
        company: typeof company === 'string' ? company.trim() : '',
        type: type.trim(),
        message: message.trim(),
        status: 'PENDING',
      },
    });

    // Send notification email using Resend
    await sendInquiryEmail(email.trim(), name.trim(), type.trim(), message.trim());

    res.json({ success: true, inquiry });
  } catch (error: any) {
    next(error);
  }
});

// Create Newsletter Subscription
app.post('/api/newsletter', async (req, res, next) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return res.json({ success: true, message: 'Already subscribed' });
      } else {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { status: 'ACTIVE' },
        });
        return res.json({ success: true, message: 'Re-subscribed' });
      }
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        status: 'ACTIVE',
      },
    });

    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error: any) {
    next(error);
  }
});

// Book Event Ticket
app.post('/api/bookings', async (req, res, next) => {
  const { eventId, name, email, ticketQuantity } = req.body;

  if (!isNonEmptyString(eventId)) {
    return res.status(400).json({ error: 'Event ID is required' });
  }
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const quantity = parseInt(ticketQuantity, 10);
  if (isNaN(quantity) || quantity <= 0 || quantity > 50) {
    return res.status(400).json({ error: 'Please specify a valid quantity between 1 and 50 tickets' });
  }

  try {
    // Transaction to update ticketsLeft and create booking
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.ticketsLeft < quantity) {
        throw new Error(`Only ${event.ticketsLeft} tickets remaining for this experience.`);
      }

      // Decrement tickets
      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          ticketsLeft: event.ticketsLeft - quantity,
        },
      });

      // Create Booking record
      const booking = await tx.booking.create({
        data: {
          eventId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          ticketQuantity: quantity,
          totalPaid: event.price * quantity,
          status: 'SUCCESS',
        },
      });

      // Create Payment record
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalPaid,
          provider: 'stripe_mock',
          status: 'SUCCESS',
          transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      });

      return { booking, eventTitle: event.title };
    });

    res.json({
      success: true,
      booking: {
        id: result.booking.id,
        eventId: result.booking.eventId,
        eventTitle: result.eventTitle,
        name: result.booking.name,
        email: result.booking.email,
        ticketQuantity: result.booking.ticketQuantity,
        totalPaid: result.booking.totalPaid,
        status: 'SUCCESS',
        bookingDate: result.booking.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    // If it's an error from our transaction throwing explicit issues, pass a clean message
    res.status(400).json({ error: error.message || 'Booking process failed' });
  }
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Email/Password login (for Admin/Staff)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Check auth configuration status
app.get('/api/auth/config', (req, res) => {
  const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({
    googleConfigured: isGoogleConfigured,
  });
});

// Google ID Token / Firebase Token Login
app.post('/api/auth/google', async (req, res) => {
  const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  if (!isGoogleConfigured) {
    return res.status(400).json({ error: 'Google authentication is not configured on this server.' });
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Firebase ID Token is required' });
  }

  try {
    // Verify token with firebase-admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'Email missing from Google account' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If we have an existing admin configuration, or first user, or specific email pattern
      // We'll default role to ADMIN if email domain matches ADMIN_EMAIL or specific user
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@mangobox.curation').toLowerCase();
      const isSystemAdmin = email === adminEmail || email === 'msaumyaa08@gmail.com';
      user = await prisma.user.create({
        data: {
          email,
          name: decodedToken.name || 'Google User',
          password: '', // Google Login doesn't have local password
          role: isSystemAdmin ? 'ADMIN' : 'MEMBER',
          avatarUrl: decodedToken.picture || null,
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('Google Auth verification error:', error);
    res.status(401).json({ error: 'Invalid Google authentication token' });
  }
});

// Get Current User (via JWT verification)
app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify user profile' });
  }
});

// ==========================================
// ADMIN API ENDPOINTS (Protected CRUD)
// ==========================================

// --- UPLOAD ---
app.post('/api/admin/upload', requireAdmin, upload.single('file'), async (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const secureUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    res.json({ url: secureUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// --- ADMIN GETS ---
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
    // Format into TicketBooking structure
    const formatted = bookings.map((b) => ({
      id: b.id,
      eventId: b.eventId,
      eventTitle: b.event.title,
      name: b.name,
      email: b.email,
      ticketQuantity: b.ticketQuantity,
      totalPaid: b.totalPaid,
      status: b.status,
      bookingDate: b.createdAt.toISOString(),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/admin/inquiries', requireAdmin, async (req, res) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.get('/api/admin/subscribers', requireAdmin, async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// --- SERVICES CRUD ---
app.post('/api/admin/services', requireAdmin, async (req, res) => {
  const { title, description, longDescription, iconName, image, category } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const service = await prisma.service.create({
      data: { title, slug, description, longDescription, iconName, image, category },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
  const { title, description, longDescription, iconName, image, category } = req.body;
  const data: any = { description, longDescription, iconName, image, category };
  if (title) {
    data.title = title;
    data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data,
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- EXPERIENCE TEMPLATES CRUD ---
app.post('/api/admin/experiences', requireAdmin, async (req, res) => {
  const { title, tagline, description, vibeDescription, vibeKeywords, duration, pricingInfo, image, highlights } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const exp = await prisma.experienceTemplate.create({
      data: { title, slug, tagline, description, vibeDescription, vibeKeywords, duration, pricingInfo, image, highlights },
    });
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/experiences/:id', requireAdmin, async (req, res) => {
  const { title, tagline, description, vibeDescription, vibeKeywords, duration, pricingInfo, image, highlights } = req.body;
  const data: any = { tagline, description, vibeDescription, vibeKeywords, duration, pricingInfo, image, highlights };
  if (title) {
    data.title = title;
    data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const exp = await prisma.experienceTemplate.update({
      where: { id: req.params.id },
      data,
    });
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/experiences/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.experienceTemplate.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- VENUES CRUD ---
app.post('/api/admin/venues', requireAdmin, async (req, res) => {
  const { name, address, capacity, amenities, images, description, featured } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        address,
        capacity: parseInt(capacity, 10) || 0,
        amenities: amenities || [],
        images: images || [],
        description,
        featured: !!featured,
      },
    });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/venues/:id', requireAdmin, async (req, res) => {
  const { name, address, capacity, amenities, images, description, featured, pastEventsCount } = req.body;
  const data: any = {
    address,
    amenities,
    images,
    description,
  };
  if (capacity !== undefined) data.capacity = parseInt(capacity, 10) || 0;
  if (featured !== undefined) data.featured = !!featured;
  if (pastEventsCount !== undefined) data.pastEventsCount = parseInt(pastEventsCount, 10) || 0;
  if (name) {
    data.name = name;
    data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const venue = await prisma.venue.update({
      where: { id: req.params.id },
      data,
    });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/venues/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.venue.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- ARTISTS CRUD ---
app.post('/api/admin/artists', requireAdmin, async (req, res) => {
  const { name, role, bio, image, gallery, socialLinks, featured } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const artist = await prisma.artist.create({
      data: {
        name,
        slug,
        role,
        bio,
        image,
        gallery: gallery || [],
        socialLinks: socialLinks || {},
        featured: !!featured,
      },
    });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/artists/:id', requireAdmin, async (req, res) => {
  const { name, role, bio, image, gallery, socialLinks, featured } = req.body;
  const data: any = { role, bio, image, gallery, socialLinks };
  if (featured !== undefined) data.featured = !!featured;
  if (name) {
    data.name = name;
    data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const artist = await prisma.artist.update({
      where: { id: req.params.id },
      data,
    });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/artists/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.artist.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- EVENTS CRUD ---
app.post('/api/admin/events', requireAdmin, async (req, res) => {
  const { title, date, time, venueId, price, totalTickets, description, schedule, artists, faqs, image, gallery, category, featured } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        date,
        time,
        venueId,
        price: parseFloat(price) || 0,
        totalTickets: parseInt(totalTickets, 10) || 0,
        ticketsLeft: parseInt(totalTickets, 10) || 0,
        description,
        schedule: schedule || [],
        artists: artists || [],
        faqs: faqs || [],
        image,
        gallery: gallery || [],
        category,
        featured: !!featured,
      },
    });
    res.json(event);
  } catch (error: any) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Create failed: ' + error.message });
  }
});

app.put('/api/admin/events/:id', requireAdmin, async (req, res) => {
  const { title, date, time, venueId, price, totalTickets, description, schedule, artists, faqs, image, gallery, category, featured } = req.body;
  const data: any = {
    date,
    time,
    venueId,
    description,
    schedule,
    artists,
    faqs,
    image,
    gallery,
    category,
  };
  if (price !== undefined) data.price = parseFloat(price) || 0;
  if (featured !== undefined) data.featured = !!featured;
  if (title) {
    data.title = title;
    data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    // If updating totalTickets, adjust ticketsLeft proportionally
    if (totalTickets !== undefined) {
      const current = await prisma.event.findUnique({ where: { id: req.params.id } });
      if (current) {
        const sold = current.totalTickets - current.ticketsLeft;
        data.totalTickets = parseInt(totalTickets, 10) || 0;
        data.ticketsLeft = Math.max(0, data.totalTickets - sold);
      }
    }

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data,
    });
    res.json(event);
  } catch (error: any) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Update failed: ' + error.message });
  }
});

app.delete('/api/admin/events/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- GALLERY CRUD ---
app.post('/api/admin/gallery', requireAdmin, async (req, res) => {
  const { title, description, imageUrl, category, date } = req.body;

  try {
    const item = await prisma.gallery.create({
      data: { title, description, imageUrl, category, date },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  const { title, description, imageUrl, category, date } = req.body;

  try {
    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data: { title, description, imageUrl, category, date },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- BLOGS CRUD ---
app.post('/api/admin/blogs', requireAdmin, async (req, res) => {
  const { title, excerpt, content, date, readTime, authorName, authorRole, authorAvatarUrl, image, category, featured, status } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        date,
        readTime,
        authorName,
        authorRole,
        authorAvatarUrl,
        image,
        category,
        featured: !!featured,
        status: status || 'PUBLISHED',
      },
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  const { title, excerpt, content, date, readTime, authorName, authorRole, authorAvatarUrl, image, category, featured, status } = req.body;
  const data: any = {
    excerpt,
    content,
    date,
    readTime,
    authorName,
    authorRole,
    authorAvatarUrl,
    image,
    category,
  };
  if (featured !== undefined) data.featured = !!featured;
  if (status !== undefined) data.status = status;
  if (title) {
    data.title = title;
    data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data,
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- FAQS CRUD ---
app.post('/api/admin/faqs', requireAdmin, async (req, res) => {
  const { question, answer, order } = req.body;
  try {
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        order: order !== undefined ? Number(order) : 0,
      },
    });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

app.put('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
  const { question, answer, order } = req.body;
  const data: any = {};
  if (question !== undefined) data.question = question;
  if (answer !== undefined) data.answer = answer;
  if (order !== undefined) data.order = Number(order);

  try {
    const faq = await prisma.faq.update({
      where: { id: req.params.id },
      data,
    });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.faq.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- INQUIRIES CRUD ---
app.put('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
  const { status } = req.body;

  try {
    const inquiry = await prisma.contactInquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.contactInquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- SUBSCRIBERS CRUD ---
app.delete('/api/admin/subscribers/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// --- BOOKINGS CRUD (Cancel Booking / Refund) ---
app.delete('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: req.params.id },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Restore ticket count
      const event = await tx.event.findUnique({ where: { id: booking.eventId } });
      if (event) {
        await tx.event.update({
          where: { id: booking.eventId },
          data: {
            ticketsLeft: Math.min(event.totalTickets, event.ticketsLeft + booking.ticketQuantity),
          },
        });
      }

      // Delete booking
      await tx.booking.delete({ where: { id: req.params.id } });
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Cancel failed' });
  }
});

// --- TESTIMONIALS ADMIN CRUD ---
app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
  const { name, role, company, content, rating, image } = req.body;
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company,
        content,
        rating: parseInt(rating, 10) || 5,
        image,
      },
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Create testimonial failed' });
  }
});

app.put('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  const { name, role, company, content, rating, image } = req.body;
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        name,
        role,
        company,
        content,
        rating: rating !== undefined ? parseInt(rating, 10) : undefined,
        image,
      },
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Update testimonial failed' });
  }
});

app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete testimonial failed' });
  }
});

// --- PARTNERS ADMIN CRUD ---
app.post('/api/admin/partners', requireAdmin, async (req, res) => {
  const { name, type, logoUrl, websiteUrl } = req.body;
  try {
    const partner = await prisma.partner.create({
      data: {
        name,
        type,
        logoUrl,
        websiteUrl,
      },
    });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Create partner failed' });
  }
});

app.put('/api/admin/partners/:id', requireAdmin, async (req, res) => {
  const { name, type, logoUrl, websiteUrl } = req.body;
  try {
    const partner = await prisma.partner.update({
      where: { id: req.params.id },
      data: {
        name,
        type,
        logoUrl,
        websiteUrl,
      },
    });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Update partner failed' });
  }
});

app.delete('/api/admin/partners/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.partner.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete partner failed' });
  }
});

// --- WEBSITE SETTINGS ADMIN CRUD / UPSERT ---
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  const { key, value, description } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Settings key is required' });
  }
  try {
    const setting = await prisma.websiteSettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update website setting' });
  }
});

// --- BULK WEBSITE SETTINGS ADMIN ---
app.post('/api/admin/settings/bulk', requireAdmin, async (req, res) => {
  const { settings } = req.body; // array of { key, value, description }
  if (!Array.isArray(settings)) {
    return res.status(400).json({ error: 'Settings must be an array' });
  }
  try {
    const results = [];
    for (const item of settings) {
      if (item.key) {
        const s = await prisma.websiteSettings.upsert({
          where: { key: item.key },
          update: { value: item.value, description: item.description },
          create: { key: item.key, value: item.value, description: item.description },
        });
        results.push(s);
      }
    }
    res.json({ success: true, count: results.length });
  } catch (error) {
    console.error('Bulk settings error:', error);
    res.status(500).json({ error: 'Failed to bulk update website settings' });
  }
});

// ==========================================
// CENTRALIZED ERROR HANDLING MIDDLEWARE
// ==========================================
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Centralized API Error Catch:', err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred on the server';
  res.status(statusCode).json({
    error: err.name || 'InternalServerError',
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
});

// ==========================================
// VITE DEV / PRODUCTION ROUTING MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
