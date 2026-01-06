import { X, TrendingUp, Heart, Compass, Sun, MapPin, Sparkles, DollarSign, Music } from 'lucide-react';
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
  // Categorize scenarios
  const categories: Category[] = [
    {
      id: 'nightlife',
      name: 'Nightlife & Social',
      icon: <TrendingUp size={24} />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: 'Spontaneous nights out, parties, and social gatherings',
      scenarioIds: ['tonight-plans', 'girls-night', 'lazy-sunday', 'luxury-clubs'],
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
      scenarioIds: ['im-bored', 'surprise-me', 'first-time-dubai'],
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Scenario Categories Overview</h2>
            <p className="text-sm text-indigo-100 mt-1">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 text-white rounded-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{totalScenarios}</div>
                  <div className="text-sm text-blue-700">Total Scenarios</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 text-white rounded-lg">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-900">{totalCategories}</div>
                  <div className="text-sm text-purple-700">Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 text-white rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-900">~{averagePerCategory}</div>
                  <div className="text-sm text-green-700">Avg per Category</div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryScenarios = getCategoryScenarios(category.scenarioIds);
              return (
                <div
                  key={category.id}
                  className={`border-2 ${category.borderColor} ${category.bgColor} rounded-xl p-5 hover:shadow-lg transition-shadow`}
                >
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-white rounded-lg ${category.color} shadow-sm`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${category.color} mb-1`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="mt-2 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-300">
                        <span className={`w-2 h-2 rounded-full ${category.bgColor} border ${category.borderColor}`}></span>
                        {categoryScenarios.length} scenario{categoryScenarios.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Scenarios in this category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              {scenario.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {scenario.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-mono">
                                {scenario.pattern}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pattern Analysis */}
          <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles size={20} className="text-gray-600" />
              Conversation Patterns
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from(new Set(scenarios.map((s) => s.pattern))).map((pattern) => {
                const count = scenarios.filter((s) => s.pattern === pattern).length;
                return (
                  <div
                    key={pattern}
                    className="bg-white border border-gray-300 rounded-lg p-3 text-center"
                  >
                    <div className="text-lg font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">{pattern}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-xs text-gray-600 text-center">
            Press ESC or click outside to close
          </div>
        </div>
      </div>
    </div>
  );
}
