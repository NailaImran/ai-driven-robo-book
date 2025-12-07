---
id: lesson-2-3-control-theory
title: Lesson 2.3 - Control Theory for Bipedal Locomotion
sidebar_position: 3
keywords: [pid-control, zero-moment-point, gait-generation, balance-control, imu-feedback]
---

# Lesson 2.3: Control Theory for Bipedal Locomotion

**Reading Time**: 45 minutes | **Coding Time**: 90 minutes | **Total**: 2.5-3 hours

## Prerequisites

- **Completed**: Lesson 2.1 (ROS 2 Fundamentals) and Lesson 2.2 (Robot Modeling)
- **Knowledge**: Basic control theory (feedback loops), linear algebra basics
- **Environment**: ROS 2 Humble, Gazebo simulation, Python 3.10+

## Learning Objectives

By the end of this lesson, you will be able to:
- **Understand** feedback control systems and stability
- **Implement** PID controllers for joint-level control
- **Analyze** bipedal stability using Zero Moment Point (ZMP)
- **Generate** walking gaits with foot trajectories
- **Apply** sensor fusion (IMU) for balance recovery
- **Design** emergency stop mechanisms for safety
- **Simulate** complete humanoid walking in Gazebo

---

## Introduction: The Challenge of Walking

Imagine you're trying to make a humanoid robot walk across a room. What could go wrong?

1. **Joint control**: How do you command motors to move smoothly?
2. **Balance**: How do you prevent the robot from tipping over?
3. **Coordination**: How do you synchronize legs, arms, and torso?
4. **Stability**: How do you keep the center of mass over the support polygon?
5. **Recovery**: What if the robot gets pushed? How does it recover?

**Control theory** gives us the mathematical tools to solve these problems. In this lesson, we'll build from basic feedback loops to complete bipedal locomotion.

### Real-World Examples

Modern humanoid robots solve these problems with control theory:
- **Boston Dynamics Atlas**: Uses advanced impedance control + ZMP for dynamic walks
- **Tesla Optimus**: Vision + deep learning control for flexible gait adaptation
- **IHMC Valkyrie**: Multi-layer control (low-level joint PID + high-level gait planning)
- **Honda ASIMO**: Pioneer in bipedal walking with ZMP control

---

## Part 1: Feedback Control Systems

Before we implement specific controllers, let's understand how feedback works.

### Open-Loop vs Closed-Loop

**Open-Loop Control** (No Feedback):
```
Command → Robot → Result
|→ 0.5 rad → Joint Motor → Joint moves to 0.5 rad

Problem: No guarantee of accuracy! Motor might be weak, joint might have friction.
```

**Closed-Loop Control** (With Feedback):
```
Desired Position → Error Calculator → Controller → Motor
                                           ↑
                                        Sensor reads current position
```

The **feedback loop** compares what we want (desired) vs what we got (actual), then adjusts the command.

### Three Components of Control

1. **Sensor**: Measures current state (joint angle, position, acceleration)
2. **Controller**: Calculates error and desired action
3. **Actuator**: Executes the command (motor, hydraulic, pneumatic)

The key insight: **A good controller minimizes error over time.**

---

## Part 2: PID Control - The Industry Standard

**PID** stands for **Proportional-Integral-Derivative**. It's the most widely used controller in robotics and industry.

### PID Formula

```
Output = Kp * error + Ki * integral(error) + Kd * derivative(error)
```

Where:
- `error = desired - actual`
- `Kp, Ki, Kd` are tuning gains (constants we adjust)

### The Three Terms Explained

#### 1. Proportional (P): Immediate Response

```python
output = Kp * error
```

- Proportional to the error
- **Large error** → Large correction
- **Small error** → Small correction

**Problem**: If you want to reach position 1.0 rad, a P-only controller will oscillate around it but never settle.

