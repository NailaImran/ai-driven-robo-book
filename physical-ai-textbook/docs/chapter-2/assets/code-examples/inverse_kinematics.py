#!/usr/bin/env python3
"""
Inverse Kinematics (IK) Solver for 2-Link Robot Arm

This module demonstrates how to find joint angles that achieve
a target end-effector position. From Lesson 2.2: Humanoid Modeling.

Two approaches are shown:
1. Analytical solution (exact, only works for 2D planar arms)
2. Numerical optimization (general, works for any arm)
"""

import numpy as np
from scipy.optimize import minimize


class InverseKinematics:
    """Inverse kinematics solver for 2-link planar arm."""

    def __init__(self, l1=0.5, l2=0.4):
        self.l1 = l1
        self.l2 = l2

    def solve_analytical(self, target_x, target_y):
        """Solve IK analytically using geometry."""
        d = np.sqrt(target_x**2 + target_y**2)

        # Check if reachable
        if d > self.l1 + self.l2 or d < abs(self.l1 - self.l2):
            return None, None

        # Law of cosines
        cos_theta2 = (self.l1**2 + self.l2**2 - d**2) / (2 * self.l1 * self.l2)
        cos_theta2 = np.clip(cos_theta2, -1, 1)
        theta2 = np.arccos(cos_theta2)

        alpha = np.arctan2(self.l2 * np.sin(theta2),
                          self.l1 + self.l2 * np.cos(theta2))
        theta1 = np.arctan2(target_y, target_x) - alpha

        return theta1, theta2

    def solve_numerical(self, target_x, target_y, initial_guess=None):
        """Solve IK numerically using optimization."""
        if initial_guess is None:
            initial_guess = np.random.randn(2) * np.pi

        def error_function(angles):
            theta1, theta2 = angles
            x = self.l1 * np.cos(theta1) + self.l2 * np.cos(theta1 + theta2)
            y = self.l1 * np.sin(theta1) + self.l2 * np.sin(theta1 + theta2)
            return np.sqrt((x - target_x)**2 + (y - target_y)**2)

        result = minimize(error_function, initial_guess, method='BFGS')
        return result.x[0], result.x[1]


if __name__ == '__main__':
    print("=== Inverse Kinematics Example ===")
    ik = InverseKinematics()

    target_x, target_y = 0.7, 0.3
    theta1, theta2 = ik.solve_analytical(target_x, target_y)

    if theta1 is not None:
        print(f"Target: ({target_x}, {target_y})")
        print(f"Solution: ¸1={np.degrees(theta1):.1f}°, ¸2={np.degrees(theta2):.1f}°")
