import { UserProfile } from '../types';

/**
 * VIBI PERSONALIZATION SYSTEM
 * ===========================
 *
 * This utility provides functions to personalize Vibi's responses based on user profile data.
 *
 * HOW IT WORKS:
 * 1. Scenarios contain messages with PLACEHOLDER TOKENS like {userName}, {userArea}
 * 2. At runtime, these tokens are replaced with actual user data
 * 3. Tone is adjusted based on user's vibe preference
 *
 * EXAMPLE:
 * Original: "Hey! What are you looking for today?"
 * Personalized: "Hey Sarah! What are you looking for today?"
 *
 * TOKEN REFERENCE:
 * - {userName} → User's name (e.g., "Sarah")
 * - {userArea} → User's area (e.g., "Marina")
 * - {areaGreeting} → Area-specific greeting (e.g., "Since you're in Marina")
 * - {tone:casual|supportive|enthusiastic|sophisticated} → Tone-specific phrases
 */

// ============================================================================
// TONE MAPPING
// ============================================================================
// Maps user vibe preferences to conversation tone styles

interface TonePhrases {
  greeting: string[];           // How to greet the user
  encouragement: string[];      // Encouraging phrases
  transition: string[];         // Transition between topics
  confirmation: string[];       // Confirming choices
  suggestion: string[];         // Making suggestions
}

/**
 * Tone phrase library for different user vibes
 * Each tone has specific phrases that match the user's energy level
 */
const toneLibrary: Record<string, TonePhrases> = {
  // Supportive tone - for "Chill & budget-friendly" users
  supportive: {
    greeting: ["Hey {userName}!", "Hi {userName}!", "What's up {userName}?"],
    encouragement: ["I got you", "No pressure", "Take your time", "I feel you"],
    transition: ["So", "Alright", "Cool", "Okay"],
    confirmation: ["Sounds good", "Perfect", "Got it", "Nice"],
    suggestion: ["How about", "Maybe try", "You could check out", "What about"]
  },

  // Enthusiastic tone - for "Trendy & mid-range" users
  enthusiastic: {
    greeting: ["Hey {userName}! 👋", "Yo {userName}!", "What's up {userName}!"],
    encouragement: ["Let's go!", "Love it!", "That's the move!", "Bet!"],
    transition: ["Okay so", "Alright!", "Perfect!", "Sweet!"],
    confirmation: ["Yess!", "Love that!", "Perfect choice!", "Amazing!"],
    suggestion: ["You should definitely", "Check out", "Go to", "Hit up"]
  },

  // Sophisticated tone - for "Luxury & top-tier" users
  sophisticated: {
    greeting: ["Hello {userName}", "Good to see you, {userName}", "Hi {userName}"],
    encouragement: ["Excellent choice", "Superb", "Well done", "Perfect"],
    transition: ["Now then", "Moving forward", "Next", "Certainly"],
    confirmation: ["Very well", "Excellent", "Wonderful", "Splendid"],
    suggestion: ["I'd recommend", "Consider", "You might enjoy", "I suggest"]
  },

  // Adaptive tone - for "Mix it up" users (balanced)
  adaptive: {
    greeting: ["Hey {userName}!", "Hi {userName}!", "What's up {userName}?"],
    encouragement: ["Great!", "Nice!", "Perfect!", "Awesome!"],
    transition: ["Alright", "Okay", "Cool", "Right"],
    confirmation: ["Sounds good", "Perfect", "Great choice", "Nice"],
    suggestion: ["How about", "Check out", "You could try", "Go to"]
  }
};

// ============================================================================
// AREA-BASED PERSONALIZATION
// ============================================================================

/**
 * Get area-specific context for location-based recommendations
 * Helps provide relevant suggestions based on where user lives/hangs out
 */
export function getAreaContext(area: string): {
  greeting: string;
  nearbyAreas: string[];
  vibe: string;
} {
  const areaMap: Record<string, { greeting: string; nearbyAreas: string[]; vibe: string }> = {
    "Marina / JBR": {
      greeting: "Since you're in Marina",
      nearbyAreas: ["JBR Beach", "The Walk", "Marina Mall", "DIFC (15 min drive)"],
      vibe: "beach vibes, expat-friendly, waterfront dining"
    },
    "DIFC / Downtown": {
      greeting: "Since you're in DIFC",
      nearbyAreas: ["Downtown Dubai", "Burj Khalifa area", "Dubai Mall", "Business Bay"],
      vibe: "upscale, business crowd, fine dining"
    },
    "Business Bay / Deira": {
      greeting: "Since you're in that area",
      nearbyAreas: ["Business Bay", "Deira", "Bur Dubai", "Dubai Creek"],
      vibe: "authentic, diverse, local culture"
    },
    "I'm all over Dubai": {
      greeting: "Since you're mobile",
      nearbyAreas: ["Anywhere in Dubai!"],
      vibe: "flexible, adventurous"
    }
  };

  return areaMap[area] || {
    greeting: "Since you're in " + area,
    nearbyAreas: [area],
    vibe: "local favorite"
  };
}

// ============================================================================
// NAME INJECTION
// ============================================================================

/**
 * Inject user's name into a message naturally
 * Handles various name placeholder formats
 */
export function injectName(message: string, userName: string): string {
  return message
    .replace(/{userName}/g, userName)
    .replace(/{name}/g, userName)
    .replace(/\[Name\]/g, userName);
}

// ============================================================================
// TONE ADJUSTMENT
// ============================================================================

/**
 * Get a phrase from the tone library based on user's vibe
 *
 * @param tone - User's tone preference (from profile)
 * @param phraseType - Type of phrase needed (greeting, encouragement, etc.)
 * @returns Random phrase from that category
 */
