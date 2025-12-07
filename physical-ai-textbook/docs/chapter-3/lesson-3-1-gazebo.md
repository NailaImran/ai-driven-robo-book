---
id: lesson-3-1-gazebo
title: Lesson 3.1 - Physics Simulation with Gazebo
sidebar_position: 1
keywords: [gazebo, physics-simulation, SDF, joint-control, ROS2-bridge, collision-detection]
---

# Lesson 3.1: Physics Simulation with Gazebo

## Overview

In this lesson, you'll learn how to create realistic physics simulations of your humanoid robot using Gazebo. Gazebo is the most widely-used open-source robot simulator, featuring accurate physics engines, sensor simulation, and tight ROS 2 integration.

**Learning Duration**: 3 hours
**Hands-On Exercises**: 5 code examples + 1 practical project

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Understand Gazebo architecture** - how worlds, models, plugins, and physics engines work together
2. **Write SDF files** - Simulation Description Format for defining robots and environments
3. **Configure physics engines** - choose between ODE, Bullet, Simbody and tune timesteps
4. **Control robot joints** - actuate humanoid models via ROS 2 topics
5. **Detect collisions** - understand contact dynamics and material properties
6. **Visualize in RViz2** - display TF2 transforms, joint states, and sensor data
7. **Debug simulation issues** - diagnose instability, clipping, and performance problems

## Prerequisites

- ✅ Completed Chapter 2 (ROS 2 fundamentals, URDF basics)
- ✅ ROS 2 Humble or Iron installed and working
- ✅ Gazebo Garden or Humble installed (`sudo apt install gazebo`)
- ✅ Chapter 2 URDF model available
- ✅ Basic Python 3.10+ and command-line familiarity

## Key Concepts

### What is Gazebo?

Gazebo is a robot simulator that provides:
- **Physics simulation**: realistic joint dynamics, friction, collision
- **Sensor simulation**: cameras, LiDAR, IMU, contact sensors
- **ROS 2 integration**: direct topic/service/tf2 bridges
- **Plugin system**: extend functionality with custom components
- **Multiple physics engines**: ODE (default), Bullet, Simbody

### Gazebo vs. Your Real Robot

| Aspect | Gazebo | Real Robot |
|--------|--------|-----------|
| Physics accuracy | 95%+ for mechanical systems | 100% (real world) |
| Sensor realism | Configurable noise models | Actual sensor hardware |
| Execution speed | 1-10x real-time (CPU dependent) | 1x real-time (locked to wall clock) |
| Development cycle | Seconds to minutes | Hours to days |
| Safety | No risk of robot damage | Risk of collision, damage, injury |
| Cost | Free | $50k-$500k+ |

## Section 1: Gazebo Fundamentals

### 1.1 Gazebo Architecture

Gazebo consists of:

1. **Server (`gzserver`)**: Physics engine, sensor simulation, plugin execution
2. **Client (`gzclient`)**: 3D visualization, mouse/keyboard interaction
3. **Plugins**: Custom C++ code that runs on server (no latency from client)
4. **ROS 2 Bridge**: Bidirectional communication (topics, services, transforms)

```
┌─────────────────────────────────────────┐
│           Gazebo Server                 │
│  ┌─────────────────────────────────┐   │
│  │  Physics Engine (ODE/Bullet)    │   │
│  │  - Update at 1000 Hz (1ms step) │   │
│  │  - Gravity, friction, contacts  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Sensor Simulation              │   │
│  │  - Cameras, LiDAR, IMU, contact │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  ROS 2 Bridge (gz_ros2_control) │   │
│  │  - /cmd_vel, /joint_command     │   │
│  │  - /joint_state, /tf2, /imu     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
          ↕ (localhost:11345)
┌─────────────────────────────────────────┐
│        Gazebo Client (3D View)          │
│  - Mouse/keyboard interaction           │
│  - Visualization only (stateless)       │
└─────────────────────────────────────────┘
```

### 1.2 SDF Format (Simulation Description Format)

