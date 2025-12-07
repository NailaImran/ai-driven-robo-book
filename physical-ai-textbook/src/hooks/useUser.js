import { useState, useEffect } from 'react';

const STORAGE_KEY = 'physical-ai-user-preferences';

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user preferences from localStorage on mount
    const storedPreferences = localStorage.getItem(STORAGE_KEY);
    if (storedPreferences) {
      try {
        const preferences = JSON.parse(storedPreferences);
        setUser({ preferences });
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
        // Initialize with defaults
        setUser({ preferences: { expertise: 'beginner' } });
      }
    } else {
      // Initialize with default preferences
      setUser({ preferences: { expertise: 'beginner' } });
    }
  }, []);

  const updatePreferences = (newPreferences) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        preferences: {
          ...prevUser?.preferences,
          ...newPreferences,
        },
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser.preferences));
      } catch (error) {
        console.error('Failed to save user preferences:', error);
      }

      return updatedUser;
    });
  };

  return {
    user,
    updatePreferences,
  };
};
