import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Scenario, ConversationStep } from '../types';

interface ScenarioTreeViewerProps {
  scenario: Scenario;
  onClose: () => void;
}

interface TreeNodeProps {
  step: ConversationStep;
  allSteps: ConversationStep[];
  level: number;
  visitedSteps: Set<string>;
}

// Helper function to highlight tone tokens in text
function highlightToneTokens(text: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  const regex = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the token
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the highlighted token
    parts.push(
      <span
        key={`token-${keyCounter++}`}
        className="text-purple-600 font-mono bg-purple-50 px-1 rounded text-sm"
      >
        {`{${match[1]}}`}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key="full-text">{text}</span>];
}

function TreeNode({ step, allSteps, level, visitedSteps }: TreeNodeProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  // Check if this is an end node
  const isEndNode = !step.nextStepMap || Object.keys(step.nextStepMap).length === 0;

  // Prevent infinite loops by tracking visited steps
  const isAlreadyVisited = visitedSteps.has(step.id);
  const newVisitedSteps = new Set(visitedSteps);
  newVisitedSteps.add(step.id);

  // Get child steps
  const childSteps = step.nextStepMap
    ? Object.entries(step.nextStepMap).map(([option, nextStepId]) => {
        const nextStep = allSteps.find((s) => s.id === nextStepId);
        return { option, nextStep };
      })
    : [];

  return (
    <div className={`mb-4 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-gray-300' : ''}`}>
      {/* Node Container */}
      <div className="border-2 border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Header - Step ID */}
        <div
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-t-lg font-mono text-sm font-bold flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Step: {step.id}</span>
          <button className="hover:bg-blue-200 rounded p-1">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-3">
            {/* User Message */}
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">👤 User:</div>
              <div className="text-base">{step.userMessage}</div>
            </div>

            {/* Vibi Response */}
            <div className="bg-green-50 text-green-900 p-3 rounded-lg">
              <div className="text-xs font-semibold text-green-700 mb-1">🤖 Vibi:</div>
              <div className="text-base">{highlightToneTokens(step.vibiResponse)}</div>
            </div>

            {/* Reasoning (Collapsible) */}
            <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900 w-full text-left"
              >
                {showReasoning ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                📝 Reasoning
              </button>
              {showReasoning && (
                <div className="mt-2 text-sm italic text-amber-800">
                  {step.vibiReasoning}
                </div>
              )}
            </div>

            {/* User Options */}
            {step.userOptions && step.userOptions.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                <div className="text-xs font-semibold text-purple-700 mb-2">Options:</div>
                <div className="space-y-1">
                  {step.userOptions.map((option, idx) => {
                    const nextStepId = step.nextStepMap?.[option];
                    return (
                      <div
                        key={idx}
                        className="text-sm font-medium text-purple-700 flex items-start gap-2"
                      >
                        <span className="text-purple-400">→</span>
                        <span className="flex-1">
                          "{option}"
                          {nextStepId && (
                            <span className="text-xs text-purple-500 ml-2">
                              (→ {nextStepId})
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* End Node Badge */}
            {isEndNode && (
              <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center">
                <span className="text-sm font-semibold text-gray-600">
                  🏁 End of conversation
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Child Nodes */}
      {isExpanded && !isAlreadyVisited && childSteps.length > 0 && (
        <div className="mt-4">
          {childSteps.map(({ option, nextStep }, idx) => {
            if (!nextStep) {
              return (
                <div key={idx} className="ml-6 text-sm text-red-500 italic">
                  ⚠️ Missing step reference: {option}
                </div>
              );
            }

            return (
              <div key={idx} className="mb-4">
                <div className="text-xs text-gray-500 mb-2 ml-2">
                  ↳ After choosing: "{option}"
                </div>
                <TreeNode
                  step={nextStep}
                  allSteps={allSteps}
                  level={level + 1}
                  visitedSteps={newVisitedSteps}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Already Visited Warning */}
      {isAlreadyVisited && (
        <div className="ml-6 mt-2 text-xs text-gray-500 italic">
          ↪ This step was already shown above (avoiding infinite loop)
        </div>
      )}
    </div>
  );
}

export function ScenarioTreeViewer({ scenario, onClose }: ScenarioTreeViewerProps) {
  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Sticky */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">{scenario.title}</h2>
            <p className="text-sm text-blue-100 mt-1">{scenario.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Persona Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="text-sm font-semibold text-blue-800 mb-2">👤 Persona</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-blue-700">Name:</span>{' '}
                <span className="text-gray-800">{scenario.persona.name}, {scenario.persona.age}</span>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Time:</span>{' '}
                <span className="text-gray-800">{scenario.persona.time}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-blue-700">Situation:</span>{' '}
                <span className="text-gray-800">{scenario.persona.situation}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-blue-700">Mood:</span>{' '}
                <span className="text-gray-800">{scenario.persona.mood}</span>
              </div>
            </div>
          </div>

          {/* Initial Message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="text-sm font-semibold text-green-800 mb-2">💬 Initial Message</div>
            <div className="text-base text-gray-800 italic">"{scenario.initialMessage}"</div>
          </div>

          {/* Conversation Tree */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-lg font-bold text-gray-800 mb-4">📋 Conversation Flow</div>
            {scenario.conversationFlow.length > 0 ? (
              <TreeNode
                step={scenario.conversationFlow[0]}
                allSteps={scenario.conversationFlow}
                level={0}
                visitedSteps={new Set()}
              />
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                No conversation flow defined
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-xs text-gray-600 text-center">
            Total steps: {scenario.conversationFlow.length} | Click outside or press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
}
