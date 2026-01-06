# Vibi Personalization System - Developer Guide

> **For:** Explaining to coworkers how personalization works
> **Purpose:** Make Vibi's responses feel personal and contextual based on user profile

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Token System](#token-system)
4. [How It Works (Step-by-Step)](#how-it-works-step-by-step)
5. [Code Examples](#code-examples)
6. [Adding Personalization to Scenarios](#adding-personalization-to-scenarios)
7. [Before & After Examples](#before--after-examples)
8. [API Reference](#api-reference)

---

## Overview

### What Is Personalization?

Personalization makes Vibi's responses adapt to each user based on their profile data:

- **Name injection** - "Hey Sarah!" instead of "Hey!"
- **Area context** - "Since you're in Marina..." instead of generic location talk
- **Tone matching** - Enthusiastic vs sophisticated language based on user vibe
- **Budget awareness** - Suggest appropriate venues for user's budget level

### Why We Built It This Way

We use a **token-based system** that:
- ✅ Keeps scenarios readable (plain English with placeholders)
- ✅ Separates content from personalization logic
- ✅ Works with or without user profiles (graceful fallback)
- ✅ Easy for non-technical team members to add personalization

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    USER PROFILE                             │
│  { name: "Sarah", area: "Marina", tone: "enthusiastic" }    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Profile data flows down
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 SCENARIO (with tokens)                      │
│  "{tone:greeting} {areaGreeting}, what are you looking     │
│   for today?"                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Message sent to personalization engine
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         PERSONALIZATION ENGINE (personalization.ts)         │
│                                                             │
│  1. Inject name:  {userName} → "Sarah"                     │
│  2. Inject area:  {areaGreeting} → "Since you're in Marina"│
│  3. Adjust tone:  {tone:greeting} → "Yo Sarah!" (enthusiastic)│
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Personalized message returned
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 DISPLAYED MESSAGE                           │
│  "Yo Sarah! Since you're in Marina, what are you looking   │
│   for today?"                                               │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
/src/utils/
  └── personalization.ts        # Core personalization engine

/src/components/
  └── ChatContainer.tsx         # Applies personalization before rendering

/src/data/
  └── scenarios.ts              # Scenarios with personalization tokens

/docs/
  └── PERSONALIZATION-GUIDE.md  # This document
```

---

## Token System

### Available Tokens

Tokens are **placeholders** in scenario messages that get replaced with user data at runtime.

| Token | Replaced With | Example |
|-------|---------------|---------|
| `{userName}` | User's name | "Sarah" |
| `{userArea}` | User's area | "Marina / JBR" |
| `{areaGreeting}` | Context-aware area greeting | "Since you're in Marina" |
| `{tone:greeting}` | Tone-appropriate greeting | "Yo Sarah!" (enthusiastic) |
| `{tone:encouragement}` | Tone-appropriate encouragement | "Let's go!" (enthusiastic) |
| `{tone:suggestion}` | Tone-appropriate suggestion | "Check out" (enthusiastic) |
| `{tone:confirmation}` | Tone-appropriate confirmation | "Love it!" (enthusiastic) |
| `{tone:transition}` | Tone-appropriate transition | "Alright!" (enthusiastic) |

### Tone Categories

Based on user's vibe preference, different phrases are used:

| Vibe Preference | Tone | Greeting Example | Encouragement Example |
|----------------|------|------------------|----------------------|
| 😊 Chill & budget-friendly | `supportive` | "Hey Sarah!" | "I got you" |
| ✨ Trendy & mid-range | `enthusiastic` | "Yo Sarah!" | "Let's go!" |
| 🥂 Luxury & top-tier | `sophisticated` | "Hello Sarah" | "Excellent choice" |
| 🎯 Mix it up | `adaptive` | "Hey Sarah!" | "Great!" |

---

## How It Works (Step-by-Step)

### Step 1: User Completes Onboarding

```typescript
// User profile is created and saved to localStorage
{
  name: "Sarah",
  area: "Marina / JBR",
  vibePreference: "✨ Trendy & mid-range",
  tone: "enthusiastic",        // Derived from vibe
  budgetLevel: "mid"           // Derived from vibe
}
```

### Step 2: Scenario Contains Tokens

```typescript
// In scenarios.ts
{
  vibiResponse: "{tone:greeting} {areaGreeting}, what are you looking for today?",
  // Original tokens: {tone:greeting} and {areaGreeting}
}
```

### Step 3: ChatContainer Applies Personalization

```typescript
// In ChatContainer.tsx (simplified)
import { personalizeMessage } from '../utils/personalization';

const personalizedContent = personalizeMessage(
  message.content,  // Message with tokens
  userProfile       // User profile data
);
```

### Step 4: Tokens Are Replaced

```typescript
// personalizeMessage() does:
1. {tone:greeting} → getTonePhrase('enthusiastic', 'greeting') → "Yo Sarah!"
2. {areaGreeting} → getAreaContext('Marina / JBR').greeting → "Since you're in Marina"
3. Result: "Yo Sarah! Since you're in Marina, what are you looking for today?"
```

### Step 5: User Sees Personalized Message

```
Vibi: "Yo Sarah! Since you're in Marina, what are you looking
      for today?"
```

---

## Code Examples

### Example 1: Basic Name Injection

**Scenario Code:**
```typescript
{
  vibiResponse: "Hey {userName}! What are you looking for today?",
}
```

**How It's Processed:**
```typescript
// Without profile
personalizeMessage("Hey {userName}! What are you looking for today?", null)
// Returns: "Hey ! What are you looking for today?"

// With profile (name: "Sarah")
personalizeMessage("Hey {userName}! What are you looking for today?", profile)
// Returns: "Hey Sarah! What are you looking for today?"
```

---

### Example 2: Tone-Aware Greeting

**Scenario Code:**
```typescript
{
  vibiResponse: "{tone:greeting} What's the plan for tonight?",
}
```

**Different Tone Results:**
```typescript
// Enthusiastic user (Sarah)
personalizeMessage("{tone:greeting} What's the plan for tonight?", sarahProfile)
// Returns: "Yo Sarah! What's the plan for tonight?"

// Sophisticated user (Alex)
personalizeMessage("{tone:greeting} What's the plan for tonight?", alexProfile)
// Returns: "Hello Alex, what's the plan for tonight?"

// Supportive user (Jamie)
personalizeMessage("{tone:greeting} What's the plan for tonight?", jamieProfile)
// Returns: "Hey Jamie! What's the plan for tonight?"
```

---

### Example 3: Area-Based Context

**Scenario Code:**
```typescript
{
  vibiResponse: "{areaGreeting}, I'm thinking either stick around there or head to DIFC - which sounds better?",
}
```

**Different Area Results:**
```typescript
// Marina user
personalizeMessage("...", marinaProfile)
// Returns: "Since you're in Marina, I'm thinking either stick around there or head to DIFC..."

// DIFC user
personalizeMessage("...", difcProfile)
// Returns: "Since you're in DIFC, I'm thinking either stick around there or head to JBR..."
```

---

### Example 4: Combined Personalization

**Scenario Code:**
```typescript
{
  vibiResponse: "{tone:greeting} {areaGreeting}, how about {tone:suggestion} Scalini tonight?",
}
```

**Result for Enthusiastic Marina User:**
```typescript
personalizeMessage("...", {
  name: "Sarah",
  area: "Marina / JBR",
  tone: "enthusiastic"
})
// Returns: "Yo Sarah! Since you're in Marina, how about Check out Scalini tonight?"
```

---

## Adding Personalization to Scenarios

### Quick Guide for Team Members

1. **Open the scenario file** (`src/data/scenarios.ts`)
2. **Add tokens** to Vibi's responses where you want personalization
3. **Use these common patterns:**

```typescript
// Pattern 1: Start with personalized greeting
vibiResponse: "{tone:greeting} What are you looking for?"

// Pattern 2: Reference user's area
vibiResponse: "{areaGreeting}, I'm thinking you should check out..."

// Pattern 3: Combine name + suggestion
vibiResponse: "Hey {userName}! {tone:suggestion} trying this spot..."

// Pattern 4: Enthusiastic encouragement
vibiResponse: "{tone:encouragement} That's a great choice!"

// Pattern 5: Smooth transition
vibiResponse: "{tone:transition}, let me help you with that."
```

### Best Practices

✅ **DO:**
- Use `{tone:greeting}` at conversation starts
- Use `{areaGreeting}` when making location-based suggestions
- Use `{userName}` when addressing the user directly
- Keep tokens natural in sentences

❌ **DON'T:**
- Overuse name injection (once per 3-4 messages is enough)
- Use multiple tone tokens in one sentence (sounds repetitive)
- Forget that messages must work WITHOUT profile too (graceful fallback)

---

## Before & After Examples

### Example 1: Tonight Plans Scenario

**BEFORE (Generic):**
```
User: What should I do tonight?

Vibi: Ooh dinner plans! Quick question - are you thinking
      fancy date night or more casual vibes?

User: Fancy

Vibi: Perfect! For that upscale vibe, go to Scalini in DIFC.
      Really nice Italian spot, romantic but not stuffy, and
      the food is legit.
```

**AFTER (Personalized for Sarah, Marina, Enthusiastic):**
```
User: What should I do tonight?

Vibi: Yo Sarah! Dinner plans tonight? Quick question - are you
      thinking fancy date night or more casual vibes?

User: Fancy

Vibi: Love it! Since you're in Marina, you should definitely
      check out Scalini in DIFC (just 15 mins away). Really
      nice Italian spot, romantic but not stuffy, and the food
      is legit.
```

**What Changed:**
- Added "Yo Sarah!" (enthusiastic greeting with name)
- Added "Since you're in Marina" (area context)
- Changed "Perfect!" → "Love it!" (enthusiastic confirmation)
- Changed "go to" → "you should definitely check out" (enthusiastic suggestion)
- Added distance context "(just 15 mins away)" (area-aware)

---

### Example 2: I'm Bored Scenario

**BEFORE (Generic):**
```
User: I'm bored

Vibi: Sunday mood, I feel you! Quick question - are you trying
      to stay home and chill or get out of the house for a bit?

User: Get out

Vibi: Say less! Want to stick around your area or explore
      somewhere new?
```

**AFTER (Personalized for Alex, DIFC, Sophisticated):**
```
User: I'm bored

Vibi: Hello Alex. I understand - Sunday afternoons can be
      rather quiet. Would you prefer to remain at home or
      venture out for a bit?

User: Get out

Vibi: Excellent. Since you're in DIFC, would you like to
      explore the area or venture to another district?
```

**What Changed:**
- "Sunday mood, I feel you!" → "Hello Alex. I understand..." (sophisticated greeting + name)
- "get out of the house" → "venture out" (sophisticated language)
- "Say less!" → "Excellent." (sophisticated confirmation)
- Added "Since you're in DIFC" (area context)
- "explore somewhere new" → "venture to another district" (sophisticated vocabulary)

---

## API Reference

### Core Functions

#### `personalizeMessage(message, profile)`

**Main personalization function** - Call this to personalize any message.

```typescript
import { personalizeMessage } from './utils/personalization';

const personalized = personalizeMessage(
  "Hey {userName}! {areaGreeting}, what's up?",
  userProfile
);
```

**Parameters:**
- `message` (string) - Message with tokens
- `profile` (UserProfile | null) - User profile or null

**Returns:** Fully personalized message (string)

---

#### `getTonePhrase(tone, phraseType)`

Get a specific phrase for a tone category.

```typescript
import { getTonePhrase } from './utils/personalization';

const greeting = getTonePhrase('enthusiastic', 'greeting');
// Returns: "Yo Sarah!" or "What's up Sarah!" (random from library)
```

**Parameters:**
- `tone` - 'supportive' | 'enthusiastic' | 'sophisticated' | 'adaptive'
- `phraseType` - 'greeting' | 'encouragement' | 'suggestion' | 'confirmation' | 'transition'

**Returns:** Random phrase from that category (string)

---

#### `getAreaContext(area)`

Get area-specific information.

```typescript
import { getAreaContext } from './utils/personalization';

const context = getAreaContext('Marina / JBR');
// Returns: {
//   greeting: "Since you're in Marina",
//   nearbyAreas: ["JBR Beach", "The Walk", "Marina Mall", "DIFC"],
//   vibe: "beach vibes, expat-friendly, waterfront dining"
// }
```

**Parameters:**
- `area` (string) - User's area

**Returns:** Area context object

---

#### `filterByBudget(items, budgetLevel)`

Filter venue/event list by user's budget.

```typescript
import { filterByBudget } from './utils/personalization';

const venues = [
  { name: "Cheap Eats", priceLevel: 1 },
  { name: "Mid Range", priceLevel: 2 },
  { name: "Luxury Spot", priceLevel: 4 }
];

const affordable = filterByBudget(venues, 'low');
// Returns: [{ name: "Cheap Eats", priceLevel: 1 }, { name: "Mid Range", priceLevel: 2 }]
```

**Parameters:**
- `items` - Array of objects with optional `priceLevel` property
- `budgetLevel` - 'low' | 'mid' | 'high' | 'flexible'

**Returns:** Filtered array

---

## Integration Checklist

For coworkers implementing personalization in new scenarios:

- [ ] Add tokens to scenario messages (`{userName}`, `{tone:greeting}`, etc.)
- [ ] Test with different profiles (enthusiastic, sophisticated, supportive)
- [ ] Verify messages work WITHOUT profile (graceful fallback)
- [ ] Check that personalization feels natural (not forced)
- [ ] Use area context where location-relevant
- [ ] Match tone consistency throughout conversation
- [ ] Test on mobile (responsive design with longer personalized messages)

---

## Troubleshooting

### Issue: Tokens appear as literal text

**Problem:** Message shows "{userName}" instead of actual name

**Solution:** Make sure `personalizeMessage()` is called in ChatContainer before rendering

```typescript
// ❌ Wrong - renders raw tokens
<div>{message.content}</div>

// ✅ Correct - personalizes first
<div>{personalizeMessage(message.content, userProfile)}</div>
```

---

### Issue: Tone doesn't match user vibe

**Problem:** Sophisticated user getting enthusiastic language

**Solution:** Verify user profile has correct tone value

```typescript
// Check user profile
console.log(userProfile.tone);  // Should be: 'sophisticated'

// If wrong, check vibe mapping in OnboardingFlow.tsx
```

---

### Issue: Area context doesn't show

**Problem:** `{areaGreeting}` is blank

**Solution:** Check if area is in `getAreaContext()` mapping

```typescript
// If custom area, ensure fallback works
getAreaContext("Custom Area")
// Should return: { greeting: "Since you're in Custom Area", ... }
```

---

## Summary

The personalization system is a **token-based engine** that:

1. ✅ Uses placeholders (`{userName}`, `{tone:greeting}`) in scenario messages
2. ✅ Replaces tokens at runtime based on user profile
3. ✅ Adapts tone to match user vibe (supportive/enthusiastic/sophisticated)
4. ✅ Injects area context for location-based suggestions
5. ✅ Gracefully handles users without profiles (removes tokens)

**Key Files:**
- `/src/utils/personalization.ts` - Core engine
- `/src/data/scenarios.ts` - Add tokens here
- `/src/components/ChatContainer.tsx` - Applies personalization

**For Questions:**
- Check code comments in `personalization.ts` (heavily documented)
- See examples in this guide
- Test with different profiles in dev tools

---

**Last Updated:** January 2026
**Version:** 1.0
**Status:** Production Ready
