import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  generatePersonalizedRecommendations,
  getLanguagePreference,
  shouldShowContent,
  getPersonalizedReadingTime,
  PersonalizationRecommendations
} from '../utils/contentPersonalization';

export interface UsePersonalizationReturn {
  recommendations: PersonalizationRecommendations;
  languagePreference: 'python' | 'cpp' | 'both';
  shouldShow: (contentType: string) => boolean;
  getReadingTime: (baseMinutes: number) => number;
  isPersonalized: boolean;
}

/**
 * Hook for accessing personalized content recommendations
 */
export function usePersonalization(): UsePersonalizationReturn {
  const { user } = useAuth();

  const recommendations = useMemo(
    () => generatePersonalizedRecommendations(user),
    [user]
  );

  const languagePreference = useMemo(
    () => getLanguagePreference(user),
    [user]
  );

  const shouldShow = useMemo(
    () => (contentType: string) => shouldShowContent(contentType, user),
    [user]
  );

  const getReadingTime = useMemo(
    () => (baseMinutes: number) => getPersonalizedReadingTime(baseMinutes, user),
    [user]
  );

  return {
    recommendations,
    languagePreference,
    shouldShow,
    getReadingTime,
    isPersonalized: !!user
  };
}