SDF is an XML-based format for describing Gazebo worlds. Key elements:

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="default">
    <!-- Physics engine configuration -->
    <physics name="default_physics" type="ode">
      <max_step_size>0.001</max_step_size>  <!-- 1 ms timestep -->
      <real_time_factor>1.0</real_time_factor>
      <gravity>0 0 -9.81</gravity>
    </physics>

    <!-- Models (robots, objects, etc.) -->
    <model name="humanoid_robot">
      <!-- Links: rigid bodies -->
      <link name="base_link">
        <mass>50</mass>
        <inertial>...</inertial>
        <collision name="collision">
          <geometry>
            <box><size>0.3 0.3 0.9</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <mesh><uri>model://humanoid/meshes/torso.stl</uri></mesh>
          </geometry>
        </visual>
      </link>

      <!-- Joints: connections between links -->
      <joint name="waist_pitch" type="revolute">
        <parent>base_link</parent>
        <child>torso_link</child>
        <axis><xyz>0 1 0</xyz></axis>
        <limit>
          <lower>-1.57</lower>
          <upper>1.57</upper>
          <effort>100</effort>
          <velocity>2.0</velocity>
        </limit>
        <dynamics>
          <damping>5.0</damping>
          <friction>1.0</friction>
        </dynamics>
      </joint>
    </model>
  </world>
</sdf>
```

Key takeaways:
- **Links** have mass, inertia, collision, and visual geometry
- **Joints** connect links with limits, friction, damping
- **Physics** defines gravity, timestep, solver (ODE/Bullet)
- **Friction** and **damping** affect motion stability

---

## Section 2: Setting Up Your First Gazebo Simulation

### 2.1 Creating a World File

Create `my_world.sdf`:

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="humanoid_sim">
    <!-- High-resolution physics -->
    <physics name="default_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <gravity>0 0 -9.81</gravity>
      <ode>
        <solver>
          <type>quick</type>
          <iters>50</iters>
          <precon_iters>0</precon_iters>
          <sor>1.3</sor>
        </solver>
        <constraints>
          <cfm>0.0</cfm>
          <erp>0.2</erp>
          <contact_max_correcting_vel>100</contact_max_correcting_vel>
          <contact_surface_layer>0.001</contact_surface_layer>
        </constraints>
      </ode>
    </physics>

    <!-- Lighting -->
    <light type="directional" name="sun">
      <pose>0 0 10 0 0 0</pose>
      <diffuse>1 1 1 1</diffuse>
      <ambient>0.5 0.5 0.5 1</ambient>
    </light>

    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <surface>
            <friction><ode><mu>0.6</mu><mu2>0.6</mu2></ode></friction>
          </surface>
          <geometry><plane><normal>0 0 1</normal></plane></geometry>
        </collision>
        <visual name="visual">
          <geometry><plane><normal>0 0 1</normal></plane></geometry>
          <material><ambient>0.3 0.3 0.3 1</ambient></material>
        </visual>
      </link>
    </model>

    <!-- Import your Chapter 2 humanoid model -->
    <model name="humanoid">
      <pose>0 0 0.5 0 0 0</pose>
      <include>
        <uri>model://humanoid_robot</uri>
      </include>
    </model>
  </world>
</sdf>
```

### 2.2 Launching Gazebo with ROS 2

Create `launch_gazebo.py`:

```bash
# Option 1: Command line
gazebo --verbose my_world.sdf

# Option 2: With ROS 2 bridge (requires gz_ros2_control)
ros2 launch gazebo_ros gazebo.launch.py world:=my_world.sdf

# Option 3: Headless (no GUI, faster)
gzserver my_world.sdf
```

Start RViz2 to visualize transforms:
```bash
ros2 run rviz2 rviz2 -d my_config.rviz
```

---

## Section 3: Controlling Your Robot

### 3.1 Joint Command Topic

Once Gazebo is running, you can publish joint commands:

```bash
# List available topics
ros2 topic list

# Publish velocity command to base
ros2 topic pub /cmd_vel geometry_msgs/Twist \
  '{linear: {x: 0.5}, angular: {z: 0.2}}'

# Publish joint command to arm
ros2 topic pub /humanoid/joint_command \
  std_msgs/Float64MultiArray 'data: [0.1, -0.5, 0.3]'

# View joint states
ros2 topic echo /joint_states
```

### 3.2 Python Control Script

Example 3.1: `control_humanoid.py`

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float64MultiArray
import time

