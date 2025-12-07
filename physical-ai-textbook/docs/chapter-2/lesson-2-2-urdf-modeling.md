---
id: lesson-2-2-urdf-modeling
title: Lesson 2.2 - Humanoid Modeling with URDF
sidebar_position: 2
keywords: [urdf, sdf, robot-modeling, kinematics, robot-description]
---

import { Lesson22 } from '@site/src/components/chapter-2/Lesson22Wrapper';

<Lesson22 />

# Lesson 2.2: Humanoid Modeling with URDF/SDF

**Reading Time**: 40 minutes | **Coding Time**: 85 minutes | **Total**: 2-3 hours

## Prerequisites

- **Completed**: Lesson 2.1 (ROS 2 Fundamentals)
- **Knowledge**: Basic understanding of 3D coordinate systems, transformations
- **Environment**: ROS 2 Humble installed, RVIZ2 available

## Learning Objectives

By the end of this lesson, you will be able to:
- Understand and write URDF (Unified Robot Description Format) files
- Create robot models with links, joints, and kinematic chains
- Add visual and collision meshes to robot parts
- Compute forward kinematics (joint angles → end-effector pose)
- Solve inverse kinematics (target pose → joint angles)
- Visualize and debug robot models in RVIZ2
- Validate URDF syntax and model integrity

---

## Introduction: Robot Descriptions as Code

In Lesson 2.1, we learned how ROS 2 nodes communicate. Now we need to teach ROS 2 about the **physical structure** of our robot: where are the sensors? What joints can move? How do the parts connect?

This is where **URDF** (Unified Robot Description Format) comes in—it's XML that describes your robot's **kinematic chain**, **geometry**, **physics properties**, and **sensors**.

### Why Robot Descriptions Matter

Without a proper robot description, your control algorithms don't know:
- How many degrees of freedom (DOF) does the robot have?
- What's the range of motion for each joint?
- Where is the camera mounted relative to the base?
- Will the arm collide with the body?
- How much does each link weigh (for dynamics)?

**URDF solves all of these problems** by providing a standardized format that works across:
- **Simulation** (Gazebo, Bullet, NVIDIA Isaac Sim)
- **Visualization** (RVIZ2)
- **Planning** (MoveIt 2)
- **Control** (ros2_control)
- **Physical robots** (Unitree, Boston Dynamics, custom platforms)

### URDF vs Other Formats

| Format | Use Case | Pros | Cons |
|--------|----------|------|------|
| **URDF** | ROS standard robot description | Well-integrated, human-readable XML | Limited Gazebo-specific features |
| **SDF** | Gazebo-native format | Rich physics simulation features | More complex, less ROS integration |
| **MJCF** | DeepMind MuJoCo simulator | Excellent for RL training | Limited robot ecosystem support |
| **URDF + Gazebo plugins** | Simulation + real robots | Best of both worlds | More complexity |

**For this textbook, we'll use URDF with optional Gazebo plugins** because:
1. Works with ROS 2 ecosystem
2. Compatible with multiple simulators
3. Used in industry (Tesla, Boston Dynamics, etc.)
4. Human-readable and learner-friendly

---

## URDF Fundamentals: Building Blocks

URDF files are XML documents with a simple structure. Let's build from the ground up.

### Basic Structure

```xml
<?xml version="1.0"?>
<robot name="my_robot">
  <!-- Links: rigid bodies -->
  <link name="base_link">
    ...
  </link>

  <!-- Joints: connections between links -->
  <joint name="joint_1" type="revolute">
    ...
  </joint>
</robot>
```

### Links: Rigid Bodies

A **link** represents a rigid body in your robot. Think of it as a physical part that doesn't bend.

