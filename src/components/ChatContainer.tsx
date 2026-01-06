import { useEffect, useRef } from 'react';
import { Message, UserProfile } from '../types';
import { MessageBubble } from './MessageBubble';
import { UserOptions } from './UserOptions';

interface ChatContainerProps {
  messages: Message[];
  userOptions: string[];
  onSelectOption: (option: string) => void;
  showReasoning: boolean;
  isWaitingForResponse: boolean;
  userProfile?: UserProfile | null;
  aiMode?: boolean;
  onSendMessage?: (message: string) => void;
}

export function ChatContainer({
  messages,
  userOptions,
  onSelectOption,
  showReasoning,
  isWaitingForResponse,
  userProfile,
  aiMode,
  onSendMessage,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-lg">Select a scenario to start chatting with Vibi</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                showReasoning={showReasoning}
                userProfile={userProfile}
              />
            ))}
            {!isWaitingForResponse && userOptions.length > 0 && (
              <UserOptions
                options={userOptions}
                onSelectOption={onSelectOption}
              />
            )}
            {isWaitingForResponse && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {aiMode && (
        <div className="p-4 bg-white border-t border-gray-200">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                onSendMessage?.(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            disabled={isWaitingForResponse}
          />
        </div>
      )}
    </div>
  );
}
