import { TextInput } from './TextInput';
import { UserOptions } from '../UserOptions';

interface OnboardingStepProps {
  message: string;
  inputType: 'text' | 'options';
  options?: string[];
  placeholder?: string;
  showSkip?: boolean;
  onComplete: (value: string) => void;
}

export function OnboardingStep({
  message,
  inputType,
  options = [],
  placeholder,
  showSkip = false,
  onComplete
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Vibi's message */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            V
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">Vibi</div>
            <div className="text-gray-700 whitespace-pre-line">{message}</div>
          </div>
        </div>
      </div>

      {/* Input section */}
      <div className="px-2">
        {inputType === 'text' && (
          <TextInput
            onSubmit={onComplete}
            placeholder={placeholder}
            showSkip={showSkip}
            onSkip={showSkip ? () => onComplete('friend') : undefined}
          />
        )}

        {inputType === 'options' && options.length > 0 && (
          <UserOptions
            options={options}
            onSelectOption={onComplete}
          />
        )}
      </div>
    </div>
  );
}
