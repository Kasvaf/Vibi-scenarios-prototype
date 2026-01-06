/**
 * Vibi Backend Demo
 * Complete working example of the data pipeline
 *
 * This demonstrates:
 * 1. Instagram scraping (Apify)
 * 2. Event extraction (Claude AI)
 * 3. Venue data (Google Maps)
 * 4. Concert listings (Platinumlist)
 */

import 'dotenv/config';
import { InstagramService } from './services/instagram.service';
import { ClaudeService } from './services/claude.service';
import { GoogleMapsService } from './services/google-maps.service';
import { PlatinumlistService } from './services/platinumlist.service';

// Test venues (real Dubai venues)
const TEST_VENUES = [
  { name: 'Zero Gravity Dubai', instagram: 'zerogravitydubai' },
  { name: 'Cove Beach Dubai', instagram: 'covebeachdubai' },
  { name: 'White Dubai', instagram: 'whitedubai' },
];

async function main() {
  console.log('🚀 Vibi Backend Demo\n');
  console.log('='.repeat(60));

  // Check environment variables
  if (!process.env.APIFY_API_TOKEN) {
    console.error('❌ APIFY_API_TOKEN not set in .env');
    console.log('👉 Get your token from: https://console.apify.com/');
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set in .env');
    console.log('👉 Get your key from: https://console.anthropic.com/');
    return;
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY not set in .env');
    console.log('👉 Get your key from: https://console.cloud.google.com/');
    return;
  }

  console.log('✅ All API keys configured\n');

  // Initialize services
  const instagram = new InstagramService(process.env.APIFY_API_TOKEN);
  const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY);
  const googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY);
  const platinumlist = new PlatinumlistService();

  try {
    // ========================================
    // DEMO 1: Complete Venue Sync
    // ========================================
    console.log('\n📍 DEMO 1: Complete Venue Sync Pipeline');
    console.log('='.repeat(60));

    const venue = TEST_VENUES[0];
    await demoVenueSync(venue, instagram, claude, googleMaps);

    // ========================================
    // DEMO 2: Multi-Venue Instagram Scraping
    // ========================================
    console.log('\n\n📸 DEMO 2: Multi-Venue Instagram Scraping');
    console.log('='.repeat(60));

    await demoMultiVenueScraping(instagram);

    // ========================================
    // DEMO 3: Google Maps Integration
    // ========================================
    console.log('\n\n🗺️  DEMO 3: Google Maps Venue Data');
    console.log('='.repeat(60));

    await demoGoogleMaps(googleMaps);

    // ========================================
    // DEMO 4: Platinumlist Concert Scraping
    // ========================================
    console.log('\n\n🎵 DEMO 4: Platinumlist Concerts');
    console.log('='.repeat(60));

    await demoPlatinumlist(platinumlist);

    console.log('\n\n✅ Demo completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Set up a database (Supabase recommended)');
    console.log('2. Create database schema for venues/events');
    console.log('3. Build sync jobs to run daily');
    console.log('4. Create REST API endpoints');
    console.log('5. Connect to Vibi frontend');

  } catch (error: any) {
    console.error('\n❌ Demo failed:', error.message);
    console.error(error.stack);
  }
}

/**
 * Demo 1: Complete venue sync pipeline
 */
