# Vibi Scenarios Overview

This folder contains complete conversation scenarios demonstrating how Vibi interacts with users across different situations and moods.

## Scenario Collection

### 1. [Tonight Plans](./01-tonight-plans.md)
**Use Case**: Last-minute decision making
**User Mood**: Spontaneous, ready to go out
**Conversation Style**: Fast-paced, decisive
**Key Feature**: Strategic planning (dinner location → nearby bars)

**What It Demonstrates**:
- Quick narrowing from broad to specific
- Opinionated recommendations with reasoning
- Context-aware follow-up suggestions

---

### 2. [Lazy Sunday](./02-lazy-sunday.md)
**Use Case**: Low-energy, exploratory day planning
**User Mood**: Relaxed, flexible, no rush
**Conversation Style**: Slow-paced, organic
**Key Feature**: Progressive building (brunch → galleries)

**What It Demonstrates**:
- Energy matching (bot mirrors user's chill vibe)
- Organic conversation extension
- Sunday-specific contextual knowledge

---

### 3. [Birthday Party Planning](./03-birthday-party.md)
**Use Case**: Complex event planning with multiple requirements
**User Mood**: Excited but needs guidance
**Conversation Style**: Consultative, detailed
**Key Feature**: Requirements gathering through conversation

**What It Demonstrates**:
- Multi-factor decision making (size, budget, cuisine, vibe)
- Planning for someone else (boyfriend's preferences)
- Practical booking and day-of advice
- Private room recommendation for special occasion

---

### 4. [First Time in Dubai](./04-first-time-dubai.md)
**Use Case**: Week-long trip planning for tourists
**User Mood**: Excited, wants comprehensive guidance
**Conversation Style**: Educational, balanced
**Key Feature**: Tourist + local perspective

**What It Demonstrates**:
- Balancing iconic sights with authentic experiences
- Honest opinions about touristy things
- Personalized filtering (food + adventure focus)
- Comprehensive planning across multiple days

---

### 5. [Surprise Me](./05-surprise-me.md)
**Use Case**: Breaking out of routine, seeking unique experiences
**User Mood**: Adventurous, trusting, wants novelty
**Conversation Style**: Vibi-led, creative, bold
**Key Feature**: Bot takes full creative control

**What It Demonstrates**:
- Proactive recommendation style
- Risk calibration (1-10 adventurous scale)
- Cohesive multi-venue experience design
- Honest about potential downsides
- Personal investment in outcome

---

### 6. [I'm Bored](./06-im-bored.md)
**Use Case**: Vague emotional state, needs inspiration
**User Mood**: Low energy, indecisive, unmotivated
**Conversation Style**: Supportive, progressive narrowing
**Key Feature**: Addressing psychological need, not just activity

**What It Demonstrates**:
- Emotional intelligence (recognizing low motivation)
- Decision support for indecisive users
- Solo activity normalization
- Root cause addressing (change of scenery)
- Energy matching

---

### 7. [Girls Night Out - Offers](./07-girls-night-offers.md)
**Use Case**: Group outing focused on deals/promotions
**User Mood**: Fun, social, budget-conscious
**Conversation Style**: Enthusiastic, strategic
**Key Feature**: Dubai ladies' night optimization

**What It Demonstrates**:
- Dubai-specific cultural knowledge (Tuesday ladies' nights)
- Deal optimization and multi-venue strategy
- Transparency about trade-offs (house drinks, crowds)
- Group dynamics consideration
- Promotional awareness

---

### 8. [Girlfriend Date Night](./08-girlfriend-date-night.md)
**Use Case**: Romantic date planning
**User Mood**: Wants to impress, slightly nervous
**Conversation Style**: Supportive, confidence-building
**Key Feature**: Partner-focused recommendations

**What It Demonstrates**:
- Stakeholder awareness (her preferences over his)
- Romance expertise (lighting, ambiance, table location)
- Confidence coaching
- Practical stress reduction (parking, dress code)
- Success-oriented guidance

---

### 9. [Luxury High-End Clubs](./09-luxury-high-end.md)
**Use Case**: Premium nightlife experience
**User Mood**: Confident, expects exclusivity
**Conversation Style**: Sophisticated, tier-appropriate
**Key Feature**: VIP access and luxury market knowledge

**What It Demonstrates**:
- Tier flexibility (adapts to luxury expectations)
- Dubai premium nightlife expertise
- Price transparency (real costs vs minimums)
- VIP dynamics (hosts, door politics, table hierarchy)
- Honest guidance without judgment

---

## Scenario Comparison Matrix

| Scenario | Pace | Control | Complexity | Planning Horizon | Budget Tier |
|----------|------|---------|------------|------------------|-------------|
| Tonight Plans | Fast | Collaborative | Simple | Immediate (hours) | Mid-range |
| Lazy Sunday | Slow | User-led | Simple | Same day | Budget-friendly |
| Birthday Party | Medium | Consultative | Complex | 2 weeks ahead | Mid-range |
| First Time Dubai | Medium | Collaborative | Complex | Full week | Mixed |
| Surprise Me | Fast | Vibi-led | Medium | Immediate (hours) | Mid-range |
| I'm Bored | Medium | Supportive | Simple | Same day | Free-Low |
| Girls Night Offers | Fast | Strategic | Medium | Same evening | Budget-conscious |
| Girlfriend Date | Medium | Confidence-building | Medium | Same evening | Mid-range |
| Luxury High-End | Fast | Sophisticated | Medium | Same evening | Premium (10k+) |

---

## Conversation Patterns Demonstrated

### Pattern 1: Progressive Narrowing
**Seen in**: Tonight Plans, Lazy Sunday, Birthday Party
```
Broad question → Binary choice → Refinement → Specific recommendation
```

### Pattern 2: Requirements Gathering
**Seen in**: Birthday Party, First Time Dubai
```
Natural questions → Context building → Personalized recommendations
```

### Pattern 3: Opinionated Guidance
**Seen in**: All scenarios
```
"Here's what I think..." → Reasoning → "What do you think?"
```

### Pattern 4: Creative Authority
**Seen in**: Surprise Me
```
Minimal questions → Bold plan → Justification → Buy-in check
```

---

## User Types Covered

1. **The Decider** (Tonight Plans) - Knows they want to go out, needs quick direction
2. **The Explorer** (Lazy Sunday) - Open-ended, mood-based, no pressure
3. **The Planner** (Birthday Party) - Specific occasion, multiple requirements
4. **The Tourist** (First Time Dubai) - New to city, wants comprehensive guidance
5. **The Adventurer** (Surprise Me) - Trusts Vibi, wants novelty
6. **The Unmotivated** (I'm Bored) - Needs inspiration and decision support
7. **The Deal Seeker** (Girls Night) - Value-conscious, group dynamics
8. **The Romantic** (Girlfriend Date) - Wants to impress, needs confidence
9. **The VIP** (Luxury High-End) - Premium expectations, exclusivity-focused

---

## Contextual Factors Demonstrated

### Time Sensitivity
- **Immediate**: Tonight Plans, Surprise Me
- **Same Day**: Lazy Sunday
- **Advance Planning**: Birthday Party
- **Trip Planning**: First Time Dubai

### Social Context
- **Solo**: Lazy Sunday (implied)
- **Two People**: Tonight Plans, Lazy Sunday, Surprise Me
- **Group**: Birthday Party (10-12 people)
- **Variable**: First Time Dubai

### Budget Awareness
- **Budget-conscious**: Lazy Sunday (Tom&Serg), First Time Dubai (mix)
- **Mid-range**: Tonight Plans, Surprise Me
- **Flexible**: Birthday Party (~4k AED)

### Day/Time Context
- **Thursday night**: Tonight Plans (referenced as good night out)
- **Sunday**: Lazy Sunday (what's open, crowd levels)
- **Friday**: Surprise Me (referenced in planning)
- **Weekday**: First Time Dubai (weekday beach club tip)

---

## What These Scenarios Prove

### 1. Vibi Adapts to Context
Same bot, completely different conversation styles based on:
- User's stated mood
- Urgency of request
- Complexity of needs
- Trust level

### 2. Information Gathering ≠ Interrogation
Every scenario collects necessary information through natural conversation:
- Never feels like a form
- Questions flow logically
- User rarely notices they're providing data

### 3. Personality Consistency
Despite different styles, Vibi maintains:
- Enthusiastic, helpful tone
- Casual language
- Honest opinions
- Practical value-add

### 4. Practical Intelligence
Vibi considers:
- Location logistics
- Timing and crowds
- Booking requirements
- Budget implications
- Social dynamics

---

## How to Use These Scenarios

### For Product Development:
- Reference conversation patterns when building dialogue flows
- Use as training examples for AI model
- Extract common decision trees

### For Stakeholder Demos:
- Show range of use cases
- Demonstrate personality consistency
- Prove conversational approach works

### For Design Reviews:
- Compare new scenarios against these patterns
- Ensure new flows maintain quality standards
- Check tone consistency

---

## Additional Scenario Ideas

Potential future scenarios to demonstrate edge cases:
- **Emergency/Problem Solving**: "The restaurant lost my reservation"
- **Group Disagreement**: "My friends can't decide where to go"
- **Extreme Budget**: "What can I do with 50 AED?"
- **Dietary Restrictions**: "I'm vegan, where can I eat?"
- **First Date**: "Planning a first date with someone I just met"
- **Family with Kids**: "Things to do with children in Dubai"
- **Business Dinner**: "I need to impress a client"
- **Visiting Friend**: "My friend is visiting, what should we do?"

Each would demonstrate different aspects of Vibi's conversational intelligence.

---

## Current Coverage

With 9 scenarios, we've covered:
- ✅ Various budget tiers (free to 20k+ AED)
- ✅ Different social contexts (solo, couples, groups)
- ✅ Multiple moods (energetic, lazy, nervous, confident)
- ✅ Planning horizons (same day to weeks ahead)
- ✅ Dubai-specific knowledge (ladies' nights, tourist spots, luxury scene)
- ✅ Emotional states (bored, excited, anxious)
- ✅ Conversation control levels (user-led to Vibi-led)
