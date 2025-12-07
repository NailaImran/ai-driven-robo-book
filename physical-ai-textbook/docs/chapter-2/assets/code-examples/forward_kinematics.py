#!/usr/bin/env python3
"""
Forward Kinematics (FK) Solver for 2-Link Robot Arm

This module demonstrates how to compute the end-effector position
given joint angles. From Lesson 2.2: Humanoid Modeling with URDF.

Usage:
    fk = ForwardKinematics(l1=0.5, l2=0.4)
    ee_pos = fk.compute(theta1=0.785, theta2=1.57)
    print(f"End-effector at: {ee_pos}")

Expected Output:
    End-effector at: [0.3536, -0.3536]
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple


class ForwardKinematics:
    """
    2-Link planar arm forward kinematics solver.

    Structure:
    base ’ link1 (length l1) ’ link2 (length l2)

    Each joint rotates around Z-axis (out of page in 2D view)
    """

    def __init__(self, l1: float = 0.5, l2: float = 0.4):
        """
        Initialize the arm with link lengths.

        Args:
            l1: Length of first link (meters)
            l2: Length of second link (meters)
        """
        self.l1 = l1
        self.l2 = l2

    def compute(self, theta1: float, theta2: float) -> Tuple[float, float]:
        """
        Compute end-effector (X, Y) position from joint angles.

        Uses standard 2D transformation:
        x = l1*cos(¸1) + l2*cos(¸1+¸2)
        y = l1*sin(¸1) + l2*sin(¸1+¸2)

        Args:
            theta1: Angle of first joint (radians)
            theta2: Angle of second joint (radians)

        Returns:
            Tuple of (x, y) end-effector position in meters
        """
        # Position of joint 2 (end of link 1)
        x1 = self.l1 * np.cos(theta1)
        y1 = self.l1 * np.sin(theta1)

        # Position of end-effector (end of link 2)
        # Note: theta2 is relative to link 1, so we use (theta1 + theta2)
        total_angle = theta1 + theta2
        x2 = x1 + self.l2 * np.cos(total_angle)
        y2 = y1 + self.l2 * np.sin(total_angle)

        return x2, y2

    def compute_trajectory(self, theta1_range, theta2_range, steps=20):
        """
        Compute reachable workspace (all positions the arm can reach).

        Args:
            theta1_range: Tuple of (min, max) for joint 1 (radians)
            theta2_range: Tuple of (min, max) for joint 2 (radians)
            steps: Number of samples per joint dimension

        Returns:
            Lists of x, y positions forming the reachable region
        """
        x_positions = []
        y_positions = []

        theta1_vals = np.linspace(theta1_range[0], theta1_range[1], steps)
        theta2_vals = np.linspace(theta2_range[0], theta2_range[1], steps)

        for t1 in theta1_vals:
            for t2 in theta2_vals:
                x, y = self.compute(t1, t2)
                x_positions.append(x)
                y_positions.append(y)

        return x_positions, y_positions

    def plot_workspace(self, theta1_range=(-np.pi, np.pi),
                       theta2_range=(-np.pi, np.pi)):
        """
        Visualize the reachable workspace of the arm.

        Args:
            theta1_range: Joint 1 angle range
            theta2_range: Joint 2 angle range
        """
        x_vals, y_vals = self.compute_trajectory(
            theta1_range, theta2_range, steps=30
        )

        plt.figure(figsize=(10, 10))

        # Plot workspace
        plt.scatter(x_vals, y_vals, c='lightblue', s=20, alpha=0.6)

        # Plot a few example configurations
        test_configs = [
            (0, 0, 'red', '¸1=0°, ¸2=0°'),
            (np.pi/4, np.pi/4, 'green', '¸1=45°, ¸2=45°'),
            (np.pi/2, -np.pi/2, 'blue', '¸1=90°, ¸2=-90°'),
        ]

        for theta1, theta2, color, label in test_configs:
            x, y = self.compute(theta1, theta2)

            # Plot the arm configuration
            x0, y0 = 0, 0
            x1 = self.l1 * np.cos(theta1)
            y1 = self.l1 * np.sin(theta1)
            x2, y2 = x, y

            # Draw links
            plt.plot([x0, x1], [y0, y1], color=color, linewidth=2)
            plt.plot([x1, x2], [y1, y2], color=color, linewidth=2)

            # Mark joints
            plt.plot(x0, y0, 'ko', markersize=8)  # Base
            plt.plot(x1, y1, 'ko', markersize=6)  # Joint 1
            plt.plot(x2, y2, 'o', color=color, markersize=8)  # End-effector

            plt.label(f'{label}')

        plt.xlabel('X (meters)')
        plt.ylabel('Y (meters)')
        plt.title(f'2-Link Arm Workspace (l1={self.l1}m, l2={self.l2}m)')
        plt.axis('equal')
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.show()


if __name__ == '__main__':
    # Example usage
    print("=== Forward Kinematics Example ===\n")

    # Create a 2-link arm with specific link lengths
    arm = ForwardKinematics(l1=0.5, l2=0.4)

    # Test configuration 1: Both joints pointing up
    theta1, theta2 = 0, 0
    x, y = arm.compute(theta1, theta2)
    print(f"Config 1: ¸1=0°, ¸2=0°")
    print(f"  End-effector: ({x:.3f}, {y:.3f})")
    print(f"  Distance from base: {np.sqrt(x**2 + y**2):.3f}m\n")

    # Test configuration 2: First joint at 45°, second at 45°
    theta1, theta2 = np.pi/4, np.pi/4
    x, y = arm.compute(theta1, theta2)
    print(f"Config 2: ¸1=45°, ¸2=45°")
    print(f"  End-effector: ({x:.3f}, {y:.3f})")
    print(f"  Distance from base: {np.sqrt(x**2 + y**2):.3f}m\n")

    # Test configuration 3: Elbow down (theta2 negative)
    theta1, theta2 = np.pi/2, -np.pi/2
    x, y = arm.compute(theta1, theta2)
    print(f"Config 3: ¸1=90°, ¸2=-90°")
    print(f"  End-effector: ({x:.3f}, {y:.3f})")
    print(f"  Distance from base: {np.sqrt(x**2 + y**2):.3f}m\n")

    # Workspace visualization
    print("Generating workspace visualization...")
    # Uncomment to show plot:
    # arm.plot_workspace()

    print("\n Forward kinematics computation complete!")
    print("Next: Try Lesson 2.2 Quiz or move to Inverse Kinematics in lesson-2-3")
