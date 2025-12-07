---
id: lab-setup-guide
title: 1.4 Lab Setup Guide
sidebar_position: 5
keywords: [lab-setup, ros2, jetson, cloud, cost-analysis, safety, workspace, installation]
---

import { Lesson14 } from '@site/src/components/chapter-1/Lesson14Wrapper';

<Lesson14 />

# 1.4 Lab Setup Guide

You've learned what Physical AI is, why embodiment matters, and what hardware components exist. Now comes the practical question: **How do I set up my own lab to start building robots?**

This section guides you through four setup options, from cloud-only (zero upfront cost) to full on-premise ($5k investment), helping you choose based on your budget, timeline, and goals.

## Setup Option 1: On-Premise Physical Lab

**Best for**: Serious hobbyists, research labs, small teams building physical prototypes

**Total Cost**: $4,850 CapEx + $35/month OpEx

### Hardware Breakdown

**Compute Stack**:
- **NVIDIA Jetson Orin Nano** ($499): Edge AI for real-time inference (YOLO, depth estimation, control)
- **Development Workstation** ($1,200 used): Ryzen 7 / Core i7, 32GB RAM
- **NVIDIA RTX 4070 Ti** ($799): Training models, running Isaac Sim, developing algorithms

**Sensors**:
- **Intel RealSense D435** ($179): RGB-D camera for manipulation tasks
- **Bosch BNO055 IMU** ($35): 9-axis sensor fusion for balance/odometry

**Actuators**:
- **12× Dynamixel XL430-W250** ($600 total): Smart servos for 6-DOF arm + gripper
- **Robotis OpenManipulator-X Kit** ($899): Complete arm with mounting + control board

**Infrastructure**:
- **Power Supply (24V 10A)** ($80): Stable power for servos
- **Safety Equipment** ($150): Emergency stop button, safety mat, signage
- **Workbench & Cable Management** ($250): Dedicated workspace, organizers
- **Monitor, Keyboard, Mouse** ($200): Peripherals for workstation
- **Miscellaneous** ($200): USB cables, mounts, breadboards, tools

### Monthly Operating Costs

- **Electricity**: $20/month (5 hours/day usage @ $0.12/kWh)
  - Workstation (300W) + Jetson (15W) + Monitors (40W) = 355W
  - 355W × 5 hrs/day × 30 days × $0.12/kWh = $19.11
- **Cloud Storage/Backups**: $10/month (Google Drive, AWS S3)
- **Consumables**: $5/month (screws, zip ties, adhesives)

### Advantages

1. **No Latency**: Develop and test locally, immediate feedback
2. **Offline Capable**: Works without internet (useful for field deployments)
3. **Full Control**: Customize hardware, swap components, root access
4. **Long-term Cost**: After 14 months, cheaper than cloud-only approach

### Disadvantages

1. **High Upfront**: $4,850 is a significant barrier for students
2. **Maintenance**: Hardware failures, cable management, dust/wear
3. **Limited Parallelism**: Can't run 1,000 simulations simultaneously like cloud
4. **Space Requirements**: Needs dedicated ~2m² workspace

<div class="hardware-corner">

### 🔧 Hardware Corner: Incremental Build Strategy

Don't buy everything at once! Start minimal, expand as you learn:

**Phase 1 ($1,200)**: Workstation + Jetson + RealSense
- **What you can do**: Train vision models, run Gazebo simulation, develop ROS 2 code
- **Limitation**: No physical robot yet

**Phase 2 ($1,900)**: Add 6 servos + frame
- **What you can do**: Build 3-DOF arm, learn inverse kinematics, practice manipulation
- **Limitation**: Limited degrees of freedom

**Phase 3 ($2,500)**: Add 6 more servos + gripper
- **What you can do**: Full 6-DOF arm + 2-DOF gripper, complex pick-and-place tasks

**Phase 4 ($4,850)**: Add safety equipment, IMU, professional setup
- **What you can do**: Safe human-robot interaction, full physical AI stack

</div>

## Setup Option 2: Cloud-Native (Simulation-First)

**Best for**: Algorithm researchers, students without physical hardware access, remote teams

**Total Cost**: $750 CapEx + $195/month OpEx

### Minimal Hardware

- **Jetson Orin Nano** ($499): For final deployment testing only
- **Intel RealSense D435** ($179): Collect real-world sensor data for sim calibration
- **Laptop** ($0, assumed existing): i5/i7 CPU, 16GB RAM, web browser

### Cloud Services (Monthly)

**Compute**:
- **AWS EC2 g5.2xlarge** ($48/month): NVIDIA A10G GPU for training
  - $1.21/hour × 40 hours/month
  - Use spot instances to cut costs 60-70%

