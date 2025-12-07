import React, { useState, useCallback, useMemo } from 'react';
import styles from './PIDTuner.module.css';
import { StepResponseChart } from './StepResponseChart';
import { GainSliders } from './GainSliders';
import { SimulationControls } from './SimulationControls';
import { MetricsDisplay } from './MetricsDisplay';
import { simulatePIDResponse } from './pidSimulation';

/**
 * PID Tuner Component
 *
 * Interactive tool for understanding PID control behavior.
 * Students can adjust P, I, D gains and observe step response in real-time.
 */

interface TunerState {
  Kp: number;
  Ki: number;
  Kd: number;
  setpoint: number;
  targetValue: number;
  systemType: 'first-order' | 'second-order';
}

interface StepResponse {
  time: number;
  position: number;
  setpoint: number;
  error: number;
}

const DEFAULT_STATE: TunerState = {
  Kp: 2.0,
  Ki: 0.1,
  Kd: 0.5,
  setpoint: 1.0,
  targetValue: 1.0,
  systemType: 'second-order'
};

const PRESETS = {
  aggressive: { Kp: 5.0, Ki: 0.3, Kd: 1.0, name: 'Aggressive (Fast)' },
  balanced: { Kp: 2.0, Ki: 0.1, Kd: 0.5, name: 'Balanced' },
  smooth: { Kp: 0.8, Ki: 0.05, Kd: 0.3, name: 'Smooth (Slow)' },
  proportional: { Kp: 1.5, Ki: 0, Kd: 0, name: 'P Only' },
  pidFull: { Kp: 2.0, Ki: 0.15, Kd: 0.8, name: 'PID Optimized' }
};