```
Target: 1.0 rad
Actual: 0.0 rad
Error: 1.0 rad
Output: Kp * 1.0 (large, moves towards target)

But as it approaches:
Error: 0.1 rad
Output: Kp * 0.1 (small, slows down)

But it overshoots:
Error: -0.05 rad (now below target!)
Output: Kp * -0.05 (corrects backward)

→ Oscillates forever!
```

#### 2. Integral (I): Eliminates Steady-State Error

```python
integral_error = sum of all past errors
output = Ki * integral_error
```

- Accumulates error over time
- If error persists, this term grows larger
- **Forces** the system to eventually reach the target

**Example**:
```
Target: 1.0 rad (constant torque needed to maintain: 0.1 N⋅m)
P-only controller settles at 0.95 rad (steady-state error of 0.05 rad)

I term accumulates:
  Integral = 0.05 + 0.05 + 0.05 + ... = grows over time

Eventually integral * Ki becomes large enough to overcome steady-state error
→ System reaches 1.0 rad exactly!
```

#### 3. Derivative (D): Damping (Smooth Response)

```python
derivative_error = (current_error - previous_error) / dt
output = Kd * derivative_error
```

- Reacts to how **fast** error is changing
- Provides "damping" - slows down the response
- Prevents overshoot

**Example**:
```
Target: 1.0 rad
Current: 0.9 rad (approaching target)
Error: 0.1 rad
Derivative: -0.05 (error is decreasing)

P says: "Still 0.1 error away, apply full correction"
D says: "But error is decreasing fast, so ease off"
→ Smooth approach without overshoot
```

### Tuning PID Parameters

How do you choose Kp, Ki, Kd? Several methods exist:

#### 1. Ziegler-Nichols Method (Classical)

1. Set Ki = 0, Kd = 0 (P-only)
2. Increase Kp until system oscillates
3. Measure oscillation period (Tu)
4. Set:
   - Kp = 0.6 * Ku (where Ku is the gain at oscillation)
   - Ki = 1.2 * Ku / Tu
   - Kd = 0.075 * Ku * Tu

#### 2. Manual Tuning (Trial and Error)

- **Increase Kp** until you get quick response but slight overshoot
- **Increase Ki** to eliminate steady-state error
- **Increase Kd** to reduce overshoot and oscillation

#### 3. Computational Methods (Advanced)

- Genetic algorithms
- Particle swarm optimization
- Reinforcement learning

### Step Response Performance Metrics

When we tune a PID controller, we measure:

```
        Overshoot (%)
              ↑
        ┌─────────┐
        │         │
Response│         └───────→ Steady-state
        │    Rise Time
        └─────────────
     Settling Time →
```

- **Rise Time**: How fast it reaches the target (faster is better, up to a point)
- **Overshoot**: How much it overshoots the target (want under 20%)
- **Settling Time**: How long until it stops oscillating (want under 2 sec for joint control)
- **Steady-State Error**: Final error (want under 1%)

### PID Control in ROS 2

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
from sensor_msgs.msg import JointState
import time

class PIDController(Node):
    """Simple PID controller for a single joint"""

    def __init__(self, joint_name, Kp=1.0, Ki=0.1, Kd=0.5):
        super().__init__('pid_controller')

        # Gains
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd

        # State tracking
        self.current_position = 0.0
        self.desired_position = 0.0
        self.integral_error = 0.0
        self.previous_error = 0.0
        self.previous_time = time.time()

        # Publishers and subscribers
        self.joint_cmd_pub = self.create_publisher(
            Float64, f'/{joint_name}/command', 10
        )
        self.joint_state_sub = self.create_subscription(
            JointState, '/joint_states', self.state_callback, 10
        )

        # Control loop at 100Hz
        self.create_timer(0.01, self.control_loop)

    def state_callback(self, msg):
        """Update current position from sensor"""
        # Simplified: assumes our joint is first in the message
        self.current_position = msg.position[0]

    def control_loop(self):
        """Execute PID control law"""
        # Calculate error
        error = self.desired_position - self.current_position

        # Integral term (accumulate error)
        self.integral_error += error * 0.01  # dt = 0.01 (100Hz)

        # Derivative term (rate of error change)
        current_time = time.time()
        dt = current_time - self.previous_time
        if dt > 0:
            derivative_error = (error - self.previous_error) / dt
        else:
            derivative_error = 0.0

        # PID output
        output = (self.Kp * error +
                 self.Ki * self.integral_error +
                 self.Kd * derivative_error)

        # Publish command
        cmd = Float64()
        cmd.data = output
        self.joint_cmd_pub.publish(cmd)

        # Update for next iteration
        self.previous_error = error
        self.previous_time = current_time
