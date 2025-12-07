/**
 * Custom hook for client-side PID controller simulation
 *
 * This hook manages:
 * - Real-time PID calculation (Kp, Ki, Kd)
 * - Step response simulation
 * - Performance metrics (overshoot, settling time, steady-state error)
 * - Preset configurations (P-only, PI, PID, critically damped)
 *
 * Implementation: T012 (Phase 2: Foundational Components)
 *
 * @example
 * ```tsx
 * const { running, data, metrics, runSimulation, stopSimulation } = usePIDSimulation(
 *   { kp: 1.2, ki: 0.5, kd: 0.2 },
 *   { setpoint: 100, initialValue: 0, dt: 0.01, duration: 5 }
 * );
 *
 * useEffect(() => {
 *   runSimulation();
 * }, []);
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface PIDGains {
  kp: number;
  ki: number;
  kd: number;
}

export interface PIDState {
  time: number;
  error: number;
  integral: number;
  derivative: number;
  output: number;
  processValue: number; // actual system output
}

export interface SimulationConfig {
  setpoint: number;
  initialValue: number;
  dt: number; // timestep in seconds
  duration: number; // simulation duration in seconds
  systemInertia?: number; // simulated system's resistance to change (0-1)
  disturbance?: number; // external disturbance magnitude
}

export interface PerformanceMetrics {
  overshoot: number; // percentage
  settlingTime: number; // seconds
  steadyStateError: number; // absolute error
  riseTime: number; // seconds
  peakTime: number; // seconds
}

export const usePIDSimulation = (gains: PIDGains, config: SimulationConfig) => {
  const {
    setpoint,
    initialValue,
    dt,
    duration,
    systemInertia = 0.1,
    disturbance = 0,
  } = config;

  const [running, setRunning] = useState(false);
  const [data, setData] = useState<PIDState[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [progress, setProgress] = useState(0);

  const stateRef = useRef<PIDState>({
    time: 0,
    error: 0,
    integral: 0,
    derivative: 0,
    output: 0,
    processValue: initialValue,
  });
  const previousErrorRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Simple first-order plant model: dPV/dt = (controlOutput - PV) / inertia
  const simulatePlant = useCallback(
    (controlOutput: number, currentPV: number) => {
      const newPV = currentPV + ((controlOutput - currentPV) / systemInertia) * dt;
      return newPV + disturbance * (Math.random() - 0.5) * 2;
    },
    [systemInertia, dt, disturbance]
  );

  // Calculate PID control output
  const calculatePID = useCallback(
    (error: number, integral: number, derivative: number) => {
      const { kp, ki, kd } = gains;
      return kp * error + ki * integral + kd * derivative;
    },
    [gains]
  );

  // Calculate performance metrics
  const calculateMetrics = useCallback(
    (simulationData: PIDState[]): PerformanceMetrics => {
      if (simulationData.length === 0) {
        return {
          overshoot: 0,
          settlingTime: 0,
          steadyStateError: 0,
          riseTime: 0,
          peakTime: 0,
        };
      }

      const settlingBand = 0.02; // 2% band around setpoint
      const riseThresholdLow = 0.1; // 10% of setpoint
      const riseThresholdHigh = 0.9; // 90% of setpoint

      let maxValue = simulationData[0].processValue;
      let peakTime = 0;
      let riseTime = 0;
      let settlingTime = duration;
      let riseStartTime = 0;
      let riseEndTime = 0;

      // Find peak value and peak time
      simulationData.forEach((state) => {
        if (state.processValue > maxValue) {
          maxValue = state.processValue;
          peakTime = state.time;
        }
      });

      // Calculate overshoot
      const overshoot = maxValue > setpoint
        ? ((maxValue - setpoint) / setpoint) * 100
        : 0;

      // Find rise time (10% to 90%)
      const lowThreshold = setpoint * riseThresholdLow;
      const highThreshold = setpoint * riseThresholdHigh;

      for (let i = 0; i < simulationData.length; i++) {
        if (simulationData[i].processValue >= lowThreshold && riseStartTime === 0) {
          riseStartTime = simulationData[i].time;
        }
        if (simulationData[i].processValue >= highThreshold && riseEndTime === 0) {
          riseEndTime = simulationData[i].time;
          break;
        }
      }
      riseTime = riseEndTime - riseStartTime;

      // Find settling time (last time outside 2% band)
      const upperBound = setpoint * (1 + settlingBand);
      const lowerBound = setpoint * (1 - settlingBand);

      for (let i = simulationData.length - 1; i >= 0; i--) {
        const pv = simulationData[i].processValue;
        if (pv < lowerBound || pv > upperBound) {
          settlingTime = simulationData[i].time;
          break;
        }
      }

      // Steady-state error (last 10% of simulation)
      const steadyStateStart = Math.floor(simulationData.length * 0.9);
      const steadyStateValues = simulationData.slice(steadyStateStart);
      const avgSteadyState =
        steadyStateValues.reduce((sum, state) => sum + state.processValue, 0) /
        steadyStateValues.length;
      const steadyStateError = Math.abs(setpoint - avgSteadyState);

      return {
        overshoot,
        settlingTime,
        steadyStateError,
        riseTime,
        peakTime,
      };
    },
    [setpoint, duration]
  );

  // Run complete simulation (synchronous)
  const runSimulation = useCallback(() => {
    console.log('[PIDSimulation] Starting simulation');
    setRunning(true);
    setProgress(0);

    const simulationData: PIDState[] = [];
    let currentState: PIDState = {
      time: 0,
      error: setpoint - initialValue,
      integral: 0,
      derivative: 0,
      output: 0,
      processValue: initialValue,
    };
    let previousError = setpoint - initialValue;

    const steps = Math.floor(duration / dt);

    for (let i = 0; i <= steps; i++) {
      const time = i * dt;
      const error = setpoint - currentState.processValue;
      const integral = currentState.integral + error * dt;
      const derivative = (error - previousError) / dt;

      const controlOutput = calculatePID(error, integral, derivative);
      const newPV = simulatePlant(controlOutput, currentState.processValue);

      currentState = {
        time,
        error,
        integral,
        derivative,
        output: controlOutput,
        processValue: newPV,
      };

      simulationData.push({ ...currentState });
      previousError = error;

      // Update progress periodically
      if (i % Math.floor(steps / 100) === 0 || i === steps) {
        setProgress((i / steps) * 100);
      }
    }

    setData(simulationData);
    const calculatedMetrics = calculateMetrics(simulationData);
    setMetrics(calculatedMetrics);
    stateRef.current = currentState;
    setRunning(false);
    setProgress(100);

    console.log('[PIDSimulation] Completed:', calculatedMetrics);
  }, [
    setpoint,
    initialValue,
    duration,
    dt,
    calculatePID,
    simulatePlant,
    calculateMetrics,
  ]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    console.log('[PIDSimulation] Stopped');
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setRunning(false);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    console.log('[PIDSimulation] Reset');
    stopSimulation();
    setData([]);
    setMetrics(null);
    setProgress(0);
    stateRef.current = {
      time: 0,
      error: 0,
      integral: 0,
      derivative: 0,
      output: 0,
      processValue: initialValue,
    };
    previousErrorRef.current = 0;
  }, [stopSimulation, initialValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    running,
    data,
    metrics,
    progress,
    runSimulation,
    stopSimulation,
    resetSimulation,
  };
};

// Preset PID configurations (tuned for common response types)
export const PID_PRESETS: Record<string, PIDGains> = {
  'P-only': { kp: 1.0, ki: 0, kd: 0 },
  'PI': { kp: 0.8, ki: 0.3, kd: 0 },
  'PD': { kp: 0.8, ki: 0, kd: 0.1 },
  'PID': { kp: 1.2, ki: 0.5, kd: 0.2 },
  'Critically Damped': { kp: 2.0, ki: 1.0, kd: 1.0 },
  'Underdamped': { kp: 3.0, ki: 0.5, kd: 0.5 },
  'Overdamped': { kp: 0.5, ki: 0.1, kd: 0.5 },
  'Aggressive': { kp: 5.0, ki: 2.0, kd: 1.0 },
  'Conservative': { kp: 0.3, ki: 0.05, kd: 0.05 },
};
