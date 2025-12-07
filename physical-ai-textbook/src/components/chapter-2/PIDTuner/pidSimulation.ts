/**
 * PID Simulation Engine
 *
 * Simulates a system response to PID control with step input.
 * Supports both first-order and second-order systems.
 */

interface SimulationParams {
  Kp: number;
  Ki: number;
  Kd: number;
  setpoint: number;
  systemType: 'first-order' | 'second-order';
  duration: number;
}

interface SimulationState {
  position: number;
  velocity: number;
  integralError: number;
  previousError: number;
}

interface StepResponse {
  time: number;
  position: number;
  setpoint: number;
  error: number;
}

/**
 * Simulate PID control response
 *
 * Uses numerical integration (Euler method) to simulate the system.
 * First-order: dx/dt = -x + u (RC filter)
 * Second-order: d²x/dt² = u - 2ζω₀(dx/dt) - ω₀²x (mass-spring-damper)
 */
export function simulatePIDResponse(params: SimulationParams): StepResponse[] {
  const { Kp, Ki, Kd, setpoint, systemType, duration } = params;

  const dt = 0.01; // 10ms timestep
  const steps = Math.floor(duration / dt);
  const results: StepResponse[] = [];

  // System parameters
  const tau = 1.0; // Time constant for first-order system
  const omega0 = 2.0; // Natural frequency for second-order
  const zeta = 0.7; // Damping ratio for second-order

  // Initial state
  let state: SimulationState = {
    position: 0,
    velocity: 0,
    integralError: 0,
    previousError: setpoint
  };

  for (let i = 0; i < steps; i++) {
    const time = i * dt;

    // Calculate error
    const error = setpoint - state.position;

    // PID output
    const pTerm = Kp * error;
    state.integralError += error * dt;
    state.integralError = Math.max(-5, Math.min(5, state.integralError)); // Anti-windup
    const iTerm = Ki * state.integralError;
    const dTerm = Kd * (error - state.previousError) / dt;
    const u = pTerm + iTerm + dTerm;

    // Update system state (numerical integration)
    if (systemType === 'first-order') {
      // dx/dt = -x + u/tau
      const acceleration = (-state.position + u) / tau;
      state.position += state.velocity * dt;
      state.velocity = acceleration; // For first order, velocity ~= acceleration
    } else {
      // Second-order system: d²x/dt² = u - 2ζω₀(dx/dt) - ω₀²x
      const acceleration = u - 2 * zeta * omega0 * state.velocity - omega0 * omega0 * state.position;
      state.position += state.velocity * dt;
      state.velocity += acceleration * dt;
    }

    // Clamp position to reasonable range
    state.position = Math.max(-2, Math.min(5, state.position));

    // Store result
    results.push({
      time: parseFloat(time.toFixed(2)),
      position: parseFloat(state.position.toFixed(4)),
      setpoint: setpoint,
      error: parseFloat(error.toFixed(4))
    });

    state.previousError = error;
  }

  return results;
}

/**
 * Calculate key performance metrics from response
 */
export function calculateMetrics(data: StepResponse[], setpoint: number) {
  if (data.length === 0) return null;

  const lastValue = data[data.length - 1];
  const peakValue = Math.max(...data.map(d => d.position));
  const settlingIndex = data.findIndex(
    d => Math.abs(d.error) < 0.02 * setpoint
  );

  return {
    steadyStateError: Math.abs(lastValue.error),
    overshoot: Math.max(0, ((peakValue - setpoint) / setpoint) * 100),
    settlingTime: settlingIndex > 0 ? data[settlingIndex].time : null,
    finalValue: lastValue.position,
    peakValue: peakValue
  };
}

/**
 * Suggest gain adjustments based on system behavior
 */
export function suggestTuning(metrics: ReturnType<typeof calculateMetrics>) {
  if (!metrics) return [];

  const suggestions: string[] = [];

  if (metrics.overshoot > 20) {
    suggestions.push('High overshoot: Try decreasing Kp or increasing Kd');
  } else if (metrics.overshoot < 2) {
    suggestions.push('Very low overshoot: Consider increasing Kp for faster response');
  }

  if (metrics.steadyStateError > 0.05) {
    suggestions.push('Large steady-state error: Increase Ki');
  }

  if (metrics.settlingTime && metrics.settlingTime > 5) {
    suggestions.push('Slow settling: Consider increasing Kp');
  } else if (metrics.settlingTime && metrics.settlingTime < 0.5) {
    suggestions.push('Very fast settling: Possible oscillation, check for instability');
  }

  return suggestions;
}
