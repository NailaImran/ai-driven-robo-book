import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePersonalization } from '../../hooks/usePersonalization';
import styles from './PersonalizationBanner.module.css';

export const PersonalizationBanner: React.FC = () => {
  const { user } = useAuth();
  const { recommendations } = usePersonalization();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.greeting}>
          <h3>Welcome back, {user.name}!</h3>
          <p>Your personalized learning path is ready</p>
        </div>

        <div className={styles.recommendations}>
          <div className={styles.stat}>
            <span className={styles.label}>Your Level</span>
            <span className={styles.value}>{recommendations.recommendedDifficulty}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Preferred Language</span>
            <span className={styles.value}>{recommendations.languagePreference}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Est. Completion</span>
            <span className={styles.value}>{recommendations.estimatedCompletionTime}h</span>
          </div>
        </div>

        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Details' : 'View Recommendations'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.details}>
          {recommendations.focusAreas.length > 0 && (
            <div className={styles.section}>
              <h4>Focus Areas for You</h4>
              <ul>
                {recommendations.focusAreas.map((area, idx) => (
                  <li key={idx}>{area}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.suggestedChapters.length > 0 && (
            <div className={styles.section}>
              <h4>Suggested Learning Path</h4>
              <ul>
                {recommendations.suggestedChapters.map((chapter, idx) => (
                  <li key={idx}>
                    <a href={`/docs/${chapter}`}>{chapter.replace(/-/g, ' ').toUpperCase()}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {user.background?.learningGoals && user.background.learningGoals.length > 0 && (
            <div className={styles.section}>
              <h4>Your Learning Goals</h4>
              <div className={styles.goals}>
                {user.background.learningGoals.map((goal, idx) => (
                  <span key={idx} className={styles.goal}>{goal}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
