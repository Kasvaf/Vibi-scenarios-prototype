import { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { UserOptions } from './UserOptions';

interface ChatContainerProps {
  messages: Message[];
  userOptions: string[];
  onSelectOption: (option: string) => void;
  showReasoning: boolean;
  isWaitingForResponse: boolean;
}

export function ChatContainer({
  messages,
  userOptions,
  onSelectOption,
  showReasoning,
  isWaitingForResponse,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
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
  );
}