async function demoVenueSync(
  venue: { name: string; instagram: string },
  instagram: InstagramService,
  claude: ClaudeService,
  googleMaps: GoogleMapsService
) {
  console.log(`\nSyncing: ${venue.name} (@${venue.instagram})\n`);

  // Step 1: Get Google Maps data
  console.log('1️⃣  Fetching Google Maps data...');
  const venueData = await googleMaps.getVenueByName(venue.name);

  if (venueData) {
    console.log(`   ✅ ${venueData.name}`);
    console.log(`   ⭐ Rating: ${venueData.rating}/5 (${venueData.userRatingsTotal} reviews)`);
    console.log(`   📍 ${venueData.address}`);
    console.log(`   💰 Price level: ${'$'.repeat(venueData.priceLevel || 1)}`);

    if (venueData.reviews && venueData.reviews.length > 0) {
      console.log(`   💬 Latest review: "${venueData.reviews[0].text.substring(0, 80)}..."`);
    }
  }

  // Step 2: Scrape Instagram
  console.log('\n2️⃣  Scraping Instagram posts...');
  const posts = await instagram.scrapeVenuePosts(venue.instagram, 5);
  console.log(`   ✅ Found ${posts.length} recent posts`);

  // Step 3: Extract events
  console.log('\n3️⃣  Extracting events with Claude AI...');
  const events = [];

  for (let i = 0; i < Math.min(posts.length, 3); i++) {
    const post = posts[i];
    console.log(`\n   📄 Post ${i + 1}:`);
    console.log(`   Caption: "${post.caption.substring(0, 100)}..."`);

    const event = await claude.extractEventFromPost(post);

    if (event) {
      events.push(event);
      console.log(`   ✅ EVENT DETECTED!`);
      console.log(`      Name: ${event.eventName}`);
      console.log(`      Date: ${event.date} (${event.dayOfWeek})`);
      console.log(`      Time: ${event.startTime || 'TBD'}`);
      console.log(`      DJ: ${event.djArtist || 'N/A'}`);
      console.log(`      Genre: ${event.musicGenre || 'N/A'}`);
      console.log(`      Pricing: ${JSON.stringify(event.pricing)}`);
      console.log(`      Ladies Night: ${event.isLadiesNight ? 'Yes' : 'No'}`);
      console.log(`      Confidence: ${(event.confidence * 100).toFixed(0)}%`);
    } else {
      console.log(`   ℹ️  Not an event post (promotional/menu content)`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total posts analyzed: ${Math.min(posts.length, 3)}`);
  console.log(`   Events found: ${events.length}`);
}

/**
 * Demo 2: Multi-venue Instagram scraping
 */
async function demoMultiVenueScraping(instagram: InstagramService) {
  const handles = TEST_VENUES.slice(0, 2).map(v => v.instagram);

  console.log(`\nScraping ${handles.length} venues in batch...\n`);

  const results = await instagram.scrapeMultipleVenues(handles, 5);

  results.forEach((posts, handle) => {
    console.log(`@${handle}: ${posts.length} posts`);
  });
}

/**
 * Demo 3: Google Maps data for multiple venues
 */
async function demoGoogleMaps(googleMaps: GoogleMapsService) {
  const venueNames = [
    'Zero Gravity Dubai',
    'Common Grounds Dubai',
    'Kite Beach Dubai'
  ];

  for (const venueName of venueNames) {
    const venue = await googleMaps.getVenueByName(venueName);

    if (venue) {
      console.log(`\n${venue.name}`);
      console.log(`⭐ ${venue.rating}/5 (${venue.userRatingsTotal} reviews)`);
      console.log(`📍 ${venue.address}`);
      console.log(`🌐 ${venue.website || 'No website'}`);
    }
  }
}

/**
 * Demo 4: Platinumlist concert scraping
 */
async function demoPlatinumlist(platinumlist: PlatinumlistService) {
  console.log('\nNote: Platinumlist scraping is a template.');
  console.log('You need to update the CSS selectors based on current site structure.\n');

  try {
    const concerts = await platinumlist.getUpcomingConcerts(5);

    if (concerts.length > 0) {
      concerts.forEach((concert, i) => {
        console.log(`\n${i + 1}. ${concert.title}`);
        console.log(`   Artist: ${concert.artist}`);
        console.log(`   Venue: ${concert.venue}`);
        console.log(`   Date: ${concert.date.toDateString()}`);
        console.log(`   Price: ${concert.pricing.min}-${concert.pricing.max} ${concert.pricing.currency}`);
      });
    } else {
      console.log('No concerts found (scraper needs updating)');
    }
  } catch (error) {
    console.log('⚠️  Platinumlist scraping requires updating CSS selectors');
    console.log('   Inspect platinumlist.net and update selectors in platinumlist.service.ts');
  }
}

// Run the demo
main().catch(console.error);
