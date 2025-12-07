#!/usr/bin/env python3
"""
Gait Generator for Bipedal Walking

Generates smooth foot and CoM trajectories for natural walking.
From Lesson 2.3: Control Theory for Bipedal Locomotion
"""

import numpy as np
import matplotlib.pyplot as plt


class GaitGenerator:
    """Generate walking patterns at variable speeds"""

    def __init__(self, step_length=0.2, step_width=0.15, ground_clearance=0.05):
        """
        Args:
            step_length: Forward distance per step (meters)
            step_width: Distance between left and right feet (meters)
            ground_clearance: Height of swing foot above ground (meters)
        """
        self.step_length = step_length
        self.step_width = step_width
        self.ground_clearance = ground_clearance

        # Default gait parameters (will be updated by speed)
        self.cycle_time = 1.0  # seconds
        self.swing_phase_ratio = 0.6  # 60% swing, 40% stance

    def update_gait_for_speed(self, desired_speed):
        """Adjust gait parameters based on walking speed (m/s)"""

        if desired_speed <= 0.1:
            # Very slow walk
            self.cycle_time = 2.0
            self.swing_phase_ratio = 0.4
        elif desired_speed <= 0.3:
            # Slow walk
            self.cycle_time = 1.5
            self.swing_phase_ratio = 0.5
        elif desired_speed <= 0.6:
            # Normal walk
            self.cycle_time = 1.0
            self.swing_phase_ratio = 0.6
        else:
            # Fast walk / jog
            self.cycle_time = 0.8
            self.swing_phase_ratio = 0.65

        # Adjust step length for speed
        self.step_length = desired_speed * self.cycle_time

    def swing_foot_trajectory(self, phase):
        """
        Calculate foot position during swing phase

        Uses cubic polynomial for smooth horizontal motion and
        parabolic arc for vertical clearance.

        Args:
            phase: Normalized swing phase progress [0, 1]

        Returns:
            (x_offset, z_height) relative to swing start position
        """
        # Cubic interpolation for horizontal position
        # Smooth start and end, faster in middle
        x = self.step_length * (3 * phase**2 - 2 * phase**3)

        # Parabolic arc for height
        # Maximum at center of swing
        z = self.ground_clearance * 4 * phase * (1 - phase)

        return x, z

    def stance_foot_trajectory(self, phase):
        """
        Calculate CoM position during stance phase

        Linear movement forward while foot stays on ground.

        Args:
            phase: Normalized stance phase progress [0, 1]

        Returns:
            x_offset relative to stance start
        """
        # Simple linear movement
        # As stance foot moves back, body moves forward
        x = self.step_length * phase

        return x

    def get_foot_positions(self, cycle_phase, time_in_cycle):
        """
        Get desired positions for both feet at current time

        Args:
            cycle_phase: Phase within full gait cycle [0, 1]
            time_in_cycle: Current time in seconds

        Returns:
            (left_foot_pos, right_foot_pos, com_pos) as (x, y) tuples
        """
        # Determine if left or right foot is swinging
        if cycle_phase < 0.5:
            # Left foot swinging, right foot on ground
            right_phase = cycle_phase / 0.5  # Normalize stance to [0, 1]
            right_x = self.stance_foot_trajectory(1 - right_phase)
            right_y = self.step_width / 2

            left_phase = cycle_phase / 0.5
            left_x, left_z = self.swing_foot_trajectory(left_phase)
            left_y = -self.step_width / 2
        else:
            # Right foot swinging, left foot on ground
            left_phase = (cycle_phase - 0.5) / 0.5
            left_x = self.stance_foot_trajectory(1 - left_phase)
            left_y = -self.step_width / 2

            right_phase = (cycle_phase - 0.5) / 0.5
            right_x, right_z = self.swing_foot_trajectory(right_phase)
            right_y = self.step_width / 2

        # CoM moves smoothly forward
        com_x = self.step_length * cycle_phase
        com_y = 0.0  # Stay centered

        return ((left_x, left_y), (right_x, right_y), (com_x, com_y))

    def plot_gait_cycle(self):
        """Visualize the gait pattern"""

        n_points = 100
        phases = np.linspace(0, 1, n_points)

        left_x_vals = []
        left_y_vals = []
        right_x_vals = []
        right_y_vals = []
        com_x_vals = []

        for phase in phases:
            (left_pos, right_pos, com_pos) = self.get_foot_positions(phase, phase * self.cycle_time)
            left_x_vals.append(left_pos[0])
            left_y_vals.append(left_pos[1])
            right_x_vals.append(right_pos[0])
            right_y_vals.append(right_pos[1])
            com_x_vals.append(com_pos[0])

        plt.figure(figsize=(12, 5))

        # Foot positions
        plt.subplot(1, 2, 1)
        plt.plot(left_x_vals, left_y_vals, 'b-', label='Left foot')
        plt.plot(right_x_vals, right_y_vals, 'r-', label='Right foot')
        plt.plot(com_x_vals, [0]*n_points, 'g--', label='CoM', linewidth=2)
        plt.xlabel('Forward (m)')
        plt.ylabel('Lateral (m)')
        plt.title('Foot Trajectories in Gait Cycle')
        plt.legend()
        plt.axis('equal')
        plt.grid(True)

        # Foot height during swing
        plt.subplot(1, 2, 2)
        swing_phases = np.linspace(0, 1, 50)
        swing_heights = [self.swing_foot_trajectory(p)[1] for p in swing_phases]
        plt.plot(swing_phases, swing_heights, 'b-', linewidth=2)
        plt.xlabel('Swing Phase Progress')
        plt.ylabel('Foot Height (m)')
        plt.title('Foot Clearance During Swing Phase')
        plt.grid(True)

        plt.tight_layout()
        plt.show()


if __name__ == '__main__':
    print("=== Gait Generation Test ===\n")

    # Create gait generator
    gait = GaitGenerator(step_length=0.3, step_width=0.15)

    # Test different speeds
    print("Normal walking speed (0.3 m/s)")
    gait.update_gait_for_speed(0.3)

    # Print positions at key phases
    for phase_pct in [0, 25, 50, 75, 100]:
        phase = phase_pct / 100.0
        left, right, com = gait.get_foot_positions(phase, phase * gait.cycle_time)
        print(f"  Phase {phase_pct}%: Left={left}, Right={right}, CoM={com}")

    print("\nGenerating visualization...")
    # Uncomment to show plot:
    # gait.plot_gait_cycle()

    print(" Gait generation complete!")
