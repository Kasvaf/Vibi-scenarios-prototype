export interface Message {
  id: string;
  sender: 'user' | 'vibi';
  content: string;
  reasoning?: string; // Bot's reasoning (shown in debug mode)
}

export interface ConversationStep {
  id: string;
  userMessage: string;
  vibiResponse: string;
  vibiReasoning: string;
  userOptions?: string[]; // Predefined user response options
  nextStepMap?: Record<string, string>; // Maps user choice to next step ID
}

export interface AlternativePath {
  title: string;
  description: string;
  triggerMessage: string;
  steps: ConversationStep[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  persona: {
    name: string;
    age: number;
    situation: string;
    mood: string;
    time: string;
  };
  initialMessage: string;
  conversationFlow: ConversationStep[];
  alternativePaths?: AlternativePath[];
  keyHighlights: string[];
  pattern: string;
  vibeCategory?: 'lazy' | 'adventurous' | 'sporty' | 'clubbing';
}

// User Profile for personalization
export interface UserProfile {
  // Required fields (collected in onboarding)
  name: string;                    // User's name (e.g., "Sarah")
  area: string;                    // Dubai area (e.g., "Marina / JBR")
  vibePreference: string;          // Vibe choice (e.g., "Chill & budget-friendly")
  vibeCategory?: 'lazy' | 'adventurous' | 'sporty' | 'clubbing';  // Mood preference

  // Derived from vibePreference (for personalization)
  tone: 'supportive' | 'enthusiastic' | 'sophisticated' | 'adaptive';
  budgetLevel: 'low' | 'mid' | 'high' | 'flexible';

  // Metadata
  createdAt: string;               // ISO timestamp
  lastActive: string;              // ISO timestamp (updated each session)
  completedOnboarding: boolean;    // true after finishing onboarding flow
}

// Vibe mapping for tone and budget inference
export interface VibeMappingEntry {
  tone: 'supportive' | 'enthusiastic' | 'sophisticated' | 'adaptive';
  budget: 'low' | 'mid' | 'high' | 'flexible';
}

export type VibeMapping = Record<string, VibeMappingEntry>;
