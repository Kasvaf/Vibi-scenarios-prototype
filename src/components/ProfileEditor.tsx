import { useState } from 'react';
import { X, Save, User, MapPin, Sparkles } from 'lucide-react';
import { UserProfile, VibeMapping } from '../types';
import { saveProfile } from '../utils/profileStorage';

// Vibe mapping (same as in OnboardingFlow)
const vibeMapping: VibeMapping = {
  "😊 Chill & budget-friendly": { tone: "supportive", budget: "low" },
  "✨ Trendy & mid-range": { tone: "enthusiastic", budget: "mid" },
  "🥂 Luxury & top-tier": { tone: "sophisticated", budget: "high" },
  "🎯 Mix it up / Depends on mood": { tone: "adaptive", budget: "flexible" }
};

interface ProfileEditorProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

export function ProfileEditor({ profile, onClose, onSave }: ProfileEditorProps) {
  const [name, setName] = useState(profile.name);
  const [area, setArea] = useState(profile.area);
  const [vibePreference, setVibePreference] = useState(profile.vibePreference);
  const [showCustomArea, setShowCustomArea] = useState(false);
  const [customArea, setCustomArea] = useState('');

  const areaOptions = [
    "Marina / JBR",
    "DIFC / Downtown",
    "Business Bay / Deira",
    "I'm all over Dubai",
    "Other area"
  ];

  const vibeOptions = Object.keys(vibeMapping);

  const handleAreaChange = (value: string) => {
    if (value === 'Other area') {
      setShowCustomArea(true);
      setCustomArea(area);
    } else {
      setShowCustomArea(false);
      setArea(value);
    }
  };

  const handleSave = () => {
    const finalArea = showCustomArea ? customArea : area;
    const mapping = vibeMapping[vibePreference];

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!finalArea.trim()) {
      alert('Please select or enter your area');
      return;
    }

    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim(),
      area: finalArea.trim(),
      vibePreference,
      tone: mapping.tone,
      budgetLevel: mapping.budget,
      lastActive: new Date().toISOString()
    };

    saveProfile(updatedProfile);
    onSave(updatedProfile);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={18} className="text-blue-500" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Area */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={18} className="text-blue-500" />
              Area
            </label>
            {!showCustomArea ? (
              <select
                value={area}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {areaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  placeholder="Enter your area"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={() => {
                    setShowCustomArea(false);
                    setArea(areaOptions[0]);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  ← Back to predefined areas
                </button>
              </div>
            )}
          </div>

          {/* Vibe Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Sparkles size={18} className="text-blue-500" />
              Vibe
            </label>
            <div className="space-y-2">
              {vibeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setVibePreference(option)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                    vibePreference === option
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
