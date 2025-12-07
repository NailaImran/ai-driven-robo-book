"""
Physical AI - Chapter 1: Sensor Data Processing Example
=======================================================

This script demonstrates how Physical AI systems process IMU (Inertial Measurement Unit)
sensor data to estimate orientation using a simple complementary filter.

Prerequisites:
- Python 3.10+
- numpy >= 1.24
- matplotlib >= 3.7

Installation:
    pip install numpy matplotlib

Expected Output:
- A plot showing raw accelerometer/gyroscope data and filtered orientation estimate
- Demonstration of sensor fusion (combining multiple sensors for better estimates)

Learning Objectives:
- Understand how robots sense their orientation (roll, pitch, yaw)
- See why sensor fusion is necessary (accelerometers are noisy, gyroscopes drift)
- Practice working with time-series sensor data
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple


def simulate_imu_data(duration: float = 10.0, dt: float = 0.01,
                     true_angle: float = 30.0) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Simulate IMU sensor data for a robot tilted at a fixed angle.

    In reality, this data would come from hardware (e.g., Bosch BNO055, InvenSense MPU6050).
    Here we simulate it to demonstrate processing algorithms.

    Args:
        duration: Simulation time (seconds)
        dt: Sampling interval (seconds)
        true_angle: Actual tilt angle (degrees)

    Returns:
        (time, accel_readings, gyro_readings): Simulated sensor data
    """
    num_samples = int(duration / dt)
    time = np.arange(num_samples) * dt

    # Convert true angle to radians
    true_angle_rad = np.deg2rad(true_angle)

    # Simulate accelerometer readings (measures gravity direction)
    # Perfect reading would be: ax = g * sin(angle), ay = 0, az = g * cos(angle)
    # We add noise because real accelerometers are noisy (vibration, movement)
    accel_noise_std = 0.5  # m/s^2
    ax_true = 9.81 * np.sin(true_angle_rad)
    accel_x = ax_true + np.random.normal(0, accel_noise_std, num_samples)
    accel_z = 9.81 * np.cos(true_angle_rad) + np.random.normal(0, accel_noise_std, num_samples)

    # Simulate gyroscope readings (measures angular velocity)
    # If robot is stationary, gyro should read ~0
    # We add small bias and noise because gyroscopes drift over time
    gyro_bias = 0.05  # deg/s (constant drift)
    gyro_noise_std = 0.2  # deg/s
    gyro_readings = gyro_bias + np.random.normal(0, gyro_noise_std, num_samples)

    return time, accel_x, accel_z, gyro_readings


def estimate_angle_from_accel(accel_x: np.ndarray, accel_z: np.ndarray) -> np.ndarray:
    """
    Estimate tilt angle from accelerometer data.

    This works because gravity always points down - if the robot is tilted,
    accelerometer readings change.

    Limitation: Only works when robot is stationary or moving slowly.
    If robot accelerates (e.g., car braking), this gives wrong angle.

    Args:
        accel_x: X-axis acceleration (m/s^2)
        accel_z: Z-axis acceleration (m/s^2)

    Returns:
        Estimated angle (degrees)
    """
    # Use atan2 to get angle from gravity vector
    angle_rad = np.arctan2(accel_x, accel_z)
    return np.rad2deg(angle_rad)


def integrate_gyro(gyro_readings: np.ndarray, dt: float, initial_angle: float = 0.0) -> np.ndarray:
    """
    Estimate angle by integrating gyroscope readings.

    Gyro measures angular velocity (deg/s), so we integrate to get angle:
    angle(t) = angle(0) + ∫ gyro(t) dt

    Limitation: Gyroscopes drift - small errors accumulate over time, causing unbounded error.

    Args:
        gyro_readings: Angular velocity measurements (deg/s)
        dt: Time step (seconds)
        initial_angle: Starting angle (degrees)

    Returns:
        Estimated angle over time (degrees)
    """
    angle = np.zeros_like(gyro_readings)
    angle[0] = initial_angle

    # Numerical integration (cumulative sum)
    for i in range(1, len(gyro_readings)):
        angle[i] = angle[i-1] + gyro_readings[i-1] * dt

    return angle


def complementary_filter(accel_angle: np.ndarray, gyro_angle: np.ndarray,
                         alpha: float = 0.98) -> np.ndarray:
    """
    Fuse accelerometer and gyroscope estimates using complementary filter.

    Idea: Combine fast-changing (high-frequency) gyro data with slow-changing
    (low-frequency) accelerometer data.

    Formula: filtered_angle = alpha * (gyro_angle) + (1-alpha) * (accel_angle)

    - alpha close to 1: Trust gyro more (good short-term, drifts long-term)
    - alpha close to 0: Trust accel more (immune to drift, noisy)

    Typical alpha: 0.95-0.99

    Args:
        accel_angle: Angle from accelerometer (degrees)
        gyro_angle: Angle from gyroscope integration (degrees)
        alpha: Filter coefficient (0-1)

    Returns:
        Fused angle estimate (degrees)
    """
    filtered = np.zeros_like(accel_angle)
    filtered[0] = accel_angle[0]

    for i in range(1, len(accel_angle)):
        # Complementary filter: high-pass gyro + low-pass accel
        filtered[i] = alpha * gyro_angle[i] + (1 - alpha) * accel_angle[i]

    return filtered


