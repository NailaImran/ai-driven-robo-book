import React, { useState } from 'react';
import { usePersonalization } from '../hooks/usePersonalization';
import styles from './PersonalizationButton.module.css';
import type { Persona, SkillLevel, LearningPace } from '../context/PersonalizationContext';

export function PersonalizationButton() {
  const [showModal, setShowModal] = useState(false);
  const {
    persona,
    skillLevel,
    learningPace,
    updatePersona,
    updateSkillLevel,
    updateLearningPace,
    isAuthenticated,
    syncToBackend,
  } = usePersonalization();

  const [tempPersona, setTempPersona] = useState<Persona>(persona);
  const [tempSkillLevel, setTempSkillLevel] = useState<SkillLevel>(skillLevel);
  const [tempLearningPace, setTempLearningPace] = useState<LearningPace>(learningPace);

  const handleSave = async () => {
    updatePersona(tempPersona);
    updateSkillLevel(tempSkillLevel);
    updateLearningPace(tempLearningPace);

    if (isAuthenticated) {
      await syncToBackend();
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setTempPersona(persona);
    setTempSkillLevel(skillLevel);
    setTempLearningPace(learningPace);
    setShowModal(false);
  };

  return (
    <>
      <button
        className={styles.personalizeButton}
        onClick={() => setShowModal(true)}
        title="Personalize your learning experience"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Personalize
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Personalize Your Learning</h2>

            <div className={styles.formGroup}>
              <label>I am a:</label>
              <select
                value={tempPersona || ''}
                onChange={(e) => setTempPersona(e.target.value as Persona || null)}
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="educator">Educator</option>
                <option value="self_learner">Self Learner</option>
                <option value="industry_professional">Industry Professional</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Skill Level:</label>
              <select
                value={tempSkillLevel || ''}
                onChange={(e) => setTempSkillLevel(e.target.value as SkillLevel || null)}
              >
                <option value="">Select your skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Learning Pace:</label>
              <select
                value={tempLearningPace || 'standard'}
                onChange={(e) => setTempLearningPace(e.target.value as LearningPace)}
              >
                <option value="accelerated">Accelerated (8 weeks)</option>
                <option value="standard">Standard (13 weeks)</option>
                <option value="extended">Extended (20 weeks)</option>
              </select>
            </div>

            {!isAuthenticated && (
              <div className={styles.infoBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Sign in to save your preferences across devices
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveButton}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
