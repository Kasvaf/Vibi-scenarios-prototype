import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ChatContainer } from './components/ChatContainer';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { scenarios } from './data/scenarios';
import { Message, ConversationStep, UserProfile } from './types';
import { loadProfile, updateProfile } from './utils/profileStorage';

function App() {
  // User profile and onboarding state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Scenario state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // Check for existing profile on mount
  useEffect(() => {
    const profile = loadProfile();
    if (profile) {
      setUserProfile(profile);
      // Update last active timestamp
      updateProfile({ lastActive: new Date().toISOString() });
    } else {
      // No profile, show onboarding
      setShowOnboarding(true);
    }
  }, []);

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

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  // Show onboarding flow for first-time users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Main app for users with profiles
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        scenarioTitle={selectedScenario?.title || ''}
        onReset={handleReset}
        showReasoning={showReasoning}
        onToggleReasoning={handleToggleReasoning}
        userName={userProfile?.name}
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
