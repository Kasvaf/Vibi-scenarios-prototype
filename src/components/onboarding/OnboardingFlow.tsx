import { useState } from 'react';
import { OnboardingStep } from './OnboardingStep';
import { UserProfile, VibeMapping } from '../../types';
import { saveProfile } from '../../utils/profileStorage';

// Vibe mapping for tone and budget inference
const vibeMapping: VibeMapping = {
  "😊 Chill & budget-friendly": { tone: "supportive", budget: "low" },
  "✨ Trendy & mid-range": { tone: "enthusiastic", budget: "mid" },
  "🥂 Luxury & top-tier": { tone: "sophisticated", budget: "high" },
  "🎯 Mix it up / Depends on mood": { tone: "adaptive", budget: "flexible" }
};

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [customArea, setCustomArea] = useState('');
  const [showCustomAreaInput, setShowCustomAreaInput] = useState(false);

  // Step 1: Name collection
  const handleNameSubmit = (value: string) => {
    setName(value);
    setStep(2);
  };

  // Step 2: Area selection
  const handleAreaSelect = (value: string) => {
    if (value === 'Other area') {
      setShowCustomAreaInput(true);
    } else {
      setArea(value);
      setStep(3);
    }
  };

  // Handle custom area submission
  const handleCustomAreaSubmit = (value: string) => {
    setArea(value);
    setCustomArea(value);
    setStep(3);
  };

  // Step 3: Vibe + Budget selection
  const handleVibeSelect = (vibePreference: string) => {
    // Get tone and budget from vibe mapping
    const mapping = vibeMapping[vibePreference];

    if (!mapping) {
      console.error('Invalid vibe preference:', vibePreference);
      return;
    }

    // Create complete profile
    const profile: UserProfile = {
      name,
      area,
      vibePreference,
      tone: mapping.tone,
      budgetLevel: mapping.budget,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      completedOnboarding: true
    };

    // Save to localStorage
    saveProfile(profile);

    // Notify parent
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-4xl font-bold mb-4">
            V
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Vibi</h1>
          <p className="text-gray-600 mt-2">Your Dubai expert friend</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 w-16 rounded-full transition-colors ${
                stepNum <= step ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <OnboardingStep
            message="Hey! I'm Vibi, your Dubai expert friend. Before we dive in, what should I call you?"
            inputType="text"
            placeholder="Your name..."
            showSkip={true}
            onComplete={handleNameSubmit}
          />
        )}

        {/* Step 2: Area */}
        {step === 2 && !showCustomAreaInput && (
          <OnboardingStep
            message={`Nice to meet you, ${name}! Where are you usually hanging out in Dubai? Just so I can suggest spots close to you.`}
            inputType="options"
            options={[
              "Marina / JBR",
              "DIFC / Downtown",
              "Business Bay / Deira",
              "Other area",
              "I'm all over Dubai"
            ]}
            onComplete={handleAreaSelect}
          />
        )}

        {/* Step 2b: Custom area input */}
        {step === 2 && showCustomAreaInput && (
          <OnboardingStep
            message="Cool! Which area specifically?"
            inputType="text"
            placeholder="Your area in Dubai..."
            onComplete={handleCustomAreaSubmit}
          />
        )}

        {/* Step 3: Vibe + Budget */}
        {step === 3 && (
          <OnboardingStep
            message={`Last thing - what's usually your vibe when you go out? Helps me match your energy!`}
            inputType="options"
            options={[
              "😊 Chill & budget-friendly",
              "✨ Trendy & mid-range",
              "🥂 Luxury & top-tier",
              "🎯 Mix it up / Depends on mood"
            ]}
            onComplete={handleVibeSelect}
          />
        )}
      </div>
    </div>
  );
}