```xml
<link name="torso">
  <!-- Visual geometry (what it looks like) -->
  <visual>
    <geometry>
      <box size="0.3 0.2 0.5"/>
    </geometry>
    <material name="white">
      <color rgba="1.0 1.0 1.0 1.0"/>
    </material>
  </visual>

  <!-- Collision geometry (for physics simulation) -->
  <collision>
    <geometry>
      <box size="0.3 0.2 0.5"/>
    </geometry>
  </collision>

  <!-- Physical properties (for dynamics) -->
  <inertial>
    <mass value="5.0"/>
    <inertia ixx="0.1" ixy="0.0" ixz="0.0"
             iyy="0.2" iyz="0.0"
             izz="0.1"/>
  </inertial>
</link>
```

**Key Components**:
- **Visual**: How the link looks (for RVIZ2 and simulators)
- **Collision**: Shape for physics and collision detection (can differ from visual)
- **Inertial**: Mass and moment of inertia (for Gazebo dynamics)

### Joints: Connections

A **joint** connects two links and defines how they can move relative to each other.

```xml
<joint name="hip_roll" type="revolute">
  <!-- Parent and child links -->
  <parent link="torso"/>
  <child link="left_leg"/>

  <!-- Joint origin (relative to parent) -->
  <origin xyz="0.0 0.1 0.0" rpy="0.0 0.0 0.0"/>

  <!-- Rotation axis (for revolute joints) -->
  <axis xyz="1.0 0.0 0.0"/>

  <!-- Motion limits -->
  <limit lower="-0.785" upper="0.785" effort="100" velocity="2.0"/>

  <!-- Friction and damping -->
  <dynamics damping="10.0" friction="0.5"/>
</joint>
```

### Joint Types

| Type | Motion | Use Case | Example |
|------|--------|----------|---------|
| **revolute** | Rotation around axis with limits | Motors, hinges | Hip, knee, shoulder |
| **prismatic** | Linear motion along axis with limits | Sliding parts | Gripper finger, extending arm |
| **continuous** | Unlimited rotation | No stop points | Wheels, constant rotation motors |
| **fixed** | No motion | Permanent connections | Camera mounting, body panels |
| **planar** | 2D movement in a plane | Mobile base (wheeled robots) | Differential drive base |
| **floating** | 6 DOF (free movement) | Base of humanoid in space | Quadrotor, floating base humanoid |

### Origin Frames

Every link and joint has an **origin** frame that positions it relative to its parent.

```xml
<origin xyz="x y z" rpy="roll pitch yaw"/>
```

- **xyz**: Position in meters (x=forward, y=left, z=up in standard orientation)
- **rpy**: Rotation in radians (roll=X, pitch=Y, yaw=Z)

Think of it as: "Where is this link positioned relative to its parent?"

---

## Building a Simple Humanoid: Step by Step

Let's create a **12-DOF humanoid** from the ground up:

### Structure Overview

```
        [head]
          |
       [torso]
       /  |  \
    [L_shoulder] [R_shoulder]
        |         |
    [L_arm]   [R_arm]
      |  |       |  |
     [L_hip] [R_hip]
      |  |       |  |
     [L_leg] [R_leg]
```

### Part 1: Base Link (Torso)

```xml
<?xml version="1.0"?>
<robot name="humanoid">

  <!-- Base: torso (body center) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.3 0.25 0.5"/>
      </geometry>
      <material name="torso_color">
        <color rgba="0.1 0.1 0.1 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.25 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.2" ixy="0.0" ixz="0.0"
               iyy="0.3" iyz="0.0"
               izz="0.2"/>
    </inertial>
  </link>

</robot>
```

### Part 2: Add Legs

```xml
  <!-- Left hip link -->
  <link name="left_hip">
    <visual>
      <geometry>
        <box size="0.1 0.15 0.1"/>
      </geometry>
      <material name="joint_color">
        <color rgba="0.3 0.3 0.3 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.15 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0"
               iyy="0.01" iyz="0.0"
               izz="0.01"/>
    </inertial>
  </link>

  <!-- Hip roll joint (rotate around X-axis) -->
  <joint name="left_hip_roll" type="revolute">
    <parent link="base_link"/>
    <child link="left_hip"/>
    <origin xyz="0.0 0.15 -0.25" rpy="0.0 0.0 0.0"/>
    <axis xyz="1.0 0.0 0.0"/>
    <limit lower="-0.785" upper="0.785" effort="100" velocity="2.0"/>
    <dynamics damping="10.0" friction="0.5"/>
  </joint>

  <!-- Similar for right hip... -->

</robot>
```

