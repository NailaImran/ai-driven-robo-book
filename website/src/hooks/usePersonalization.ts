import { useContext } from 'react';
import { PersonalizationContext, PersonalizationContextValue } from '../context/PersonalizationContext';

export function usePersonalization(): PersonalizationContextValue {
  const context = useContext(PersonalizationContext);

  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }

  return context;
}

// Helper hooks for specific properties
export function usePersona() {
  const { persona, updatePersona } = usePersonalization();
  return [persona, updatePersona] as const;
}

export function useSkillLevel() {
  const { skillLevel, updateSkillLevel } = usePersonalization();
  return [skillLevel, updateSkillLevel] as const;
}

export function useLearningPace() {
  const { learningPace, updateLearningPace } = usePersonalization();
  return [learningPace, updateLearningPace] as const;
}

export function useLanguage() {
  const { language, updateLanguage } = usePersonalization();
  return [language, updateLanguage] as const;
}
