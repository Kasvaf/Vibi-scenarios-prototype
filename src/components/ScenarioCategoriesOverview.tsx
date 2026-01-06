import { useState } from 'react';
import { X, TrendingUp, Heart, Compass, Sun, Sparkles, Utensils } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioCategoriesOverviewProps {
  scenarios: Scenario[];
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  scenarioIds: string[];
}

export function ScenarioCategoriesOverview({ scenarios, onClose }: ScenarioCategoriesOverviewProps) {
  // State for collapsible categories and flowchart toggle
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showDetailedFlow, setShowDetailedFlow] = useState(false);

  // Categorize scenarios
  const categories: Category[] = [
    {
      id: 'vibes',
      name: 'Vibes & Moods',
      icon: <Sparkles size={24} />,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      description: 'Mood-based experiences tailored to how you\'re feeling',
      scenarioIds: ['lazy-sunday', 'lazy-beach-day', 'fitness-wellness', 'club-hopping-night', 'im-bored', 'surprise-me'],
    },
    {
      id: 'nightlife',
      name: 'Nightlife & Social',
      icon: <TrendingUp size={24} />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: 'Spontaneous nights out, parties, and social gatherings',
      scenarioIds: ['tonight-plans', 'girls-night', 'luxury-clubs', 'finding-concerts', 'trending-bars'],
    },
    {
      id: 'romance',
      name: 'Dating & Romance',
      icon: <Heart size={24} />,
      color: 'text-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      description: 'Date nights, special occasions, and romantic experiences',
      scenarioIds: ['girlfriend-date', 'budget-date', 'birthday-party'],
    },
    {
      id: 'exploration',
      name: 'Exploration & Discovery',
      icon: <Compass size={24} />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Finding inspiration, discovering new places, and adventures',
      scenarioIds: ['first-time-dubai', 'dubai-explorer', 'budget-dubai-experience'],
    },
    {
      id: 'daytime',
      name: 'Daytime & Lifestyle',
      icon: <Sun size={24} />,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      description: 'Beach days, cafes, work spaces, and daytime activities',
      scenarioIds: ['beach-day', 'work-lounge', 'concerts-music'],
    },
    {
      id: 'dining',
      name: 'Dining & Food',
      icon: <Utensils size={24} />,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      description: 'From budget eats to fine dining, beachfront to trending spots',
      scenarioIds: ['budget-dining', 'luxury-dining', 'beachfront-dining', 'trending-restaurants'],
    },
  ];

  // Calculate stats
  const totalScenarios = scenarios.length;
  const totalCategories = categories.length;
  const averagePerCategory = Math.round(totalScenarios / totalCategories);

  // Get scenarios for each category
  const getCategoryScenarios = (scenarioIds: string[]) => {
    return scenarios.filter((s) => scenarioIds.includes(s.id));
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">Scenario Categories Overview</h2>
            <p className="text-xs text-indigo-100 mt-0.5">
              Explore our {totalScenarios} scenarios across {totalCategories} categories
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - No scrolling */}
        <div className="p-6">
          {/* Compact Stats Bar */}
          <div className="flex items-center justify-center gap-8 py-2 bg-gray-50 border-y border-gray-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{totalScenarios}</span>
              <span className="text-xs text-gray-600">Scenarios</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{totalCategories}</span>
              <span className="text-xs text-gray-600">Categories</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">~{averagePerCategory}</span>
              <span className="text-xs text-gray-600">Avg/Category</span>
            </div>
          </div>

          {/* Onboarding Steps Progress */}
          <div className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide text-center">
              Onboarding Flow
            </h3>
            <div className="flex items-center justify-center gap-1">
              {[
                { step: 1, label: 'Name' },
                { step: 2, label: 'Area' },
                { step: 3, label: 'Vibe' },
                { step: 4, label: 'Mood' }
              ].map((item, idx) => (
                <>
                  <div key={item.step} className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <span className="text-xs text-gray-700 mt-1">{item.label}</span>
                  </div>
                  {idx < 3 && (
                    <div key={`arrow-${idx}`} className="w-8 h-0.5 bg-blue-300 mb-4"></div>
                  )}
                </>
              ))}
            </div>
          </div>

          {/* Collapsible Categories */}
          <div className="space-y-2 mb-3">
            {categories.map((category) => {
              const categoryScenarios = getCategoryScenarios(category.scenarioIds);
              const isExpanded = expandedCategory === category.id;

              return (
                <div
                  key={category.id}
                  className={`border-2 ${category.borderColor} ${category.bgColor} rounded-lg transition-all cursor-pointer`}
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                >
                  {/* Category Header - Always Visible */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-white rounded-lg ${category.color} shadow-sm`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className={`text-base font-bold ${category.color}`}>
                          {category.name}
                        </h3>
                        <div className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700 border border-gray-300 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${category.bgColor}`}></span>
                          {categoryScenarios.length} scenario{categoryScenarios.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    {/* Expand/Collapse Icon */}
                    <div className="text-gray-400 text-lg">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {/* Scenarios - Only show when expanded */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-200">
                      <div className="space-y-2">
                        {categoryScenarios.map((scenario) => (
                          <div
                            key={scenario.id}
                            className="bg-white border border-gray-200 rounded p-2 text-sm"
                          >
                            <div className="font-semibold text-gray-900">{scenario.title}</div>
                            <div className="text-xs text-gray-600 mt-0.5">{scenario.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* System Flowchart */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Sparkles size={16} className="text-gray-600" />
                How It Works
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailedFlow(!showDetailedFlow);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {showDetailedFlow ? 'Show Simple' : 'Show Details'}
              </button>
            </div>

            {!showDetailedFlow ? (
              // Simple Flow (Default)
              <div className="flex items-center justify-center gap-2">
                {[
                  { icon: '👤', label: 'Sign Up' },
                  { icon: '🎭', label: 'Choose Scenario' },
                  { icon: '💬', label: 'Chat Flow' },
                  { icon: '✅', label: 'Get Advice' }
                ].map((step, idx) => (
                  <>
                    <div key={idx} className="flex flex-col items-center gap-1 bg-white rounded-lg p-3 border border-gray-300 min-w-[80px]">
                      <div className="text-2xl">{step.icon}</div>
                      <div className="text-xs font-medium text-gray-700 text-center">{step.label}</div>
                    </div>
                    {idx < 3 && (
                      <div key={`arrow-${idx}`} className="text-gray-400 text-xl">→</div>
                    )}
                  </>
                ))}
              </div>
            ) : (
              // Detailed Flow
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">User Onboarding</div>
                    <div className="text-gray-600">Collect name, area, vibe preference, and mood category</div>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Scenario Selection</div>
                    <div className="text-gray-600">Browse by category or vibe, or use AI mode for custom requests</div>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Conversation Flow</div>
                    <div className="text-gray-600">Preset scenarios: Follow guided steps with options | AI Mode: Free-form chat with Claude</div>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Personalized Advice</div>
                    <div className="text-gray-600">Get Dubai recommendations tailored to your preferences, budget, and location</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-xs text-gray-600 text-center">
            Press ESC or click outside to close
          </div>
        </div>
      </div>
    </div>
  );
}
