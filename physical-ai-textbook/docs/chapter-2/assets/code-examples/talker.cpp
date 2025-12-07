/**
 * ROS 2 Talker Node (Publisher Example) - C++ Version
 *
 * This node publishes String messages to the '/chatter' topic at 10Hz.
 *
 * Implementation: T027 (Phase 3: User Story 1)
 *
 * Usage:
 *     ros2 run <package_name> talker_cpp
 *
 * Compilation (CMakeLists.txt):
 *     find_package(rclcpp REQUIRED)
 *     find_package(std_msgs REQUIRED)
 *     add_executable(talker_cpp src/talker.cpp)
 *     ament_target_dependencies(talker_cpp rclcpp std_msgs)
 */

#include <chrono>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

class TalkerNode : public rclcpp::Node
{
public:
    TalkerNode() : Node("talker"), counter_(0)
    {
        // Create publisher: topic='/chatter', queue size=10
        publisher_ = this->create_publisher<std_msgs::msg::String>("/chatter", 10);

        // Create timer: 10Hz (100ms)
        timer_ = this->create_wall_timer(
            100ms,
            std::bind(&TalkerNode::timer_callback, this)
        );

        RCLCPP_INFO(this->get_logger(), "Talker node started");
    }

private:
    void timer_callback()
    {
        auto message = std_msgs::msg::String();
        message.data = "Hello World: " + std::to_string(counter_);

        publisher_->publish(message);
        RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());

        counter_++;
    }

    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
    rclcpp::TimerBase::SharedPtr timer_;
    size_t counter_;
};

int main(int argc, char * argv[])
{
    // Initialize ROS 2 C++ client library
    rclcpp::init(argc, argv);

    // Create node instance
    auto node = std::make_shared<TalkerNode>();

    // Spin node (process callbacks)
    rclcpp::spin(node);

    // Clean shutdown
    rclcpp::shutdown();
    return 0;
}
