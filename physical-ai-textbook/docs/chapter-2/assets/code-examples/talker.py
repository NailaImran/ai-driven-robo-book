#!/usr/bin/env python3
"""
ROS 2 Talker Node (Publisher Example)

This node publishes String messages to the '/chatter' topic at 10Hz.

Implementation: T025 (Phase 3: User Story 1)

Usage:
    ros2 run <package_name> talker
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class TalkerNode(Node):
    def __init__(self):
        super().__init__('talker')

        # Create publisher: topic='/chatter', message type=String, queue size=10
        self.publisher = self.create_publisher(String, '/chatter', 10)

        # Create timer: 10Hz (0.1 seconds)
        self.timer = self.create_timer(0.1, self.timer_callback)

        # Message counter
        self.counter = 0

        self.get_logger().info('Talker node started')

    def timer_callback(self):
        """Publish a message every timer tick"""
        msg = String()
        msg.data = f'Hello World: {self.counter}'

        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')

        self.counter += 1


def main(args=None):
    # Initialize ROS 2 Python client library
    rclpy.init(args=args)

    # Create node instance
    node = TalkerNode()

    try:
        # Spin node (process callbacks)
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        # Clean shutdown
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
