import React from 'react';
import styles from './SimulationControls.module.css';

interface SimulationControlsProps {
  setpoint: number;
  onSetpointChange: (value: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  setpoint,
  onSetpointChange,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.control}>
        <label htmlFor="setpoint-slider">
          <strong>Target Value</strong>
          <span className={styles.value}>{setpoint.toFixed(2)}</span>
        </label>
        <input
          id="setpoint-slider"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={setpoint}
          onChange={(e) => onSetpointChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.inputGroup}>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={setpoint}
            onChange={(e) => onSetpointChange(parseFloat(e.target.value))}
            className={styles.numberInput}
          />
        </div>
        <small className={styles.description}>
          The desired output value. Controller will drive the system to match this.
        </small>
      </div>

      <div className={styles.info}>
        <h4>Simulation Parameters</h4>
        <ul>
          <li>Duration: 10 seconds</li>
          <li>Time step: 10ms</li>
          <li>Update rate: 100Hz</li>
          <li>Anti-windup limit: ±5 units</li>
        </ul>
      </div>
    </div>
  );
};
