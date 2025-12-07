---
id: lesson-2-4-deployment
title: Lesson 2.4 - Sim-to-Real Deployment Pipeline
sidebar_position: 4
keywords: [deployment, jetson, edge-computing, ros2-control]
---

# Lesson 2.4: Sim-to-Real Deployment Pipeline

**Reading Time**: 35 minutes | **Coding Time**: 90 minutes

## Learning Objectives

By the end of this lesson, you will be able to:
- Structure ROS 2 packages for production deployment
- Cross-compile code for edge devices (Jetson, ARM boards)
- Monitor performance and resource usage in real-time
- Handle hardware constraints and deployment challenges
- Deploy and manage robots in the field

## Prerequisites

- Lesson 2.1-2.3 completed
- Understanding of ROS 2 concepts (nodes, topics, services)
- Basic Linux system administration
- Optional: Physical Jetson Orin Nano or Raspberry Pi 4

---

## Introduction: From Simulation to Real Hardware

You've built a humanoid walking algorithm in Gazebo simulation. Now what?

**The sim-to-real gap** is one of the biggest challenges in robotics:
- Simulation runs in ideal conditions (perfect physics, no latency)
- Real hardware has **constraints**: limited CPU, battery, noisy sensors, network delays
- Your code needs to adapt from 64-core development PC to **4-core Jetson Orin Nano**

This lesson teaches **production deployment**—the bridge between research and real robots.

### Real-World Context

**Boston Dynamics Atlas**:
- 150+ CPU cores across distributed computers
- Real-time OS (QNX Neutrino) for control loops
- Multiple redundant systems for safety

**Tesla Optimus** (Humanoid):
- Deployed on NVIDIA Jetson Orin systems
- Runs computer vision, planning, and control on-device
- Battery powered (limited compute budget)

**Mobile ALOBOT** (Research):
- Jetson Xavier NX board
- Custom ROS 2 packages for all subsystems
- On-device logging to microSD card

---

## Part 1: ROS 2 Package Structure for Production

A production ROS 2 package needs:
- **Clear organization**: src/, launch/, config/, etc.
- **Documentation**: READMEs, examples, troubleshooting
- **Configuration files**: Not hardcoded parameters
- **Safety mechanisms**: Emergency stops, watchdogs
- **Health monitoring**: Logging, diagnostics

### Standard Package Layout

```
my_robot_pkg/
├── CMakeLists.txt                    # Build configuration
├── package.xml                       # Package metadata
├── README.md                         # Documentation
├── setup.py                          # Python packaging
├── launch/
│   ├── robot_core.launch.py         # Main launch file
│   ├── simulation.launch.py          # Sim version
│   └── hardware.launch.py            # Hardware version
├── config/
│   ├── robot_config.yaml            # Robot parameters
│   ├── joint_limits.yaml            # Safety limits
│   └── qos_profiles.yaml            # QoS settings
├── src/
│   ├── arm_driver.cpp               # Hardware drivers
│   ├── gait_controller.cpp          # Main control loop
│   └── safety_monitor.cpp           # Watchdog
├── src/my_robot/                    # Python modules
│   ├── __init__.py
│   ├── config.py                    # Configuration loader
│   └── utils.py                     # Utilities
├── test/
│   ├── test_arm_driver.cpp
│   └── test_gait_controller.cpp
└── COLCON_IGNORE                    # Disable if needed
```

### key files:

#### package.xml (Metadata)

```xml
<?xml version="1.0"?>
<package format="3">
  <name>my_robot</name>
  <version>1.0.0</version>
  <description>Humanoid robot core control</description>
  <maintainer email="author@example.com">Author Name</maintainer>
  <license>Apache-2.0</license>

  <!-- Build dependencies -->
  <buildtool_depend>ament_cmake</buildtool_depend>
  <build_depend>rclcpp</build_depend>
  <build_depend>std_msgs</build_depend>
  <exec_depend>rclcpp</exec_depend>
  <exec_depend>ros2launch</exec_depend>

  <export>
    <build_type>ament_cmake</build_type>
  </export>
</package>
```

