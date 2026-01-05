# Tonight Plans - Conversation Flow

## Decision Tree Map

```
START: "Where should I go tonight?"
│
├─ Step 1: Determine Activity Type
│  ├─ Question: "Dinner and drinks or straight to party mode?"
│  │
│  ├─ Branch A: DINNER FIRST
│  │  │
│  │  ├─ Step 2A: Dining Style
│  │  │  ├─ Q: "Fancy date night or casual hangout?"
│  │  │  │
│  │  │  ├─ Fancy → Ask budget → Suggest upscale (Zuma, Nobu, etc.)
│  │  │  └─ Casual → Continue to location
│  │  │
│  │  ├─ Step 3A: Location
│  │  │  ├─ Q: "Where are you coming from?"
│  │  │  ├─ Provide nearby option
│  │  │  └─ Provide better strategic option with reasoning
│  │  │
│  │  ├─ Step 4A: After-Dinner Plans
│  │  │  ├─ Q: "What about after?"
│  │  │  ├─ Suggest 2-3 nearby options
│  │  │  └─ Different vibes (pub, lounge, club)
│  │  │
│  │  └─ END: Confirm plan + practical tips
│  │
│  └─ Branch B: PARTY MODE
│     │
│     ├─ Step 2B: Party Style
│     │  ├─ Q: "Beach club or indoor club?"
│     │  │
│     │  ├─ Beach Club → Ask day/budget → Suggest (Cove, Zero Gravity, Soho)
│     │  └─ Indoor Club → Ask music preference
│     │
│     ├─ Step 3B: Music/Vibe
│     │  ├─ Q: "EDM, hip-hop, or mixed?"
│     │  ├─ EDM → White, Soho Garden
│     │  ├─ Hip-hop → Billionaire, Gotha
│     │  └─ Mixed → Versatile venues
│     │
│     └─ END: Confirm + entry tips (dress code, cover, etc.)
│
└─ Alternative Responses:
   ├─ "I'm bored" → Ask out/in → Branch accordingly
   ├─ "Something chill" → Suggest lounges/cafes
   └─ "Surprise me" → Ask one qualifier → Give bold suggestion

```

## Conversation States

### State 1: Initial Request
- **Goal**: Understand primary intent
- **Strategy**: Binary choice (dinner vs party) to move quickly
- **Output**: Direction for next question

### State 2: Style Refinement
- **Goal**: Determine formality/budget level
- **Strategy**: Use relatable scenarios ("date night" vs "hangout")
- **Output**: Budget/vibe expectations

### State 3: Location Context
- **Goal**: Practical logistics
- **Strategy**: Ask where they are, offer nearby + better strategic option
- **Output**: Specific venue recommendation

### State 4: Extension Planning
- **Goal**: Complete the experience
- **Strategy**: Suggest logical next step based on primary choice
- **Output**: Secondary venue with reasoning

### State 5: Confirmation
- **Goal**: Summarize and provide value-add
- **Strategy**: Recap plan + practical tips
- **Output**: User feels prepared and excited

---

## Conversation Patterns

### Pattern 1: Quick Narrowing
```
Broad → Medium → Specific → Complete Plan
"Tonight?" → "Dinner/Party?" → "Style?" → "Location?" → "Full Plan"
```

### Pattern 2: Opinionated Suggestion
```
User preference → Multiple options → Recommended choice + reasoning
"Casual dinner" → "Marina or DIFC?" → "DIFC better because X, Y, Z"
```

### Pattern 3: Context Retention
```
Every response references previous exchanges:
- "Since you said casual..."
- "For that vibe..."
- "Based on Marina location..."
```

---

## Branching Logic

### If User is Vague:
```
User: "Something fun"
Vibi: "Love it! Quick q - are you trying to go OUT out or more chill fun?"
```

### If User is Specific:
```
User: "I want sushi in DIFC"
Vibi: "Okay sushi in DIFC! Budget-wise are we talking Zuma level or more casual?"
(Skip location question, jump to refinement)
```

### If User Changes Mind Mid-Conversation:
```
User: "Actually, maybe not dinner..."
Vibi: "No worries! So straight to drinks/party then?"
(Reset to appropriate branch)
```

---

## Response Time Optimization

For voice messages, each Vibi response should be:
- **10-20 seconds** when spoken
- **1-2 questions max** per message
- **2-3 suggestions max** when providing options

This keeps the conversation feeling quick and natural, not overwhelming.

---

## Exit Points

### Successful Completion:
- User has specific venue(s)
- Plan includes timing guidance
- Practical tips provided
- Enthusiastic send-off

### Early Exit (User satisfied):
```
User: "Actually I think I'll just stay in"
Vibi: "Totally fair! Hit me up if you change your mind later!"
```

### Clarification Loop (max 2 iterations):
```
If user doesn't understand after 2 attempts:
Vibi: "Let me try differently - are you hungry right now or just want drinks?"
(Simplify language, try different angle)
```
