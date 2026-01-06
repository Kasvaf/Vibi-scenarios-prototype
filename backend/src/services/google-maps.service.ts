/**
 * Google Maps Service
 * Fetches venue details, ratings, reviews, and location data from Google Places API
 */

import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';
import { GooglePlaceDetails, GoogleReview } from '../types';

export class GoogleMapsService {
  private client: Client;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Client({});
  }

  /**
   * Find a place by name and location
   * @param venueName Name of the venue
   * @param location Optional location bias (Dubai coordinates)
   * @returns Place ID
   */
  async findPlace(
    venueName: string,
    location = { lat: 25.2048, lng: 55.2708 } // Dubai coordinates
  ): Promise<string | null> {
    console.log(`🔍 Searching for: ${venueName}`);

    try {
      const response = await this.client.findPlaceFromText({
        params: {
          input: `${venueName} Dubai`,
          inputtype: PlaceInputType.textQuery,
          fields: ['place_id', 'name'],
          locationbias: `point:${location.lat},${location.lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.candidates && response.data.candidates.length > 0) {
        const placeId = response.data.candidates[0].place_id;
        console.log(`✅ Found place ID: ${placeId}`);
        return placeId!;
      }

      console.log(`❌ No results for: ${venueName}`);
      return null;
    } catch (error: any) {
      console.error(`❌ Google Places search failed:`, error.message);
      return null;
    }
  }

  /**
   * Get detailed information about a place
   * @param placeId Google Place ID
   * @returns Detailed place information
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    console.log(`📍 Fetching details for place: ${placeId}`);

    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: [
            'place_id',
            'name',
            'rating',
            'user_ratings_total',
            'price_level',
            'types',
            'formatted_address',
            'geometry',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'photos',
            'reviews',
          ],
          key: this.apiKey,
        },
      });

      const place = response.data.result;

      if (!place) {
        return null;
      }

      // Transform Google's response to our format
      const details: GooglePlaceDetails = {
        placeId: place.place_id!,
        name: place.name!,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        types: place.types || [],
        address: place.formatted_address!,
        location: {
          lat: place.geometry!.location.lat,
          lng: place.geometry!.location.lng,
        },
        phone: place.formatted_phone_number,
        website: place.website,
        openingHours: place.opening_hours
          ? {
              weekdayText: place.opening_hours.weekday_text || [],
              periods: place.opening_hours.periods || [],
            }
          : undefined,
        photos:
          place.photos?.map(
            (photo) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
          ) || [],
        reviews: this.transformReviews(place.reviews || []),
      };

      console.log(`✅ Got details for: ${details.name} (${details.rating}⭐)`);
      return details;
    } catch (error: any) {
      console.error(`❌ Failed to get place details:`, error.message);
      return null;
    }
  }

  /**
   * Get detailed venue info by name (search + details)
   * @param venueName Name of the venue
   * @returns Complete venue details with reviews
   */
  async getVenueByName(venueName: string): Promise<GooglePlaceDetails | null> {
    // Step 1: Find the place
    const placeId = await this.findPlace(venueName);
    if (!placeId) {
      return null;
    }

    // Step 2: Get full details
    return await this.getPlaceDetails(placeId);
  }

  /**
   * Search for venues in a specific area
   * @param query Search query (e.g., "nightclub", "beach club")
   * @param location Center point
   * @param radius Radius in meters (default: 5000)
   * @returns Array of place IDs
   */
  async searchNearby(
    query: string,
    location = { lat: 25.2048, lng: 55.2708 },
    radius: number = 5000
  ): Promise<string[]> {
    console.log(`🔍 Searching for ${query} near Dubai...`);

    try {
      const response = await this.client.textSearch({
        params: {
          query: `${query} Dubai`,
          location: `${location.lat},${location.lng}`,
          radius,
          key: this.apiKey,
        },
      });

      const placeIds = response.data.results
        .map((place) => place.place_id!)
        .filter(Boolean);

      console.log(`✅ Found ${placeIds.length} places`);
      return placeIds;
    } catch (error: any) {
      console.error(`❌ Nearby search failed:`, error.message);
      return [];
    }
  }

  /**
   * Transform Google reviews to our format
   */
  private transformReviews(googleReviews: any[]): GoogleReview[] {
    return googleReviews.map((review) => ({
      authorName: review.author_name,
      rating: review.rating,
      text: review.text,
      time: new Date(review.time * 1000), // Convert Unix timestamp
      profilePhotoUrl: review.profile_photo_url,
    }));
  }
}

// Example usage:
// const googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);
// const venue = await googleMaps.getVenueByName('Zero Gravity Dubai');
// console.log(venue.rating, venue.reviews);