class HumanoidController(Node):
    def __init__(self):
        super().__init__('humanoid_controller')

        # Publishers
        self.cmd_vel_pub = self.create_publisher(
            Twist, '/cmd_vel', 10)
        self.joint_cmd_pub = self.create_publisher(
            Float64MultiArray, '/humanoid/joint_command', 10)

        # Timer for control loop
        self.create_timer(0.05, self.control_loop)
        self.step = 0

    def control_loop(self):
        # Command 1: Make robot walk forward
        if self.step < 100:
            msg = Twist()
            msg.linear.x = 0.5  # 0.5 m/s forward
            msg.angular.z = 0.0
            self.cmd_vel_pub.publish(msg)

        # Command 2: Turn in place
        elif self.step < 200:
            msg = Twist()
            msg.linear.x = 0.0
            msg.angular.z = 0.3  # 0.3 rad/s rotation
            self.cmd_vel_pub.publish(msg)

        self.step += 1

def main(args=None):
    rclpy.init(args=args)
    controller = HumanoidController()
    rclpy.spin(controller)

if __name__ == '__main__':
    main()
```

**Expected Output**:
- Robot moves forward in Gazebo
- TF2 transform `/base_link` relative to `/world` updates
- Joint states published at ~50 Hz

---

## Section 4: Physics Tuning

### 4.1 Debugging Instability

**Problem**: Robot shakes, explodes, or behaves erratically

**Causes & Solutions**:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Jittering | Timestep too large | Reduce `max_step_size` (0.001s) |
| Slow motion | Real-time factor < 1 | Increase `real_time_factor` or CPU power |
| Sinking through floor | Collision layer too thick | Reduce `contact_surface_layer` |
| Oscillating joints | Gains too high | Reduce PID gains in controller |
| Exploding | Inertia properties wrong | Check mass/inertia from Chapter 2 |

### 4.2 Performance Monitoring

Check Gazebo performance in server terminal:

```
[Msg] World [default] is paused.
[Msg] Server [http://localhost:11345] accepted a connection from a client [ID=1]
[Msg] Physics simulation step time: 0.95 ms
[Msg] Update rate: 1000 Hz (on target)
```

Monitor ROS 2 with:
```bash
ros2 topic hz /joint_states  # Should be ~50 Hz
ros2 topic bw /joint_states  # Bandwidth
```

---

## Section 5: Validation Checklist

Before proceeding to Lesson 3.2, verify:

- [ ] Gazebo launches without errors
- [ ] Your Chapter 2 URDF loads and displays correctly
- [ ] Robot doesn't fall through floor or explode
- [ ] Can publish `/cmd_vel` and see robot move
- [ ] RViz2 shows TF2 transforms updating
- [ ] `/joint_states` topic published at reasonable rate
- [ ] Timestep stable at 0.001s or smaller

---

## Hands-On Exercises

### Exercise 1: Create a Simple World
**Duration**: 30 minutes

1. Create `exercise1.sdf` with ground plane and 1 cube obstacle
2. Import your Chapter 2 humanoid
3. Launch Gazebo: `gazebo exercise1.sdf`
4. Expected: Robot standing on ground, not falling

### Exercise 2: Walk Around Obstacle
**Duration**: 1 hour

1. Modify `control_humanoid.py` to navigate around cube
2. Use `/cmd_vel` to move forward, turn, move forward again
3. Expected: Robot starts at origin, walks in square path

### Exercise 3: Record ROS Bag
**Duration**: 30 minutes

1. Record joint states while walking:
   ```bash
   ros2 bag record /joint_states /tf2
   ```
2. Playback and visualize:
   ```bash
   ros2 bag play rosbag2_0/
   ```

---

## Summary

In this lesson, you learned:

✅ **Gazebo architecture** - server/client, physics engines, ROS 2 bridge
✅ **SDF format** - define robots, worlds, physics parameters
✅ **Control robots via ROS 2** - publish commands, read joint states
✅ **Tune physics** - adjust timestep, friction, damping for stability
✅ **Validate simulation** - check transform trees and topic rates

## Next Steps

- **Lesson 3.2**: Render your Gazebo simulation in Unity for photorealism
- **Lesson 3.3**: Advance to NVIDIA Isaac Sim for even higher fidelity
- **Lesson 3.4**: Add realistic sensors (LiDAR, depth camera, IMU)

---

## Resources

- **Official Gazebo Tutorials**: https://gazebosim.org/docs
- **ROS 2 + Gazebo Integration**: https://docs.ros.org/en/humble/Tutorials/Advanced/Gazebo/Setting-Up-a-Robot-Sim.html
- **SDF Reference**: https://sdformat.org
- **ODE Physics Engine**: https://www.ode.org

---

[← Back to Chapter 3 Overview](./chapter-3-index.md) | [Next Lesson: High-Fidelity Rendering →](./lesson-3-2-unity.md)
