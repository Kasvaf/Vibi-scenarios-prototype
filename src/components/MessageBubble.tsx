import { Message, UserProfile } from '../types';
import { personalizeMessage } from '../utils/personalization';

interface MessageBubbleProps {
  message: Message;
  showReasoning: boolean;
  userProfile?: UserProfile | null;
}

export function MessageBubble({ message, showReasoning, userProfile }: MessageBubbleProps) {
  const isVibi = message.sender === 'vibi';

  // Apply personalization to Vibi's messages
  const displayContent = isVibi && userProfile
    ? personalizeMessage(message.content, userProfile)
    : message.content;

  return (
    <div className={`flex ${isVibi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[70%] ${isVibi ? 'mr-auto' : 'ml-auto'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isVibi
              ? 'bg-gray-100 text-gray-900'
              : 'bg-blue-500 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayContent}</p>
        </div>
        {isVibi && showReasoning && message.reasoning && (
          <div className="mt-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-gray-700">
            <p className="font-semibold text-yellow-800 mb-1">Bot Reasoning:</p>
            <p className="italic">{message.reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