def plot_sensor_fusion(time: np.ndarray, accel_angle: np.ndarray,
                       gyro_angle: np.ndarray, filtered_angle: np.ndarray,
                       true_angle: float):
    """
    Visualize sensor fusion results.

    Args:
        time: Time array (seconds)
        accel_angle: Accelerometer-based estimate (degrees)
        gyro_angle: Gyroscope-based estimate (degrees)
        filtered_angle: Fused estimate (degrees)
        true_angle: Ground truth angle (degrees)
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

    # Plot 1: Compare all estimates
    ax1.plot(time, accel_angle, 'b-', alpha=0.5, linewidth=1, label='Accelerometer (noisy)')
    ax1.plot(time, gyro_angle, 'r-', alpha=0.5, linewidth=1, label='Gyroscope (drifts)')
    ax1.plot(time, filtered_angle, 'g-', linewidth=2, label='Complementary Filter (fused)')
    ax1.axhline(y=true_angle, color='k', linestyle='--', linewidth=2, label=f'True Angle ({true_angle}°)')
    ax1.set_xlabel('Time (s)', fontsize=12)
    ax1.set_ylabel('Estimated Angle (degrees)', fontsize=12)
    ax1.set_title('Sensor Fusion: Combining Accelerometer and Gyroscope', fontsize=14, fontweight='bold')
    ax1.legend(loc='best', fontsize=10)
    ax1.grid(True, alpha=0.3)
    ax1.set_ylim([true_angle - 10, true_angle + 10])

    # Plot 2: Estimation errors
    accel_error = accel_angle - true_angle
    gyro_error = gyro_angle - true_angle
    filtered_error = filtered_angle - true_angle

    ax2.plot(time, accel_error, 'b-', alpha=0.5, linewidth=1, label='Accel Error')
    ax2.plot(time, gyro_error, 'r-', alpha=0.5, linewidth=1, label='Gyro Error')
    ax2.plot(time, filtered_error, 'g-', linewidth=2, label='Filtered Error')
    ax2.axhline(y=0, color='k', linestyle='--', linewidth=1)
    ax2.set_xlabel('Time (s)', fontsize=12)
    ax2.set_ylabel('Estimation Error (degrees)', fontsize=12)
    ax2.set_title('Error Analysis: Filter Performance', fontsize=14, fontweight='bold')
    ax2.legend(loc='best', fontsize=10)
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('sensor_fusion_demo.png', dpi=150, bbox_inches='tight')
    plt.show()

    print("\n✅ Sensor fusion demo complete!")
    print(f"   Plot saved as 'sensor_fusion_demo.png'")
    print(f"\n   Error Statistics (after 10 seconds):")
    print(f"   - Accelerometer RMS error: {np.sqrt(np.mean(accel_error**2)):.2f}°")
    print(f"   - Gyroscope RMS error: {np.sqrt(np.mean(gyro_error**2)):.2f}°")
    print(f"   - Complementary Filter RMS error: {np.sqrt(np.mean(filtered_error**2)):.2f}°")


def main():
    """
    Run sensor fusion demonstration.

    Experiment ideas:
    1. Change alpha from 0.98 to 0.5 - see filter become noisier but resist drift better
    2. Increase gyro_bias to 0.5 deg/s - see gyro drift become more pronounced
    3. Change true_angle to 60° - test with different tilt angles
    """
    print("=" * 70)
    print("Physical AI - IMU Sensor Data Processing Demo")
    print("=" * 70)
    print("\nSimulating IMU data for a robot tilted at 30°...")
    print("  - Accelerometer: Noisy but doesn't drift")
    print("  - Gyroscope: Smooth but drifts over time")
    print("  - Complementary Filter: Combines best of both!")
    print()

    # Simulation parameters
    true_angle = 30.0  # degrees
    duration = 10.0    # seconds
    dt = 0.01          # 100 Hz sampling rate

    # Generate simulated sensor data
    time, accel_x, accel_z, gyro_readings = simulate_imu_data(duration, dt, true_angle)

    # Method 1: Estimate angle from accelerometer
    accel_angle = estimate_angle_from_accel(accel_x, accel_z)

    # Method 2: Estimate angle from gyroscope (integration)
    gyro_angle = integrate_gyro(gyro_readings, dt, initial_angle=accel_angle[0])

    # Method 3: Sensor fusion with complementary filter
    filtered_angle = complementary_filter(accel_angle, gyro_angle, alpha=0.98)

    # Visualize results
    plot_sensor_fusion(time, accel_angle, gyro_angle, filtered_angle, true_angle)

    print("\n📚 Why this matters for Physical AI:")
    print("   - Robots need accurate orientation for balance (humanoids), navigation (drones), manipulation (arms)")
    print("   - Single sensors aren't enough - fusion is essential")
    print("   - Real robots use Kalman Filters (more advanced than complementary filter)")
    print("   - This same principle applies to fusing vision + LiDAR, GPS + IMU, etc.")


if __name__ == "__main__":
    main()
