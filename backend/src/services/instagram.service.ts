/**
 * Instagram Service
 * Uses Apify to scrape Instagram posts from Dubai venues
 */

import { ApifyClient } from 'apify-client';
import { InstagramPost } from '../types';

export class InstagramService {
  private client: ApifyClient;

  constructor(apiToken: string) {
    this.client = new ApifyClient({ token: apiToken });
  }

  /**
   * Scrape recent Instagram posts from a venue
   * @param username Instagram handle (without @)
   * @param limit Number of posts to fetch (default: 20)
   * @returns Array of Instagram posts
   */
  async scrapeVenuePosts(
    username: string,
    limit: number = 20
  ): Promise<InstagramPost[]> {
    console.log(`📸 Scraping @${username}...`);

    try {
      // Run Apify Instagram scraper
      const run = await this.client.actor('apify/instagram-scraper').call({
        username: [username],
        resultsLimit: limit,
        // Only scrape posts from last 14 days (reduce API costs)
        scrapePostsUntilDate: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      // Get results from dataset
      const { items } = await this.client
        .dataset(run.defaultDatasetId)
        .listItems();

      console.log(`✅ Found ${items.length} posts from @${username}`);

      // Transform Apify data to our format
      return items.map((item: any) => this.transformApifyPost(item));
    } catch (error: any) {
      console.error(`❌ Failed to scrape @${username}:`, error.message);
      throw new Error(`Instagram scraping failed: ${error.message}`);
    }
  }

  /**
   * Scrape multiple venues in batch
   * @param usernames Array of Instagram handles
   * @param limit Posts per venue
   */
  async scrapeMultipleVenues(
    usernames: string[],
    limit: number = 10
  ): Promise<Map<string, InstagramPost[]>> {
    const results = new Map<string, InstagramPost[]>();

    for (const username of usernames) {
      try {
        const posts = await this.scrapeVenuePosts(username, limit);
        results.set(username, posts);

        // Rate limiting - wait 2 seconds between venues
        await this.sleep(2000);
      } catch (error) {
        console.error(`Failed to scrape @${username}, skipping...`);
        results.set(username, []);
      }
    }

    return results;
  }

  /**
   * Transform Apify response to our InstagramPost type
   */
  private transformApifyPost(apifyData: any): InstagramPost {
    const mediaUrls: string[] = [];

    // Handle single image
    if (apifyData.type === 'Image' && apifyData.displayUrl) {
      mediaUrls.push(apifyData.displayUrl);
    }

    // Handle carousel (multiple images/videos)
    if (apifyData.type === 'Sidecar' && apifyData.childPosts) {
      apifyData.childPosts.forEach((child: any) => {
        if (child.displayUrl) {
          mediaUrls.push(child.displayUrl);
        }
      });
    }

    return {
      id: apifyData.id,
      venueId: '', // Will be filled when saving to database
      caption: apifyData.caption || '',
      timestamp: new Date(apifyData.timestamp),
      type: apifyData.type,
      url: apifyData.url,
      mediaUrls,
      videoUrl: apifyData.videoUrl,
      likes: apifyData.likesCount || 0,
      comments: apifyData.commentsCount || 0,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Example usage:
// const instagram = new InstagramService(process.env.APIFY_API_TOKEN!);
// const posts = await instagram.scrapeVenuePosts('zerogravitydubai', 20);
