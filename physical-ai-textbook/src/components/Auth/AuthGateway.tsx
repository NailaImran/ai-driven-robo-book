import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SignupForm } from './SignupForm';
import { SigninForm } from './SigninForm';
import styles from './AuthGateway.module.css';

type AuthMode = 'signin' | 'signup';

interface AuthGatewayProps {
  onAuthSuccess?: () => void;
  redirectTo?: string;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onAuthSuccess,
  redirectTo = '/'
}) => {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');

  if (isAuthenticated) {
    return (
      <div className={styles.alreadyAuthenticated}>
        <p>You're already signed in!</p>
        <a href={redirectTo}>Return to textbook</a>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      window.location.href = redirectTo;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Physical AI & Humanoid Robotics Textbook</h1>
        <p>Learn robotics with personalized content</p>
      </div>

      <div className={styles.authContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'signin' ? styles.active : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className={styles.content}>
          {mode === 'signin' ? (
            <SigninForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          {mode === 'signin'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            className={styles.toggleButton}
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
