---
id: hardware-landscape
title: 1.3 Hardware Landscape Deep Dive
sidebar_position: 4
keywords: [sensors, actuators, compute, lidar, imu, ros2, jetson, hardware, robotics]
---

# 1.3 Hardware Landscape Deep Dive

Now that you understand **what** Physical AI is (Section 1.1) and **why** embodiment matters (Section 1.2), it's time to get hands-on with the **hardware** that makes it possible.

This section explores the four pillars of robotic hardware:
1. **Sensors** - How robots perceive the world
2. **Actuators** - How robots act on the world
3. **Compute** - Where AI algorithms run
4. **Communication** - How components talk to each other

By the end, you'll be able to design your own hardware configuration for a humanoid robot project.

## Sensor Systems: The Robot's Senses

Humans have five senses. Robots have dozens. Let's explore the key sensor categories and when to use each.

### 1. Vision Sensors

**RGB Cameras** - The most common sensor, providing color images like a smartphone camera.

**Use cases**: Object detection, face recognition, scene understanding, visual servoing
**Examples**: Logitech C920 ($70), Raspberry Pi Camera Module v3 ($25)
**Pros**: Cheap, high resolution, rich semantic information
**Cons**: Fails in low light, no depth information, computationally expensive to process

**Depth Cameras (RGB-D)** - Add a depth channel to RGB, measuring distance to each pixel.

**Technologies**:
- **Stereo**: Two cameras, compute depth via triangulation (like human eyes)
  - *Example*: Intel RealSense D435 ($179), ZED 2 ($449)
  - *Range*: 0.3m - 20m
  - *Pros*: Works outdoors, passive (no emitted light)
  - *Cons*: Fails on textureless surfaces (white walls), sensitive to lighting

- **Structured Light**: Projects infrared pattern, measures distortion
  - *Example*: Intel RealSense D415 ($149), Kinect v2 (discontinued)
  - *Range*: 0.2m - 3m
  - *Pros*: High accuracy, works on textureless surfaces
  - *Cons*: Fails in sunlight (IR washout), limited range

- **Time-of-Flight (ToF)**: Measures time for light pulse to return
  - *Example*: Azure Kinect ($399), PMD CamBoard ($500)
  - *Range*: 0.5m - 5m
  - *Pros*: Fast, works in any light
  - *Cons*: Lower resolution than stereo, multipath interference (reflections)

**LiDAR (Light Detection and Ranging)** - Spins a laser to create 3D point clouds.

**Types**:
- **2D LiDAR**: Single scanning plane (like a horizontal slice)
  - *Example*: Hokuyo UST-10LX ($1,500), Sick TiM ($1,000)
  - *Use*: Indoor navigation, obstacle avoidance
  - *Pros*: Accurate, fast, works in any light
  - *Cons*: Can't see above/below scan plane (misses overhangs, stairs)

- **3D LiDAR**: Multiple scan planes or solid-state scanning
  - *Example*: Velodyne Puck ($3,999), Ouster OS0-128 ($18,000), Livox Mid-70 ($599)
  - *Use*: Autonomous vehicles, outdoor navigation, 3D mapping
  - *Pros*: Long range (100m+), 360° coverage, millimeter accuracy
  - *Cons*: Expensive, large, heavy, high power consumption

<div class="hardware-corner">

### 🔧 Hardware Corner: Choosing Your Depth Sensor

**Budget < $200**: Intel RealSense D435 ($179) or OAK-D Lite ($149)
- **Why**: Best value, ROS 2 support, active community, indoor manipulation

**Outdoor Navigation**: Stereolabs ZED 2 ($449)
- **Why**: Passive stereo works in sunlight, includes IMU for odometry

**Precision Manipulation**: Azure Kinect ($399)
- **Why**: High depth accuracy, body tracking SDK, sync multiple units

**Autonomous Vehicle**: Ouster OS1-64 ($12,000) or cheaper: Livox Mid-70 ($599)
- **Why**: Automotive-grade, 120m range, real-time point cloud

