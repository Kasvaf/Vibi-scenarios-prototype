# Vibi - Dubai AI Chatbot Prototype & Data Infrastructure

> Complete working prototype demonstrating Vibi's conversation design and data pipeline for Dubai experiences.

## 📖 TL;DR

### Scenarios Structure & Flow
- **13 interactive conversation scenarios** hardcoded in `src/data/scenarios.ts`
- Each scenario is a **branching conversation tree** with:
  - **User messages** → **Vibi responses** → **Multiple user options** → **Next steps**
  - **Reasoning display** showing why Vibi makes each recommendation
  - **Progressive narrowing** from broad questions to specific venue recommendations
- Structure uses `nextStepMap` to handle branching:
  - User selects option → Maps to next conversation step ID
  - Allows multiple conversation paths (e.g., "Stay home" vs "Go out")
  - Simulates real chat experience with decision trees

### Scenario Categories
1. **Spontaneous Planning** (Tonight Plans, I'm Bored, Surprise Me)
   - Fast-paced, decisive recommendations
   - Energy matching and emotional support

2. **Strategic Budget-Conscious** (Girls Night Out, Budget Date)
   - Deal-focused, ladies' night specials
   - Cost optimization strategies

3. **Relaxed Discovery** (Lazy Sunday, Beach Day, Work Cafe)
   - Slow-paced, exploratory conversations
   - Vibe matching and practical recommendations

4. **Special Occasions** (Birthday Party, Girlfriend Date)
   - Consultative, detail-oriented planning
   - Romance and celebration focused

5. **Premium Experiences** (Luxury High-End)
   - Sophisticated, VIP-level recommendations
   - High-budget nightlife ($10k+)

6. **Tourist/Discovery** (First Time Dubai, Concerts)
   - Educational, comprehensive guides
   - Event discovery and cultural context

### Where Data Comes From

#### Current Simulator (Hardcoded)
- **Venue names, prices, vibes** → Manually curated examples for demonstration
- **Conversation flows** → Pre-written to showcase Vibi's personality
- **Purpose** → Testing conversation design, NOT real-time data

#### Production Backend (Real Data Pipeline)
The backend services collect real-time Dubai venue/event data from:

**1. Instagram (via Apify)**
- **What**: Venue Instagram posts, captions, images, engagement metrics
- **How**: Apify web scraping service (avoids Instagram API limitations)
- **Output**: Post captions, photos, dates, hashtags, likes/comments
- **Cost**: ~$0.25 per 1,000 posts scraped

**2. Claude AI (Event Extraction)**
- **What**: Converts unstructured Instagram captions → Structured event data
- **How**: AI analyzes captions and extracts: event name, date, DJ, pricing, ladies' nights
- **Output**: JSON with event details + confidence score (0-1)
- **Cost**: ~$0.003 per event extraction

**3. Google Maps (Venue Details)**
- **What**: Venue ratings, reviews, location, hours, price level
- **How**: Google Places API search by venue name
- **Output**: Star ratings, user reviews, address, coordinates
- **Cost**: $17 per 1,000 requests (free tier: $200/month credit)

**4. Platinumlist (Concert Listings)**
- **What**: Upcoming concerts and live music events in Dubai
- **How**: Web scraping (no public API available)
- **Output**: Artist, venue, date, ticket pricing
- **Cost**: Free (requires CSS selector maintenance)

### How Apify Instagram Scraping Works

**What is Apify?**
- **Web scraping platform** that runs automated browser tasks in the cloud
- Provides pre-built "actors" (scrapers) for Instagram, TikTok, Twitter, etc.
- Handles anti-bot detection, captchas, rate limiting automatically

**Instagram Scraping Process:**
1. **You provide**: Instagram handle (e.g., `zerogravitydubai`) + number of posts to scrape
2. **Apify runs**: Automated browser that visits the Instagram profile
3. **Apify collects**:
   - Post captions (the text describing events/offers)
   - Media URLs (images/videos)
   - Engagement metrics (likes, comments)
   - Post timestamps
   - Hashtags
4. **Apify returns**: JSON dataset with all scraped post data
5. **Our backend**: Passes captions to Claude AI for event extraction

**Why Apify Instead of Instagram API?**
- Instagram's official API has severe limitations (no public post access)
- Apify provides reliable scraping without needing Meta partnership
- Legal gray area but widely used for business intelligence
- Alternative for MVP before securing official venue partnerships

**Example Flow:**
```
Input: "zerogravitydubai", limit: 20 posts
↓
Apify scrapes Instagram profile
↓
Returns: [{
  caption: "🔥 THIS THURSDAY - DJ SNAKE 🔥\nLadies FREE entry...",
  url: "https://instagram.com/p/...",
  likes: 3421,
  timestamp: "2026-01-05"
}, ...]
↓
Claude AI extracts event data
↓
Output: {
  eventName: "DJ Snake at Zero Gravity",
  date: "2026-01-09",
  pricing: { ladies: "free", gents: "200 AED" },
  confidence: 0.95
}
```

**Monthly Cost for 100 Venues:**
- Instagram (Apify): ~$7.50
- Claude AI: ~$27
- Google Maps: ~$2
- **Total: ~$37/month**

---

## 🎯 What's This?

This repository contains a **complete working prototype** with:

1. **React Simulator** - 13 interactive conversation scenarios showing Vibi's personality
2. **Backend Data Pipeline** - Instagram scraping, AI event extraction, venue data
3. **Complete Documentation** - Everything your team needs to build production Vibi

**This is ready for your coworkers to use and build upon!**

## 🚀 Quick Start

### Run the Conversation Simulator
```bash
npm install
npm run dev
```
**Access at:** http://localhost:5001

See 13 interactive scenarios demonstrating Vibi's conversation style!

### Run the Backend Demo
```bash
cd backend
npm install
# Add API keys to .env (see docs/SETUP-GUIDE.md)
npm run demo
```

Watch real data flowing: Instagram → Claude AI → Google Maps!

## 📁 What's Inside

```
Vibi/
├── src/                      # Frontend: React chat simulator
│   ├── data/scenarios.ts     # 13 interactive conversation scenarios
│   ├── components/           # Chat UI (MessageBubble, ChatContainer, etc.)
│   └── types.ts              # TypeScript definitions
│
├── backend/                  # Backend: Data pipeline & services
│   ├── src/services/
│   │   ├── instagram.service.ts     # Apify Instagram scraping
│   │   ├── claude.service.ts        # Claude AI event extraction
│   │   ├── google-maps.service.ts   # Google Maps venue data
│   │   └── platinumlist.service.ts  # Concert scraping
│   ├── src/demo.ts          # Complete working example
│   └── README.md            # Backend documentation
│
├── docs/                     # Documentation for your team
│   ├── SETUP-GUIDE.md       # 📖 START HERE - Complete setup guide
│   ├── QUICK-REFERENCE.md   # Quick commands and examples
│   └── AI-TRAINING-GUIDE.md # For training other AI systems
│
├── scenarios/                # Original markdown scenarios
│   └── *.md                  # 9 detailed scenario documents
│
└── README.md                 # This file
```

## 📚 Documentation for Your Team

**Start here:** [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)

1. **[Setup Guide](docs/SETUP-GUIDE.md)** - Step-by-step instructions to get everything running
2. **[Quick Reference](docs/QUICK-REFERENCE.md)** - Common commands and code examples
3. **[Backend README](backend/README.md)** - Technical details and API usage
4. **[AI Training Guide](AI-TRAINING-GUIDE.md)** - For transferring knowledge to other AI

## 🎭 The 13 Interactive Scenarios

Try them in the simulator at http://localhost:5001

| Scenario | Pattern | Use Case | Budget Range |
|----------|---------|----------|--------------|
| **Tonight Plans** | Fast-paced, decisive | Spontaneous night out | Mid-range |
| **I'm Bored** | Supportive, empathetic | Emotional support & ideas | Free-Mid |
| **Girls Night Out** | Strategic, deal-focused | Ladies' night planning | Budget-conscious |
| **Lazy Sunday** | Slow, exploratory | Relaxed weekend day | Mid-range |
| **Birthday Party** | Consultative, detailed | Special event planning | Mid-High |
| **First Time Dubai** | Educational, comprehensive | Tourist guide | All ranges |
| **Surprise Me** | Bold, Vibi-led | Creative adventure | Mid-range |
| **Girlfriend Date** | Romance-focused | Impressive date night | Mid-range |
| **Luxury High-End** | Sophisticated, VIP | Premium nightlife | $10k+ |
| **Beach Day** | Practical, vibe-matching | Beach planning | Free-Premium |
| **Work From Cafe** | Productivity-focused | Remote work spots | Free-Low |
| **Budget Date** | Resourceful, romantic | Romantic on budget | <200 AED |
| **Concerts** | Informational, discovery | Live music events | Varies |

## 🔧 Backend Data Pipeline

### What It Does

```
Instagram Posts (Apify) → Claude AI Extraction → Structured Events → Database
Google Maps → Venue Data (ratings, reviews, location)
Platinumlist → Concert Listings
```

### Services Included

- ✅ **Instagram Service** - Scrapes venue posts using Apify
- ✅ **Claude Service** - Extracts events from captions using AI
- ✅ **Google Maps Service** - Gets venue details and reviews
- ✅ **Platinumlist Service** - Scrapes concert listings (template)

### Monthly Costs (100 Venues)

| Service | Cost |
|---------|------|
| Instagram (Apify) | ~$7.50 |
| Claude AI | ~$27 |
| Google Maps | ~$2 (free tier) |
| **Total** | **~$37/month** |

## 💡 Conversation Design Principles

Every scenario demonstrates:
- ✅ **Progressive narrowing** - Start broad, get specific through conversation
- ✅ **Opinionated guidance** - Strong recommendations with clear reasoning
- ✅ **Energy matching** - Adapt tone to user's mood and energy level
- ✅ **Context retention** - Remember and reference previous points
- ✅ **Honest transparency** - Clear about costs, trade-offs, downsides
- ✅ **Dubai expertise** - Local knowledge (ladies' nights, areas, cultural context)

## 🚀 What Your Team Can Do

### Product/Design Team
- **Test conversation flows** - Use the React simulator
- **Refine scenarios** - Edit `src/data/scenarios.ts`
- **Add new scenarios** - Follow existing patterns
- **Review conversation style** - See principles in action

### Backend Developers
- **Run the demo** - `cd backend && npm run demo`
- **Extend services** - Add TripAdvisor, Zomato, etc.
- **Build database** - PostgreSQL schema (see setup guide)
- **Create API** - REST endpoints for frontend
- **Schedule sync jobs** - Daily automated updates

### Frontend Developers
- **Build production UI** - Use simulator as reference
- **Integrate real data** - Connect to backend API (replace hardcoded scenarios)
- **Add features** - Search, filters, user preferences, history
- **Optimize UX** - Based on simulator learnings

### DevOps Team
- **Deploy infrastructure** - AWS/GCP/Vercel
- **Set up monitoring** - Error tracking, API usage alerts
- **Configure CI/CD** - Automated testing and deployment
- **Manage costs** - Monitor API usage and optimize

## 📊 What's Working Right Now

✅ **React Simulator** - Fully functional, 13 scenarios, toggle reasoning display
✅ **Instagram Scraping** - Tested with real Dubai venues (Zero Gravity, Cove Beach, etc.)
✅ **Claude AI Extraction** - Successfully extracts event data from captions
✅ **Google Maps Integration** - Gets venue ratings, reviews, location data
✅ **Complete Documentation** - 800+ lines covering setup, usage, examples
✅ **Demo Script** - Working end-to-end example (`npm run demo`)

## 🎯 Next Steps for Production

This is a **foundation**. To build production Vibi:

1. **Database Setup** (1-2 days)
   - Set up PostgreSQL (Supabase recommended)
   - Create schema for venues, events, reviews
   - Add indexes for performance

2. **Sync Jobs** (2-3 days)
   - Schedule daily Instagram scraping
   - Weekly Google Maps updates
   - Real-time event detection

3. **REST API** (3-5 days)
   - Endpoints for events, venues, search
   - Authentication & rate limiting
   - Response caching

4. **Frontend Integration** (3-5 days)
   - Replace hardcoded scenarios with real data
   - Add search and filtering
   - User preferences and history

5. **Testing & Monitoring** (Ongoing)
   - Unit tests for all services
   - Error tracking (Sentry)
   - API usage monitoring
   - Alert on failed syncs

**See [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md) for detailed implementation plan.**

## 🔐 Getting API Keys

You'll need:

1. **Apify** (Instagram) - https://console.apify.com
   - Free tier: 5,000 API calls/month

2. **Anthropic** (Claude AI) - https://console.anthropic.com
   - $5 free credits when you sign up

3. **Google Maps Platform** - https://console.cloud.google.com
   - $200/month free credit

**Setup takes ~15 minutes.** Full instructions in [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)

## 💻 Technology Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- Running on port 5001

**Backend:**
- Node.js + TypeScript
- Apify Client (Instagram scraping)
- Anthropic SDK (Claude AI)
- Google Maps Services
- Cheerio (web scraping)

**Database (Next Step):**
- PostgreSQL (Supabase recommended)
- Vector DB for semantic search (pgvector)

## 📖 Learning Resources

- **Code Examples** - Check service files, heavily commented
- **Setup Guide** - [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)
- **Quick Reference** - [docs/QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md)
- **API Docs**
  - Apify: https://docs.apify.com/
  - Claude: https://docs.anthropic.com/
  - Google Maps: https://developers.google.com/maps

## 🤝 For Your Coworkers

This prototype is designed to be:
- ✅ **Understandable** - Heavily documented, clear code comments
- ✅ **Runnable** - Working demos you can try in minutes
- ✅ **Extensible** - Solid foundation to build production features
- ✅ **Educational** - Learn architecture and patterns through examples

## 🎉 You're Ready!

Everything you need is here:

1. ✅ **Working simulator** - See Vibi's conversation style
2. ✅ **Data pipeline** - Instagram, Claude AI, Google Maps
3. ✅ **Complete docs** - Setup guides and examples
4. ✅ **Demo script** - Run end-to-end pipeline
5. ✅ **Foundation code** - Services, types, architecture

**Start building production Vibi!**

---

## 📞 Getting Help

1. **Setup issues?** → [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)
2. **API questions?** → [backend/README.md](backend/README.md)
3. **Quick reference?** → [docs/QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md)
4. **Code questions?** → Check comments in service files

---

**Built with Claude Code** 🤖

*Complete working prototype - Ready for your team to build production Vibi!*

**Status**: Production-Ready Foundation
**Last Updated**: January 2026