export function getTonePhrase(
  tone: 'supportive' | 'enthusiastic' | 'sophisticated' | 'adaptive',
  phraseType: keyof TonePhrases
): string {
  const phrases = toneLibrary[tone]?.[phraseType] || toneLibrary.adaptive[phraseType];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Adjust message tone based on user's vibe preference
 * Replaces {tone:phraseType} tokens with appropriate phrases
 *
 * EXAMPLE:
 * Input: "{tone:greeting} What are you looking for?"
 * Output (enthusiastic): "Yo Sarah! What are you looking for?"
 * Output (sophisticated): "Hello Sarah, what are you looking for?"
 */
export function adjustTone(message: string, tone: string): string {
  // Replace tone tokens: {tone:greeting}, {tone:encouragement}, etc.
  const toneRegex = /\{tone:(\w+)\}/g;

  return message.replace(toneRegex, (match, phraseType) => {
    const validTone = ['supportive', 'enthusiastic', 'sophisticated', 'adaptive'].includes(tone)
      ? (tone as 'supportive' | 'enthusiastic' | 'sophisticated' | 'adaptive')
      : 'adaptive';

    return getTonePhrase(validTone, phraseType as keyof TonePhrases);
  });
}

// ============================================================================
// AREA INJECTION
// ============================================================================

/**
 * Inject area-specific context into messages
 * Replaces {userArea} and {areaGreeting} tokens
 */
export function injectArea(message: string, area: string): string {
  const context = getAreaContext(area);

  return message
    .replace(/{userArea}/g, area)
    .replace(/{areaGreeting}/g, context.greeting);
}

// ============================================================================
// BUDGET-AWARE FILTERING
// ============================================================================

/**
 * Filter recommendations based on user's budget level
 * Used to show appropriate venue suggestions
 *
 * EXAMPLE:
 * User with "low" budget → Show venues with $ or $$
 * User with "high" budget → Show venues with $$$ or $$$$
 */
export function filterByBudget<T extends { priceLevel?: number }>(
  items: T[],
  budgetLevel: 'low' | 'mid' | 'high' | 'flexible'
): T[] {
  if (budgetLevel === 'flexible') return items;

  const budgetMap = {
    low: [1, 2],      // $ and $$
    mid: [2, 3],      // $$ and $$$
    high: [3, 4]      // $$$ and $$$$
  };

  const allowedLevels = budgetMap[budgetLevel];
  return items.filter(item =>
    !item.priceLevel || allowedLevels.includes(item.priceLevel)
  );
}

// ============================================================================
// MAIN PERSONALIZATION FUNCTION
// ============================================================================

/**
 * MAIN PERSONALIZATION ENGINE
 * ===========================
 *
 * This is the primary function that applies ALL personalization to a message.
 * Call this function before displaying any Vibi message to the user.
 *
 * HOW TO USE:
 * -----------
 * const originalMessage = "Hey! {areaGreeting}, what are you looking for today?";
 * const personalized = personalizeMessage(originalMessage, userProfile);
 * // Result: "Hey! Since you're in Marina, what are you looking for today?"
 *
 * WHAT IT DOES:
 * ------------
 * 1. Injects user's name where {userName} appears
 * 2. Injects user's area where {userArea} or {areaGreeting} appears
 * 3. Adjusts tone based on user's vibe preference
 * 4. Returns fully personalized message
 *
 * @param message - Original message from scenario (with tokens)
 * @param profile - User profile data (or null if no profile)
 * @returns Personalized message ready to display
 */
export function personalizeMessage(
  message: string,
  profile: UserProfile | null
): string {
  // If no profile, return message as-is (remove tokens)
  if (!profile) {
    return message
      .replace(/\{userName\}/g, '')
      .replace(/\{name\}/g, '')
      .replace(/\{userArea\}/g, 'Dubai')
      .replace(/\{areaGreeting\}/g, '')
      .replace(/\{tone:\w+\}/g, 'Hey');
  }

  let personalized = message;

  // Step 1: Adjust tone (this may insert {userName} tokens)
  personalized = adjustTone(personalized, profile.tone);

  // Step 2: Inject area context
  personalized = injectArea(personalized, profile.area);

  // Step 3: Inject name (must be last to replace {userName} from tone phrases)
  personalized = injectName(personalized, profile.name);

  return personalized;
}

// ============================================================================
// CONVERSATION FLOW HELPERS
// ============================================================================

/**
 * Get personalized greeting for scenario start
 * Used at the beginning of conversations
 */
export function getPersonalizedGreeting(profile: UserProfile | null): string {
  if (!profile) return "Hey!";

  const phrase = getTonePhrase(profile.tone, 'greeting');
  return phrase.replace('{userName}', profile.name);
}

/**
 * Get area-specific venue suggestions
 * Returns nearby venues based on user's area
 */
export function getNearbyVenues(area: string): string[] {
  const context = getAreaContext(area);
  return context.nearbyAreas;
}

/**
 * Determine if a suggestion is appropriate for user's budget
 * Returns true if venue matches user's budget comfort level
 */
export function isWithinBudget(
  priceLevel: number,
  budgetLevel: 'low' | 'mid' | 'high' | 'flexible'
): boolean {
  if (budgetLevel === 'flexible') return true;

  const budgetMap = {
    low: [1, 2],
    mid: [2, 3],
    high: [3, 4]
  };

  return budgetMap[budgetLevel].includes(priceLevel);
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Export all personalization utilities
 * Import these in components to apply personalization
 */
export default {
  personalizeMessage,
  getPersonalizedGreeting,
  getTonePhrase,
  getAreaContext,
  getNearbyVenues,
  filterByBudget,
  isWithinBudget,
  injectName,
  injectArea,
  adjustTone
};