**Simulation**:
- **NVIDIA Omniverse Cloud** ($100/month): Isaac Sim subscription
  - Photorealistic robot simulation
  - Multi-GPU scaling for 10,000+ parallel envs
  - Integrated with ROS 2

**Storage & Misc**:
- **AWS S3** ($20/month): Datasets, model checkpoints, logs
- **Data Transfer** ($15/month): Download trained models, upload datasets
- **Misc Services** ($12/month): Lambda functions, CloudWatch monitoring

### Workflow

1. **Develop in Simulation**: Train policies in Isaac Sim using thousands of randomized scenarios
2. **Validate on Desktop**: Test in local Gazebo sim before cloud deployment
3. **Deploy to Jetson**: Transfer trained model, test on real hardware
4. **Iterate**: Collect failure cases, retrain in cloud, redeploy

### Advantages

1. **Low Upfront Cost**: $750 vs $4,850 on-premise
2. **Infinite Scale**: Run 10,000 parallel simulations for reinforcement learning
3. **Latest Hardware**: Access to A100/H100 GPUs without $10k-40k purchase
4. **Collaboration**: Team members worldwide can access same cloud environment

### Disadvantages

1. **Recurring Costs**: $195/month = $2,340/year (exceeds on-premise after 2 years)
2. **Latency**: 50-200ms round-trip to cloud (can't close real-time control loop)
3. **Internet Dependency**: No offline development
4. **Vendor Lock-in**: Isaac Sim tied to NVIDIA Omniverse ecosystem

## Setup Option 3: Hybrid (Best of Both Worlds)

**Best for**: Serious learners with moderate budget, teams wanting local dev + cloud bursts

**Total Cost**: $2,100 CapEx + $90/month OpEx

### Hardware

- **NVIDIA Jetson Orin Nano** ($499)
- **Intel RealSense D435** ($179)
- **Bosch BNO055 IMU** ($35)
- **6× Dynamixel XL430-W250** ($300): Start with simple 3-DOF arm
- **Desktop PC (DIY build)** ($800): Ryzen 5 / Core i5, 16GB RAM, integrated graphics
- **Monitor & Peripherals** ($150)
- **Power & Safety** ($150)

### Strategy

**Local Development** (90% of time):
- Iterate in Gazebo on desktop PC
- Train small models locally (TensorFlow/PyTorch on CPU)
- Debug ROS 2 nodes, test sensor integration

**Cloud Bursts** (10% of time):
- Large-scale training: rent g5.2xlarge for 20 hours/month ($40)
- Photorealistic sim: Omniverse Cloud pay-as-you-go ($25/month)
- Storage: $10/month S3

**Monthly OpEx**: $25 electricity + $40 cloud training + $25 Omniverse = $90

### Advantages

1. **Balanced Cost**: Initial $2,100, then $90/month
2. **Local Iteration**: Fast feedback loop for debugging
3. **Cloud Acceleration**: Burst to cloud for heavy jobs
4. **Upgrade Path**: Add more servos/sensors as budget allows

### Disadvantages

1. **Context Switching**: Managing local and cloud environments
2. **Sync Overhead**: Upload/download datasets, models, code
3. **Still Moderate Upfront**: $2,100 isn't trivial for students

## Setup Option 4: Economy Student Kit

**Best for**: Absolute beginners, students with &lt;$700 budget, learning fundamentals

**Total Cost**: $680 CapEx + $15/month OpEx

### Hardware

- **Raspberry Pi 5 (8GB)** ($80): Main compute
- **Google Coral Edge TPU** ($59): AI acceleration (TensorFlow Lite)
- **Pi Camera Module v3** ($25): Vision sensor
- **MPU6050 IMU** ($8): 6-axis accelerometer + gyro
- **8× SG90 Hobby Servos** ($24): 0.18 Nm torque (weak but functional)
- **Arduino Uno** ($25): Servo control bridge
- **Power Supply + Battery** ($30): 5V for Pi, 6V for servos
- **Chassis/Frame** ($50): 3D printed or laser-cut acrylic
- **SD Card, Cables, Breadboard** ($40)
- **Basic Safety** ($50): Kill switch, workspace boundaries

**Alternative**: **MyCobot 280 Edu Bundle** ($699) - turnkey system with Pi 4 + 6 servos + software

### Limitations

- **Low Torque**: Hobby servos can't lift heavy objects
- **No Force Sensing**: Can't detect contact/collisions
- **Limited Vision**: Pi Camera adequate for learning, not production
- **Slow Compute**: Pi 5 runs ROS 2 but struggles with real-time vision

### What You CAN Learn

- ROS 2 fundamentals (publishers, subscribers, services, actions)
- Computer vision basics (OpenCV, object detection with Coral TPU)
- Control algorithms (PID, state machines, trajectory planning)
- Simulation (Gazebo on laptop, not on Pi)

### Upgrade Path

1. **Phase 1 ($680)**: Learn with hobby servos
2. **Phase 2 ($980)**: Replace 6 hobby servos with Dynamixel XL430 ($300)
3. **Phase 3 ($1,479)**: Add Jetson Orin Nano ($499) for AI acceleration
4. **Phase 4 ($1,658)**: Add RealSense D435 ($179) for depth sensing

Over 1-2 years, you've built a capable system for &lt;$1,700 total.

## Cost Analysis: CapEx vs OpEx

Let's compare break-even points:

**Scenario 1: 1-Year Project**
- **On-Premise**: $4,850 + ($35 × 12) = $5,270
- **Cloud**: $750 + ($195 × 12) = $3,090
- **Winner**: Cloud ($2,180 savings)

**Scenario 2: 2-Year Project**
- **On-Premise**: $4,850 + ($35 × 24) = $5,690
- **Cloud**: $750 + ($195 × 24) = $5,430
- **Winner**: On-premise (but close)

**Scenario 3: 3-Year Project**
- **On-Premise**: $4,850 + ($35 × 36) = $6,110
- **Cloud**: $750 + ($195 × 36) = $7,770
- **Winner**: On-premise ($1,660 savings)

**Break-even point**: 20-22 months

**Conclusion**: If you're committed for 2+ years, on-premise wins. If experimenting &lt;1 year, cloud is cheaper.

<div class="hardware-corner">

### 🔧 Hardware Corner: Cloud vs On-Premise Decision Matrix

Choose **Cloud** if:
- ✅ Budget < $1,500 upfront
- ✅ Timeline < 1 year (exploratory project)
- ✅ Need massive parallelism (RL training with 10,000 envs)
- ✅ Remote team (distributed collaboration)
- ✅ No physical space for workspace

Choose **On-Premise** if:
- ✅ Budget allows $3k-5k upfront
- ✅ Timeline > 2 years (research degree, startup)
- ✅ Need real-time control (< 10ms latency)
- ✅ Offline operation required (field robotics, demos)
- ✅ Prefer ownership over renting

Choose **Hybrid** if:
- ✅ Budget moderate ($2k-3k)
- ✅ Want fast local iteration + occasional cloud bursts
- ✅ Learning with intent to scale later

</div>

## Safety Protocols

Physical AI systems can cause harm. **Safety is non-negotiable.**

### Hardware Safety

1. **Emergency Stop (E-Stop)**:
   - Big red mushroom button within 1-second reach
   - Hard-wired (not software-controlled) to cut actuator power
   - Test weekly: press E-Stop, verify robot freezes instantly

2. **Workspace Boundaries**:
   - Mark floor with tape/barriers (2m radius around robot)
   - "ROBOT OPERATIONAL" sign when powered
   - Never enter workspace while robot moving

3. **Force Limits**:
   - Program maximum joint torques in software (e.g., Dynamixel: 50% max)
   - Use force/torque sensors for impedance control (expensive but safer)
   - Collision detection: if current spikes, stop immediately

4. **Power Management**:
   - Separate power supplies for compute (Jetson) and actuators (servos)
   - Servo power should be killable without rebooting computer
   - Fuses on power rails to prevent fire from short circuits

### Software Safety

1. **Watchdog Timers**:
   ```python
   # If control loop doesn't update within 100ms, assume crash and stop robot
   rclpy.create_timer(0.1, watchdog_callback)
   ```

2. **Velocity Limits**:
   - Cap maximum joint velocity (e.g., 30°/s for arms near humans)
   - Smooth acceleration (no jerky starts/stops)

3. **Sanity Checks**:
   - Verify sensor readings (e.g., IMU detecting 50 m/s² acceleration = sensor failure)
   - Check actuator feedback (commanded 90°, encoder reads 10° = broken joint)

### Environmental Safety

- **Floor Protection**: Rubber mat to catch dropped objects
- **Fire Extinguisher**: Class C (electrical fires) within reach
- **First Aid Kit**: For minor cuts from sharp edges
- **Ventilation**: Servos/batteries can produce ozone smell, ensure airflow

## Hands-On: ROS 2 Environment Setup

Ready to install ROS 2 Humble on Ubuntu 22.04? We've created a comprehensive setup script.

### Running the Script

```bash
# Download the script
cd ~/Downloads
wget https://your-textbook-url.com/environment_setup.sh

# Make it executable
chmod +x environment_setup.sh

# Run it (takes 15-30 minutes)
./environment_setup.sh
```

**What the script does**:
1. Adds ROS 2 apt repository
2. Installs ROS 2 Humble Desktop (includes RViz, demos)
3. Installs colcon (build tool) and rosdep (dependency manager)
4. Creates `~/ros2_ws` workspace
5. Builds a hello-world publisher node
6. Configures `.bashrc` with ROS 2 environment

### Verification

After script completes, open a **new terminal** and run:

```bash
# Check ROS 2 version
ros2 --version
# Expected: ros2 doctor 0.10.x

# Test hello-world publisher
ros2 run hello_physical_ai talker
# Expected: Publishing: "Hello Physical AI! Count: 0"
```

**Troubleshooting**:
- **Error: ros2: command not found**
  - Solution: Run `source ~/.bashrc` or open new terminal
- **Error: Package 'hello_physical_ai' not found**
  - Solution: `cd ~/ros2_ws && colcon build && source install/setup.bash`

## Lab Setup Verification Checklist

Before considering your lab "ready," verify:

- [ ] **ROS 2 Installed**: `ros2 --version` shows Humble
- [ ] **Workspace Built**: `~/ros2_ws` exists and compiles without errors
- [ ] **Hello-world Works**: Can run `ros2 run hello_physical_ai talker`
- [ ] **Sensors Tested**: Camera/LiDAR/IMU detected by OS (run `lsusb`)
- [ ] **Actuators Calibrated**: Servos respond to test commands
- [ ] **Emergency Stop Works**: Press E-Stop, robot freezes immediately
- [ ] **Safety Equipment Ready**: Fire extinguisher, first aid kit, workspace boundaries
- [ ] **Simulation Running**: Gazebo or Isaac Sim launches successfully
- [ ] **Internet Stable**: If using cloud, test upload/download speed (>10 Mbps)
- [ ] **Backup System**: Code + data backed up (GitHub + cloud storage)

**If all checked**: ✅ Your lab is operational! Proceed to Chapter 2.

**If any unchecked**: ⚠️ Address blockers before starting robot development.

## Key Takeaways

- **Four setup options** exist: On-Premise ($4,850), Cloud ($750 + $195/mo), Hybrid ($2,100 + $90/mo), Student ($680)
- **Break-even point** for on-premise vs cloud: 20-22 months
- **Incremental approach** reduces risk: start minimal, expand as you learn
- **Safety is critical**: E-Stop, workspace boundaries, force limits, watchdog timers
- **ROS 2 Humble** is the foundation - spend time learning it deeply

## Chapter Conclusion

Congratulations! You've completed Chapter 1: Foundations of Physical AI & Embodied Intelligence.

**You now know**:
- ✅ What Physical AI is and how it differs from digital AI (Section 1.1)
- ✅ Why embodiment matters and how robots ground intelligence in physics (Section 1.2)
- ✅ The hardware landscape: sensors, actuators, compute, and communication (Section 1.3)
- ✅ How to set up your own Physical AI lab (Section 1.4)

**You've built**:
- ✅ Physics simulation code (pendulum dynamics)
- ✅ Sensor fusion demo (complementary filter for IMU)
- ✅ ROS 2 workspace with hello-world publisher

**Next in Chapter 2**: We'll dive deep into **ROS 2 architecture**, **control theory** (PID, MPC), and **manipulation** (inverse kinematics, motion planning). You'll build a pick-and-place system and learn how to control multi-DOF arms.

[Proceed to Chapter 2: The Robotic Nervous System (ROS 2 & Control Theory) →](../chapter-2/index.md)

## References

1. NVIDIA. (2024). "Jetson Orin Modules Pricing". [https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/)
2. AWS. (2024). "EC2 GPU Instance Pricing". [https://aws.amazon.com/ec2/instance-types/g5/](https://aws.amazon.com/ec2/instance-types/g5/)
3. NVIDIA. (2024). "Omniverse Cloud Pricing". [https://www.nvidia.com/en-us/omniverse/cloud/](https://www.nvidia.com/en-us/omniverse/cloud/)
4. Open Robotics. (2024). "ROS 2 Humble Installation". [https://docs.ros.org/en/humble/Installation.html](https://docs.ros.org/en/humble/Installation.html)
5. Robotis. (2024). "Dynamixel Actuator Selection Guide". [https://emanual.robotis.com/](https://emanual.robotis.com/)
6. Intel. (2023). "RealSense SDK Installation Guide". [https://github.com/IntelRealSense/librealsense](https://github.com/IntelRealSense/librealsense)
