import { User, UserBackground } from '../types/index';

export interface PersonalizationRecommendations {
  suggestedChapters: string[];
  recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced';
  codeExamplesLanguage: ('python' | 'cpp')[];
  focusAreas: string[];
  skipTopics: string[];
  estimatedCompletionTime: number; // in hours
}

/**
 * Generate personalized recommendations based on user background
 */
export function generatePersonalizedRecommendations(
  user: User | null
): PersonalizationRecommendations {
  if (!user || !user.background) {
    return getDefaultRecommendations();
  }

  const background = user.background;
  const recommendations: PersonalizationRecommendations = {
    suggestedChapters: [],
    recommendedDifficulty: calculateDifficulty(background),
    codeExamplesLanguage: [background.preferredLanguage === 'cpp' ? 'cpp' : 'python'],
    focusAreas: [],
    skipTopics: [],
    estimatedCompletionTime: 0
  };

  // Suggest chapters based on learning goals
  if (background.learningGoals.includes('Bipedal Walking')) {
    recommendations.suggestedChapters.push('chapter-2');
  }
  if (background.learningGoals.includes('Control Theory')) {
    recommendations.suggestedChapters.push('lesson-2-3');
  }
  if (background.learningGoals.includes('ROS2 Mastery')) {
    recommendations.suggestedChapters.push('lesson-2-1');
  }
  if (background.learningGoals.includes('Hardware Integration')) {
    recommendations.suggestedChapters.push('lesson-2-4');
  }
  if (background.learningGoals.includes('Simulation')) {
    recommendations.suggestedChapters.push('lesson-2-2');
  }

  if (recommendations.suggestedChapters.length === 0) {
    recommendations.suggestedChapters = ['chapter-1', 'lesson-2-1', 'lesson-2-2'];
  }

  // Determine focus areas based on background
  recommendations.focusAreas = determineFocusAreas(background);

  // Determine topics to skip based on experience
  recommendations.skipTopics = determineSkipTopics(background);

  // Calculate estimated completion time
  recommendations.estimatedCompletionTime = estimateCompletionTime(
    background,
    recommendations
  );

  // Support both languages if requested
  if (background.preferredLanguage === 'both') {
    recommendations.codeExamplesLanguage = ['python', 'cpp'];
  }

  return recommendations;
}

function calculateDifficulty(background: UserBackground): 'beginner' | 'intermediate' | 'advanced' {
  const experiences = [
    background.pythonExperience,
    background.cppExperience,
    background.rosExperience,
    background.roboticsExperience
  ];

  const advancedCount = experiences.filter(e => e === 'advanced').length;
  const intermediateCount = experiences.filter(e => e === 'intermediate').length;

  if (advancedCount >= 2) {
    return 'advanced';
  } else if (advancedCount === 1 || intermediateCount >= 2) {
    return 'intermediate';
  }
  return 'beginner';
}

function determineFocusAreas(background: UserBackground): string[] {
  const focusAreas: string[] = [];

  // Software focus areas
  if (background.pythonExperience === 'none' || background.pythonExperience === 'beginner') {
    focusAreas.push('Python fundamentals');
  }
  if (background.rosExperience === 'none' || background.rosExperience === 'beginner') {
    focusAreas.push('ROS 2 essentials');
  }
  if (background.roboticsExperience === 'none' || background.roboticsExperience === 'beginner') {
    focusAreas.push('Robotics basics');
  }

  // Hardware focus areas
  if (background.hardwareProjects === 0) {
    focusAreas.push('Hardware integration guide');
    focusAreas.push('Sensor interfacing');
  }

  // Learning goal-based areas
  if (background.learningGoals.includes('Control Theory')) {
    focusAreas.push('Control systems theory');
  }
  if (background.learningGoals.includes('Path Planning')) {
    focusAreas.push('Path planning algorithms');
  }
  if (background.learningGoals.includes('Computer Vision')) {
    focusAreas.push('Vision processing');
  }

  return focusAreas.length > 0
    ? focusAreas
    : ['Foundational concepts', 'Practical applications'];
}

function determineSkipTopics(background: UserBackground): string[] {
  const skipTopics: string[] = [];

  // Skip basics if user is advanced
  if (background.pythonExperience === 'advanced') {
    skipTopics.push('Python language basics');
  }
  if (background.rosExperience === 'advanced') {
    skipTopics.push('ROS 2 introduction');
  }
  if (background.roboticsExperience === 'advanced') {
    skipTopics.push('Robotics fundamentals');
  }

  // Skip topics not in learning goals
  if (!background.learningGoals.includes('Hardware Integration')) {
    skipTopics.push('Advanced hardware setup');
  }
  if (!background.learningGoals.includes('Path Planning')) {
    skipTopics.push('Path planning deep dive');
  }

  return skipTopics;
}

function estimateCompletionTime(
  background: UserBackground,
  recommendations: PersonalizationRecommendations
): number {
  let baseTime = 40; // base completion time in hours

  // Adjust based on learning pace
  if (background.learningPace === 'fast') {
    baseTime *= 0.6;
  } else if (background.learningPace === 'slow') {
    baseTime *= 1.4;
  }

  // Adjust based on experience level
  if (recommendations.recommendedDifficulty === 'advanced') {
    baseTime *= 0.7;
  } else if (recommendations.recommendedDifficulty === 'beginner') {
    baseTime *= 1.3;
  }

  // Adjust based on number of suggested chapters
  baseTime *= (recommendations.suggestedChapters.length / 4);

  return Math.round(baseTime);
}

function getDefaultRecommendations(): PersonalizationRecommendations {
  return {
    suggestedChapters: ['chapter-1', 'lesson-2-1', 'lesson-2-2', 'lesson-2-3', 'lesson-2-4'],
    recommendedDifficulty: 'beginner',
    codeExamplesLanguage: ['python'],
    focusAreas: ['Foundational concepts', 'Practical applications'],
    skipTopics: [],
    estimatedCompletionTime: 40
  };
}

/**
 * Get language-specific code examples
 */
export function getLanguagePreference(user: User | null): 'python' | 'cpp' | 'both' {
  if (!user?.background) {
    return 'python';
  }
  return user.background.preferredLanguage;
}

/**
 * Check if user should see specific content based on background
 */
export function shouldShowContent(
  contentType: string,
  user: User | null
): boolean {
  if (!user?.background) {
    return true; // Show all content if no user profile
  }

  const background = user.background;

  // Beginner-specific content
  if (contentType.includes('beginner') && background.pythonExperience === 'advanced') {
    return false;
  }

  // Advanced content
  if (contentType.includes('advanced') && background.pythonExperience === 'none') {
    return true; // Show but may be challenging
  }

  // Hardware-specific content
  if (contentType.includes('hardware') && background.hardwareProjects === 0) {
    return true; // Show guide content
  }

  return true;
}

/**
 * Get personalized reading time estimate
 */
export function getPersonalizedReadingTime(
  baseMinutes: number,
  user: User | null
): number {
  if (!user?.background) {
    return baseMinutes;
  }

  if (user.background.learningPace === 'fast') {
    return Math.round(baseMinutes * 0.7);
  } else if (user.background.learningPace === 'slow') {
    return Math.round(baseMinutes * 1.4);
  }

  return baseMinutes;
}
