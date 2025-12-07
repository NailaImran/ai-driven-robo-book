/**
 * Unit tests for usePIDSimulation hook
 *
 * Tests:
 * - PID calculation
 * - Simulation execution
 * - Performance metrics
 * - Preset configurations
 *
 * Implementation: T016 (Phase 2: Foundational Components)
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { usePIDSimulation, PID_PRESETS } from '../../src/hooks/usePIDSimulation';

describe('usePIDSimulation', () => {
  const defaultConfig = {
    setpoint: 100,
    initialValue: 0,
    dt: 0.01,
    duration: 5,
  };

  const defaultGains = {
    kp: 1.2,
    ki: 0.5,
    kd: 0.2,
  };

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      expect(result.current.running).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.metrics).toBeNull();
      expect(result.current.progress).toBe(0);
    });

    it('should have simulation control methods', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      expect(typeof result.current.runSimulation).toBe('function');
      expect(typeof result.current.stopSimulation).toBe('function');
      expect(typeof result.current.resetSimulation).toBe('function');
    });
  });

  describe('Simulation Execution', () => {
    it('should run complete simulation', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.running).toBe(false); // synchronous simulation
      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.metrics).not.toBeNull();
      expect(result.current.progress).toBe(100);
    });

    it('should generate correct number of data points', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      const expectedPoints = Math.floor(defaultConfig.duration / defaultConfig.dt) + 1;
      expect(result.current.data.length).toBe(expectedPoints);
    });

    it('should calculate PID output correctly', () => {
      const gains = { kp: 1.0, ki: 0.0, kd: 0.0 }; // P-only controller
      const { result } = renderHook(() =>
        usePIDSimulation(gains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      // First data point
      const firstPoint = result.current.data[0];
      expect(firstPoint.time).toBe(0);
      expect(firstPoint.error).toBeCloseTo(100); // setpoint - initialValue
      expect(firstPoint.output).toBeCloseTo(100); // kp * error
    });

    it('should converge to setpoint', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      // Last data point should be close to setpoint
      const lastPoint = result.current.data[result.current.data.length - 1];
      expect(lastPoint.processValue).toBeCloseTo(defaultConfig.setpoint, 0);
    });

    it('should handle system inertia', () => {
      const config = { ...defaultConfig, systemInertia: 0.5 };
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, config)
      );

      act(() => {
        result.current.runSimulation();
      });

      // Higher inertia should result in slower response
      const midPoint = result.current.data[Math.floor(result.current.data.length / 2)];
      expect(midPoint.processValue).toBeLessThan(defaultConfig.setpoint);
    });
  });

  describe('Performance Metrics', () => {
    it('should calculate overshoot correctly', () => {
      const aggressiveGains = { kp: 5.0, ki: 2.0, kd: 0.5 };
      const { result } = renderHook(() =>
        usePIDSimulation(aggressiveGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.metrics).not.toBeNull();
      expect(result.current.metrics!.overshoot).toBeGreaterThanOrEqual(0);
    });

    it('should calculate settling time', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.metrics).not.toBeNull();
      expect(result.current.metrics!.settlingTime).toBeGreaterThan(0);
      expect(result.current.metrics!.settlingTime).toBeLessThanOrEqual(defaultConfig.duration);
    });

    it('should calculate rise time', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.metrics).not.toBeNull();
      expect(result.current.metrics!.riseTime).toBeGreaterThan(0);
    });

    it('should calculate steady-state error', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.metrics).not.toBeNull();
      expect(result.current.metrics!.steadyStateError).toBeGreaterThanOrEqual(0);
    });

    it('should calculate peak time', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.metrics).not.toBeNull();
      expect(result.current.metrics!.peakTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Control Actions', () => {
    it('should stop simulation', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
        result.current.stopSimulation();
      });

      expect(result.current.running).toBe(false);
    });

    it('should reset simulation', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);

      act(() => {
        result.current.resetSimulation();
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.metrics).toBeNull();
      expect(result.current.progress).toBe(0);
      expect(result.current.running).toBe(false);
    });
  });

  describe('Preset Configurations', () => {
    it('should have all expected presets', () => {
      const expectedPresets = [
        'P-only',
        'PI',
        'PD',
        'PID',
        'Critically Damped',
        'Underdamped',
        'Overdamped',
        'Aggressive',
        'Conservative',
      ];

      expectedPresets.forEach((preset) => {
        expect(PID_PRESETS[preset]).toBeDefined();
        expect(PID_PRESETS[preset]).toHaveProperty('kp');
        expect(PID_PRESETS[preset]).toHaveProperty('ki');
        expect(PID_PRESETS[preset]).toHaveProperty('kd');
      });
    });

    it('should work with P-only preset', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(PID_PRESETS['P-only'], defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.metrics).not.toBeNull();

      // P-only controller should have steady-state error
      expect(result.current.metrics!.steadyStateError).toBeGreaterThan(0);
    });

    it('should work with PID preset', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(PID_PRESETS['PID'], defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.metrics).not.toBeNull();
    });

    it('should work with aggressive preset', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(PID_PRESETS['Aggressive'], defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.metrics).not.toBeNull();

      // Aggressive tuning typically has more overshoot
      expect(result.current.metrics!.overshoot).toBeGreaterThan(0);
    });

    it('should work with conservative preset', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(PID_PRESETS['Conservative'], defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.metrics).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero gains', () => {
      const zeroGains = { kp: 0, ki: 0, kd: 0 };
      const { result } = renderHook(() =>
        usePIDSimulation(zeroGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      // With zero gains, process value should stay at initial value
      const lastPoint = result.current.data[result.current.data.length - 1];
      expect(lastPoint.processValue).toBeCloseTo(defaultConfig.initialValue, 0);
    });

    it('should handle zero setpoint', () => {
      const config = { ...defaultConfig, setpoint: 0, initialValue: 100 };
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, config)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      const lastPoint = result.current.data[result.current.data.length - 1];
      expect(lastPoint.processValue).toBeCloseTo(0, 0);
    });

    it('should handle very small timestep', () => {
      const config = { ...defaultConfig, dt: 0.001, duration: 0.1 };
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, config)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
    });

    it('should handle disturbance', () => {
      const config = { ...defaultConfig, disturbance: 0.1 };
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, config)
      );

      act(() => {
        result.current.runSimulation();
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      // With disturbance, metrics should still be calculated
      expect(result.current.metrics).not.toBeNull();
    });
  });

  describe('Data Structure', () => {
    it('should have correct data point structure', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      const dataPoint = result.current.data[0];
      expect(dataPoint).toHaveProperty('time');
      expect(dataPoint).toHaveProperty('error');
      expect(dataPoint).toHaveProperty('integral');
      expect(dataPoint).toHaveProperty('derivative');
      expect(dataPoint).toHaveProperty('output');
      expect(dataPoint).toHaveProperty('processValue');
    });

    it('should have increasing timestamps', () => {
      const { result } = renderHook(() =>
        usePIDSimulation(defaultGains, defaultConfig)
      );

      act(() => {
        result.current.runSimulation();
      });

      for (let i = 1; i < result.current.data.length; i++) {
        expect(result.current.data[i].time).toBeGreaterThan(
          result.current.data[i - 1].time
        );
      }
    });
  });
});