### Part 3: Add Arms and Head

```xml
  <!-- Left shoulder -->
  <link name="left_shoulder">
    <visual>
      <geometry>
        <sphere radius="0.08"/>
      </geometry>
      <material name="shoulder_color">
        <color rgba="0.2 0.2 0.2 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.08"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0"
               iyy="0.02" iyz="0.0"
               izz="0.02"/>
    </inertial>
  </link>

  <!-- Shoulder pitch joint -->
  <joint name="left_shoulder_pitch" type="revolute">
    <parent link="base_link"/>
    <child link="left_shoulder"/>
    <origin xyz="-0.2 0.15 0.1" rpy="0.0 0.0 0.0"/>
    <axis xyz="0.0 1.0 0.0"/>
    <limit lower="-1.57" upper="1.57" effort="50" velocity="1.5"/>
    <dynamics damping="5.0" friction="0.3"/>
  </joint>

  <!-- Left arm (similar structure) -->
  <link name="left_arm">
    <visual>
      <geometry>
        <cylinder length="0.3" radius="0.05"/>
      </geometry>
      <material name="arm_color">
        <color rgba="0.4 0.4 0.4 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.3" radius="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0"
               iyy="0.01" iyz="0.0"
               izz="0.001"/>
    </inertial>
  </link>

  <joint name="left_elbow" type="revolute">
    <parent link="left_shoulder"/>
    <child link="left_arm"/>
    <origin xyz="0.0 0.0 -0.15" rpy="0.0 0.0 0.0"/>
    <axis xyz="0.0 1.0 0.0"/>
    <limit lower="0.0" upper="2.0" effort="40" velocity="1.5"/>
    <dynamics damping="4.0" friction="0.3"/>
  </joint>

</robot>
```

---

## Kinematics: From Angles to Positions

Now that we can describe robot structure with URDF, we need to **compute where the robot's parts are** in 3D space given joint angles.

### Forward Kinematics (FK)

**Problem**: Given joint angles, where is the end-effector (hand, foot, camera)?

**Solution**: Chain matrix multiplications through the kinematic tree.

```python
import numpy as np
from scipy.spatial.transform import Rotation

class ForwardKinematics:
    """Compute end-effector position from joint angles"""

    def __init__(self, urdf_file):
        # Load URDF and extract kinematic chain
        self.load_urdf(urdf_file)

    def compute_fk(self, joint_angles):
        """
        Args:
            joint_angles: List of joint angles [θ₁, θ₂, ..., θₙ] in radians

        Returns:
            end_effector_pose: 4x4 transformation matrix [R|t; 0|1]
        """
        # Start from base (identity)
        T = np.eye(4)

        # Apply each joint transformation
        for i, angle in enumerate(joint_angles):
            # Get joint axis and origin
            axis = self.joints[i]['axis']
            origin = self.joints[i]['origin']

            # Create rotation matrix around axis
            R = Rotation.from_rotvec(angle * np.array(axis)).as_matrix()

            # Create 4x4 transformation
            T_joint = np.eye(4)
            T_joint[:3, :3] = R
            T_joint[:3, 3] = origin

            # Accumulate transformations
            T = T @ T_joint

        return T

    def get_end_effector_position(self, joint_angles):
        """Extract XYZ position from FK result"""
        T = self.compute_fk(joint_angles)
        return T[:3, 3]  # Translation vector
```

### Inverse Kinematics (IK)

**Problem**: Given target end-effector position, what joint angles achieve it?

**Challenge**: This is mathematically hard! For a 6-DOF arm, there can be 0, 1, 2, or 8 solutions.

**Approach**: Use numerical optimization (Newton-Raphson or gradient descent)

