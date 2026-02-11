# Karakoram Alpine Web - Implementation Documentation

## Project Overview
Single-page React application for Karakoram Alpine Club with Supabase backend and admin dashboard.

**Tech Stack:**
- Frontend: React 19 + Vite 7 + TypeScript
- Styling: Tailwind CSS
- Animations: GSAP + ScrollTrigger
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Deployment: Vercel (was Netlify)
- Version Control: GitHub

**Repository:** https://github.com/moizkaseer/karakarumaphineclub.git

---

## Implementation Details

### 1. Backend Infrastructure (Supabase)

#### Database Schema
**Tables:**
- `events` - Climbing events and expeditions
  - id, title, description, date, end_date, location, max_participants, current_participants, status, image_url, created_at
  - RLS: Public read, authenticated full CRUD

- `contact_submissions` - Contact form messages
  - id, name, email, message, is_read, created_at
  - RLS: Anonymous insert, authenticated read/update

- `newsletter_subscribers` - Newsletter email list
  - id, email, status, subscribed_at
  - RLS: Anonymous insert, authenticated read/update

- `stories` - Blog/story posts
  - id, title, category, excerpt, content, image_url, is_published, created_at
  - RLS: Public read (published only), authenticated full CRUD

#### Storage
- Bucket: `event-images` (public read, authenticated upload/delete)
- Used for event and story images

#### Authentication
- Email/password authentication for admin access
- Session-based with automatic token refresh

**Setup Files:**
- `supabase-schema.sql` - Complete database schema with RLS policies, seed data
- `.env` - Environment variables (local only, not committed)
- `.env.example` - Template for environment variables

---

### 2. Frontend Architecture

#### Core Structure
```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   ├── database.types.ts    # TypeScript types from schema
│   └── database.ts          # All CRUD operations + auth
├── sections/
│   ├── HeroSection.tsx
│   ├── SummitMissionSection.tsx
│   ├── SplitSection.tsx     # Reusable split layout
│   ├── EventsSection.tsx    # Public events display (NEW)
│   ├── StoriesSection.tsx   # Fetches from Supabase
│   ├── ContactSection.tsx   # Submits to Supabase
│   ├── AdminPanel.tsx       # Tabbed dashboard
│   └── admin/
│       ├── EventsTab.tsx
│       ├── MessagesTab.tsx
│       ├── SubscribersTab.tsx
│       └── StoriesTab.tsx
├── components/
│   └── Navigation.tsx
└── App.tsx                  # Main app with GSAP scroll logic
```

#### Key Features

**Public Site:**
- Scroll-pinned sections with GSAP ScrollTrigger
- Responsive design with Tailwind CSS
- Contact form → Supabase `contact_submissions`
- Newsletter signup → Supabase `newsletter_subscribers`
- Dynamic events section → Fetches from `events` table
- Dynamic stories section → Fetches from `stories` table

**Admin Dashboard:**
- Protected by Supabase Auth
- Tabbed interface (Events, Messages, Subscribers, Stories)
- Full CRUD for events with image upload
- View/manage contact messages (mark read/unread)
- View/manage newsletter subscribers (active/inactive)
- Full CRUD for stories (draft/publish toggle)

---

### 3. Data Layer (`database.ts`)

**Authentication:**
- `signInWithEmail(email, password)` - Admin login
- `signOut()` - Admin logout
- `getSession()` - Get current session
- `onAuthStateChange(callback)` - Listen for auth changes

**Events:**
- `getEvents()` - Get all events
- `createEvent(event)` - Create new event
- `updateEvent(id, updates)` - Update existing event
- `deleteEvent(id)` - Delete event

**Contact Submissions:**
- `submitContactForm(data)` - Submit contact form (public)
- `getContactSubmissions()` - Get all submissions (admin)
- `markSubmissionRead(id, isRead)` - Toggle read status

**Newsletter:**
- `subscribeNewsletter(email)` - Subscribe (public)
- `getNewsletterSubscribers()` - Get all subscribers (admin)
- `updateSubscriberStatus(id, status)` - Toggle active/inactive

**Stories:**
- `getPublishedStories()` - Get published stories (public)
- `getAllStories()` - Get all stories (admin)
- `createStory(story)` - Create new story
- `updateStory(id, updates)` - Update existing story
- `deleteStory(id)` - Delete story

**Storage:**
- `uploadEventImage(file, eventId)` - Upload image to Supabase Storage
- `deleteEventImage(imageUrl)` - Delete image from Storage

---

### 4. UI/UX Implementation

#### GSAP ScrollTrigger
- Scroll-pinned sections with snap behavior
- Smooth transitions between sections
- Fixed z-index layering (`.pin-spacer { z-index: inherit !important; }`)
- Sections cascade with `z-section-1` through `z-section-14`

#### Responsive Design
- Mobile-first Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts

#### Loading States
- Skeleton loaders for events and stories
- Button loading states during submissions
- Optimistic UI updates

---

### 5. Deployment Configuration

#### Netlify (Original Plan)
**File:** `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel (Current Plan)
Will use Vercel's automatic detection or create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Environment Variables (Production):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase publishable key

---

### 6. Security Considerations

**Row Level Security (RLS):**
- All tables have RLS enabled
- Public can only read published content (events, stories)
- Public can insert contact forms and newsletter signups
- Only authenticated users can perform CRUD operations

**Environment Variables:**
- `.env` is gitignored (never committed)
- Only publishable key exposed to frontend
- Secret key stored in local `.env` (not used in frontend)

**API Keys:**
- Using newer Supabase key format (`sb_publishable_...`)
- Keys are scoped to project permissions

---

### 7. Known Issues & Fixes

**Issue 1: Supabase TypeScript Types**
- **Problem:** `@supabase/supabase-js` v2.95+ requires `Relationships: []` on each table
- **Fix:** Added `Relationships`, `Views`, `Functions`, `Enums`, `CompositeTypes` to `database.types.ts`

**Issue 2: GSAP ScrollTrigger Types**
- **Problem:** TypeScript strict mode conflicts with ScrollTrigger filter callback
- **Fix:** Changed filter callback parameter to `any` type

**Issue 3: Duplicate Hero Images**
- **Problem:** GSAP `pin-spacer` wrapper doesn't inherit z-index
- **Fix:** Added `.pin-spacer { z-index: inherit !important; }` to CSS

**Issue 4: Events Not Showing on Public Site**
- **Problem:** Admin-created events had no public display section
- **Fix:** Created `EventsSection.tsx` to fetch and display upcoming events

---

## Build & Run

**Development:**
```bash
cd app
npm install
npm run dev
# Runs on http://localhost:5173
```

**Production Build:**
```bash
npm run build
# Output: dist/
```

**Preview Production Build:**
```bash
npm run preview
```

---

## Admin Access

**URL:** Click "ADMIN" button in navigation
**Login:** Use email/password created in Supabase dashboard
**Default Setup:**
1. Go to Supabase Dashboard → Authentication → Users
2. Create user with email/password
3. Use those credentials to log into admin panel

---

## What's Next

See `TASKS.md` and `ROADMAP.md` for remaining work and deployment steps.
