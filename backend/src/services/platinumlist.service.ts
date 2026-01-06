/**
 * Platinumlist Service
 * Scrapes concert and event listings from Platinumlist.net (Dubai's main ticketing platform)
 * Note: Platinumlist doesn't have a public API, so we use web scraping
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Concert } from '../types';

export class PlatinumlistService {
  private baseUrl = 'https://dubai.platinumlist.net';

  /**
   * Scrape upcoming concerts from Platinumlist
   * @param limit Maximum number of concerts to fetch
   * @returns Array of concerts
   */
  async getUpcomingConcerts(limit: number = 50): Promise<Concert[]> {
    console.log(`🎵 Scraping Platinumlist for concerts...`);

    try {
      // Note: This is a simplified example. Real implementation needs:
      // - Pagination handling
      // - Category filtering (music, nightlife, etc.)
      // - Error handling for different page structures
      // - Rate limiting to avoid being blocked

      const response = await axios.get(`${this.baseUrl}/events`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const concerts: Concert[] = [];

      // This selector needs to be updated based on actual Platinumlist structure
      $('.event-card').each((index, element) => {
        if (concerts.length >= limit) return;

        try {
          const $elem = $(element);

          const concert: Concert = {
            id: $elem.attr('data-id') || `pl_${Date.now()}_${index}`,
            title: $elem.find('.event-title').text().trim(),
            artist: $elem.find('.artist-name').text().trim(),
            venue: $elem.find('.venue-name').text().trim(),
            date: new Date($elem.find('.event-date').attr('data-date') || ''),
            time: $elem.find('.event-time').text().trim(),
            ticketUrl: `${this.baseUrl}${$elem.find('a').attr('href')}`,
            pricing: this.extractPricing($elem.find('.price').text()),
            genre: this.extractGenre($elem),
            source: 'platinumlist',
            imageUrl: $elem.find('img').attr('src'),
            description: $elem.find('.description').text().trim(),
          };

          concerts.push(concert);
        } catch (error) {
          console.error('Failed to parse event element:', error);
        }
      });

      console.log(`✅ Found ${concerts.length} concerts on Platinumlist`);
      return concerts;
    } catch (error: any) {
      console.error(`❌ Platinumlist scraping failed:`, error.message);
      return [];
    }
  }

  /**
   * Search for specific type of events
   * @param category e.g., "concerts", "nightlife", "festivals"
   */
  async searchByCategory(category: string): Promise<Concert[]> {
    console.log(`🔍 Searching Platinumlist for ${category}...`);

    try {
      // Simplified - real implementation would use proper category URLs
      const url = `${this.baseUrl}/events/${category}`;
      // Similar scraping logic as above
      return [];
    } catch (error: any) {
      console.error(`❌ Category search failed:`, error.message);
      return [];
    }
  }

  /**
   * Extract pricing from text like "AED 200 - AED 500"
   */
  private extractPricing(priceText: string): {
    min: number;
    max: number;
    currency: string;
  } {
    const defaultPricing = { min: 0, max: 0, currency: 'AED' };

    try {
      const prices = priceText.match(/\d+/g);
      if (!prices) return defaultPricing;

      if (prices.length >= 2) {
        return {
          min: parseInt(prices[0]),
          max: parseInt(prices[1]),
          currency: 'AED',
        };
      }

      return {
        min: parseInt(prices[0]),
        max: parseInt(prices[0]),
        currency: 'AED',
      };
    } catch (error) {
      return defaultPricing;
    }
  }

  /**
   * Extract genre from event data
   */
  private extractGenre($elem: cheerio.Cheerio): string | undefined {
    const categories = $elem.find('.category').text().toLowerCase();

    if (categories.includes('edm') || categories.includes('electronic'))
      return 'EDM';
    if (categories.includes('hip-hop') || categories.includes('rap'))
      return 'Hip-Hop';
    if (categories.includes('rock')) return 'Rock';
    if (categories.includes('pop')) return 'Pop';
    if (categories.includes('jazz')) return 'Jazz';

    return undefined;
  }
}

// NOTE FOR COWORKERS:
// Platinumlist structure changes frequently. You'll need to:
// 1. Inspect the actual Platinumlist.net website
// 2. Update the CSS selectors above
// 3. Test regularly and update when site changes
// 4. Consider using Apify's web scraper actor for more robustness
// 5. Be respectful with rate limiting to avoid being blocked

// Example usage:
// const platinumlist = new PlatinumlistService();
// const concerts = await platinumlist.getUpcomingConcerts(20);
