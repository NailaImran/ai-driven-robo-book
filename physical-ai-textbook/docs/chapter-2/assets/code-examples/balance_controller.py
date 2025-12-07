#!/usr/bin/env python3
"""
IMU-Based Balance Controller for Bipedal Robots

Maintains balance using gyroscope and accelerometer feedback.
From Lesson 2.3: Control Theory for Bipedal Locomotion
"""

import numpy as np
from dataclasses import dataclass


@dataclass
class IMUData:
    """IMU measurement from robot"""
    # Accelerometer (m/s^2)
    accel_x: float
    accel_y: float
    accel_z: float

    # Gyroscope (rad/s)
    gyro_x: float
    gyro_y: float
    gyro_z: float

    # Magnetometer (Tesla) - optional
    mag_x: float = 0.0
    mag_y: float = 0.0
    mag_z: float = 0.0


class BalanceController:
    """Maintain bipedal balance using IMU feedback and ankle/hip adjustments"""

    def __init__(self, robot_mass=25.0, imu_height=0.8, gravity=9.81):
        """
        Args:
            robot_mass: Total robot mass (kg)
            imu_height: Height of IMU above ground (meters)
            gravity: Gravitational acceleration (m/s^2)
        """
        self.mass = robot_mass
        self.imu_height = imu_height
        self.g = gravity

        # Current body orientation (roll, pitch, yaw in radians)
        self.roll = 0.0
        self.pitch = 0.0
        self.yaw = 0.0

        # Angular velocity (gyroscope integration)
        self.roll_rate = 0.0
        self.pitch_rate = 0.0
        self.yaw_rate = 0.0

        # PID gains for balance (tuned for humanoid robots)
        self.Kp_pitch = 2.0   # Proportional gain for pitch correction
        self.Ki_pitch = 0.05  # Integral gain
        self.Kd_pitch = 0.3   # Derivative gain

        self.Kp_roll = 1.5    # Proportional gain for roll correction
        self.Ki_roll = 0.03
        self.Kd_roll = 0.2

        # Error history for integral/derivative
        self.pitch_integral_error = 0.0
        self.roll_integral_error = 0.0
        self.previous_pitch_error = 0.0
        self.previous_roll_error = 0.0

        # Sensor fusion state (Kalman-like tracking)
        self.pitch_estimated = 0.0
        self.roll_estimated = 0.0

        # Time tracking
        self.previous_time = None
        self.dt = 0.01  # Default 100Hz update rate

    def update_attitude(self, imu_data, dt=0.01):
        """
        Update robot attitude estimate from IMU

        Uses complementary filter combining:
        - Gyroscope integration (fast but drifts)
        - Accelerometer (slow but stable)
        """
        self.dt = dt

        # Extract measurements
        ax = imu_data.accel_x
        ay = imu_data.accel_y
        az = imu_data.accel_z

        wx = imu_data.gyro_x
        wy = imu_data.gyro_y
        wz = imu_data.gyro_z

        # Accelerometer-based angle estimation
        # pitch = arctan(ax / sqrt(ay^2 + az^2))
        pitch_accel = np.arctan2(ax, np.sqrt(ay**2 + az**2))
        roll_accel = np.arctan2(ay, np.sqrt(ax**2 + az**2))

        # Gyroscope-based integration (velocity)
        # Small angle approximation: angle_rate H gyro_reading
        pitch_gyro = self.pitch_estimated + wy * dt
        roll_gyro = self.roll_estimated + wx * dt

        # Complementary filter (0.98 = gyro weight, 0.02 = accel weight)
        accel_weight = 0.02
        gyro_weight = 0.98

        self.pitch_estimated = gyro_weight * pitch_gyro + accel_weight * pitch_accel
        self.roll_estimated = gyro_weight * roll_gyro + accel_weight * roll_accel

        # Store rates for derivative term
        self.pitch_rate = wy
        self.roll_rate = wx

        # Clamp to valid range (-À/2 to À/2)
        self.pitch_estimated = np.clip(self.pitch_estimated, -np.pi/2, np.pi/2)
        self.roll_estimated = np.clip(self.roll_estimated, -np.pi/2, np.pi/2)

    def calculate_ankle_correction(self, desired_pitch=0.0, desired_roll=0.0):
        """
        Calculate ankle joint torques to correct body pitch/roll

        Strategy: Rotate ankles to shift CoM back inside support polygon

        Args:
            desired_pitch: Target pitch angle (rad) - usually 0 (vertical)
            desired_roll: Target roll angle (rad) - usually 0 (balanced)

        Returns:
            (left_ankle_torque, right_ankle_torque) in NÅm
        """
        # Pitch error (positive = leaning forward)
        pitch_error = self.pitch_estimated - desired_pitch

        # Roll error (positive = leaning right)
        roll_error = self.roll_estimated - desired_roll

        # PID for pitch control
        p_pitch = self.Kp_pitch * pitch_error
        self.pitch_integral_error += pitch_error * self.dt
        self.pitch_integral_error = np.clip(self.pitch_integral_error, -0.5, 0.5)
        i_pitch = self.Ki_pitch * self.pitch_integral_error
        d_pitch = self.Kd_pitch * (pitch_error - self.previous_pitch_error) / self.dt
        pitch_torque = p_pitch + i_pitch + d_pitch

        # PID for roll control
        p_roll = self.Kp_roll * roll_error
        self.roll_integral_error += roll_error * self.dt
        self.roll_integral_error = np.clip(self.roll_integral_error, -0.3, 0.3)
        i_roll = self.Ki_roll * self.roll_integral_error
        d_roll = self.Kd_roll * (roll_error - self.previous_roll_error) / self.dt
        roll_torque = p_roll + i_roll + d_roll

        # Distribute to ankles
        # Pitch: both ankles move together
        # Roll: ankles move opposite (left forward = right back)
        left_ankle_pitch = pitch_torque
        right_ankle_pitch = pitch_torque
        left_ankle_roll = roll_torque
        right_ankle_roll = -roll_torque

        # Combine pitch and roll (magnitude)
        left_ankle_torque = np.sqrt(left_ankle_pitch**2 + left_ankle_roll**2)
        right_ankle_torque = np.sqrt(right_ankle_pitch**2 + right_ankle_roll**2)

        # Safety limit
        max_ankle_torque = 50.0  # NÅm
        left_ankle_torque = np.clip(left_ankle_torque, -max_ankle_torque, max_ankle_torque)
        right_ankle_torque = np.clip(right_ankle_torque, -max_ankle_torque, max_ankle_torque)

        # Store errors for next iteration
        self.previous_pitch_error = pitch_error
        self.previous_roll_error = roll_error

        return left_ankle_torque, right_ankle_torque

    def calculate_hip_correction(self, imu_data, com_height=0.5):
        """
        Calculate hip joint adjustments for balance

        Uses inverted pendulum model:
        - Robot as pendulum with pivot at ankle
        - Hip torque creates moment about ankle

        Args:
            imu_data: Current IMU measurement
            com_height: CoM height above ankle (meters)

        Returns:
            (left_hip_torque, right_hip_torque) in NÅm
        """
        # Pendulum dynamics: Ä = m * g * L * sin(¸) + m * L * accel_angular
        # For small angles: Ä H m * g * L * ¸ + m * L * ±

        pitch_angle = self.pitch_estimated
        roll_angle = self.roll_estimated

        # Linear acceleration (tilt-induced)
        # If leaning forward, need counter-torque
        accel_x = imu_data.accel_x
        accel_y = imu_data.accel_y

        # Torque needed to counteract angular acceleration
        pitch_torque = self.mass * 9.81 * com_height * np.sin(pitch_angle)
        roll_torque = self.mass * 9.81 * com_height * np.sin(roll_angle)

        # Add feedback from linear acceleration
        pitch_torque -= self.mass * accel_x * com_height * 0.1
        roll_torque -= self.mass * accel_y * com_height * 0.1

        # Distribute to hips (opposite ankles - work together to maintain balance)
        # Both hips pitch together
        left_hip_torque = pitch_torque * 0.5
        right_hip_torque = pitch_torque * 0.5

        # Safety limit
        max_hip_torque = 100.0  # NÅm
        left_hip_torque = np.clip(left_hip_torque, -max_hip_torque, max_hip_torque)
        right_hip_torque = np.clip(right_hip_torque, -max_hip_torque, max_hip_torque)

        return left_hip_torque, right_hip_torque

    def get_balance_metrics(self):
        """
        Return current balance state metrics

        Returns:
            dict with keys:
            - pitch, roll: Current orientation (rad)
            - pitch_rate, roll_rate: Angular velocity (rad/s)
            - pitch_error, roll_error: Deviation from vertical
            - stability_margin: How close to falling (0-1, where 1=vertical)
        """
        pitch_error = self.pitch_estimated
        roll_error = self.roll_estimated

        # Stability as distance from edge (approximation)
        # At 15 degrees, robot starts to struggle; at 20 degrees, falls
        stability_margin = 1.0 - (abs(pitch_error) + abs(roll_error)) / (np.pi / 9)  # 20 degrees in radians
        stability_margin = np.clip(stability_margin, 0.0, 1.0)

        return {
            'pitch': self.pitch_estimated,
            'roll': self.roll_estimated,
            'pitch_rate': self.pitch_rate,
            'roll_rate': self.roll_rate,
            'pitch_error': pitch_error,
            'roll_error': roll_error,
            'stability_margin': stability_margin,
        }


