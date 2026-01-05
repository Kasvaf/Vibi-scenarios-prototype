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
}
