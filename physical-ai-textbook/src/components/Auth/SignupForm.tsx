import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserBackground } from '../../types/index';
import styles from './AuthForm.module.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type SignupStep = 'account' | 'background' | 'preferences' | 'complete';

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const { signup } = useAuth();
  const [step, setStep] = useState<SignupStep>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account step
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Background step
  const [background, setBackground] = useState<UserBackground>({
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
  });

  const hardwareOptions = ['Arduino', 'Raspberry Pi', 'Jetson Nano', 'Jetson Orin', 'ROS Robot', 'Quadcopter', 'Humanoid'];
  const learningGoalsOptions = ['Bipedal Walking', 'Control Theory', 'Path Planning', 'Hardware Integration', 'Simulation', 'ROS2 Mastery', 'Computer Vision'];

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setStep('background');
  };

  const handleBackgroundChange = (field: keyof UserBackground, value: any) => {
    setBackground(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHardwareToggle = (hardware: string) => {
    setBackground(prev => ({
      ...prev,
      familiarHardware: prev.familiarHardware.includes(hardware)
        ? prev.familiarHardware.filter(h => h !== hardware)
        : [...prev.familiarHardware, hardware]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setBackground(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(name, email, password, background);
      setStep('complete');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
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
      {step === 'account' && (
        <form onSubmit={handleAccountSubmit} className={styles.form}>
          <h2>Create Your Account</h2>
          <p className={styles.subtitle}>
            Join our community of robotics enthusiasts and AI learners
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Continue
          </button>
        </form>
      )}

      {step === 'background' && (
        <form onSubmit={handleSignup} className={styles.form}>
          <h2>Tell Us About Your Background</h2>
          <p className={styles.subtitle}>
            This helps us personalize your learning experience
          </p>

          {error && <div className={styles.error}>{error}</div>}

          {/* Software Experience */}
          <div className={styles.section}>
            <h3>Software Experience</h3>

            <div className={styles.formGroup}>
              <label htmlFor="pythonExperience">Python Experience</label>
              <select
                id="pythonExperience"
                value={background.pythonExperience}
                onChange={e => handleBackgroundChange('pythonExperience', e.target.value as any)}
              >
                <option value="none">No experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cppExperience">C++ Experience</label>
              <select
                id="cppExperience"
                value={background.cppExperience}
                onChange={e => handleBackgroundChange('cppExperience', e.target.value as any)}
              >
                <option value="none">No experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rosExperience">ROS/ROS2 Experience</label>
              <select
                id="rosExperience"
                value={background.rosExperience}
                onChange={e => handleBackgroundChange('rosExperience', e.target.value as any)}
              >
                <option value="none">No experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="softwareProjects">Software Projects Completed</label>
              <input
                id="softwareProjects"
                type="number"
                min="0"
                value={background.softwareProjects}
                onChange={e => handleBackgroundChange('softwareProjects', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Hardware Experience */}
          <div className={styles.section}>
            <h3>Hardware & Robotics Experience</h3>

            <div className={styles.formGroup}>
              <label htmlFor="roboticsExperience">Robotics Experience</label>
              <select
                id="roboticsExperience"
                value={background.roboticsExperience}
                onChange={e => handleBackgroundChange('roboticsExperience', e.target.value as any)}
              >
                <option value="none">No experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hardwareProjects">Hardware Projects Completed</label>
              <input
                id="hardwareProjects"
                type="number"
                min="0"
                value={background.hardwareProjects}
                onChange={e => handleBackgroundChange('hardwareProjects', parseInt(e.target.value))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Familiar Hardware Platforms</label>
              <div className={styles.checkboxGroup}>
                {hardwareOptions.map(hw => (
                  <label key={hw} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={background.familiarHardware.includes(hw)}
                      onChange={() => handleHardwareToggle(hw)}
                    />
                    {hw}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className={styles.section}>
            <h3>Learning Preferences</h3>

            <div className={styles.formGroup}>
              <label htmlFor="currentRole">Current Role</label>
              <select
                id="currentRole"
                value={background.currentRole}
                onChange={e => handleBackgroundChange('currentRole', e.target.value as any)}
              >
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="hobbyist">Hobbyist</option>
                <option value="professional">Professional</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="preferredLanguage">Preferred Language</label>
              <select
                id="preferredLanguage"
                value={background.preferredLanguage}
                onChange={e => handleBackgroundChange('preferredLanguage', e.target.value as any)}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="learningPace">Preferred Learning Pace</label>
              <select
                id="learningPace"
                value={background.learningPace}
                onChange={e => handleBackgroundChange('learningPace', e.target.value as any)}
              >
                <option value="slow">Slow & Detailed</option>
                <option value="moderate">Moderate (Balanced)</option>
                <option value="fast">Fast (Challenge me!)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Learning Goals (Select all that apply)</label>
              <div className={styles.checkboxGroup}>
                {learningGoalsOptions.map(goal => (
                  <label key={goal} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={background.learningGoals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                    />
                    {goal}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setStep('account')}
              className={styles.secondaryButton}
            >
              Back
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Signup'}
            </button>
          </div>
        </form>
      )}

      {step === 'complete' && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2>Welcome to Physical AI Textbook!</h2>
          <p>Your account has been created successfully.</p>
          <p>We've personalized your learning path based on your background.</p>
          <p className={styles.redirectText}>Redirecting...</p>
        </div>
      )}
    </div>
  );
};
