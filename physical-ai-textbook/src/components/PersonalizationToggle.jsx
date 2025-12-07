import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './PersonalizationToggle.module.css';

const PersonalizationToggle = ({ chapterId }) => {
  const { user, updateUserPreferences, isAuthenticated } = useAuth();
  const [level, setLevel] = useState('beginner');

  useEffect(() => {
    if (user?.preferences?.expertise) {
      setLevel(user.preferences.expertise);
      document.documentElement.setAttribute('data-expertise', user.preferences.expertise);
    } else {
      // Load from localStorage if not authenticated
      const storedLevel = localStorage.getItem('physical-ai-expertise-level');
      if (storedLevel) {
        setLevel(storedLevel);
        document.documentElement.setAttribute('data-expertise', storedLevel);
      }
    }
  }, [user]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);

    if (isAuthenticated) {
      updateUserPreferences({ expertise: newLevel });
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('physical-ai-expertise-level', newLevel);
    }

    // Apply content filtering based on level
    document.documentElement.setAttribute('data-expertise', newLevel);
  };

  return (
    <div className={styles.personalizationToggle}>
      <span className={styles.label}>Content Level: </span>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${level === 'beginner' ? styles.active : ''}`}
          onClick={() => handleLevelChange('beginner')}
          aria-pressed={level === 'beginner'}
        >
          Beginner
        </button>
        <button
          className={`${styles.button} ${level === 'intermediate' ? styles.active : ''}`}
          onClick={() => handleLevelChange('intermediate')}
          aria-pressed={level === 'intermediate'}
        >
          Intermediate
        </button>
        <button
          className={`${styles.button} ${level === 'expert' ? styles.active : ''}`}
          onClick={() => handleLevelChange('expert')}
          aria-pressed={level === 'expert'}
        >
          Expert
        </button>
      </div>
    </div>
  );
};

export default PersonalizationToggle;