#### Launch File (Python)

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration

def generate_launch_description():
    # Arguments for easy configuration
    robot_name = LaunchConfiguration('robot_name', default='my_robot')
    sim_mode = LaunchConfiguration('sim_mode', default='false')

    return LaunchDescription([
        DeclareLaunchArgument('robot_name', default_value='my_robot'),
        DeclareLaunchArgument('sim_mode', default_value='false'),

        # Gait controller node
        Node(
            package='my_robot',
            executable='gait_controller',
            name='gait_controller',
            parameters=[
                {'sim_mode': sim_mode},
                {'robot_name': robot_name}
            ],
            remappings=[
                ('/cmd_vel', '/teleop/cmd_vel')
            ]
        ),

        # Safety monitor (always on)
        Node(
            package='my_robot',
            executable='safety_monitor',
            name='safety_monitor',
            parameters=[
                {'max_pitch': 0.35},
                {'max_roll': 0.30},
                {'timeout_seconds': 1.0}
            ]
        ),
    ])
```

---

## Part 2: Cross-Compilation for Edge Hardware

### Why Cross-Compile?

**Development Machine**: Ubuntu 22.04 on x86_64 (Intel/AMD)
**Target Hardware**: Jetson Orin Nano (ARM64)

Compiling on Jetson directly is **slow** (30+ minutes for ROS packages). Cross-compilation compiles on your PC for the Jetson architecture in minutes.

### Setting Up Cross-Compilation

#### 1. Install ARM toolchain

```bash
# On your development PC
sudo apt install gcc-aarch64-linux-gnu g++-aarch64-linux-gnu \
                 cmake pkgconfig-aarch64-linux-gnu
```

#### 2. Create ROS 2 ARM sysroot

```bash
# Download Jetson JetPack 5.x (contains ROS 2 libraries)
# Extract to ~/jetpack_sysroot

# Set environment for cross-compilation
export COLCON_CMAKE_ARGS="\
  -DCMAKE_SYSTEM_NAME=Linux \
  -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
  -DCMAKE_C_COMPILER=aarch64-linux-gnu-gcc \
  -DCMAKE_CXX_COMPILER=aarch64-linux-gnu-g++ \
  -DCMAKE_SYSROOT=/home/user/jetpack_sysroot"
```

#### 3. Cross-compile your packages

```bash
colcon build \
  --cmake-args -DCMAKE_SYSTEM_NAME=Linux \
    -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
    -DCMAKE_C_COMPILER=aarch64-linux-gnu-gcc
```

#### 4. Transfer to robot

```bash
# Copy compiled packages to Jetson
rsync -avz ./install/ jetson_user@robot_ip:/opt/ros2_ws/install/

# On Jetson: source environment
source /opt/ros2_ws/install/setup.bash

# Run your nodes!
ros2 launch my_robot robot_core.launch.py
```

### Real-Time Performance on Jetson

**Jetson Orin Nano specs**:
- 8-core ARM CPU @ 2.1 GHz
- 8 GB LPDDR5 RAM
- No real-time kernel by default

**Performance optimization**:

1. **CPU frequency scaling** (never let it throttle):
```bash
# Set max frequency
sudo bash -c 'echo 2100000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq'
```

2. **GPU/CPU power allocation** (if needed):
```bash
# Use maximum power mode
sudo nvpmodel -m 0  # 25W mode
```

3. **Threading strategy**:
```cpp
// Bind control threads to specific cores
pthread_t tid;
cpu_set_t cpuset;
CPU_ZERO(&cpuset);
CPU_SET(0, &cpuset);  // Core 0
pthread_setaffinity_np(tid, sizeof(cpu_set_t), &cpuset);
```

---

## Part 3: Real-Time Monitoring & Diagnostics

### System Resource Monitoring

```bash
# Real-time system stats on Jetson
jtop  # Interactive (install: pip3 install jetson-stats)

