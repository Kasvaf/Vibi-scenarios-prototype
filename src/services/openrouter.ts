import { UserProfile } from '../types';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = 'anthropic/claude-3.5-sonnet';

function buildSystemPrompt(userProfile: UserProfile): string {
  return `You are Vibi, a Dubai experience companion chatbot.

USER PROFILE:
- Name: ${userProfile.name}
- Area: ${userProfile.area}
- Tone: ${userProfile.tone} (supportive=casual, enthusiastic=energetic, sophisticated=polished, adaptive=balanced)
- Budget: ${userProfile.budgetLevel}

YOUR ROLE:
- Help users discover Dubai experiences (dining, nightlife, activities)
- Match their tone preference
- Consider their budget level
- Give venue recommendations for their area

CONVERSATION STYLE:
- Keep responses SHORT (2-3 sentences)
- Ask ONE question at a time
- Be opinionated - give strong recommendations
- Use their name naturally: ${userProfile.name}

Now help ${userProfile.name} discover their next Dubai experience!`;
}

export async function sendAIMessage(
  userMessage: string,
  conversationHistory: Array<{role: string; content: string}>,
  userProfile: UserProfile
): Promise<string> {
  const systemPrompt = buildSystemPrompt(userProfile);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 200  // Keep responses short
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
