import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/index';

export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced';

interface PersonalizationContextType {
  expertiseLevel: ExpertiseLevel;
  showDetailedExplanations: boolean;
  showAdvancedContent: boolean;
  showSetupInstructions: boolean;
  showResearchPapers: boolean;
  setExpertiseLevel: (level: ExpertiseLevel) => void;
  toggleDetailedExplanations: () => void;
  toggleAdvancedContent: () => void;
  getContentLevel: (contentType: string) => 'show' | 'hide' | 'advanced';
  shouldShowSection: (difficulty: 'beginner' | 'intermediate' | 'advanced') => boolean;
}

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

export const PersonalizationProvider: React.FC<{ children: ReactNode; user: User | null }> = ({
  children,
  user
}) => {
  // Determine initial expertise level from user background
  const getInitialExpertiseLevel = (): ExpertiseLevel => {
    if (!user?.preferences?.expertise) return 'beginner';
    return user.preferences.expertise as ExpertiseLevel;
  };

  const [expertiseLevel, setExpertiseLevel] = useState<ExpertiseLevel>(
    getInitialExpertiseLevel()
  );

  // Derived states based on expertise level
  const showDetailedExplanations = expertiseLevel === 'beginner';
  const showAdvancedContent = expertiseLevel === 'advanced';
  const showSetupInstructions = expertiseLevel !== 'advanced';
  const showResearchPapers = expertiseLevel === 'advanced';

  const toggleDetailedExplanations = () => {
    setExpertiseLevel(expertiseLevel === 'beginner' ? 'intermediate' : 'beginner');
  };

  const toggleAdvancedContent = () => {
    setExpertiseLevel(expertiseLevel === 'advanced' ? 'intermediate' : 'advanced');
  };

  /**
   * Determines whether to show content based on type and expertise level
   * @param contentType - Type of content (e.g., 'explanation', 'setup', 'theory', 'example')
   * @returns 'show' | 'hide' | 'advanced'
   */
  const getContentLevel = (contentType: string): 'show' | 'hide' | 'advanced' => {
    switch (contentType) {
      // Beginner-only content
      case 'setup':
      case 'prerequisite':
      case 'basic-explanation':
        return expertiseLevel === 'beginner' ? 'show' : expertiseLevel === 'intermediate' ? 'hide' : 'hide';

      // Intermediate and above
      case 'explanation':
      case 'example':
        return expertiseLevel !== 'beginner' ? 'show' : 'show';

      // Advanced only
      case 'research':
      case 'advanced-theory':
      case 'advanced-variation':
        return expertiseLevel === 'advanced' ? 'show' : 'advanced';

      // Always show
      case 'learning-objective':
      case 'key-concept':
      case 'summary':
      default:
        return 'show';
    }
  };

  /**
   * Determines if a section should be shown based on difficulty
   */
  const shouldShowSection = (difficulty: 'beginner' | 'intermediate' | 'advanced'): boolean => {
    if (expertiseLevel === 'beginner') {
      return difficulty === 'beginner' || difficulty === 'intermediate';
    } else if (expertiseLevel === 'intermediate') {
      return true; // Show all sections at intermediate level
    } else {
      // Advanced: show all but skip basic setup
      return difficulty !== 'beginner';
    }
  };

  const value: PersonalizationContextType = {
    expertiseLevel,
    showDetailedExplanations,
    showAdvancedContent,
    showSetupInstructions,
    showResearchPapers,
    setExpertiseLevel,
    toggleDetailedExplanations,
    toggleAdvancedContent,
    getContentLevel,
    shouldShowSection
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

/**
 * Helper component for conditional rendering based on personalization level
 */
interface PersonalizedContentProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  children: ReactNode;
  fallback?: ReactNode;
}

export const PersonalizedContent: React.FC<PersonalizedContentProps> = ({
  level,
  children,
  fallback = null
}) => {
  const { expertiseLevel } = usePersonalization();

  if (level === 'all') return <>{children}</>;

  const shouldShow =
    (level === 'beginner' && expertiseLevel === 'beginner') ||
    (level === 'intermediate' && (expertiseLevel === 'beginner' || expertiseLevel === 'intermediate')) ||
    (level === 'advanced' && expertiseLevel === 'advanced');

  return shouldShow ? <>{children}</> : <>{fallback}</>;
};
