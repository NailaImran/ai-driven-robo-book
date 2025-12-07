"""
Physical AI - Chapter 1: Physics Simulation Example
====================================================

This script simulates a simple pendulum to demonstrate how Physical AI systems
must understand and predict physical dynamics.

Prerequisites:
- Python 3.10+
- numpy >= 1.24
- matplotlib >= 3.7

Installation:
    pip install numpy matplotlib

Expected Output:
- A plot showing pendulum angle over time
- Demonstration of oscillatory motion with energy dissipation (if damping added)

Learning Objectives:
- Understand how physics engines work (numerical integration)
- See why Physical AI needs to model real-world dynamics
- Practice working with differential equations in robot simulation
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple


def pendulum_dynamics(theta: float, omega: float, g: float = 9.81, L: float = 1.0,
                     b: float = 0.1) -> Tuple[float, float]:
    """
    Calculate the derivatives of pendulum state.

    Physics equation: θ'' = -(g/L)sin(θ) - b*θ'

    Args:
        theta: Current angle (radians)
        omega: Current angular velocity (rad/s)
        g: Gravitational acceleration (m/s^2)
        L: Pendulum length (meters)
        b: Damping coefficient (reduces energy over time)

    Returns:
        (dtheta/dt, domega/dt): Rate of change of angle and angular velocity
    """
    dtheta_dt = omega
    domega_dt = -(g / L) * np.sin(theta) - b * omega
    return dtheta_dt, domega_dt


def simulate_pendulum(theta0: float, omega0: float, duration: float = 10.0,
                     dt: float = 0.01) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Simulate pendulum motion using Euler integration.

    This is a simple numerical method - real robot simulators use more advanced
    techniques (Runge-Kutta, implicit methods) for better accuracy.

    Args:
        theta0: Initial angle (radians)
        omega0: Initial angular velocity (rad/s)
        duration: Simulation time (seconds)
        dt: Time step size (seconds)

    Returns:
        (time_array, theta_array, omega_array): Simulation results
    """
    # Initialize arrays to store results
    num_steps = int(duration / dt)
    time = np.zeros(num_steps)
    theta = np.zeros(num_steps)
    omega = np.zeros(num_steps)

    # Set initial conditions
    theta[0] = theta0
    omega[0] = omega0

    # Euler integration loop
    for i in range(1, num_steps):
        time[i] = i * dt

        # Calculate derivatives at current state
        dtheta, domega = pendulum_dynamics(theta[i-1], omega[i-1])

        # Update state using Euler's method: x(t+dt) = x(t) + dx/dt * dt
        theta[i] = theta[i-1] + dtheta * dt
        omega[i] = omega[i-1] + domega * dt

    return time, theta, omega


def plot_results(time: np.ndarray, theta: np.ndarray, omega: np.ndarray):
    """
    Visualize pendulum simulation results.

    Args:
        time: Time array (seconds)
        theta: Angle array (radians)
        omega: Angular velocity array (rad/s)
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

    # Plot angle vs time
    ax1.plot(time, np.degrees(theta), 'b-', linewidth=2, label='Angle')
    ax1.set_xlabel('Time (s)', fontsize=12)
    ax1.set_ylabel('Angle (degrees)', fontsize=12)
    ax1.set_title('Pendulum Angle Over Time', fontsize=14, fontweight='bold')
    ax1.grid(True, alpha=0.3)
    ax1.legend()

    # Plot angular velocity vs time
    ax2.plot(time, omega, 'r-', linewidth=2, label='Angular Velocity')
    ax2.set_xlabel('Time (s)', fontsize=12)
    ax2.set_ylabel('Angular Velocity (rad/s)', fontsize=12)
    ax2.set_title('Pendulum Angular Velocity Over Time', fontsize=14, fontweight='bold')
    ax2.grid(True, alpha=0.3)
    ax2.legend()

    plt.tight_layout()
    plt.savefig('pendulum_simulation.png', dpi=150, bbox_inches='tight')
    plt.show()

    print("\n✅ Simulation complete!")
    print(f"   Plot saved as 'pendulum_simulation.png'")
    print(f"   Maximum angle: {np.degrees(np.max(np.abs(theta))):.2f}°")
    print(f"   Simulation duration: {time[-1]:.2f} seconds")


def main():
    """
    Run pendulum simulation with default parameters.

    Experiment ideas:
    1. Change theta0 to π (180°) - see the pendulum start upside down!
    2. Set damping b=0 in pendulum_dynamics() - see perpetual motion
    3. Decrease dt to 0.001 - see if the solution becomes more accurate
    """
    print("=" * 60)
    print("Physical AI - Pendulum Physics Simulation")
    print("=" * 60)
    print("\nSimulating a simple pendulum with:")
    print("  - Initial angle: 45° (π/4 radians)")
    print("  - Initial velocity: 0 rad/s")
    print("  - Damping: Yes (b=0.1)")
    print("  - Duration: 10 seconds")
    print("\nThis demonstrates how robots must predict physical motion...")
    print()

    # Run simulation
    theta_initial = np.pi / 4  # 45 degrees in radians
    omega_initial = 0.0        # Start from rest

    time, theta, omega = simulate_pendulum(theta_initial, omega_initial)

    # Visualize results
    plot_results(time, theta, omega)

    print("\n📚 Why this matters for Physical AI:")
    print("   - Robots must predict: 'If I push this door with force F, how far will it open?'")
    print("   - Physics engines use these same techniques (but much more complex)")
    print("   - Simulators like Gazebo/Isaac Sim run millions of these calculations per second")


if __name__ == "__main__":
    main()