```python
from scipy.optimize import minimize

class InverseKinematics:
    """Solve IK numerically using optimization"""

    def __init__(self, fk_solver):
        self.fk = fk_solver

    def solve_ik(self, target_position, initial_guess=None):
        """
        Find joint angles that reach target position

        Args:
            target_position: [x, y, z] target in meters
            initial_guess: Starting joint angles (random if None)

        Returns:
            joint_angles: Solution (if found)
        """
        if initial_guess is None:
            initial_guess = np.random.randn(len(self.fk.joints)) * 0.5

        def error_function(angles):
            """Objective: minimize distance to target"""
            try:
                current_pos = self.fk.get_end_effector_position(angles)
                error = np.linalg.norm(current_pos - target_position)
                return error
            except:
                return 1e6  # Large penalty for invalid angles

        # Optimize
        result = minimize(
            error_function,
            initial_guess,
            method='BFGS',
            options={'maxiter': 100}
        )

        if result.fun < 0.01:  # Tolerance: 1cm
            return result.x
        else:
            return None  # No solution found
```

---

## Visualizing Robots in RVIZ2

Once you have a URDF file, visualizing it in RVIZ2 is straightforward:

### Step 1: Launch RVIZ2 with URDF

```bash
ros2 launch urdf_tutorial display.launch.py model:=path/to/your_robot.urdf
```

### Step 2: Interact with Joints

RVIZ2 includes a **Joint State Publisher GUI** that lets you:
- Slide joint angles
- See the robot move in real-time
- Inspect frames and transformations

### Step 3: Debug the Kinematic Tree

```bash
# View robot structure
ros2 run urdf_launch display.launch.py model:=humanoid.urdf

# In RVIZ2 interface:
# 1. Click "Add" → "RobotModel"
# 2. Set "Robot Description" to /robot_description
# 3. Check "TF" (show coordinate frames)
# 4. Expand the tree to see all frames
```

---

## Interactive Component: URDF Editor

Below is the **URDF Editor**—a web-based tool for creating and testing robot models:

### Features:
- ✏️ **Edit URDF XML** with Monaco code editor
- 👁️ **3D Preview** using Three.js (rotate, zoom, pan)
- ✅ **Live Validation** (errors highlighted instantly)
- 🎛️ **Joint Sliders** (move joints in real-time)
- 📚 **Template Library** (starter URDF models)
- 💾 **Export** (download your URDF file)

<!-- URDFEditor component will be embedded here during Phase 4 -->

---

## Quiz

Ready to test your understanding of URDF and kinematics?

**What you should be able to answer:**
1. What are the differences between visual and collision geometry?
2. How would you create a prismatic (sliding) joint?
3. What does the `origin` tag represent in a joint?
4. How many solutions can inverse kinematics have for a 6-DOF arm?
5. Why do we need inertial properties in URDF for simulation?

<!-- Quiz component will be embedded here -->

---

## Summary

You've learned:
- ✅ **URDF** is XML that describes robot structure
- ✅ **Links** are rigid bodies; **joints** connect them
- ✅ **Geometry** can be visual (appearance) or collision (physics)
- ✅ **Kinematics** lets you compute positions from angles (FK) or vice versa (IK)
- ✅ **RVIZ2** visualizes and debugs robot models
- ✅ **Joint State Publisher** lets you interactively test joint ranges

**Next Steps**:
1. Complete the quiz on URDF syntax
2. Try the **URDF Editor** below to build your own simple robot
3. Load your URDF in RVIZ2 and verify the structure
4. Move to Lesson 2.3: Control Theory for making your robot move!

---

**Interactive Components**:
- URDF Editor with 3D preview (embed Three.js component)
- Joint State Publisher simulator
- FK/IK visualization tool

**Code Examples Available**:
- `simple_2link.urdf` - Basic 2-link robot arm
- `humanoid_12dof.urdf` - Complete humanoid model
- `forward_kinematics.py` - FK computation
- `inverse_kinematics.py` - IK solver

---

**Next Lesson**: [Lesson 2.3: Control Theory for Bipedal Locomotion →](./lesson-2-3-control-theory.md)
