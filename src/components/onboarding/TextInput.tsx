import { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function TextInput({ onSubmit, placeholder = 'Type here...', showSkip = false, onSkip }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>

      {showSkip && onSkip && (
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip this step
        </button>
      )}
    </div>
  );
}
