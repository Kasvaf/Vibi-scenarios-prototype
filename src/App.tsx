import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ChatContainer } from './components/ChatContainer';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ProfileEditor } from './components/ProfileEditor';
import { scenarios } from './data/scenarios';
import { Message, ConversationStep, UserProfile } from './types';
import { loadProfile, updateProfile, clearProfile } from './utils/profileStorage';
import { sendAIMessage } from './services/openrouter';

function App() {
  // User profile and onboarding state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Scenario state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // AI mode state
  const [aiMode, setAIMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string; content: string}>>([]);
  const [isAIResponding, setIsAIResponding] = useState(false);

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

  const handleEditProfile = () => {
    setShowProfileEditor(true);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setShowProfileEditor(false);
  };

  const handleRestartOnboarding = () => {
    // Clear profile from localStorage
    clearProfile();
    // Reset app state
    setUserProfile(null);
    setShowOnboarding(true);
    // Reset scenario state
    setSelectedScenarioId(null);
    setMessages([]);
    setCurrentStepId(null);
    setUserOptions([]);
    setIsWaitingForResponse(false);
  };

  const handleAIMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAIResponding(true);

    try {
      // Call OpenRouter
      const aiResponse = await sendAIMessage(
        userMessage,
        conversationHistory,
        userProfile!
      );

      // Add AI response
      setMessages(prev => [...prev, {
        id: `vibi-${Date.now()}`,
        sender: 'vibi',
        content: aiResponse
      }]);

      // Update history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'vibi',
        content: 'Sorry, I had trouble responding. Try again?'
      }]);
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleToggleAI = () => {
    setAIMode(!aiMode);
    // Clear messages when switching modes
    setMessages([]);
    setConversationHistory([]);
    setSelectedScenarioId(null);
    setCurrentStepId(null);
    setUserOptions([]);

    if (!aiMode) {
      // Entering AI mode - show welcome message
      setMessages([{
        id: 'ai-welcome',
        sender: 'vibi',
        content: `Hey ${userProfile?.name}! I'm now in AI mode. Ask me anything about Dubai experiences!`
      }]);
    }
  };

  // Show onboarding flow for first-time users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Main app for users with profiles
  return (
    <>
      <div className="h-screen flex flex-col bg-gray-100">
        <Header
          scenarioTitle={selectedScenario?.title || ''}
          onReset={handleReset}
          showReasoning={showReasoning}
          onToggleReasoning={handleToggleReasoning}
          userName={userProfile?.name}
          onEditProfile={handleEditProfile}
          onRestartOnboarding={handleRestartOnboarding}
          aiMode={aiMode}
          onToggleAI={handleToggleAI}
        />
        {!aiMode && (
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={handleSelectScenario}
          />
        )}
        <ChatContainer
          messages={messages}
          userOptions={userOptions}
          onSelectOption={handleSelectOption}
          showReasoning={showReasoning}
          isWaitingForResponse={aiMode ? isAIResponding : isWaitingForResponse}
          userProfile={userProfile}
          aiMode={aiMode}
          onSendMessage={aiMode ? handleAIMessage : undefined}
        />
      </div>

      {/* Profile Editor Modal */}
      {showProfileEditor && userProfile && (
        <ProfileEditor
          profile={userProfile}
          onClose={() => setShowProfileEditor(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </>
  );
}

export default App;
