# Vibi Quick Reference

## 🚀 Quick Commands

### Frontend (React Simulator)
```bash
cd /root/projects/Vibi
npm install
npm run dev
```
Access at: http://localhost:5001

---

### Backend (Data Pipeline)
```bash
cd backend
npm install
npm run demo  # Run complete demo
```

---

## 📊 What's Included

### Frontend: 13 Interactive Scenarios
1. **Tonight Plans** - Fast-paced spontaneous night out
2. **I'm Bored** - Emotional support & decision help
3. **Girls Night Out** - Ladies' night deals strategy
4. **Lazy Sunday** - Relaxed brunch & galleries
5. **Birthday Party** - Planning 30th birthday dinner
6. **First Time Dubai** - Week-long tourist guide
7. **Surprise Me** - Vibi-led creative adventure
8. **Girlfriend Date** - Romance-focused planning
9. **Luxury High-End** - VIP nightlife ($10k+ budgets)
10. **Beach Day** - Beach club vs public beach
11. **Work From Cafe** - Remote work spots
12. **Budget Date** - Romantic on <200 AED
13. **Concerts** - Live music & event discovery

---

### Backend: 4 Data Services

| Service | Purpose | API Used | Cost |
|---------|---------|----------|------|
| **Instagram** | Scrape venue posts | Apify | $0.25/1k posts |
| **Claude** | Extract event data | Anthropic | $0.003/event |
| **Google Maps** | Venue details & reviews | Google Places | $17/1k requests |
| **Platinumlist** | Concert listings | Web scraping | Free |

---

## 🔑 Environment Variables

Create `backend/.env`:
```env
APIFY_API_TOKEN=your_token
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_MAPS_API_KEY=your_key
```

Get keys from:
- Apify: https://console.apify.com/account/integrations
- Claude: https://console.anthropic.com/settings/keys
- Google Maps: https://console.cloud.google.com/apis/credentials

---

## 💻 Code Examples

### Scrape Instagram
```typescript
import { InstagramService } from './services/instagram.service';

const instagram = new InstagramService(process.env.APIFY_API_TOKEN!);
const posts = await instagram.scrapeVenuePosts('zerogravitydubai', 20);
```

### Extract Events
```typescript
import { ClaudeService } from './services/claude.service';

const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
const event = await claude.extractEventFromPost(post);
```

### Get Venue Data
```typescript
import { GoogleMapsService } from './services/google-maps.service';

const maps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);
const venue = await maps.getVenueByName('Zero Gravity Dubai');
```

---

## 💰 Monthly Costs (100 Venues)

| Service | Usage | Cost |
|---------|-------|------|
| Apify | 1,000 posts/day | $7.50 |
| Claude | 300 events/day | $27 |
| Google Maps | 100 venues/month | $2 |
| **TOTAL** | | **~$37/month** |

---

## 📁 Project Structure

```
Vibi/
├── frontend/                 # React simulator
│   ├── src/
│   │   ├── data/
│   │   │   └── scenarios.ts  # 13 scenarios
│   │   ├── components/       # Chat UI
│   │   └── types.ts
│   └── package.json
│
├── backend/                  # Data pipeline
│   ├── src/
│   │   ├── services/
│   │   │   ├── instagram.service.ts
│   │   │   ├── claude.service.ts
│   │   │   ├── google-maps.service.ts
│   │   │   └── platinumlist.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── demo.ts          # Working example
│   ├── .env.example
│   └── package.json
│
└── docs/
    ├── SETUP-GUIDE.md       # Complete setup instructions
    └── QUICK-REFERENCE.md   # This file
```

---

## 🎯 Next Steps for Production

1. **Database Setup**
   - Create PostgreSQL database (Supabase recommended)
   - Create tables: venues, events, reviews
   - Add indexes for performance

2. **Sync Jobs**
   - Schedule daily Instagram scraping (2 AM)
   - Weekly Google Maps updates
   - Real-time event detection

3. **API Layer**
   - REST endpoints for events, venues, search
   - Authentication & rate limiting
   - Caching with Redis

4. **Frontend Integration**
   - Replace hardcoded scenarios with real data
   - Add search functionality
   - User preferences & history

5. **Monitoring**
   - Error tracking (Sentry)
   - API usage monitoring
   - Alert on failed syncs

---

## 🐛 Common Issues

**"API key not set"**
→ Create `backend/.env` from `.env.example`

**"Apify scraping failed"**
→ Check Apify account has credits

**"Claude API error"**
→ Verify API key, check rate limits (50/min)

**"Google Maps API error"**
→ Enable Places API in Google Cloud Console

---

## 📚 Documentation

- **Full Setup Guide:** `docs/SETUP-GUIDE.md`
- **Backend README:** `backend/README.md`
- **Service Examples:** Check code comments in each service file

---

## 🤝 Team Workflow

1. **Designer:** Use frontend simulator to test conversation flows
2. **Backend Dev:** Extend services, add new data sources
3. **Database Dev:** Set up schema, optimize queries
4. **Frontend Dev:** Build UI, integrate API
5. **DevOps:** Deploy, monitor, scale

---

## 📞 Support

- Check code comments - everything is documented
- Run `npm run demo` to see working examples
- Inspect service files for detailed examples

---

**Built with Claude Code** 🤖
Ready to build production Vibi!
