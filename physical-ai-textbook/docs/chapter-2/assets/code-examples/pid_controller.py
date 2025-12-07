#!/usr/bin/env python3
"""
PID Controller Implementation for Robot Joint Control

This module demonstrates basic PID control in ROS 2.
From Lesson 2.3: Control Theory for Bipedal Locomotion

Usage:
    controller = PIDController(joint_name='left_hip_pitch', Kp=1.0, Ki=0.1, Kd=0.5)
    ros2 launch: ros2 run package pid_controller.py

Real-world context:
    - Every joint in a humanoid robot uses a PID controller
    - Lower-level motor drivers implement position/torque PID
    - Higher-level task control specifies desired joint angles
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
from sensor_msgs.msg import JointState
import time
import math


class PIDController(Node):
    """Simple PID controller for a single robot joint"""

    def __init__(self, joint_name='test_joint', Kp=1.0, Ki=0.1, Kd=0.5):
        super().__init__('pid_controller')

        # Joint and controller name
        self.joint_name = joint_name
        self.get_logger().info(f'Initializing PID controller for {joint_name}')
        self.get_logger().info(f'Gains: Kp={Kp}, Ki={Ki}, Kd={Kd}')

        # PID gains
        self.Kp = Kp  # Proportional gain
        self.Ki = Ki  # Integral gain
        self.Kd = Kd  # Derivative gain

        # State tracking
        self.current_position = 0.0
        self.current_velocity = 0.0
        self.desired_position = 0.0
        self.desired_velocity = 0.0

        # Error history for integral and derivative terms
        self.integral_error = 0.0
        self.previous_error = 0.0
        self.previous_time = time.time()

        # Performance tracking
        self.max_error = 0.0
        self.control_steps = 0

        # Publishers and subscribers
        self.joint_cmd_pub = self.create_publisher(
            Float64, f'/{joint_name}/command', 10
        )
        self.joint_state_sub = self.create_subscription(
            JointState, '/joint_states', self.state_callback, 10
        )

        # Control loop at 100Hz (0.01 second timestep)
        self.dt = 0.01
        self.timer = self.create_timer(self.dt, self.control_loop)

    def state_callback(self, msg):
        """Update current joint state from sensor feedback"""
        try:
            # Find our joint in the message
            idx = msg.name.index(self.joint_name)
            self.current_position = msg.position[idx]
            self.current_velocity = msg.velocity[idx]
        except ValueError:
            self.get_logger().warn(
                f'Joint {self.joint_name} not found in joint states'
            )

    def control_loop(self):
        """Execute the PID control law"""

        # Calculate position error
        error = self.desired_position - self.current_position

        # Update maximum error (for diagnostics)
        if abs(error) > self.max_error:
            self.max_error = abs(error)

        # ===== PROPORTIONAL TERM =====
        p_term = self.Kp * error

        # ===== INTEGRAL TERM =====
        # Accumulate error over time
        self.integral_error += error * self.dt
        # Limit integral windup (prevent unbounded accumulation)
        integral_limit = 1.0
        self.integral_error = max(-integral_limit, min(integral_limit, self.integral_error))
        i_term = self.Ki * self.integral_error

        # ===== DERIVATIVE TERM =====
        # Rate of change of error
        current_time = time.time()
        dt = current_time - self.previous_time

        if dt > 0:
            derivative_error = (error - self.previous_error) / dt
        else:
            derivative_error = 0.0

        d_term = self.Kd * derivative_error

        # ===== COMBINED OUTPUT =====
        output = p_term + i_term + d_term

        # Limit output torque (safety constraint)
        max_torque = 100.0  # NÅm
        output = max(-max_torque, min(max_torque, output))

        # Publish command
        cmd = Float64()
        cmd.data = output
        self.joint_cmd_pub.publish(cmd)

        # Log diagnostics periodically
        self.control_steps += 1
        if self.control_steps % 100 == 0:  # Every 1 second at 100Hz
            self.get_logger().info(
                f'Error: {error:.4f} rad | '
                f'P={p_term:.2f} I={i_term:.2f} D={d_term:.2f} | '
                f'Output: {output:.2f} NÅm'
            )

        # Update for next iteration
        self.previous_error = error
        self.previous_time = current_time

    def set_target_position(self, target_position):
        """Set desired joint position (external command)"""
        self.desired_position = target_position
        self.get_logger().info(f'Target position set to {target_position:.4f} rad')


def main(args=None):
    rclpy.init(args=args)

    # Create PID controller with tuned gains
    # These gains are example values - real robots require tuning!
    controller = PIDController(
        joint_name='left_hip_pitch',
        Kp=2.0,    # Strong proportional response
        Ki=0.1,    # Slow integral correction
        Kd=0.5     # Moderate damping
    )

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        controller.get_logger().info('Shutting down PID controller')
    finally:
        controller.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
