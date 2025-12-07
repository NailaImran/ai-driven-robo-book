import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthForm.module.css';

interface SigninFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>
          Sign in to your Physical AI Textbook account
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordInput}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className={styles.rememberMe}>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Keep me signed in</label>
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className={styles.helpText}>
          <p>Don't have an account? <a href="/auth/signup">Sign up</a></p>
          <p><a href="/auth/forgot-password">Forgot your password?</a></p>
        </div>
      </form>

      <div className={styles.features}>
        <h3>Why Join?</h3>
        <ul>
          <li>Personalized learning path based on your experience</li>
          <li>Track your progress through chapters</li>
          <li>Access to interactive simulations</li>
          <li>Save bookmarks and notes</li>
          <li>Community forum access</li>
        </ul>
      </div>
    </div>
  );
};
