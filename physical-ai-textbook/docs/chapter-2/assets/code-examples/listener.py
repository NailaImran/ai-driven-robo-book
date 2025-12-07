#!/usr/bin/env python3
"""
ROS 2 Listener Node (Subscriber Example)

This node subscribes to String messages on the '/chatter' topic.

Implementation: T026 (Phase 3: User Story 1)

Usage:
    ros2 run <package_name> listener
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class ListenerNode(Node):
    def __init__(self):
        super().__init__('listener')

        # Create subscriber: topic='/chatter', message type=String, queue size=10
        self.subscription = self.create_subscription(
            String,
            '/chatter',
            self.listener_callback,
            10
        )

        self.get_logger().info('Listener node started')

    def listener_callback(self, msg):
        """Callback function executed when message is received"""
        self.get_logger().info(f'I heard: [{msg.data}]')


def main(args=None):
    # Initialize ROS 2 Python client library
    rclpy.init(args=args)

    # Create node instance
    node = ListenerNode()

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
