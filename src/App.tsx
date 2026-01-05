import { useState } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ChatContainer } from './components/ChatContainer';
import { scenarios } from './data/scenarios';
import { Message, ConversationStep } from './types';

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Reset and start the scenario
    setMessages([]);
    setCurrentStepId(null);
    setUserOptions([]);
    setIsWaitingForResponse(false);

    // Show initial user message after a brief delay
    setTimeout(() => {
      const initialMessage: Message = {
        id: 'initial-user',
        sender: 'user',
        content: scenario.initialMessage,
      };
      setMessages([initialMessage]);
      setIsWaitingForResponse(true);

      // Find and show the first step
      setTimeout(() => {
        const firstStep = scenario.conversationFlow[0];
        if (firstStep) {
          const vibiMessage: Message = {
            id: firstStep.id + '-vibi',
            sender: 'vibi',
            content: firstStep.vibiResponse,
            reasoning: firstStep.vibiReasoning,
          };
          setMessages((prev) => [...prev, vibiMessage]);
          setCurrentStepId(firstStep.id);
          setUserOptions(firstStep.userOptions || []);
          setIsWaitingForResponse(false);
        }
      }, 1000);
    }, 300);
  };

  const handleSelectOption = (option: string) => {
    if (!selectedScenario || !currentStepId) return;

    // Add user's message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: option,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserOptions([]);
    setIsWaitingForResponse(true);

    // Find current step
    const currentStep = selectedScenario.conversationFlow.find(
      (step) => step.id === currentStepId
    );

    if (!currentStep) return;

    // Determine next step
    const nextStepId = currentStep.nextStepMap?.[option];

    setTimeout(() => {
      if (nextStepId) {
        const nextStep = selectedScenario.conversationFlow.find(
          (step) => step.id === nextStepId
        );

        if (nextStep) {
          const vibiMessage: Message = {
            id: nextStep.id + '-vibi',
            sender: 'vibi',
            content: nextStep.vibiResponse,
            reasoning: nextStep.vibiReasoning,
          };
          setMessages((prev) => [...prev, vibiMessage]);
          setCurrentStepId(nextStep.id);
          setUserOptions(nextStep.userOptions || []);
          setIsWaitingForResponse(false);
        } else {
          // End of conversation
          setIsWaitingForResponse(false);
        }
      } else {
        // No next step means conversation ended
        setIsWaitingForResponse(false);
      }
    }, 1000);
  };

  const handleReset = () => {
    if (selectedScenarioId) {
      handleSelectScenario(selectedScenarioId);
    } else {
      setMessages([]);
      setCurrentStepId(null);
      setUserOptions([]);
      setIsWaitingForResponse(false);
    }
  };

  const handleToggleReasoning = () => {
    setShowReasoning(!showReasoning);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        scenarioTitle={selectedScenario?.title || ''}
        onReset={handleReset}
        showReasoning={showReasoning}
        onToggleReasoning={handleToggleReasoning}
      />
      <ScenarioSelector
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
      />
      <ChatContainer
        messages={messages}
        userOptions={userOptions}
        onSelectOption={handleSelectOption}
        showReasoning={showReasoning}
        isWaitingForResponse={isWaitingForResponse}
      />
    </div>
  );
}

export default App;
