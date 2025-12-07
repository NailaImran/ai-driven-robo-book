import React from 'react';
import styles from './GainSliders.module.css';

interface GainSlidersProps {
  Kp: number;
  Ki: number;
  Kd: number;
  onKpChange: (value: number) => void;
  onKiChange: (value: number) => void;
  onKdChange: (value: number) => void;
}

export const GainSliders: React.FC<GainSlidersProps> = ({
  Kp,
  Ki,
  Kd,
  onKpChange,
  onKiChange,
  onKdChange,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.gainControl}>
        <label htmlFor="kp-slider">
          <strong>Proportional (Kp)</strong>
          <span className={styles.value}>{Kp.toFixed(2)}</span>
        </label>
        <input
          id="kp-slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={Kp}
          onChange={(e) => onKpChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.inputGroup}>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={Kp}
            onChange={(e) => onKpChange(parseFloat(e.target.value))}
            className={styles.numberInput}
          />
        </div>
        <small className={styles.description}>
          Controls responsiveness. Higher = faster but more oscillation.
        </small>
      </div>

      <div className={styles.gainControl}>
        <label htmlFor="ki-slider">
          <strong>Integral (Ki)</strong>
          <span className={styles.value}>{Ki.toFixed(2)}</span>
        </label>
        <input
          id="ki-slider"
          type="range"
          min="0"
          max="10"
          step="0.01"
          value={Ki}
          onChange={(e) => onKiChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.inputGroup}>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={Ki}
            onChange={(e) => onKiChange(parseFloat(e.target.value))}
            className={styles.numberInput}
          />
        </div>
        <small className={styles.description}>
          Eliminates steady-state error. Higher = slower oscillations.
        </small>
      </div>

      <div className={styles.gainControl}>
        <label htmlFor="kd-slider">
          <strong>Derivative (Kd)</strong>
          <span className={styles.value}>{Kd.toFixed(2)}</span>
        </label>
        <input
          id="kd-slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={Kd}
          onChange={(e) => onKdChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.inputGroup}>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={Kd}
            onChange={(e) => onKdChange(parseFloat(e.target.value))}
            className={styles.numberInput}
          />
        </div>
        <small className={styles.description}>
          Dampens overshoot. Higher = smoother but more damped.
        </small>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <h4>Current Configuration</h4>
        <code className={styles.code}>
          u(t) = {Kp.toFixed(2)}·e(t) + {Ki.toFixed(2)}·∫e(t)dt + {Kd.toFixed(2)}·de/dt
        </code>
      </div>
    </div>
  );
};
