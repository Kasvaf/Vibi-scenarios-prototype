import { UserProfile } from '../types';

// localStorage key for user profile
const PROFILE_KEY = 'vibiUserProfile';

/**
 * Save user profile to localStorage
 */
export const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
  }
};

/**
 * Load user profile from localStorage
 * Returns null if no profile exists or if parsing fails
 */
export const loadProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return null;
  }
};

/**
 * Update user profile with partial data
 * Automatically updates lastActive timestamp
 */
export const updateProfile = (updates: Partial<UserProfile>): void => {
  const current = loadProfile();
  if (current) {
    saveProfile({
      ...current,
      ...updates,
      lastActive: new Date().toISOString(),
    });
  }
};

/**
 * Clear user profile from localStorage
 * Useful for testing or user-requested reset
 */
export const clearProfile = (): void => {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error('Failed to clear profile from localStorage:', error);
  }
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = (): boolean => {
  const profile = loadProfile();
  return profile?.completedOnboarding || false;
};
