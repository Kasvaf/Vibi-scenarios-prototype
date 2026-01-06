# Vibi Setup Guide for Coworkers

This guide will help you set up and run the complete Vibi system on your machine.

## 📋 What You'll Have After This Guide

1. ✅ React simulator running with 13 scenarios
2. ✅ Backend services configured (Instagram, Claude, Google Maps)
3. ✅ Working demo of data pipeline
4. ✅ Foundation to build production system

---

## 🎯 Part 1: Frontend Setup (React Simulator)

### Step 1: Install Dependencies

```bash
cd /root/projects/Vibi
npm install
```

### Step 2: Run the Simulator

```bash
npm run dev
```

The simulator will be available at:
- **Local:** http://localhost:5001/
- **Network:** http://YOUR_IP:5001/

### Step 3: Explore the Scenarios

The simulator includes 13 complete scenarios:
1. Tonight Plans
2. I'm Bored
3. Girls Night Out
4. Lazy Sunday
5. Birthday Party Planning
6. First Time in Dubai
7. Surprise Me
8. Girlfriend Date Night
9. Luxury High-End Clubs
10. Beach Day
11. Work From Cafe
12. Budget Date Night
13. Concerts & Live Music

Each scenario demonstrates Vibi's conversation style, progressive narrowing, and Dubai expertise.

---

## 🎯 Part 2: Backend Setup (Data Pipeline)

### Step 1: Get API Keys

You'll need accounts and API keys from these services:

#### 1. Apify (Instagram Scraping)

**Sign up:** https://console.apify.com/sign-up

**Get API token:**
1. Go to https://console.apify.com/account/integrations
2. Copy your API token
3. Free tier: 5,000 API calls/month (enough for testing)

**Cost:** ~$0.25 per 1000 Instagram posts scraped

---

#### 2. Anthropic Claude (Event Extraction)

**Sign up:** https://console.anthropic.com/

**Get API key:**
1. Go to https://console.anthropic.com/settings/keys
2. Create new API key
3. Copy the key (starts with `sk-ant-api03-...`)

**Cost:**
- Input: $3 per million tokens
- Output: $15 per million tokens
- ~$0.003 per event extraction

**Free credits:** $5 when you sign up

---

#### 3. Google Maps Platform (Venue Data)

**Sign up:** https://console.cloud.google.com/

**Enable APIs:**
1. Create new project
2. Enable these APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API (optional for frontend)

**Get API key:**
1. Go to Credentials
2. Create API key
3. Restrict to Places API (recommended for security)

**Cost:**
- Places API: $17 per 1000 requests
- Free tier: $200/month credit (covers ~11,000 requests)

---

#### 4. Supabase (Database) - Optional for now

**Sign up:** https://supabase.com/

**Get connection details:**
1. Create new project
2. Go to Project Settings → Database
3. Copy connection string

**Cost:** Free tier is generous (plenty for prototype)

---

### Step 2: Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your API keys:

```env
# Required for demo
APIFY_API_TOKEN=your_apify_token_here
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Optional (for database integration later)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

---

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `apify-client` - Instagram scraping
- `@anthropic-ai/sdk` - Claude AI
- `@googlemaps/google-maps-services-js` - Google Maps
- `cheerio` - Web scraping (Platinumlist)
- `express` - API server (for later)
- `typescript` - Type safety

---

### Step 4: Run the Demo

```bash
npm run demo
```

This will:
1. ✅ Scrape Instagram posts from Zero Gravity Dubai
2. ✅ Extract events using Claude AI
3. ✅ Fetch venue data from Google Maps
4. ✅ Show you the complete pipeline in action

**Expected output:**

```
🚀 Vibi Backend Demo
============================================================
✅ All API keys configured

📍 DEMO 1: Complete Venue Sync Pipeline
============================================================

Syncing: Zero Gravity Dubai (@zerogravitydubai)

1️⃣  Fetching Google Maps data...
   ✅ Zero Gravity
   ⭐ Rating: 4.5/5 (2341 reviews)
   📍 Dubai Marina - Dubai - United Arab Emirates
   💰 Price level: $$$$

2️⃣  Scraping Instagram posts...
📸 Scraping @zerogravitydubai...
   ✅ Found 5 recent posts

3️⃣  Extracting events with Claude AI...

   📄 Post 1:
   Caption: "🔥 THIS THURSDAY 🔥 DJ SNAKE at Zero Gravity..."
   🤖 Analyzing post...
   ✅ EVENT DETECTED!
      Name: DJ Snake at Zero Gravity
      Date: 2026-01-09 (Thursday)
      Time: 20:00
      DJ: DJ Snake
      Genre: EDM
      Pricing: {"ladies":"free","gents":"200 AED"}
      Ladies Night: Yes
      Confidence: 95%
