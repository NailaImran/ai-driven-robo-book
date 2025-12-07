import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserBackground, AuthState } from '../types/index';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, background?: UserBackground) => Promise<User>;
  logout: () => void;
  updateUserProfile: (background: Partial<UserBackground>) => Promise<void>;
  updateUserPreferences: (preferences: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'physical-ai-auth';
const USERS_STORAGE_KEY = 'physical-ai-users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            background: foundUser.background,
            preferences: foundUser.preferences || { expertise: 'beginner' },
            createdAt: foundUser.createdAt
          };

          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData }));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    background?: UserBackground
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

        if (users.some((u: any) => u.email === email)) {
          reject(new Error('Email already registered'));
          return;
        }

        // Calculate expertise level based on background
        let expertiseLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
        if (background) {
          const experiences = [
            background.pythonExperience,
            background.cppExperience,
            background.rosExperience,
            background.roboticsExperience
          ];
          const advancedCount = experiences.filter(e => e === 'advanced').length;
          const intermediateCount = experiences.filter(e => e === 'intermediate').length;

          if (advancedCount >= 2) {
            expertiseLevel = 'advanced';
          } else if (advancedCount === 1 || intermediateCount >= 2) {
            expertiseLevel = 'intermediate';
          }
        }

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password, // In production, this would be hashed
          background: background || getDefaultBackground(),
          preferences: {
            expertise: expertiseLevel,
            customizedContent: true
          },
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const userData: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          background: newUser.background,
          preferences: newUser.preferences,
          createdAt: newUser.createdAt
        };

        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData }));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUserProfile = async (background: Partial<UserBackground>): Promise<void> => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      background: {
        ...user.background,
        ...background
      } as UserBackground
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser }));

    // Update in users list
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].background = updatedUser.background;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  const updateUserPreferences = (preferences: any) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser }));

    // Also update in users list
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].preferences = updatedUser.preferences;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUserProfile,
    updateUserPreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get default background
function getDefaultBackground(): UserBackground {
  return {
    pythonExperience: 'none',
    cppExperience: 'none',
    rosExperience: 'none',
    softwareProjects: 0,
    roboticsExperience: 'none',
    hardwareProjects: 0,
    familiarHardware: [],
    learningGoals: [],
    currentRole: 'student',
    preferredLanguage: 'python',
    learningPace: 'moderate'
  };
}
