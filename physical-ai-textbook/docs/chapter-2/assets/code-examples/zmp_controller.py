#!/usr/bin/env python3
"""
Zero Moment Point (ZMP) Stability Controller

Ensures bipedal robot doesn't fall by monitoring ZMP.
From Lesson 2.3: Control Theory for Bipedal Locomotion
"""

import numpy as np


class ZMPController:
    """Monitor and maintain stability using Zero Moment Point criterion"""

    def __init__(self, footprint_width=0.2, footprint_length=0.3):
        """
        Args:
            footprint_width: Distance between left and right feet (meters)
            footprint_length: Length of each foot (meters)
        """
        self.footprint_width = footprint_width
        self.footprint_length = footprint_length
        self.stability_margin = 0.02  # 2cm safety margin

    def get_support_polygon(self, left_foot_pos, right_foot_pos):
        """
        Calculate support polygon from foot positions

        Returns:
            (x_min, x_max, y_min, y_max) of support region
        """
        left_x, left_y = left_foot_pos
        right_x, right_y = right_foot_pos

        # Support polygon is rectangular region between feet
        x_min = min(left_x, right_x) - self.footprint_length / 2
        x_max = max(left_x, right_x) + self.footprint_length / 2
        y_min = min(left_y, right_y) - self.footprint_width / 2
        y_max = max(left_y, right_y) + self.footprint_width / 2

        return (x_min, x_max, y_min, y_max)

    def is_stable(self, com_pos, left_foot_pos, right_foot_pos):
        """
        Check if robot is stable (ZMP inside support polygon)

        Args:
            com_pos: (x, y) center of mass position
            left_foot_pos: (x, y) left foot position
            right_foot_pos: (x, y) right foot position

        Returns:
            (is_stable: bool, stability_margin_percent: float)
        """
        com_x, com_y = com_pos
        support = self.get_support_polygon(left_foot_pos, right_foot_pos)
        x_min, x_max, y_min, y_max = support

        # ZMP approximates CoM when acceleration is small
        zmp_x, zmp_y = com_x, com_y

        # Apply stability margin
        safe_x_min = x_min + self.stability_margin
        safe_x_max = x_max - self.stability_margin
        safe_y_min = y_min + self.stability_margin
        safe_y_max = y_max - self.stability_margin

        # Check if ZMP is within safe region
        is_stable = (safe_x_min <= zmp_x <= safe_x_max and
                    safe_y_min <= zmp_y <= safe_y_max)

        # Calculate how much margin remains
        if is_stable:
            margin_x = min(zmp_x - safe_x_min, safe_x_max - zmp_x)
            margin_y = min(zmp_y - safe_y_min, safe_y_max - zmp_y)
            margin_min = min(margin_x, margin_y)
            safe_width = min(safe_x_max - safe_x_min, safe_y_max - safe_y_min)
            stability_percent = 100 * margin_min / (safe_width / 2) if safe_width > 0 else 0
        else:
            stability_percent = 0.0

        return is_stable, stability_percent

    def clamp_com_trajectory(self, desired_com, left_foot, right_foot):
        """
        Modify desired CoM trajectory to maintain stability

        If CoM would leave support polygon, pull it back to safe region.
        """
        support = self.get_support_polygon(left_foot, right_foot)
        x_min, x_max, y_min, y_max = support

        safe_x_min = x_min + self.stability_margin
        safe_x_max = x_max - self.stability_margin
        safe_y_min = y_min + self.stability_margin
        safe_y_max = y_max - self.stability_margin

        adjusted_x = np.clip(desired_com[0], safe_x_min, safe_x_max)
        adjusted_y = np.clip(desired_com[1], safe_y_min, safe_y_max)

        return np.array([adjusted_x, adjusted_y])

    def calculate_zmp(self, com_pos, com_accel, total_mass, g=9.81):
        """
        Calculate Zero Moment Point from dynamics

        More accurate formula including acceleration terms:
        ZMP_x = CoM_x - (CoM_accel_x / g) * CoM_z

        Args:
            com_pos: (x, y, z) center of mass position
            com_accel: (x, y, z) center of mass acceleration
            total_mass: Robot total mass (kg)
            g: Gravity constant (m/s^2)

        Returns:
            (zmp_x, zmp_y) position on ground plane
        """
        com_x, com_y, com_z = com_pos
        accel_x, accel_y, accel_z = com_accel

        # ZMP calculation (simplified 2D)
        if com_z > 0:  # Avoid division by zero
            zmp_x = com_x - (accel_x / g) * com_z
            zmp_y = com_y - (accel_y / g) * com_z
        else:
            zmp_x, zmp_y = com_x, com_y

        return zmp_x, zmp_y


if __name__ == '__main__':
    # Test example
    print("=== ZMP Stability Test ===\n")

    controller = ZMPController(footprint_width=0.2, footprint_length=0.3)

    # Scenario 1: Robot centered between feet (stable)
    print("Scenario 1: Robot centered (should be stable)")
    com = np.array([0.0, 0.0])
    left_foot = np.array([-0.1, 0.0])
    right_foot = np.array([0.1, 0.0])

    is_stable, margin = controller.is_stable(com, left_foot, right_foot)
    print(f"  Stable: {is_stable}, Margin: {margin:.1f}%\n")

    # Scenario 2: Robot shifted forward (approaching instability)
    print("Scenario 2: Robot shifted forward")
    com = np.array([0.08, 0.0])

    is_stable, margin = controller.is_stable(com, left_foot, right_foot)
    print(f"  Stable: {is_stable}, Margin: {margin:.1f}%\n")

    # Scenario 3: Robot too far forward (unstable!)
    print("Scenario 3: Robot shifted too far (should be unstable)")
    com = np.array([0.15, 0.0])

    is_stable, margin = controller.is_stable(com, left_foot, right_foot)
    print(f"  Stable: {is_stable}, Margin: {margin:.1f}%")

    if not is_stable:
        adjusted = controller.clamp_com_trajectory(com, left_foot, right_foot)
        print(f"  Clamped to: {adjusted}")
