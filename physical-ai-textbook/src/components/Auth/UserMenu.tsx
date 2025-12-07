import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePersonalization } from '../../hooks/usePersonalization';
import styles from './UserMenu.module.css';

export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { recommendations } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className={styles.authButtons}>
        <a href="/auth/signin" className={styles.signInButton}>
          Sign In
        </a>
        <a href="/auth/signup" className={styles.signUpButton}>
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <span className={styles.userName}>{user?.name}</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>

          {user?.preferences?.expertise && (
            <div className={styles.menuItem}>
              <span className={styles.label}>Level:</span>
              <span className={styles.value}>{user.preferences.expertise}</span>
            </div>
          )}

          {recommendations.recommendedDifficulty && (
            <div className={styles.menuItem}>
              <span className={styles.label}>Recommended Difficulty:</span>
              <span className={styles.value}>{recommendations.recommendedDifficulty}</span>
            </div>
          )}

          <div className={styles.divider} />

          <a href="/profile" className={styles.menuLink}>
            Profile Settings
          </a>
          <a href="/progress" className={styles.menuLink}>
            Learning Progress
          </a>
          <a href="/bookmarks" className={styles.menuLink}>
            Saved Bookmarks
          </a>

          <div className={styles.divider} />

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className={styles.logoutButton}
          >
            Sign Out
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