```

---

## Part 3: Bipedal Stability - The ZMP Criterion

Now that we can control individual joints, how do we prevent the robot from falling?

### The Problem: Gravity Always Wins

A humanoid robot is constantly fighting gravity. If the **center of mass (CoM)** moves outside the **support polygon** (area of contact with ground), the robot tips over.

```
STABLE                          UNSTABLE
   CoM                             CoM
    ↓                               ↓
  ┌─┴─┐                           │
  │   │  ← Within support          │
  │   │     polygon (feet)         │
  └─┬─┘                        ┌───┴──┐
    │                          │      │
  [Feet]                      [Feet]  ↓ Falls!
```

### The Zero Moment Point (ZMP)

The **Zero Moment Point** is the point on the ground where the net moment (torque) from all forces is zero.

**Key Insight**: If ZMP is inside the support polygon, the robot is stable. If ZMP exits the polygon, the robot tips.

#### ZMP Calculation

For a 2D walking robot:

```
ZMP_x = (CoM_x * m * g - (I * angular_acceleration)) / (m * g)

Where:
- CoM_x = horizontal position of center of mass
- m = total mass
- g = gravity (9.81 m/s²)
- I = moment of inertia
- angular_acceleration = how fast the robot is rotating
```

**Simplified Version** (when not accelerating much):

```
ZMP_x ≈ CoM_x
```

This means: **Keep the center of mass over your feet!**

#### Stability Margins

In practice, we add a safety margin:

```
Support Polygon:  [foot_left, foot_right]
Stability Margin: [foot_left + 2cm, foot_right - 2cm]

If ZMP is inside the stability margin → Safe
If ZMP approaches the edge → Reduce gait speed or adjust stance
If ZMP exits polygon → Fall (emergency stop!)
```

### ZMP Control in Practice

```python
import numpy as np

class ZMPController:
    """Maintain stability using Zero Moment Point criterion"""

    def __init__(self, footprint_width=0.2):  # meters
        self.footprint_width = footprint_width
        self.stability_margin = 0.02  # 2cm margin

    def is_stable(self, com_x, left_foot_x, right_foot_x):
        """Check if robot is stable (ZMP inside support polygon)"""

        # Support polygon is between feet
        support_min = min(left_foot_x, right_foot_x)
        support_max = max(left_foot_x, right_foot_x)

        # Apply stability margin
        stable_min = support_min + self.stability_margin
        stable_max = support_max - self.stability_margin

        # ZMP ≈ CoM (simplified, assuming low acceleration)
        zmp = com_x

        if stable_min <= zmp <= stable_max:
            stability_percent = 100 * min(
                zmp - stable_min,
                stable_max - zmp
            ) / (stable_max - stable_min)
            return True, stability_percent
        else:
            return False, 0.0

    def adjust_com_trajectory(self, desired_com, left_foot, right_foot):
        """Modify desired CoM trajectory to maintain stability"""

        # Check current stability
        is_stable, margin = self.is_stable(desired_com, left_foot, right_foot)

        if not is_stable:
            # Pull CoM back towards safe region
            support_center = (left_foot + right_foot) / 2
            safety_factor = 0.8  # Keep within 80% of support polygon

            # Clamp CoM to safe region
            support_min = min(left_foot, right_foot)
            support_max = max(left_foot, right_foot)

            safe_min = support_min + self.stability_margin
            safe_max = support_max - self.stability_margin

            adjusted_com = np.clip(desired_com, safe_min, safe_max)
            return adjusted_com

        return desired_com
