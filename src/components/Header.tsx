import { Bot, Settings, RotateCcw } from 'lucide-react';

interface HeaderProps {
  scenarioTitle: string;
  onReset: () => void;
  showReasoning: boolean;
  onToggleReasoning: () => void;
  userName?: string;
  onEditProfile?: () => void;
  onRestartOnboarding?: () => void;
  aiMode?: boolean;
  onToggleAI?: () => void;
}

export function Header({ scenarioTitle, onReset, showReasoning, onToggleReasoning, userName, onEditProfile, onRestartOnboarding, aiMode, onToggleAI }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">
              {userName ? `Hey ${userName}! 👋` : 'Vibi Simulator'}
            </h1>
            {scenarioTitle && (
              <p className="text-sm text-blue-100">Scenario: {scenarioTitle}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {userName && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-colors flex items-center gap-2"
              title="Edit Profile"
            >
              <Settings size={16} />
              Edit Profile
            </button>
          )}
          {userName && onRestartOnboarding && (
            <button
              onClick={onRestartOnboarding}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-colors flex items-center gap-2"
              title="Restart Onboarding"
            >
              <RotateCcw size={16} />
              Restart Onboarding
            </button>
          )}
          {onToggleAI && (
            <button
              onClick={onToggleAI}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                aiMode
                  ? 'bg-green-500 text-white'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
              }`}
            >
              {aiMode ? '🤖 AI Mode' : 'Try AI Chat'}
            </button>
          )}
          <button
            onClick={onToggleReasoning}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-colors"
          >
            {showReasoning ? 'Hide' : 'Show'} Reasoning
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
