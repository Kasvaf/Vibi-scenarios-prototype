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

## Scenario Comparison Matrix

| Scenario | Pace | Control | Complexity | Planning Horizon |
|----------|------|---------|------------|------------------|
| Tonight Plans | Fast | Collaborative | Simple | Immediate (hours) |
| Lazy Sunday | Slow | User-led | Simple | Same day |
| Birthday Party | Medium | Consultative | Complex | 2 weeks ahead |
| First Time Dubai | Medium | Collaborative | Complex | Full week |
| Surprise Me | Fast | Vibi-led | Medium | Immediate (hours) |

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

## Next Steps

Potential additional scenarios:
- **Emergency/Problem Solving**: "The restaurant lost my reservation"
- **Group Disagreement**: "My friends can't decide where to go"
- **Budget Constraints**: "What can I do with 50 AED?"
- **Dietary Restrictions**: "I'm vegan, where can I eat?"
- **Romantic Date**: "Planning a first date, help!"
- **Family with Kids**: "Things to do with children in Dubai"

Each would demonstrate different aspects of Vibi's conversational intelligence.