```

---

## Part 4: Gait Generation - Making the Robot Walk

Now we have joint control (PID) and stability assurance (ZMP). How do we generate a walking pattern?

### Gait Phases

Walking has distinct phases:

```
SWING PHASE                    STANCE PHASE
(leg in air)                   (leg on ground)

    ↙ Start         ↙ End            ↙ Start        ↙ End
    │               │               │               │
Time│───────────────┼───────────────┼───────────────┼──→
    │    L swing    │    R swing    │    L swing    │
    ├───────────────┤       ├───────────────┤
              R stance         L stance

Duty cycle = stance_duration / cycle_duration
  (typically 0.6 = 60% of cycle on ground)
```

### Foot Trajectory Planning

For smooth, natural walking, we need smooth foot trajectories:

#### Swing Phase Trajectory (Foot in Air)

Use a **cubic polynomial** to move the foot from start to end position while maintaining clearance:

```python
def swing_trajectory(t, t_swing, x_start, x_end, height=0.05):
    """
    Cubic trajectory for swing phase

    Args:
        t: current time (0 to t_swing)
        t_swing: total swing phase duration
        x_start: starting position
        x_end: ending position
        height: peak height off ground (meters)
    """

    # Normalize time to [0, 1]
    s = t / t_swing

    # Cubic interpolation for horizontal: s^2 * (3 - 2*s)
    x = x_start + (x_end - x_start) * (3*s**2 - 2*s**3)

    # Parabolic arc for height: 4*height * s * (1-s)
    z = height * 4 * s * (1 - s)

    return x, z
```

This gives smooth, natural-looking movement without jarring transitions.

#### Stance Phase Trajectory (Foot on Ground)

During stance, the foot stays in contact with the ground. Adjust the CoM to move forward:

```python
def stance_trajectory(t, t_stance, com_start, com_end):
    """
    Linear CoM movement during stance phase
    """
    s = t / t_stance
    com = com_start + (com_end - com_start) * s
    return com
```

### Walking Speed Control

To make the robot walk faster or slower, adjust the gait parameters:

```python
class GaitGenerator:
    """Generate walking patterns at variable speeds"""

    def __init__(self, step_length=0.2, footprint_width=0.15):
        self.step_length = step_length  # meters
        self.footprint_width = footprint_width  # meters
        self.walking_speed = 0.3  # m/s (target)

    def update_gait(self, desired_walking_speed):
        """Adjust gait for different speeds"""

        if desired_walking_speed <= 0.1:
            # Very slow walk: longer stance, shorter swing
            self.cycle_time = 2.0  # seconds per step
            self.swing_ratio = 0.4  # 40% swing, 60% stance

        elif desired_walking_speed <= 0.3:
            # Slow walk
            self.cycle_time = 1.5
            self.swing_ratio = 0.5

        elif desired_walking_speed <= 0.6:
            # Normal walk
            self.cycle_time = 1.0
            self.swing_ratio = 0.6

        else:
            # Fast walk / jog
            self.cycle_time = 0.8
            self.swing_ratio = 0.65

        # Adjust step length
        self.step_length = desired_walking_speed * self.cycle_time

    def get_foot_position(self, cycle_time, phase):
        """Get desired foot position at given phase"""

        if phase < self.swing_ratio:
            # Swing phase
            relative_time = phase / self.swing_ratio
            x, z = swing_trajectory(
                relative_time * self.cycle_time,
                self.cycle_time * self.swing_ratio,
                x_start=0, x_end=self.step_length
            )
        else:
            # Stance phase
            relative_time = (phase - self.swing_ratio) / (1 - self.swing_ratio)
            x = self.step_length * (1 - relative_time)  # Move backward relative to body
            z = 0  # On ground

        return x, z