# Or native Linux tools
htop              # CPU/Memory
nvtop             # GPU/Memory (Jetson specific)
iostat -x 1       # Disk I/O
```

### ROS 2 Diagnostics Aggregator

```cpp
#include <diagnostic_aggregator/aggregator.hpp>

// In your node...
diagnostic_updater::Updater diagnostics(this);
diagnostics.setHardwareID("robot_gait_controller");

diagnostics.add("Gait Status", [this](diagnostic_updater::DiagnosticStatusWrapper &stat) {
    stat.summary(diagnostic_msgs::msg::DiagnosticStatus::OK, "Running smoothly");
    stat.add("Stride Length", current_stride);
    stat.add("Cadence", walking_frequency);
    stat.add("CPU Load", cpu_usage);
});

diagnostics.update();  // Call in control loop
```

### Network Monitoring

```bash
# Monitor ROS 2 network traffic
ros2 topic hz /camera/image_raw  # Actual publish rate
ros2 topic bw /camera/image_raw  # Bandwidth

# UDP performance (DDS default)
iperf3 -s  # On Jetson (server)
iperf3 -c jetson_ip -u -b 100M  # On PC (client)
```

---

## Part 4: Safety & Emergency Stop

### Hardware Kill Switch

```cpp
class SafetyMonitor : public rclcpp::Node {
private:
    rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr gpio_sub_;
    rclcpp::TimerBase::SharedPtr watchdog_timer_;
    std::atomic<bool> is_alive_{true};
    rclcpp::Time last_heartbeat_;

public:
    SafetyMonitor() : Node("safety_monitor") {
        // Subscribe to GPIO for physical kill switch
        gpio_sub_ = create_subscription<std_msgs::msg::Bool>(
            "/hardware/kill_switch", 10,
            [this](const std_msgs::msg::Bool &msg) {
                if (msg.data) {
                    RCLCPP_FATAL(get_logger(), "KILL SWITCH ACTIVATED!");
                    emergency_stop();
                }
            }
        );

        // Watchdog timer - ensure main controller sends heartbeats
        watchdog_timer_ = create_wall_timer(
            std::chrono::milliseconds(100),
            [this]() { check_watchdog(); }
        );
    }

    void check_watchdog() {
        auto now = this->get_clock()->now();
        auto elapsed = (now - last_heartbeat_).seconds();

        if (elapsed > 1.0) {  // 1 second timeout
            RCLCPP_WARN(get_logger(), "WATCHDOG TIMEOUT! Controller not responding");
            emergency_stop();
        }
    }

    void emergency_stop() {
        // Stop all motors
        std_msgs::msg::Float64 zero_cmd;
        zero_cmd.data = 0.0;

        // Publish zero torque to all joints
        for (const auto &joint : joint_names_) {
            joint_pub_map_[joint]->publish(zero_cmd);
        }

        // Trigger hardware relay
        std_msgs::msg::Bool relay_cmd;
        relay_cmd.data = false;  // Cut power
        hardware_relay_pub_->publish(relay_cmd);

        is_alive_ = false;
    }
};
```

### Graceful Shutdown

```bash
# In launch file or manually:
# Ctrl+C sends SIGTERM to all nodes
# ROS 2 has 5-10 second graceful shutdown period

# Force kill if needed:
pkill -9 -f ros2  # ONLY if necessary
```

---

## Summary

You've learned:
- ✅ **Package structure**: Organize code for production
- ✅ **Cross-compilation**: Compile for edge devices efficiently
- ✅ **Real-time optimization**: Tune Jetson performance
- ✅ **Monitoring**: Diagnose problems in the field
- ✅ **Safety**: Implement kill switches and watchdogs

**Next Steps**:
- Deploy your humanoid walker to physical hardware
- Monitor real-world performance vs. simulation
- Iterate on control algorithms based on actual robot behavior
- Continue to Capstone Project (Chapter 3)

---

**Interactive Component**: Below you'll find the **Deployment Dashboard**—a monitoring interface showing system health, resource usage, and network status for a deployed robot.

<!-- DeploymentDashboard component will be embedded here during implementation -->
