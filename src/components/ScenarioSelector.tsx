import { useState } from 'react';
import { Network } from 'lucide-react';
import { Scenario } from '../types';
import { ScenarioTreeViewer } from './ScenarioTreeViewer';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenarioId: string | null;
  onSelectScenario: (scenarioId: string) => void;
}

export function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps) {
  const [showTreeViewer, setShowTreeViewer] = useState(false);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select a Scenario:
      </label>
      <select
        value={selectedScenarioId || ''}
        onChange={(e) => onSelectScenario(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
      >
        <option value="">Choose a scenario...</option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.title} - {scenario.description}
          </option>
        ))}
      </select>
      {selectedScenarioId && selectedScenario && (
        <>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold text-blue-900 mb-1">
              {selectedScenario.persona.name} - {selectedScenario.persona.situation}
            </p>
            <p className="text-blue-700">
              Mood: {selectedScenario.persona.mood}
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowTreeViewer(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Network size={16} />
              View Tree
            </button>
          </div>
        </>
      )}

      {/* Tree Viewer Modal */}
      {showTreeViewer && selectedScenario && (
        <ScenarioTreeViewer
          scenario={selectedScenario}
          onClose={() => setShowTreeViewer(false)}
        />
      )}
    </div>
  );
}