```

---

## Part 5: Balance Recovery with IMU Feedback

The robot can't see its own orientation, but it has an **Inertial Measurement Unit (IMU)**:
- **Accelerometer**: Measures acceleration (including gravity)
- **Gyroscope**: Measures angular velocity (rotation)

### Detecting Imbalance

When the robot tilts, the IMU detects it:

```python
class BalanceController:
    """Use IMU to detect and recover from imbalance"""

    def __init__(self, balance_kp=50.0):
        self.balance_kp = balance_kp
        self.tilt_threshold = 0.1  # radians (5.7 degrees)
        self.fall_threshold = 0.3  # radians (17 degrees)

    def process_imu(self, imu_msg):
        """Process IMU data and calculate corrective torque"""

        # Extract roll from IMU (rotation around X-axis)
        roll = imu_msg.roll
        pitch = imu_msg.pitch

        # Detect imbalance
        if abs(roll) > self.tilt_threshold:
            # Robot is tilting!
            # Calculate corrective torque (proportional to tilt)
            corrective_torque = -self.balance_kp * roll

            if abs(roll) > self.fall_threshold:
                # Falling! Emergency response
                return "EMERGENCY_STOP", corrective_torque
            else:
                # Recovering. Apply corrective torque to ankle joints
                return "RECOVERING", corrective_torque
        else:
            return "STABLE", 0.0

    def apply_ankle_torque(self, corrective_torque, left_ankle, right_ankle):
        """Apply corrective torque to ankle joints"""

        # Distribute torque between left and right ankle
        left_ankle.desired_torque = corrective_torque * 0.5
        right_ankle.desired_torque = corrective_torque * 0.5

        # Limit torque to prevent damage
        max_torque = 100.0  # N⋅m
        left_ankle.desired_torque = np.clip(
            left_ankle.desired_torque, -max_torque, max_torque
        )
        right_ankle.desired_torque = np.clip(
            right_ankle.desired_torque, -max_torque, max_torque
        )
```

### Complementary Filter for Sensor Fusion

IMUs have problems:
- **Accelerometer**: Accurate but noisy
- **Gyroscope**: Smooth but drifts over time

Solution: Combine them with a **complementary filter**:

```python
class IMUFusion:
    """Fuse accelerometer + gyroscope for accurate orientation"""

    def __init__(self, alpha=0.98):
        self.alpha = alpha  # 98% trust gyroscope, 2% trust accelerometer
        self.pitch = 0.0
        self.roll = 0.0

    def update(self, accel, gyro, dt):
        """
        Update orientation estimate

        Args:
            accel: [ax, ay, az] from accelerometer
            gyro: [gx, gy, gz] from gyroscope
            dt: time step
        """

        # Accelerometer-based pitch (vertical tilt)
        accel_pitch = np.arctan2(accel[0], np.sqrt(accel[1]**2 + accel[2]**2))

        # Gyroscope-based pitch (integrate rotation)
        gyro_pitch = self.pitch + gyro[1] * dt

        # Complementary filter: mostly trust gyro, occasionally correct with accel
        self.pitch = self.alpha * gyro_pitch + (1 - self.alpha) * accel_pitch

        # Same for roll
        accel_roll = np.arctan2(accel[1], np.sqrt(accel[0]**2 + accel[2]**2))
        gyro_roll = self.roll + gyro[0] * dt
        self.roll = self.alpha * gyro_roll + (1 - self.alpha) * accel_roll

        return self.roll, self.pitch
