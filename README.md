# MangoBox Production Application with Supabase PostgreSQL

Welcome to the production-ready full-stack website for **MangoBox** (*Unbox Extraordinary*). This application features a React + Vite frontend seamlessly integrated with a high-performance custom Express backend, powered by Prisma ORM connected to Supabase PostgreSQL.

---

## 🛠️ Complete Supabase & PostgreSQL Setup Instructions

To configure this application to work with a dedicated, cloud-hosted **Supabase PostgreSQL** database, please follow the steps below carefully.

### 1. How to Create a Supabase Project
1. Visit [Supabase](https://supabase.com) and click **Sign Up** or **Sign In**.
2. From your Supabase Dashboard, click **New Project**.
3. Select an existing organization or create a new one.
4. Enter a **Name** for your project (e.g., `mangobox-db`).
5. Choose a secure **Database Password** and save it somewhere safe; you will need it for the connection string.
6. Select the **Region** closest to your application hosting.
7. Choose the **Free Tier** and click **Create New Project**. It will take about 1-2 minutes for the database to provision.

### 2. How to Obtain the PostgreSQL Connection String
1. Once your project is created, click on the **Project Settings** (gear icon) in the left sidebar.
2. Under Settings, select **Database**.
3. Scroll down to the **Connection string** section.
4. Select the **URI** tab.
5. Copy the connection string. It should look like this:
   ```env
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the actual database password you chose during project creation.

### 3. Where to Paste the Connection String
1. Create a new file named `.env` in the absolute root of this project (in the same directory as `package.json`).
2. Add your database connection string as `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
3. *(Optional)* Add other environment configuration settings to `.env` such as:
   ```env
   JWT_SECRET="super_secret_jwt_sign_key"
   ADMIN_EMAIL="admin@mangobox.curation"
   ADMIN_PASSWORD="adminpassword123"
   ```

### 4. Database Initialization Commands
Open your terminal in the project root directory and run the following three commands in order to prepare and seed your database:

```bash
# 1. Generate the Prisma Client
npx prisma generate

# 2. Deploy the database migrations to Supabase
npx prisma migrate deploy

# 3. Seed initial website content and admin login credentials
npm run seed
```

---

## 🚀 Key Features & Production Architecture

1. **Full-Stack Express + Vite Integration**: High-performance backend router hosting API routes and serving production assets out of `/dist`.
2. **Graceful Startup Safeguard**: If `DATABASE_URL` is missing, the server will boot up and serve a beautiful setup assistant page rather than crashing continuously.
3. **Enterprise Authentications**:
   - **Google Identity Provider**: Complete Firebase client-side Google OAuth popup flow generating ID tokens, verified via the Firebase Admin SDK on the Express server.
   - **Administrative Email Login**: Direct backend comparison utilizing secure credentials with custom bcrypt hashes stored in PostgreSQL.
4. **Prisma ORM Managed Relational Schema**: 100% relational tables governing experience templates, nightlife listings, artist rosters, client brief leads, and billing transactions.
5. **Production Deployment Ready**: Comprehensive Docker configuration, docker-compose orchestration, and a declarative Render Blueprint.

---

## 📡 Core API Routing Manifest

### Public Ingress Endpoints
- `GET /api/services`: Returns available premium curations.
- `GET /api/events`: Retrieves ticketing details, booking rates, and dates.
- `POST /api/contact`: Form transmission for client event briefs (sends Resend emails if key configured).
- `POST /api/newsletter`: Captures user contact emails for news and drops.
- `POST /api/bookings`: Reserves reservation tickets for scheduled events.

### Protected Admin Operations (`Authorization: Bearer <token>`)
- `GET /api/admin/bookings`: Retrieve all billing details.
- `DELETE /api/admin/bookings/:id`: Reverts billing ticket purchases.
- `POST /api/admin/events`: Inserts customized experiences.
- `PUT /api/admin/events/:id` | `DELETE /api/admin/events/:id`: Manage details.
- `POST /api/admin/upload`: Handles real Cloudinary multipart file uploads.

---

## 🔒 Administrative Gateways (SuperAdmin Auth)
Enter the `/admin` path inside the browser interface.
- **Method A (Email)**:
  - User: `admin@mangobox.curation`
  - Pass: `adminpassword123`
- **Method B (Google OAuth)**:
  - Click the Google button to authenticate. Any valid Gmail domain user matching the administrative configuration automatically logs in.