if __name__ == '__main__':
    print("=== IMU-Based Balance Controller Test ===\n")

    controller = BalanceController(robot_mass=25.0, imu_height=0.8)

    # Simulate a robot being pushed forward
    print("Scenario 1: Robot pushed forward (positive accel)")
    imu_data = IMUData(
        accel_x=1.5,      # Leaning forward
        accel_y=0.0,
        accel_z=9.81,     # Gravity
        gyro_x=0.0,
        gyro_y=0.05,      # Pitching forward
        gyro_z=0.0
    )

    for step in range(5):
        controller.update_attitude(imu_data, dt=0.01)
        left_ankle, right_ankle = controller.calculate_ankle_correction(desired_pitch=0.0)
        left_hip, right_hip = controller.calculate_hip_correction(imu_data)
        metrics = controller.get_balance_metrics()

        print(f"Step {step}: Pitch={metrics['pitch']:.4f} rad, "
              f"Stability={metrics['stability_margin']:.2%}, "
              f"Ankle Torque={left_ankle:.2f} NÅm")

    print("\nScenario 2: Robot recovering from disturbance")
    # Disturbance stops
    imu_data = IMUData(
        accel_x=0.0,
        accel_y=0.0,
        accel_z=9.81,
        gyro_x=0.0,
        gyro_y=-0.03,  # Negative pitch rate (recovering)
        gyro_z=0.0
    )

    for step in range(5):
        controller.update_attitude(imu_data, dt=0.01)
        metrics = controller.get_balance_metrics()
        print(f"Step {step}: Pitch={metrics['pitch']:.4f} rad, "
              f"Stability={metrics['stability_margin']:.2%}")

    print("\n Balance control simulation complete!")