```

---

## 🎯 Part 3: Understanding the Code

### Service Overview

#### `instagram.service.ts`
- Uses Apify to scrape Instagram
- Returns posts with captions, media URLs, likes, comments
- Handles rate limiting

**Example:**
```typescript
const instagram = new InstagramService(process.env.APIFY_API_TOKEN!);
const posts = await instagram.scrapeVenuePosts('zerogravitydubai', 20);
```

---

#### `claude.service.ts`
- Sends Instagram captions to Claude AI
- Extracts structured event data
- Determines if post is actually an event
- Returns confidence score

**Example:**
```typescript
const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
const event = await claude.extractEventFromPost(post);

if (event) {
  console.log(event.eventName);  // "DJ Snake at Zero Gravity"
  console.log(event.date);       // "2026-01-09"
  console.log(event.pricing);    // { ladies: "free", gents: "200 AED" }
}
```

---

#### `google-maps.service.ts`
- Searches for venues on Google Maps
- Gets ratings, reviews, hours, photos
- Provides location data

**Example:**
```typescript
const googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);
const venue = await googleMaps.getVenueByName('Zero Gravity Dubai');

console.log(venue.rating);    // 4.5
console.log(venue.reviews);   // Array of reviews
```

---

#### `platinumlist.service.ts`
- Web scraping template for Platinumlist
- Needs CSS selectors updated based on current site
- Extracts concert listings

**Note:** This is a template. You'll need to inspect Platinumlist.net and update the selectors.

---

## 🎯 Part 4: Next Steps for Production

### 1. Set Up Database

Create these tables in PostgreSQL (Supabase):

```sql
-- Venues
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  instagram_handle TEXT,
  google_place_id TEXT,
  rating DECIMAL,
  address TEXT,
  location POINT, -- lat/lng
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  dj_artist TEXT,
  genre TEXT,
  pricing JSONB,
  offers TEXT[],
  is_ladies_night BOOLEAN,
  instagram_post_id TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id),
  source TEXT, -- 'google', 'instagram', etc.
  rating INTEGER,
  text TEXT,
  author TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Build Sync Jobs

Create scheduled jobs that run daily:

```typescript
// jobs/sync-all-venues.ts
import cron from 'node-cron';

// Run every day at 2 AM UAE time
cron.schedule('0 2 * * *', async () => {
  console.log('🔄 Starting daily venue sync...');

  const venues = await db.venues.findMany();

  for (const venue of venues) {
    await syncVenue(venue.id, venue.instagramHandle);
  }

  console.log('✅ Daily sync complete');
});
```

---

### 3. Create API Endpoints

Build REST API for frontend:

```typescript
// api/routes.ts
import express from 'express';

const app = express();

// Get all events
app.get('/api/events', async (req, res) => {
  const events = await db.events.findMany({
    where: { date: { gte: new Date() } },
    include: { venue: true },
    orderBy: { date: 'asc' },
  });

  res.json(events);
});

// Get events for a specific venue
app.get('/api/venues/:id/events', async (req, res) => {
  const events = await db.events.findMany({
    where: { venueId: req.params.id },
  });

  res.json(events);
});

// Search venues
app.get('/api/search', async (req, res) => {
  const query = req.query.q as string;
  const venues = await searchVenues(query);
  res.json(venues);
});
```

---

### 4. Connect to Frontend

Update the React app to use real data instead of hardcoded scenarios:

```typescript
// frontend/src/App.tsx
const [events, setEvents] = useState([]);

useEffect(() => {
  fetch('http://localhost:3001/api/events')
    .then(res => res.json())
    .then(data => setEvents(data));
}, []);
```

---

## 💰 Cost Management Tips

### Reduce Apify Costs:
- Only scrape posts from last 14 days
- Scrape top venues daily, others weekly
- Use `resultsLimit` parameter wisely

### Reduce Claude Costs:
- Batch process posts
- Only analyze posts with event keywords
- Cache results to avoid re-processing

### Reduce Google Maps Costs:
- Cache venue data (rarely changes)
- Only refresh weekly
- Use free tier wisely

---

## 🐛 Troubleshooting

### "APIFY_API_TOKEN not set"
- Make sure `.env` file exists in `backend/` folder
- Check no typos in environment variable names

### "Instagram scraping failed"
- Check Apify account has credits
- Verify Instagram handle is correct (no @ symbol)

### "Claude API error"
- Check API key is valid
- Verify you have credits in Anthropic account
- Check rate limits (50 requests/minute)

### "Google Maps API error"
- Enable Places API in Google Cloud Console
- Check API key restrictions
- Verify billing is enabled (even for free tier)

---

## 📚 Additional Resources

- **Apify Docs:** https://docs.apify.com/
- **Claude API Docs:** https://docs.anthropic.com/
- **Google Maps API:** https://developers.google.com/maps
- **Supabase:** https://supabase.com/docs

---

## 🎉 You're Ready!

You now have:
- ✅ Working frontend simulator
- ✅ Backend data pipeline
- ✅ All services integrated
- ✅ Foundation for production system

**Next:** Start building your production database and API!

Questions? Check the code comments - everything is documented!
