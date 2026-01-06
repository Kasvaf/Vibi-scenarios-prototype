# Vibi Backend - Data Pipeline & API

This is the backend system for Vibi that scrapes, processes, and serves venue and event data from multiple sources.

## 🎯 What This Does

1. **Instagram Scraping** - Gets posts from Dubai venue Instagram accounts (via Apify)
2. **Event Extraction** - Uses Claude AI to extract event details from Instagram captions
3. **Venue Data** - Fetches venue info, ratings, and reviews from Google Maps
4. **Concert Listings** - Scrapes upcoming concerts from Platinumlist
5. **API Server** - Serves all this data to the Vibi frontend

## 🏗️ Architecture

```
Instagram (Apify) ──┐
                    ├──> Claude AI Extraction ──> Database ──> API ──> Frontend
Google Maps ────────┤
Platinumlist ───────┘
```

## 📋 Prerequisites

You'll need API keys for:

1. **Apify** - Instagram scraping (https://apify.com)
   - Free tier: 5,000 API calls/month
   - Cost: ~$0.25 per 1000 Instagram posts

2. **Anthropic Claude** - Event extraction (https://console.anthropic.com)
   - Cost: ~$0.003 per event extraction

3. **Google Maps Platform** - Venue data (https://console.cloud.google.com)
   - Free tier: $200 credit/month
   - Cost: ~$17 per 1000 Places API calls

4. **Supabase** - Database (https://supabase.com)
   - Free tier: Generous limits
   - Or use any PostgreSQL database

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required
APIFY_API_TOKEN=your_apify_token
ANTHROPIC_API_KEY=your_claude_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
DATABASE_URL=your_postgres_connection_string

# Optional
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Run a Test Scrape

```bash
# Scrape Instagram posts from a venue
npm run test:instagram

# Extract events with Claude
npm run test:claude

# Fetch Google Maps data
npm run test:google
```

## 📖 Usage Examples

### Scrape Instagram Posts

```typescript
import { InstagramService } from './services/instagram.service';

const instagram = new InstagramService(process.env.APIFY_API_TOKEN!);

// Get recent posts from a venue
const posts = await instagram.scrapeVenuePosts('zerogravitydubai', 20);

console.log(`Found ${posts.length} posts`);
posts.forEach(post => {
  console.log(`- ${post.caption.substring(0, 50)}...`);
});
```

### Extract Events with Claude

```typescript
import { ClaudeService } from './services/claude.service';

const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

// Extract event from Instagram post
const event = await claude.extractEventFromPost(post);

if (event) {
  console.log(`Event: ${event.eventName}`);
  console.log(`Date: ${event.date}`);
  console.log(`DJ: ${event.djArtist}`);
  console.log(`Price: ${JSON.stringify(event.pricing)}`);
}
```

### Get Google Maps Venue Data

```typescript
import { GoogleMapsService } from './services/google-maps.service';

const googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);

// Get venue details
const venue = await googleMaps.getVenueByName('Zero Gravity Dubai');

console.log(`${venue.name}: ${venue.rating}⭐ (${venue.userRatingsTotal} reviews)`);
console.log(`Address: ${venue.address}`);
console.log(`Phone: ${venue.phone}`);
```

### Complete Pipeline Example

```typescript
import { InstagramService } from './services/instagram.service';
import { ClaudeService } from './services/claude.service';
import { GoogleMapsService } from './services/google-maps.service';

async function syncVenue(venueName: string, instagramHandle: string) {
  const instagram = new InstagramService(process.env.APIFY_API_TOKEN!);
  const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
  const googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);

  console.log(`\n🔄 Syncing ${venueName}...\n`);

  // 1. Get venue data from Google Maps
  console.log('📍 Fetching Google Maps data...');
  const venueData = await googleMaps.getVenueByName(venueName);
  console.log(`✅ Rating: ${venueData?.rating}⭐`);

  // 2. Scrape Instagram posts
  console.log('\n📸 Scraping Instagram...');
  const posts = await instagram.scrapeVenuePosts(instagramHandle, 10);
  console.log(`✅ Found ${posts.length} posts`);

  // 3. Extract events from posts
  console.log('\n🤖 Extracting events with Claude...');
  const events = [];
  for (const post of posts) {
    const event = await claude.extractEventFromPost(post);
    if (event) {
      events.push(event);
      console.log(`✅ Found: ${event.eventName}`);
    }
  }

  console.log(`\n✨ Total events found: ${events.length}`);
  return { venueData, posts, events };
}

// Run it
syncVenue('Zero Gravity Dubai', 'zerogravitydubai');
```

## 💰 Cost Estimates

### For 100 Venues (Daily Sync)

**Instagram Scraping (Apify):**
- 100 venues × 10 posts = 1,000 posts/day
- Cost: $0.25 per day = **$7.50/month**

**Event Extraction (Claude):**
- ~300 events extracted/day
- Cost: 300 × $0.003 = $0.90/day = **$27/month**

**Google Maps:**
- 100 venue lookups/month (once per venue)
- Cost: **~$2/month** (within free tier)

**Database (Supabase):**
- Free tier (plenty for prototype)

**TOTAL: ~$37/month** for 100 venues with daily updates

## 📁 Project Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── instagram.service.ts     # Apify Instagram scraper
│   │   ├── claude.service.ts        # Claude event extraction
│   │   ├── google-maps.service.ts   # Google Maps integration
│   │   └── platinumlist.service.ts  # Concert scraping
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── jobs/
│   │   └── sync-venues.job.ts       # Scheduled sync jobs
│   ├── api/
│   │   └── routes.ts                # REST API endpoints
│   └── database/
│       └── schema.ts                # Database models
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔐 Security Notes

- **Never commit `.env` file** - Contains sensitive API keys
- **Rate limiting** - All services implement rate limiting to avoid bans
- **Legal compliance** - Instagram scraping is in gray area, use responsibly
- **API costs** - Monitor usage to avoid unexpected bills

## 🚧 Next Steps for Your Team

1. **Setup Database Schema** - Create tables for venues, events, reviews
2. **Build Sync Jobs** - Scheduled tasks to update data daily
3. **Create REST API** - Endpoints for frontend to query data
4. **Add Caching** - Redis caching to reduce API costs
5. **Error Handling** - Robust error handling and logging
6. **Monitoring** - Set up alerts for failed syncs
7. **Testing** - Unit tests for each service

## 📚 Additional Resources

- [Apify Documentation](https://docs.apify.com/)
- [Claude API Docs](https://docs.anthropic.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

This is a prototype/foundation. Your team should:
- Test with real Dubai venues
- Optimize costs based on actual usage
- Add error handling and monitoring
- Build out the database schema
- Create the API layer
- Add authentication

## 📝 License

Internal project - not for public distribution.

---

**Built with Claude Code** 🤖
