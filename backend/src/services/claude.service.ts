/**
 * Claude Service
 * Uses Anthropic Claude API to extract event information from Instagram captions
 */

import Anthropic from '@anthropic-ai/sdk';
import { ExtractedEvent, InstagramPost } from '../types';

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Extract event information from Instagram post caption
   * @param post Instagram post with caption
   * @returns Extracted event data or null if not an event
   */
  async extractEventFromPost(
    post: InstagramPost
  ): Promise<ExtractedEvent | null> {
    if (!post.caption || post.caption.length < 20) {
      return null; // Too short to be an event
    }

    console.log(`🤖 Analyzing post ${post.id.substring(0, 10)}...`);

    try {
      const extractedEvent = await this.analyzeCaption(
        post.caption,
        post.timestamp
      );

      // If confidence is too low or no event name, skip
      if (!extractedEvent || extractedEvent.confidence < 0.5) {
        console.log(`ℹ️  Not an event (confidence: ${extractedEvent?.confidence || 0})`);
        return null;
      }

      console.log(`✅ Found event: ${extractedEvent.eventName}`);
      return extractedEvent;
    } catch (error: any) {
      console.error(`❌ Claude extraction failed:`, error.message);
      return null;
    }
  }

  /**
   * Analyze caption text with Claude
   */
  private async analyzeCaption(
    caption: string,
    postDate: Date
  ): Promise<ExtractedEvent | null> {
    const prompt = `You are an AI that extracts event information from Instagram posts for Dubai nightlife venues.

Analyze this Instagram post caption and determine if it's announcing an EVENT (party, DJ night, special event, concert, etc.).

CAPTION:
"""
${caption}
"""

POST DATE: ${postDate.toISOString().split('T')[0]}
TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

INSTRUCTIONS:
1. First, determine if this is actually an EVENT post or just general promotional content (menu, drinks, ambiance photos).
2. If it's NOT an event, return: {"isEvent": false, "confidence": 0}
3. If it IS an event, extract all available information.

For date/time inference:
- "tonight" = today
- "this Thursday" = upcoming Thursday
- "tomorrow" = tomorrow
- "this weekend" = upcoming Saturday
- If no specific date, use POST DATE as hint

Extract the following (return null for missing fields):
- isEvent: true/false
- eventName: Name of event/party (create a descriptive name if not explicit)
- date: YYYY-MM-DD format
- dayOfWeek: e.g., "Thursday"
- startTime: HH:MM (24-hour format)
- endTime: HH:MM
- djArtist: DJ or artist name
- musicGenre: EDM, hip-hop, house, techno, etc.
- pricing: object with categories (e.g., {"ladies": "free", "gents": "200 AED"})
- specialOffers: array of special deals
- dresscode: if mentioned
- bookingInfo: how to reserve (WhatsApp, phone, DM)
- isLadiesNight: true/false
- confidence: 0.0 to 1.0 (how confident you are this is an event)

Return ONLY valid JSON, no markdown formatting, no additional text.`;

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4.5-20250929',
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent extraction
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].text.trim();

    // Remove markdown code blocks if present
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanedResponse);

      // If Claude says it's not an event
      if (!parsed.isEvent || parsed.confidence < 0.5) {
        return null;
      }

      return {
        eventName: parsed.eventName,
        date: parsed.date,
        dayOfWeek: parsed.dayOfWeek,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        djArtist: parsed.djArtist,
        musicGenre: parsed.musicGenre,
        pricing: parsed.pricing || {},
        specialOffers: parsed.specialOffers || [],
        dresscode: parsed.dresscode,
        bookingInfo: parsed.bookingInfo,
        isLadiesNight: parsed.isLadiesNight || false,
        confidence: parsed.confidence,
      };
    } catch (error) {
      console.error('Failed to parse Claude response:', cleanedResponse);
      return null;
    }
  }

  /**
   * Batch process multiple posts
   * @param posts Array of Instagram posts
   * @returns Array of extracted events (nulls filtered out)
   */
  async extractEventsFromPosts(
    posts: InstagramPost[]
  ): Promise<ExtractedEvent[]> {
    const events: ExtractedEvent[] = [];

    for (const post of posts) {
      const event = await this.extractEventFromPost(post);
      if (event) {
        events.push(event);
      }

      // Rate limiting - Claude API allows ~50 requests/min
      await this.sleep(1500);
    }

    return events;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Example usage:
// const claude = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
// const event = await claude.extractEventFromPost(instagramPost);
