import React, { useState } from 'react';
import { usePersonalization } from '../hooks/usePersonalization';
import { AuthModal } from './AuthModal';
import styles from './AuthWidget.module.css';

export function AuthWidget() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, signOut } = usePersonalization();

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <button
          className={styles.signInButton}
          onClick={() => setShowAuthModal(true)}
        >
          Sign In
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className={styles.userMenuContainer}>
        <button
          className={styles.userButton}
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="User menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showUserMenu && (
          <div className={styles.userMenu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                setShowUserMenu(false);
                // TODO: Navigate to profile page
              }}
            >
              My Profile
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                setShowUserMenu(false);
                // TODO: Navigate to personalization settings
              }}
            >
              Personalization
            </button>
            <hr className={styles.menuDivider} />
            <button
              className={`${styles.menuItem} ${styles.signOutItem}`}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
