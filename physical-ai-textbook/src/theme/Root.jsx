import React, { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { PersonalizationProvider } from '../contexts/PersonalizationContext';
import { TranslationProvider } from '../contexts/TranslationContext';

// Initialize demo account
const initializeDemoAccount = () => {
  const users = JSON.parse(localStorage.getItem('physical-ai-users') || '[]');

  // Check if demo account already exists
  if (!users.some(u => u.email === 'demo@student.com')) {
    users.push({
      id: 'demo-123',
      name: 'Demo Student',
      email: 'demo@student.com',
      password: 'demo123',
      background: {
        pythonExperience: 'intermediate',
        cppExperience: 'beginner',
        rosExperience: 'beginner',
        softwareProjects: 3,
        roboticsExperience: 'beginner',
        hardwareProjects: 1,
        familiarHardware: ['Raspberry Pi', 'Arduino'],
        learningGoals: ['Bipedal Walking', 'ROS2 Mastery'],
        currentRole: 'student',
        preferredLanguage: 'python',
        learningPace: 'moderate'
      },
      preferences: { expertise: 'intermediate' },
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('physical-ai-users', JSON.stringify(users));
  }
};

export default function Root({ children }) {
  useEffect(() => {
    // Initialize demo account on mount
    initializeDemoAccount();
  }, []);

  return (
    <AuthProvider>
      <PersonalizationProvider>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </PersonalizationProvider>
    </AuthProvider>
  );
}
