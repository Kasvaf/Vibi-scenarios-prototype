// Type definitions for Vibi backend

export interface Venue {
  id: string;
  name: string;
  type: 'restaurant' | 'bar' | 'club' | 'beach_club' | 'cafe' | 'lounge';
  instagramHandle?: string;
  googlePlaceId?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string; // DIFC, Marina, JBR, etc.
  };
  contact?: {
    phone?: string;
    website?: string;
    whatsapp?: string;
  };
  rating?: number;
  priceLevel?: number; // 1-4 ($-$$$$)
  openingHours?: string[];
  lastSyncedAt?: Date;
}

export interface InstagramPost {
  id: string;
  venueId: string;
  caption: string;
  timestamp: Date;
  type: 'Image' | 'Video' | 'Sidecar';
  url: string;
  mediaUrls: string[];
  videoUrl?: string;
  likes: number;
  comments: number;
}

export interface ExtractedEvent {
  eventName: string | null;
  date: string | null; // YYYY-MM-DD
  dayOfWeek?: string;
  startTime: string | null; // HH:MM
  endTime: string | null;
  djArtist?: string;
  musicGenre?: string;
  pricing: {
    [key: string]: string; // e.g., { "ladies": "free", "gents": "200 AED" }
  };
  specialOffers: string[];
  dresscode?: string;
  bookingInfo?: string;
  isLadiesNight: boolean;
  confidence: number; // 0-1, how confident Claude is this is an event
}

export interface Event {
  id: string;
  venueId: string;
  name: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  djArtist?: string;
  genre?: string;
  pricing: Record<string, string>;
  offers: string[];
  bookingInfo?: string;
  isLadiesNight: boolean;
  source: 'instagram' | 'platinumlist' | 'manual';
  instagramPostId?: string;
  instagramUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GooglePlaceDetails {
  placeId: string;
  name: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  phone?: string;
  website?: string;
  openingHours?: {
    weekdayText: string[];
    periods: any[];
  };
  photos?: string[];
  reviews?: GoogleReview[];
}

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  time: Date;
  profilePhotoUrl?: string;
}

export interface Concert {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: Date;
  time?: string;
  ticketUrl?: string;
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  genre?: string;
  source: string; // 'platinumlist', 'ticketmaster', etc.
  imageUrl?: string;
  description?: string;
}

export interface SyncJobResult {
  success: boolean;
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  errors: string[];
  duration: number; // milliseconds
}
