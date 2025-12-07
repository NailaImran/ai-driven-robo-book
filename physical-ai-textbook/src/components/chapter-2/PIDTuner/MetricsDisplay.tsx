import React from 'react';
import styles from './MetricsDisplay.module.css';

interface Metrics {
  steadyStateError: number;
  overshoot: number;
  settlingTime: number | null;
  finalValue: number;
}

interface MetricsDisplayProps {
  metrics: Metrics;
}

/**
 * Display key performance metrics
 * Provides visual feedback on controller performance
 */
export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  // Color coding based on performance
  const getErrorQuality = (error: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (error < 0.01) return 'excellent';
    if (error < 0.05) return 'good';
    if (error < 0.1) return 'fair';
    return 'poor';
  };

  const getOvershootQuality = (overshoot: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (overshoot < 5) return 'excellent';
    if (overshoot < 15) return 'good';
    if (overshoot < 30) return 'fair';
    return 'poor';
  };

  const getSettlingQuality = (time: number | null): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (!time) return 'poor';
    if (time < 1) return 'excellent';
    if (time < 2) return 'good';
    if (time < 3) return 'fair';
    return 'poor';
  };

  const errorQuality = getErrorQuality(metrics.steadyStateError);
  const overshootQuality = getOvershootQuality(metrics.overshoot);
  const settlingQuality = getSettlingQuality(metrics.settlingTime);

  return (
    <div className={styles.container}>
      <h3>Performance Metrics</h3>

      <div className={styles.metricsGrid}>
        {/* Steady-State Error */}
        <div className={styles.metric}>
          <div className={`${styles.card} ${styles[errorQuality]}`}>
            <h4>Steady-State Error</h4>
            <div className={styles.value}>
              {metrics.steadyStateError.toFixed(4)}
            </div>
            <div className={styles.quality}>{errorQuality}</div>
            <p className={styles.description}>
              Final deviation from setpoint. Lower is better.
            </p>
          </div>
        </div>

        {/* Overshoot */}
        <div className={styles.metric}>
          <div className={`${styles.card} ${styles[overshootQuality]}`}>
            <h4>Overshoot</h4>
            <div className={styles.value}>
              {metrics.overshoot.toFixed(1)}%
            </div>
            <div className={styles.quality}>{overshootQuality}</div>
            <p className={styles.description}>
              How much response exceeds target. Target: 5-10%
            </p>
          </div>
        </div>

        {/* Settling Time */}
        <div className={styles.metric}>
          <div className={`${styles.card} ${styles[settlingQuality]}`}>
            <h4>Settling Time</h4>
            <div className={styles.value}>
              {metrics.settlingTime ? `${metrics.settlingTime.toFixed(2)}s` : 'N/A'}
            </div>
            <div className={styles.quality}>{settlingQuality}</div>
            <p className={styles.description}>
              Time to reach and stay within 2% of setpoint.
            </p>
          </div>
        </div>

        {/* Final Value */}
        <div className={styles.metric}>
          <div className={styles.card}>
            <h4>Final Value</h4>
            <div className={styles.value}>
              {metrics.finalValue.toFixed(3)}
            </div>
            <p className={styles.description}>
              System output after 10 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.recommendations}>
        <h4>Tuning Recommendations</h4>
        <ul>
          {metrics.overshoot > 20 && (
            <li>⚠️ High overshoot detected. Try decreasing Kp or increasing Kd.</li>
          )}
          {metrics.overshoot < 2 && (
            <li>💡 Very smooth response. Consider increasing Kp for faster settling.</li>
          )}
          {metrics.steadyStateError > 0.1 && (
            <li>⚠️ Significant steady-state error. Increase Ki to improve accuracy.</li>
          )}
          {metrics.settlingTime && metrics.settlingTime > 5 && (
            <li>🐢 Slow settling time. Try increasing Kp for faster response.</li>
          )}
          {!metrics.settlingTime && (
            <li>⚠️ System has not settled. Check PID gains for stability.</li>
          )}
          {metrics.settlingTime && metrics.settlingTime < 1 && metrics.overshoot < 10 && (
            <li>✓ Good balanced tuning! Fast settling with acceptable overshoot.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