**Tight Budget**: Use simulation! NVIDIA Isaac Sim provides free photorealistic depth/LiDAR simulation.

</div>

### 2. Inertial Measurement Units (IMUs)

IMUs measure **acceleration** and **rotation** - essential for balance and odometry.

**Components**:
- **Accelerometer**: Measures linear acceleration (m/s²) in 3 axes (X, Y, Z)
- **Gyroscope**: Measures angular velocity (deg/s or rad/s) around 3 axes
- **Magnetometer**: Measures magnetic field (optional, for compass heading)

**Common IMUs**:
- **Bosch BNO055** ($35): 9-axis (accel + gyro + mag), built-in sensor fusion
- **InvenSense MPU6050** ($5): 6-axis (accel + gyro), no fusion
- **VectorNav VN-100** ($500): High-precision, GPS integration, tactical-grade

**Use cases**:
- **Humanoid balance**: Detect when robot is falling, trigger stabilization
- **Drone flight control**: Stabilize attitude (roll, pitch, yaw)
- **Wheeled robot odometry**: Integrate acceleration for dead reckoning

**Challenge**: IMUs drift over time. Accelerometers are noisy (vibration). Gyroscopes accumulate integration error. Solution: **Sensor fusion** (we'll code this shortly!)

### 3. Force/Torque Sensors

Measure forces and torques at contact points - critical for manipulation and safe human-robot interaction.

**Types**:
- **6-axis F/T Sensors**: Measure 3 forces (Fx, Fy, Fz) + 3 torques (Tx, Ty, Tz)
  - *Example*: ATI Mini40 ($2,500), Robotiq FT 300 ($7,000)
  - *Mounted*: Between robot wrist and gripper
  - *Use*: Precision assembly (feel when parts mate), compliant grasping (avoid crushing objects)

- **Tactile Skins**: Distributed pressure sensors covering larger areas
  - *Example*: SynTouch BioTac ($3,000/finger), custom capacitive/resistive arrays
  - *Use*: Dexterous manipulation (feel object slip, adjust grip)

**Why it matters**: Without force sensing, robots must rely on position control alone - risky when contacting fragile objects or humans. With force feedback, robots can implement **impedance control** - behave like a spring/damper, safely interacting with uncertain environments.

### 4. Proprioceptive Sensors

**Proprioception** = sense of body position. For robots: joint encoders, current sensors, temperature sensors.

**Encoders**:
- **Incremental**: Count pulses as shaft rotates (common in servos)
- **Absolute**: Always know exact position, even after power loss (critical for multi-turn joints)

**Current Sensors**: Detect motor stall (blocked joint), predict torque output

**Temperature Sensors**: Prevent motor burnout from overheating

Modern smart servos (Dynamixel, Hebi) integrate all these into a single actuator with digital communication.

## Actuators: How Robots Move

If sensors are inputs, actuators are outputs. Let's compare the major types.

### 1. Electric Motors

**DC Brushed Motors** - Simple, cheap, but wear out (brushes degrade).
- *Use*: Toys, low-cost robots, wheels
- *Control*: PWM (Pulse Width Modulation) for speed
- *Pros*: Cheap ($5-$50), easy to control
- *Cons*: Limited lifespan, noisy, inefficient

**Brushless DC (BLDC) Motors** - More efficient, longer life, require electronic commutation.
- *Use*: Drones, high-performance robots, industrial automation
- *Control*: ESC (Electronic Speed Controller)
- *Pros*: High power density, long life, quiet
- *Cons*: More expensive, complex control

**Servo Motors** - Position-controlled motors with integrated encoder and control loop.
- **Hobby Servos**: $10-$50, 180° range, PWM control
  - *Use*: RC cars, beginner robots
  - *Limitation*: Low torque, limited feedback

- **Smart Servos (Dynamixel, Hebi, etc.)**: $50-$500, digital bus (RS485/TTL), full feedback
  - *Specs*: Torque 0.5-10+ Nm, position resolution 4096 steps/rev, velocity/current/temp feedback
  - *Use*: Research robots, humanoids, manipulation
  - *Pros*: Plug-and-play, daisy-chain 250+ servos on one bus, ROS 2 integration
  - *Cons*: Expensive at scale (humanoid = 20-40 servos × $100-300 = $2k-12k just for actuators)

**Comparison**:

| Actuator Type | Torque (example) | Speed | Precision | Cost | Use Case |
|---------------|------------------|-------|-----------|------|----------|
| DC Brushed | 0.1 Nm | 10,000 RPM | Low | $10 | Wheels, fans |
| BLDC | 0.5 Nm | 5,000 RPM | Medium | $50 | Drones, tools |
| Hobby Servo | 0.2 Nm | 60 RPM | Low | $15 | RC, simple arms |
| Smart Servo (XL430) | 1.5 Nm | 57 RPM | High | $50 | Education, arms |
| Smart Servo (XM540) | 10.6 Nm | 50 RPM | High | $299 | Humanoid legs |

### 2. Hydraulic Actuators

**How they work**: Pump pressurizes fluid, valve directs it to cylinders, creating linear force.

**Pros**:
- **Extreme power density**: Boston Dynamics Atlas legs (hydraulic) deliver 3+ kW per kg
- **High force**: Can lift 10-100x more than electric motors of same weight
- **Compliant**: Natural back-drivability (safety in human interaction)

**Cons**:
- **Complex**: Requires pump, reservoir, hoses, valves, seals
- **Maintenance**: Leaks, contamination, seal replacement
- **Noise**: Pump is loud (~70 dB)
- **Cost**: Actuator + pump + control = $5k-50k per DOF

**Use cases**: Heavy-duty humanoids (Atlas), industrial exoskeletons, construction robots

**Trend**: Industry moving away from hydraulics toward electric (Tesla Optimus is fully electric). Why? Easier maintenance, quieter, more precise control.

### 3. Pneumatic Actuators

Similar to hydraulics but use compressed air instead of fluid.

**Pros**:
- **Safe**: Air is compressible - natural compliance, won't crush on impact
- **Clean**: No fluid leaks
- **Fast**: Air flows quickly, enabling rapid motions

**Cons**:
- **Low precision**: Hard to control position (air compressibility causes springy behavior)
- **Requires compressor**: Noisy, bulky, energy-intensive

**Use cases**: Soft robotics (inflatable grippers), industrial pick-and-place, binary actuators (open/close)

### 4. Artificial Muscles

Emerging technology mimicking biological muscle.

**Types**:
- **Pneumatic Artificial Muscles (PAMs)**: Inflate to contract (like McKibben muscles)
- **Shape Memory Alloys (SMAs)**: Wires that contract when heated
- **Electroactive Polymers (EAPs)**: Change shape under electric field
- **Dielectric Elastomer Actuators (DEAs)**: Thin films that expand when voltage applied

**Pros**: High compliance, human-like motion, lightweight

**Cons**: Low efficiency, slow response, limited force, immature technology

**Status**: Research-stage. Not yet viable for general robotics (2025), but promising for biomimetic designs.

## Compute Platforms: Where AI Runs

AI algorithms are computationally expensive. Where should you run them?

### 1. Embedded Compute (On-Robot)

**NVIDIA Jetson Series** - Industry standard for edge AI.

| Model | TOPS (AI) | Power | VRAM | Price | Use Case |
|-------|-----------|-------|------|-------|----------|
| Jetson Orin Nano | 40 | 15W | 8GB | $499 | Education, prototyping |
| Jetson Orin NX | 100 | 25W | 16GB | $899 | Research robots |
| Jetson AGX Orin | 275 | 60W | 64GB | $1,999 | Production humanoids |

**Pros**:
- Run neural networks on-device (YOLO object detection @ 30fps, depth estimation, etc.)
- Low latency (no cloud round-trip)
- Works offline
- CUDA/cuDNN/TensorRT support

**Cons**:
- Limited compute vs desktop GPU
- Power/thermal constraints
- Price adds up (humanoid might need 2-3 Jetsons for redundancy)

**Google Coral Edge TPU** - Ultra-low-power AI accelerator.
- **Specs**: 4 TOPS, 2W, USB dongle form factor, $59
- **Framework**: TensorFlow Lite only
- **Use**: Lightweight inference (image classification, pose estimation) when battery life matters
- **Limitation**: No training, limited model support

**Raspberry Pi 5** - General-purpose compute, not AI-specialized.
- **Specs**: Quad-core ARM Cortex-A76, 8GB RAM, $80
- **Use**: Sensor interfacing, low-level control, ROS 2 nodes
- **Limitation**: Slow for neural networks (CPU-only), use for non-AI tasks

### 2. Desktop Workstation (Off-Robot Development)

**NVIDIA RTX 4070 Ti** - Mid-range desktop GPU for training and simulation.
- **Specs**: 12GB VRAM, 320 TOPS, $799
- **Use**: Train models locally, run Isaac Sim, develop before deploying to Jetson
- **Workflow**: Train on RTX 4070 Ti → export to TensorRT → deploy to Jetson

**Advantages of desktop dev**:
- Fast iteration (30fps Isaac Sim vs 5fps on Jetson)
- More RAM for large datasets
- Easier debugging (monitors, keyboard, full Linux desktop)

### 3. Cloud Compute (For Training)

**When to use cloud**:
- Training large models (GPT-scale) - local GPUs too slow
- Massive parallelism (run 1,000 simulations simultaneously)
- Cost optimization (rent A100 for 10 hours vs buy $10k+ local GPU)

**Services**:
- **AWS EC2 (g5.2xlarge)**: 1× NVIDIA A10G, $1.21/hour
- **Google Cloud (a2-highgpu-1g)**: 1× NVIDIA A100, $3.67/hour
- **NVIDIA Omniverse Cloud**: Isaac Sim subscription, $50-200/month

**Cons**: Latency (can't control robot in real-time from cloud), ongoing cost, requires internet

<div class="hardware-corner">

### 🔧 Hardware Corner: Compute Budget Tiers

**$500 - Student**: Jetson Orin Nano + Raspberry Pi 5
- **Workflow**: Develop on laptop, deploy to Jetson, use Pi for I/O

**$1,500 - Hobbyist**: Jetson Orin Nano + RTX 4070 Ti desktop
- **Workflow**: Train on RTX, deploy to Jetson, run Isaac Sim locally

**$5,000 - Professional**: Jetson AGX Orin + RTX 4090 desktop + cloud credits
- **Workflow**: Local dev + Jetson deployment + cloud for large-scale training

**$0 - Simulation Only**: Google Colab (free GPU) + NVIDIA Isaac Sim Cloud trial
- **Workflow**: Develop entirely in simulation before buying hardware

</div>

## Communication Protocols: The Nervous System

How do 50+ components (sensors, actuators, compute modules) talk to each other?

### 1. ROS 2 (Robot Operating System)

**Not** an operating system - it's a middleware framework for distributed robotics.

**Architecture**: Publish-subscribe model with DDS (Data Distribution Service) underneath.
- **Publishers**: Send messages on topics (e.g., `/camera/image`, `/joint_states`)
- **Subscribers**: Receive messages from topics
- **Nodes**: Independent processes (e.g., camera driver, path planner, controller)

**Example**:
```
Camera Node (publisher) ───> /camera/image topic ───> Object Detector Node (subscriber)
                                       │
                                       └───> Path Planner Node (subscriber)
```

**Why ROS 2**:
- Industry standard (Tesla, NASA, Amazon robotics use it)
- Huge package ecosystem (navigation, manipulation, perception, simulation)
- Language-agnostic (Python, C++, Rust support)
- Real-time capable (unlike ROS 1)
- Security (DDS-Security for encryption/authentication)

**Versions**:
- **ROS 2 Humble** (LTS until 2027) - recommended for production
- **ROS 2 Iron** (shorter support) - latest features

### 2. CAN Bus (Controller Area Network)

**Use**: Automotive-grade communication for safety-critical systems.

**Characteristics**:
- **Deterministic**: Guaranteed message delivery timing
- **Robust**: Works in electrically noisy environments (motors, high currents)
- **Priority-based**: High-priority messages preempt low-priority
- **Bus topology**: All devices on twisted-pair cable

**Bitrate**: 125 Kbps - 1 Mbps (slower than Ethernet, but ultra-reliable)

**Use cases**:
- Actuator networks (100+ servos on one CAN bus)
- Safety systems (emergency stop, collision detection)
- Automotive (every car has multiple CAN buses)

**Example**: Dynamixel servos support RS485 (similar to CAN) for daisy-chaining.

### 3. Ethernet / Wi-Fi

**When to use**:
- High-bandwidth sensors (cameras, LiDAR send megabytes/second)
- ROS 2 nodes distributed across multiple computers
- Remote teleoperation

**Standards**:
- **1 Gbps Ethernet**: Standard, wired, low latency (~1 ms)
- **10 Gbps Ethernet**: High-end cameras, LiDAR arrays
- **Wi-Fi 6**: Wireless, higher latency (~5-20 ms), subject to interference

**Limitation**: Not real-time deterministic (Ethernet packets can be delayed). Don't use for safety-critical control loops.

### 4. GPIO / I2C / SPI / UART (Low-Level)

**For**: Simple sensors (buttons, LEDs, basic IMUs)

- **GPIO** (General Purpose Input/Output): Digital on/off signals
- **I2C** (Inter-Integrated Circuit): 2-wire bus for slow sensors (IMUs, temperature)
- **SPI** (Serial Peripheral Interface): Fast 4-wire protocol (high-speed ADCs)
- **UART** (Serial): Asynchronous point-to-point (GPS modules, Bluetooth)

**Use**: Interfacing Arduino/Raspberry Pi with sensors, not for inter-computer communication.

## System Architecture: Putting It All Together

A complete humanoid robot system looks like this (simplified):

```
┌─────────────────────────────────────────────────────────────┐
│                     PERCEPTION LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Camera  │  │  LiDAR   │  │   IMU    │  │ F/T Sensor│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                          │                                  │
│                          ▼                                  │
│              ┌─────────────────────┐                        │
│              │   Sensor Fusion     │                        │
│              │   (Kalman Filter)   │                        │
│              └──────────┬──────────┘                        │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                     PLANNING LAYER                          │
│              ┌──────────┴──────────┐                        │
│              │  State Estimation   │                        │
│              │  (SLAM, Odometry)   │                        │
│              └──────────┬──────────┘                        │
│                         │                                    │
│              ┌──────────┴──────────┐                        │
│              │   Path Planning     │                        │
│              │   (A*, RRT, etc.)   │                        │
│              └──────────┬──────────┘                        │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                     CONTROL LAYER                           │
│              ┌──────────┴──────────┐                        │
│              │  Motion Controller  │                        │
│              │  (PID, MPC, etc.)   │                        │
│              └──────────┬──────────┘                        │
│                         │                                    │
│       ┌─────────────────┼─────────────────┐                │
│       │                 │                 │                │
│  ┌────┴────┐       ┌────┴────┐      ┌────┴────┐           │
│  │Servo 1-6│       │Servo 7-12│      │Servo13-20│          │
│  │ (Legs)  │       │  (Arms)  │      │ (Hands) │           │
│  └─────────┘       └──────────┘      └──────────┘           │
└─────────────────────────────────────────────────────────────┘
```

**Key principles**:
1. **Layered architecture**: Perception → Planning → Control (separation of concerns)
2. **ROS 2 nodes**: Each box is an independent process communicating via topics
3. **Real-time guarantees**: Control loop runs at 100-1000 Hz (1-10ms cycle time)
4. **Failsafes**: Watchdog timers, redundant sensors, emergency stop hardware

## Hands-On: Processing Sensor Data

Let's process simulated IMU data to see how sensor fusion works - a fundamental technique in Physical AI.

The code is in `code-examples/chapter-1/sensor_data_demo.py`.

### Running the Demo

```bash
cd physical-ai-textbook/code-examples/chapter-1/
python sensor_data_demo.py
```

**What it does**:
1. Simulates a robot tilted at 30° with noisy accelerometer and drifting gyroscope
2. Estimates orientation using three methods:
   - **Accelerometer only**: Noisy but doesn't drift
   - **Gyroscope only**: Smooth but drifts over time
   - **Complementary filter**: Fuses both for best of both worlds

**Expected output**:
```
======================================================================
Physical AI - IMU Sensor Data Processing Demo
======================================================================

Simulating IMU data for a robot tilted at 30°...
  - Accelerometer: Noisy but doesn't drift
  - Gyroscope: Smooth but drifts over time
  - Complementary Filter: Combines best of both!

✅ Sensor fusion demo complete!
   Plot saved as 'sensor_fusion_demo.png'

   Error Statistics (after 10 seconds):
   - Accelerometer RMS error: 2.15°
   - Gyroscope RMS error: 5.43°
   - Complementary Filter RMS error: 0.89°
```

**Key insight**: The complementary filter achieves **60% lower error** than either sensor alone!

### Why This Matters

Every Physical AI system does sensor fusion:
- **Drones**: Fuse IMU + GPS + barometer for position estimate
- **Self-driving cars**: Fuse LiDAR + camera + radar + GPS + IMU
- **Humanoid robots**: Fuse joint encoders + IMU + force sensors for balance

The complementary filter is simple. Real robots use **Kalman Filters** or **Particle Filters** - more sophisticated but same principle: combine multiple noisy sensors for better estimate.

<div class="ai-agent-note">

#### 🤖 AI Agent Note: Why ROS 2 Dominates Robotics

**Network effect**: Once a framework reaches critical mass, it becomes self-reinforcing:
1. More users → more packages → easier development → more users
2. Industry adoption → job market → university curricula → more developers
3. Hardware vendors → official ROS drivers → better integration → more hardware support

**Result**: ROS 2 is the Linux of robotics. Alternatives exist (YARP, LCM, custom), but lack ecosystem. If you're building a research robot or startup product in 2025, you use ROS 2.

**Exception**: High-volume consumer products (vacuum robots) use custom firmware for cost/size optimization.

</div>

## Key Takeaways

- **Sensors** come in many types: vision (RGB, depth, LiDAR), inertial (IMU), force/torque, proprioceptive (encoders). Choose based on environment and task.
- **Actuators** trade off torque, speed, precision, and cost. Electric servos dominate modern robotics. Hydraulics still used for extreme power.
- **Compute** happens on-robot (Jetson), desktop (RTX), or cloud (AWS). Edge compute reduces latency, cloud enables massive scale.
- **Communication** uses ROS 2 for high-level coordination, CAN/RS485 for actuator networks, Ethernet for bandwidth-heavy sensors.
- **Sensor fusion** is essential - no single sensor is perfect, combine multiple for robustness.

## Up Next

You now have a mental map of the hardware ecosystem. In **Section 1.4**, we'll design your lab setup:

- On-premise vs cloud trade-offs
- The Economy Jetson Student Kit ($700 complete robot setup)
- Safety protocols and workspace design
- Step-by-step ROS 2 installation script

[Continue to Section 1.4: Lab Setup Guide →](./1-4-lab-setup-guide.md)

## References

1. NVIDIA. (2024). "Jetson Orin Modules". [https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/)
2. Intel. (2023). "RealSense Depth Camera D435". [https://www.intelrealsense.com/depth-camera-d435/](https://www.intelrealsense.com/depth-camera-d435/)
3. Robotis. (2024). "Dynamixel Smart Actuators". [https://emanual.robotis.com/](https://emanual.robotis.com/)
4. Open Robotics. (2024). "ROS 2 Documentation". [https://docs.ros.org/](https://docs.ros.org/)
5. Quigley, M., et al. (2009). "ROS: an open-source Robot Operating System". *ICRA Workshop on Open Source Software*.
6. Boston Dynamics. (2023). "Atlas: The World's Most Dynamic Humanoid". [https://www.bostondynamics.com/atlas](https://www.bostondynamics.com/atlas)
