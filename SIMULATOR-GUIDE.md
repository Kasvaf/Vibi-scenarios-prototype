# Vibi Simulator Guide

## 🚀 Quick Start

### Running the Simulator

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Open in browser
# Visit: http://localhost:5000
```

---

## 📱 How to Use

### 1. **Select a Scenario**
- Use the dropdown at the top to choose from available scenarios
- You'll see the persona details (name, situation, mood)

### 2. **Start the Conversation**
- The scenario will automatically start with the user's initial message
- Vibi will respond after a brief delay (simulating typing)

### 3. **Choose Your Responses**
- Click one of the blue response buttons to continue the conversation
- Each choice leads to a different conversation path
- The conversation adapts based on your selections

### 4. **View Bot Reasoning** (Optional)
- Click "Show Reasoning" in the header to see Vibi's thought process
- Yellow boxes will appear below Vibi's messages explaining the strategy
- Great for understanding conversation design principles

### 5. **Reset & Try Again**
- Click "Reset" to restart the current scenario
- Try different response paths to see alternative flows

---

## 🎯 Features

### Interactive Elements
- ✅ **Click-through responses** - No typing needed, just click
- ✅ **Branching conversations** - Different paths based on choices
- ✅ **Typing indicator** - Realistic "Vibi is typing..." animation
- ✅ **Auto-scroll** - Automatically scrolls to latest message
- ✅ **Bot reasoning toggle** - See the strategy behind each response

### Visual Design
- 💬 WhatsApp-style message bubbles
- 🔵 User messages (blue, right-aligned)
- ⚪ Vibi messages (gray, left-aligned)
- 🎨 Gradient header with Vibi branding
- 📱 Responsive design

---

## 📚 Available Scenarios

### 1. Tonight Plans
**Pattern**: Fast-paced, decisive
**User**: Sarah, 28, spontaneous evening plans
**Demonstrates**: Progressive narrowing, strategic location planning

### 2. I'm Bored
**Pattern**: Supportive, progressive narrowing
**User**: Yousef, 24, low energy, needs inspiration
**Demonstrates**: Emotional intelligence, decision support, solo normalization

### 3. Girls Night Out - Offers
**Pattern**: Strategic, deal-focused
**User**: Noor, 27, Tuesday ladies' night
**Demonstrates**: Dubai expertise, deal optimization, transparency

---

## 🔧 Technical Details

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Project Structure
```
src/
├── App.tsx                    # Main app & conversation logic
├── components/
│   ├── ChatContainer.tsx      # Message display & scrolling
│   ├── MessageBubble.tsx      # Individual message bubbles
│   ├── UserOptions.tsx        # Clickable response buttons
│   ├── ScenarioSelector.tsx   # Scenario dropdown
│   └── Header.tsx             # Top bar with controls
├── data/
│   └── scenarios.ts           # Scenario data & conversation flows
└── types.ts                   # TypeScript interfaces
```

### Data Structure

Each scenario contains:
- **Persona**: User context (name, age, situation, mood, time)
- **Conversation Flow**: Array of conversation steps
- **Branching Logic**: Maps user choices to next steps
- **Bot Reasoning**: Explanation for each response

---

## 🎨 Customization

### Adding New Scenarios

Edit `src/data/scenarios.ts`:

```typescript
{
  id: 'new-scenario',
  title: 'New Scenario',
  description: 'Brief description',
  persona: {
    name: 'Name',
    age: 25,
    situation: 'Context',
    mood: 'Emotional state',
    time: 'Time of day',
  },
  initialMessage: 'First user message',
  conversationFlow: [
    {
      id: 'step1',
      userMessage: 'User input',
      vibiResponse: 'Vibi response',
      vibiReasoning: 'Why this response',
      userOptions: ['Option 1', 'Option 2'],
      nextStepMap: {
        'Option 1': 'step2',
        'Option 2': 'step3',
      },
    },
    // More steps...
  ],
}
```

### Styling Changes

Edit `src/index.css` or component Tailwind classes.

---

## 💡 Tips for Demos

### For Coworkers
1. **Start with "Tonight Plans"** - Shows core conversation flow
2. **Enable "Show Reasoning"** - Demonstrates strategic thinking
3. **Try different paths** - Show branching conversations
4. **Compare scenarios** - Highlight tone adaptation

### For Stakeholders
1. Focus on user experience (hide reasoning)
2. Show 2-3 complete scenarios
3. Emphasize natural conversation flow
4. Point out personality consistency

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5000 already in use
Edit `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change to different port
}
```

### Scenario not loading
- Check browser console for errors
- Verify scenario data structure in `scenarios.ts`
- Ensure all `nextStepMap` references exist

---

## 📝 Future Enhancements

Potential additions:
- [ ] Add remaining 6 scenarios from `/scenarios` folder
- [ ] Free-text input mode (not just click-through)
- [ ] Conversation history export
- [ ] Mobile-responsive improvements
- [ ] Dark mode toggle
- [ ] Comparison mode (Vibi vs typical chatbot)
- [ ] Animation improvements
- [ ] Sound effects

---

## 📄 Related Files

- `AI-TRAINING-GUIDE.md` - Complete training documentation
- `docs/conversation-design-guide.md` - Personality & tone rules
- `scenarios/` - Original markdown scenario files
- `README.md` - Project overview

---

**Built for**: Testing Vibi's conversational approach
**Status**: ✅ Functional prototype
**Last Updated**: January 5, 2026
