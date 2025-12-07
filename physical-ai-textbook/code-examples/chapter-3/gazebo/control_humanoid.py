#!/usr/bin/env python3
"""
Chapter 3.1: Gazebo Humanoid Robot Controller

This example demonstrates how to control a humanoid robot in Gazebo using ROS 2.
The robot performs a sequence of movements: walking forward, turning, and walking backward.

Prerequisites:
- ROS 2 Humble or Iron installed
- Gazebo Garden or newer
- Chapter 2 humanoid URDF model imported into Gazebo
- gz_ros2_control plugin enabled

Usage:
    ros2 run control_humanoid control_humanoid.py

Expected Behavior:
- Robot walks forward 3 meters
- Robot turns 90 degrees counterclockwise
- Robot walks backward 3 meters
- Robot returns to starting position
- Total execution time: ~30 seconds
"""

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import JointState
import math
import time


class HumanoidController(Node):
    """
    ROS 2 Node for controlling humanoid robot in Gazebo.

    Publishes:
    - /cmd_vel: Velocity commands (linear and angular)

    Subscribes:
    - /joint_states: Current joint positions, velocities, and efforts
    """

    def __init__(self):
        super().__init__('humanoid_controller')

        # Publisher for velocity commands
        self.cmd_vel_pub = self.create_publisher(
            Twist, '/cmd_vel', 10
        )

        # Subscriber for joint state feedback
        self.joint_state_sub = self.create_subscription(
            JointState, '/joint_states', self.joint_state_callback, 10
        )

        # Control loop timer (50 Hz)
        self.timer = self.create_timer(0.02, self.control_loop)

        # State machine variables
        self.step = 0
        self.max_steps = 1500  # 30 seconds @ 50 Hz
        self.phase = 0  # 0: forward, 1: turn, 2: backward, 3: return turn
        self.distance_traveled = 0.0
        self.rotation_angle = 0.0

        # Robot parameters
        self.linear_speed = 0.5  # m/s
        self.angular_speed = 0.3  # rad/s
        self.target_distance = 3.0  # meters
        self.target_rotation = math.pi / 2  # 90 degrees

        # Joint state feedback
        self.current_joint_names = []
        self.current_joint_positions = []
        self.current_joint_velocities = []

        self.get_logger().info('HumanoidController initialized')
        self.get_logger().info(f'Target distance: {self.target_distance}m')
        self.get_logger().info(f'Target rotation: {math.degrees(self.target_rotation)}°')

    def joint_state_callback(self, msg: JointState):
        """
        Callback for joint state messages from Gazebo.
        Updates current joint positions and velocities.
        """
        self.current_joint_names = list(msg.name)
        self.current_joint_positions = list(msg.position)
        self.current_joint_velocities = list(msg.velocity)

    def control_loop(self):
        """
        Main control loop executing at 50 Hz.
        Implements a 4-phase movement sequence.
        """
        if self.step >= self.max_steps:
            # Movement complete - stop the robot
            self.stop_robot()
            return

        # Calculate distances and angles based on velocity and time
        time_elapsed = self.step * 0.02  # 50 Hz = 0.02 seconds per step

        if self.phase == 0:
            # Phase 0: Walk forward
            self.distance_traveled = self.linear_speed * time_elapsed

            if self.distance_traveled >= self.target_distance:
                # Transition to phase 1
                self.phase = 1
                self.step = 0
                time_elapsed = 0
                self.get_logger().info('Phase 0 complete: Forward walk finished')
                return

            self.move_forward(self.linear_speed)

        elif self.phase == 1:
            # Phase 1: Turn 90 degrees
            self.rotation_angle = self.angular_speed * time_elapsed

            if self.rotation_angle >= self.target_rotation:
                # Transition to phase 2
                self.phase = 2
                self.step = 0
                time_elapsed = 0
                self.get_logger().info('Phase 1 complete: 90° turn finished')
                return

            self.turn_left(self.angular_speed)

        elif self.phase == 2:
            # Phase 2: Walk backward
            self.distance_traveled = self.linear_speed * time_elapsed

            if self.distance_traveled >= self.target_distance:
                # Transition to phase 3
                self.phase = 3
                self.step = 0
                time_elapsed = 0
                self.get_logger().info('Phase 2 complete: Backward walk finished')
                return

            self.move_backward(self.linear_speed)

        elif self.phase == 3:
            # Phase 3: Turn back to original orientation
            self.rotation_angle = self.angular_speed * time_elapsed

            if self.rotation_angle >= self.target_rotation:
                # Movement sequence complete
                self.phase = 4
                self.step = self.max_steps
                self.get_logger().info('Phase 3 complete: Return turn finished')
                self.get_logger().info('Robot returned to starting position')
                return

            self.turn_left(self.angular_speed)

        self.step += 1

    def move_forward(self, linear_speed: float):
        """Publish forward velocity command."""
        msg = Twist()
        msg.linear.x = linear_speed
        msg.angular.z = 0.0
        self.cmd_vel_pub.publish(msg)

    def move_backward(self, linear_speed: float):
        """Publish backward velocity command."""
        msg = Twist()
        msg.linear.x = -linear_speed
        msg.angular.z = 0.0
        self.cmd_vel_pub.publish(msg)

    def turn_left(self, angular_speed: float):
        """Publish left turn velocity command."""
        msg = Twist()
        msg.linear.x = 0.0
        msg.angular.z = angular_speed
        self.cmd_vel_pub.publish(msg)

    def turn_right(self, angular_speed: float):
        """Publish right turn velocity command."""
        msg = Twist()
        msg.linear.x = 0.0
        msg.angular.z = -angular_speed
        self.cmd_vel_pub.publish(msg)

    def stop_robot(self):
        """Publish zero velocity command to stop the robot."""
        msg = Twist()
        msg.linear.x = 0.0
        msg.angular.z = 0.0
        self.cmd_vel_pub.publish(msg)
        self.get_logger().info('Robot stopped')


def main(args=None):
    """Main entry point for ROS 2 node."""
    rclpy.init(args=args)
    controller = HumanoidController()

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        controller.get_logger().info('Keyboard interrupt received')
    finally:
        controller.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