export const PIDTuner: React.FC = () => {
  const [state, setState] = useState<TunerState>(DEFAULT_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');
  const [responseData, setResponseData] = useState<StepResponse[]>([]);

  // Simulate PID response whenever gains change or simulation runs
  const simulateResponse = useCallback(() => {
    const data = simulatePIDResponse({
      Kp: state.Kp,
      Ki: state.Ki,
      Kd: state.Kd,
      setpoint: state.setpoint,
      systemType: state.systemType,
      duration: 10 // 10 seconds
    });
    setResponseData(data);
  }, [state]);

  // Auto-simulate when gains change
  React.useEffect(() => {
    simulateResponse();
  }, [simulateResponse]);

  // Handle gain updates
  const handleGainChange = (param: 'Kp' | 'Ki' | 'Kd', value: number) => {
    setState(prev => ({
      ...prev,
      [param]: Math.max(0, Math.min(10, value)) // Clamp 0-10
    }));
  };

  // Handle preset selection
  const handlePresetSelect = (presetKey: string) => {
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    if (preset) {
      setState(prev => ({
        ...prev,
        Kp: preset.Kp,
        Ki: preset.Ki,
        Kd: preset.Kd
      }));
      setSelectedPreset(presetKey);
    }
  };

  // Handle system type change
  const handleSystemTypeChange = (type: 'first-order' | 'second-order') => {
    setState(prev => ({
      ...prev,
      systemType: type
    }));
  };

  // Handle setpoint change
  const handleSetpointChange = (value: number) => {
    setState(prev => ({
      ...prev,
      setpoint: Math.max(0, Math.min(5, value))
    }));
  };

  // Calculate metrics from response
  const metrics = useMemo(() => {
    if (responseData.length === 0) return null;

    const lastValue = responseData[responseData.length - 1];
    const peakValue = Math.max(...responseData.map(d => d.position));
    const settlingIndex = responseData.findIndex(
      d => Math.abs(d.error) < 0.02 * state.setpoint
    );
    const settlingTime = settlingIndex > 0 ? responseData[settlingIndex].time : null;
    const overshoot = ((peakValue - state.setpoint) / state.setpoint) * 100;

    return {
      steadyStateError: lastValue.error,
      overshoot: Math.max(0, overshoot),
      settlingTime: settlingTime,
      finalValue: lastValue.position
    };
  }, [responseData, state.setpoint]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>PID Controller Tuner</h2>
        <p>Adjust gains and observe how the system responds to a step input</p>
      </div>

      <div className={styles.mainContent}>
        {/* Left side: Controls */}
        <div className={styles.controlPanel}>
          <section className={styles.section}>
            <h3>System Configuration</h3>
            <div className={styles.systemTypeSelector}>
              <label>
                <input
                  type="radio"
                  name="systemType"
                  value="first-order"
                  checked={state.systemType === 'first-order'}
                  onChange={() => handleSystemTypeChange('first-order')}
                />
                First Order (RC Filter)
              </label>
              <label>
                <input
                  type="radio"
                  name="systemType"
                  value="second-order"
                  checked={state.systemType === 'second-order'}
                  onChange={() => handleSystemTypeChange('second-order')}
                />
                Second Order (Mass-Spring-Damper)
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Gain Values</h3>
            <GainSliders
              Kp={state.Kp}
              Ki={state.Ki}
              Kd={state.Kd}
              onKpChange={(v) => handleGainChange('Kp', v)}
              onKiChange={(v) => handleGainChange('Ki', v)}
              onKdChange={(v) => handleGainChange('Kd', v)}
            />
          </section>

          <section className={styles.section}>
            <h3>Quick Presets</h3>
            <div className={styles.presetGrid}>
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  className={`${styles.presetButton} ${selectedPreset === key ? styles.active : ''}`}
                  onClick={() => handlePresetSelect(key)}
                  title={`${preset.name}: Kp=${preset.Kp} Ki=${preset.Ki} Kd=${preset.Kd}`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Setpoint</h3>
            <SimulationControls
              setpoint={state.setpoint}
              onSetpointChange={handleSetpointChange}
            />
          </section>
        </div>

        {/* Right side: Visualization and Metrics */}
        <div className={styles.visualizationPanel}>
          <div className={styles.chartContainer}>
            <StepResponseChart
              data={responseData}
              setpoint={state.setpoint}
            />
          </div>

          {metrics && (
            <MetricsDisplay metrics={metrics} />
          )}
        </div>
      </div>

      {/* Educational Content Section */}
      <div className={styles.infoSection}>
        <details>
          <summary>How to Use This Tool</summary>
          <div className={styles.infoContent}>
            <h4>Understanding PID Tuning</h4>
            <ul>
              <li><strong>Proportional (Kp)</strong>: Increases responsiveness. Too high causes oscillation.</li>
              <li><strong>Integral (Ki)</strong>: Eliminates steady-state error. Too high causes slow oscillations.</li>
              <li><strong>Derivative (Kd)</strong>: Dampens overshoot. Too high amplifies noise.</li>
            </ul>

            <h4>Performance Metrics</h4>
            <ul>
              <li><strong>Overshoot</strong>: How much the response exceeds the target. Lower is better (target: 5-10%)</li>
              <li><strong>Settling Time</strong>: How long to reach steady state. Fast response vs stability trade-off</li>
              <li><strong>Steady-State Error</strong>: Final deviation from target. Zero is ideal</li>
            </ul>

            <h4>Tuning Strategy</h4>
            <ol>
              <li>Start with Kp only (Ki=0, Kd=0) to reach the target quickly</li>
              <li>Increase Kd to reduce overshoot and oscillation</li>
              <li>Increase Ki to eliminate steady-state error</li>
              <li>Fine-tune all three for the best balance</li>
            </ol>

            <h4>Common Issues</h4>
            <ul>
              <li>If response oscillates wildly: Decrease Kp or Ki, increase Kd</li>
              <li>If response is too slow: Increase Kp (but watch for overshoot)</li>
              <li>If there is steady-state error: Increase Ki</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PIDTuner;