```

---

## Part 6: Safety - Emergency Stop

The most important feature of any robot controller: **Can it stop safely?**

```python
class SafetyController:
    """Monitor robot state and trigger emergency stop if needed"""

    def __init__(self):
        self.e_stop_triggered = False
        self.fall_threshold = 0.4  # radians (23 degrees)
        self.velocity_limit = 2.0  # m/s
        self.torque_limit = 150.0  # N⋅m

    def check_safety(self, robot_state):
        """Check all safety conditions"""

        # Check 1: Not falling
        if abs(robot_state.imu_roll) > self.fall_threshold:
            self.e_stop_triggered = True
            return "FALLING - EMERGENCY STOP!"

        # Check 2: Joint velocity limits
        for joint in robot_state.joints:
            if abs(joint.velocity) > self.velocity_limit:
                self.e_stop_triggered = True
                return f"Joint {joint.name} exceeds velocity limit!"

        # Check 3: Joint torque limits
        for joint in robot_state.joints:
            if abs(joint.torque) > self.torque_limit:
                self.e_stop_triggered = True
                return f"Joint {joint.name} exceeds torque limit!"

        # Check 4: Loss of contact (all feet in air)
        if not robot_state.left_foot_contact and not robot_state.right_foot_contact:
            self.e_stop_triggered = True
            return "Loss of contact - EMERGENCY STOP!"

        return "SAFE"

    def execute_emergency_stop(self):
        """Execute controlled shutdown"""

        # 1. Reduce all joint velocities to zero
        self.target_velocity = 0.0

        # 2. Apply maximum braking torque
        self.apply_braking_torque = True

        # 3. Ensure robot crouches to lower CoM (more stable when stopped)
        self.knee_angle_target = 1.57  # 90 degrees

        # 4. Lock all joints in place
        self.lock_all_joints = True

        # 5. Alert operators
        self.log_error("EMERGENCY STOP ACTIVATED")
```

---

## Interactive Component: PID Tuner

Below is the **PID Controller Tuner**—an interactive tool for visualizing PID responses:

### Features:
- 🎛️ **Adjust Kp, Ki, Kd** with sliders
- 📊 **Real-time step response graph** (using Recharts)
- 📈 **Performance metrics**: Rise time, overshoot, settling time
- ⚡ **Preset configurations**: Underdamped, critically damped, overdamped
- 💾 **Export parameters** for use in your robot

<!-- PIDTuner component will be embedded here during Phase 4 -->

---

## Quiz

Ready to test your understanding of control theory?

**What you should be able to answer:**
1. Why does a P-only controller oscillate?
2. What does the I term eliminate?
3. How does the D term improve response?
4. What does ZMP stand for and why does it matter?
5. What is the difference between swing and stance phases?
6. How would you detect robot imbalance using an IMU?
7. What safety limits should a robot controller enforce?

<!-- Quiz component will be embedded here -->

---

## Code Examples Available

All code from this lesson is available in ROS 2 Humble compatible formats:

- `pid_controller.py` - Basic joint-level PID implementation
- `zmp_controller.py` - Zero moment point stability checking
- `gait_generator.py` - Walking pattern generation
- `balance_controller.py` - IMU-based balance recovery
- `safety_monitor.py` - Emergency stop detection and response

---

## Summary

You've learned the foundations of bipedal locomotion control:

- ✅ **PID Control**: Proportional-Integral-Derivative feedback controllers
- ✅ **ZMP Stability**: Ensuring the robot doesn't tip over
- ✅ **Gait Generation**: Creating smooth, natural walking patterns
- ✅ **Sensor Fusion**: Combining IMU measurements for accurate state estimation
- ✅ **Balance Recovery**: Detecting and correcting imbalance in real-time
- ✅ **Safety Systems**: Emergency stops and protective limits

**Real robots use all of these together**: Low-level PID controllers handle each joint, while higher-level gait generation ensures the robot stays stable and walks naturally.

---

## Next Steps

1. Complete the interactive PID Tuner to visualize controller behavior
2. Try the balance controller in Gazebo simulation
3. Implement a simple walking pattern (2-DOF sagittal plane motion)
4. Move to Lesson 2.4: Deployment on Jetson hardware
5. Work on the capstone project: A complete walking humanoid

---

**Next Lesson**: [Lesson 2.4: Sim-to-Real Deployment Pipeline →](./lesson-2-4-deployment.md)
