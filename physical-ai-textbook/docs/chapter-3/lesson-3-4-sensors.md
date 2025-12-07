---
id: lesson-3-4-sensors
title: Lesson 3.4 - Sensor Simulation & Synthetic Data
sidebar_position: 4
keywords: [sensor-simulation, lidar, depth-camera, imu, synthetic-data, point-cloud, image-processing]
---

import { Lesson34 } from '@site/src/components/chapter-3/Lesson34Wrapper';

<Lesson34 />

---

# Lesson 3.4: Sensor Simulation & Synthetic Data (Detailed Content)

## Overview

Bring your simulations to life by adding realistic sensors and generating large-scale labeled datasets. This lesson teaches you to simulate LiDAR, depth cameras, and IMUs - then export the data for machine learning and perception pipeline development.

**Learning Duration**: 4 hours
**Hands-On Exercises**: 5 complete sensor projects

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Simulate LiDAR sensors** - generate point clouds with realistic range and noise
2. **Model depth cameras** - RGB-D streams with depth noise and camera distortion
3. **Configure IMUs** - accelerometer and gyroscope with bias, drift, and thermal noise
4. **Synchronize sensors** - handle multiple sensors with different frame rates
5. **Generate datasets** - 5000+ labeled images in COCO/YOLO formats
6. **Process sensor data** - Python pipelines to clean and analyze simulated sensor output
7. **Validate sim-to-real** - compare simulation vs. real sensor characteristics

## Prerequisites

- ✅ Lessons 3.1-3.3 completed (Gazebo, Unity, Isaac Sim)
- ✅ Understanding of 3D point clouds and image processing
- ✅ ROS 2 sensor message types (sensor_msgs)
- ✅ Python 3.10+ with NumPy, OpenCV, PIL

## Key Concepts

### Why Realistic Sensor Simulation?

Real sensors have imperfections:
- **LiDAR**: range limits, angular resolution, rain/fog attenuation
- **Depth cameras**: missing depth in reflective/dark regions, temporal noise
- **IMU**: gravity bias, acceleration drift, temperature sensitivity

Simulating these prepares your code for real deployment:

| Scenario | Gazebo Only | + Realistic Sensors |
|----------|-------------|-------------------|
| Robot navigation | ✅ Works | ✅ Works better (robust to noise) |
| ML training | ⚠️ Overfits | ✅ Generalizes well |
| Sim-to-real transfer | ❌ Fails often | ✅ High success rate |
| Perception debugging | ⚠️ Limited clues | ✅ Visual/data validation |

---

## Section 1: LiDAR Simulation

### 1.1 LiDAR Basics

LiDAR sends laser pulses and measures time-of-flight:

```
┌─────────────┐
│  Laser      │ → Distance to object
│  Receiver   │ → Reflectivity
│             │ → Angular position
└─────────────┘
```

**LiDAR Parameters**:

| Parameter | Typical Value | Effect |
|-----------|---------------|--------|
| Range | 0.1 - 100 m | Max detection distance |
| Resolution | 512 - 64000 pts/scan | Point cloud density |
| Frame rate | 10 - 20 Hz | Temporal resolution |
| Field of view | 120° - 360° | Horizontal coverage |

### 1.2 Gazebo LiDAR Plugin

Create `gazebo_lidar_sim.world`:

```xml
<sdf version="1.9">
  <world name="sensor_simulation">
    <model name="humanoid_with_lidar">
      <link name="base_link">
        <!-- Robot geometry -->
      </link>

      <!-- LiDAR sensor -->
      <sensor name="lidar" type="gpu_lidar">
        <pose>0 0 0.8 0 0 0</pose>  <!-- Mounted on head -->
        <topic>/lidar</topic>

        <plugin filename="gz-sim-gpu_lidar_system" name="libGazeboRosGpuLidar.so">
          <ros>
            <namespace>/humanoid</namespace>
            <remapping>~/out:=scan</remapping>
          </ros>
        </plugin>

        <ray>
          <scan>
            <horizontal>
              <samples>512</samples>
              <resolution>1</resolution>
              <min_angle>-3.14159</min_angle>
              <max_angle>3.14159</max_angle>
            </horizontal>
            <vertical>
              <samples>64</samples>
              <resolution>1</resolution>
              <min_angle>-0.262</min_angle>
              <max_angle>0.262</max_angle>
            </vertical>
          </scan>
          <range>
            <min>0.1</min>
            <max>100.0</max>
            <resolution>0.01</resolution>
          </range>
        </ray>

        <!-- Noise model (realistic) -->
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>0.08</stddev>  <!-- 8cm std dev -->
        </noise>
      </sensor>
    </model>
  </world>
</sdf>
```

### 1.3 Processing LiDAR Data

**Example 3.1: Read & Visualize Point Cloud**

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
import numpy as np
from sensor_msgs.msg import PointCloud2
import sensor_msgs.point_cloud2 as pc2

class LidarProcessor(Node):
    def __init__(self):
        super().__init__('lidar_processor')
        self.subscription = self.create_subscription(
            PointCloud2,
            '/humanoid/scan',
            self.lidar_callback,
            10)

    def lidar_callback(self, msg):
        # Convert ROS PointCloud2 to NumPy array
        points = np.array(list(pc2.read_points(msg)))

        # Extract x, y, z coordinates
        xyz = points[:, :3]

        # Compute statistics
        min_range = np.min(np.linalg.norm(xyz, axis=1))
        max_range = np.max(np.linalg.norm(xyz, axis=1))
        mean_range = np.mean(np.linalg.norm(xyz, axis=1))

        self.get_logger().info(
            f"Range: {min_range:.2f} - {max_range:.2f} m "
            f"(mean: {mean_range:.2f} m)"
        )

        # Check for obstacles ahead
        forward_points = xyz[(xyz[:, 0] > 0) & (np.abs(xyz[:, 1]) < 0.5)]
        if len(forward_points) > 0:
            closest_distance = np.min(forward_points[:, 0])
            if closest_distance < 1.0:
                self.get_logger().warn(
                    f"Obstacle detected at {closest_distance:.2f} m!"
                )

def main(args=None):
    rclpy.init(args=args)
    processor = LidarProcessor()
    rclpy.spin(processor)

if __name__ == '__main__':
    main()
```

---

## Section 2: Depth Camera Simulation

### 2.1 RGB-D Sensor Configuration

```xml
<sensor name="depth_camera" type="camera">
  <pose>0 0 0.8 0 0 0</pose>
  <topic>/depth_camera</topic>

  <camera>
    <horizontal_fov>1.047</horizontal_fov>  <!-- 60 degrees -->
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.05</near>
      <far>5.0</far>
    </clip>

    <!-- Lens distortion (realistic) -->
    <distortion>
      <k1>-0.1</k1>
      <k2>0.01</k2>
      <p1>0.005</p1>
      <p2>0.002</p2>
    </distortion>
  </camera>

  <!-- Depth image processing -->
  <plugin filename="gz-sim-sensors-system"
           name="libGazeboRosCameraSystem">
    <ros>
      <namespace>/humanoid</namespace>
      <remapping>~/image:=rgb</remapping>
      <remapping>~/depth:=depth</remapping>
    </ros>
  </plugin>
</sensor>
```

### 2.2 Processing Depth Images

**Example 3.2: Depth-Based Obstacle Detection**

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
import cv2
import numpy as np
from sensor_msgs.msg import Image
from cv_bridge import CvBridge

class DepthProcessor(Node):
    def __init__(self):
        super().__init__('depth_processor')
        self.bridge = CvBridge()

        self.subscription = self.create_subscription(
            Image,
            '/humanoid/depth',
            self.depth_callback,
            10)

    def depth_callback(self, msg):
        # Convert ROS Image to OpenCV format
        depth_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='passthrough')

        # Normalize for visualization
        depth_normalized = cv2.normalize(
            depth_image, None, 0, 255, cv2.NORM_MINMAX
        ).astype(np.uint8)

        # Find obstacles (close objects)
        MIN_DISTANCE = 0.3  # 30cm threshold
        close_mask = depth_image < MIN_DISTANCE

        # Morphological operations to filter noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        close_filtered = cv2.morphologyEx(close_mask, cv2.MORPH_CLOSE, kernel)

        # Find contours (obstacles)
        contours, _ = cv2.findContours(
            close_filtered.astype(np.uint8),
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        if len(contours) > 0:
            self.get_logger().warn(
                f"Found {len(contours)} obstacles within {MIN_DISTANCE}m"
            )

            # Draw bounding boxes
            visualization = cv2.cvtColor(depth_normalized, cv2.COLOR_GRAY2BGR)
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(visualization, (x, y), (x + w, y + h), (0, 0, 255), 2)

            # Display
            cv2.imshow("Obstacles", visualization)
            cv2.waitKey(1)

def main(args=None):
    rclpy.init(args=args)
    processor = DepthProcessor()
    rclpy.spin(processor)

if __name__ == '__main__':
    main()
```

---

## Section 3: IMU Simulation

### 3.1 IMU Sensor Configuration

```xml
<sensor name="imu" type="imu">
  <pose>0 0 0.5 0 0 0</pose>  <!-- Mounted on chest -->
  <topic>/imu</topic>

  <!-- Accelerometer specs -->
  <imu>
    <angular_velocity>
      <x>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.001</stddev>  <!-- 0.001 rad/s -->
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <stddev>0.001</stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <stddev>0.001</stddev>
        </noise>
      </z>
    </angular_velocity>

    <linear_acceleration>
      <x>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.05</stddev>  <!-- 0.05 m/s² -->
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <stddev>0.05</stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <stddev>0.05</stddev>
        </noise>
      </z>
    </linear_acceleration>
  </imu>

  <plugin filename="gz-sim-imu-system"
           name="libGazeboRosImuSystem">
    <ros>
      <namespace>/humanoid</namespace>
    </ros>
  </plugin>
</sensor>
```

### 3.2 Processing IMU Data

**Example 3.3: IMU-Based Orientation Estimation**

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
import numpy as np
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Quaternion
import math

class IMUProcessor(Node):
    def __init__(self):
        super().__init__('imu_processor')

        self.subscription = self.create_subscription(
            Imu,
            '/humanoid/imu',
            self.imu_callback,
            10)

        # State variables
        self.pitch = 0.0
        self.roll = 0.0
        self.dt = 0.01  # Assume 100Hz IMU

    def imu_callback(self, msg):
        # Extract acceleration and angular velocity
        accel = np.array([
            msg.linear_acceleration.x,
            msg.linear_acceleration.y,
            msg.linear_acceleration.z
        ])

        angular_vel = np.array([
            msg.angular_velocity.x,
            msg.angular_velocity.y,
            msg.angular_velocity.z
        ])

        # Complementary filter (fusion of accelerometer + gyroscope)
        # Accelerometer: slow but accurate
        # Gyroscope: fast but drifts

        alpha = 0.98  # Weight for gyroscope

        # Accelerometer-based pitch/roll
        accel_pitch = math.atan2(accel[1], accel[2])
        accel_roll = math.atan2(accel[0], accel[2])

        # Integrate gyroscope for pitch/roll
        self.pitch = alpha * (self.pitch + angular_vel[0] * self.dt) + \
                     (1 - alpha) * accel_pitch
        self.roll = alpha * (self.roll + angular_vel[1] * self.dt) + \
                    (1 - alpha) * accel_roll

        # Check if robot is tipping (excessive roll)
        if abs(self.roll) > 0.3:  # ~17 degrees
            self.get_logger().warn(
                f"Robot tipping! Roll = {math.degrees(self.roll):.1f}°"
            )

        self.get_logger().info(
            f"Pitch: {math.degrees(self.pitch):6.1f}° "
            f"Roll: {math.degrees(self.roll):6.1f}°"
        )

def main(args=None):
    rclpy.init(args=args)
    processor = IMUProcessor()
    rclpy.spin(processor)

if __name__ == '__main__':
    main()
```

---

## Section 4: Synthetic Dataset Generation

### 4.1 Automated Export Pipeline

**Example 3.4: Generate COCO Dataset**

```python
#!/usr/bin/env python3
import json
import cv2
import numpy as np
from pathlib import Path
from datetime import datetime

class SyntheticDatasetGenerator:
    def __init__(self, output_dir="./synthetic_dataset"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Create subdirectories
        (self.output_dir / "images").mkdir(exist_ok=True)
        (self.output_dir / "depth_maps").mkdir(exist_ok=True)

        # COCO format
        self.coco_data = {
            "info": {
                "description": "Synthetic humanoid robot dataset",
                "version": "1.0",
                "year": 2024,
                "date_created": datetime.now().isoformat()
            },
            "images": [],
            "annotations": [],
            "categories": [
                {"id": 1, "name": "humanoid"},
                {"id": 2, "name": "ground"},
                {"id": 3, "name": "obstacle"}
            ]
        }

        self.image_id = 0
        self.annotation_id = 0

    def add_frame(self, rgb_image, depth_image, joint_poses):
        """Add a single frame to the dataset"""

        # Save RGB image
        rgb_path = self.output_dir / "images" / f"frame_{self.image_id:06d}.jpg"
        cv2.imwrite(str(rgb_path), rgb_image)

        # Save depth image
        depth_path = self.output_dir / "depth_maps" / f"frame_{self.image_id:06d}.png"
        cv2.imwrite(str(depth_path), depth_image)

        # Add to COCO
        self.coco_data["images"].append({
            "id": self.image_id,
            "file_name": str(rgb_path.name),
            "height": rgb_image.shape[0],
            "width": rgb_image.shape[1]
        })

        # Add annotation with joint poses as metadata
        self.coco_data["annotations"].append({
            "id": self.annotation_id,
            "image_id": self.image_id,
            "category_id": 1,
            "metadata": {
                "joint_poses": joint_poses.tolist()
            }
        })

        self.image_id += 1
        self.annotation_id += 1

    def save(self):
        """Save COCO annotations to JSON"""
        coco_path = self.output_dir / "annotations.json"
        with open(coco_path, 'w') as f:
            json.dump(self.coco_data, f, indent=2)

        print(f"Dataset saved: {self.output_dir}")
        print(f"Total frames: {len(self.coco_data['images'])}")

# Usage
generator = SyntheticDatasetGenerator()

for frame_idx in range(1000):  # Generate 1000 frames
    # Simulate frame capture (replace with actual sensor data)
    rgb_image = np.random.randint(0, 256, (480, 640, 3), dtype=np.uint8)
    depth_image = np.random.randint(0, 256, (480, 640), dtype=np.uint8)
    joint_poses = np.random.randn(20)  # 20 joints

    generator.add_frame(rgb_image, depth_image, joint_poses)

    if (frame_idx + 1) % 100 == 0:
        print(f"Generated {frame_idx + 1} frames...")

generator.save()
```

---

## Section 5: Validation & Quality Assurance

### 5.1 Dataset Validation

```python
def validate_dataset(dataset_dir):
    """Check dataset integrity"""

    annotations_file = dataset_dir / "annotations.json"

    with open(annotations_file) as f:
        coco = json.load(f)

    errors = []

    # Check all images exist
    for img in coco["images"]:
        img_path = dataset_dir / "images" / img["file_name"]
        if not img_path.exists():
            errors.append(f"Missing image: {img_path}")

    # Check annotations reference valid images
    image_ids = set(img["id"] for img in coco["images"])
    for ann in coco["annotations"]:
        if ann["image_id"] not in image_ids:
            errors.append(f"Invalid image_id in annotation {ann['id']}")

    # Check depth maps
    for img in coco["images"]:
        depth_path = dataset_dir / "depth_maps" / img["file_name"].replace(".jpg", ".png")
        if not depth_path.exists():
            errors.append(f"Missing depth map: {depth_path}")

    if errors:
        print(f"Found {len(errors)} errors:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("✓ Dataset is valid!")
        print(f"  - {len(coco['images'])} images")
        print(f"  - {len(coco['annotations'])} annotations")

# Usage
validate_dataset(Path("./synthetic_dataset"))
```

---

## Hands-On Exercises

### Exercise 1: Simulate LiDAR Scan
**Duration**: 45 minutes

1. Launch Gazebo with LiDAR-equipped humanoid
2. Subscribe to `/lidar` topic
3. Visualize point cloud in RViz2
4. Measure max range and point density

### Exercise 2: Depth-Based Obstacle Avoidance
**Duration**: 1.5 hours

1. Add depth camera to humanoid
2. Implement obstacle detection (Example 3.2)
3. Modify `/cmd_vel` controller to avoid obstacles
4. Test in Gazebo

### Exercise 3: Generate 5000-Frame Dataset
**Duration**: 2 hours

1. Configure all 3 sensors (LiDAR, RGB-D, IMU)
2. Run simulation with domain randomization
3. Export 5000 frames to COCO format
4. Validate dataset integrity

### Exercise 4: Sim-to-Real Sensor Comparison
**Duration**: 1 hour

1. Compare simulated sensor noise vs. real (if hardware available)
2. Validate sensor calibration (ranges, resolutions)
3. Document differences in technical report

---

## Summary

✅ **LiDAR simulation** - point clouds with realistic noise
✅ **Depth camera** - RGB-D streams with distortion
✅ **IMU fusion** - accelerometer + gyroscope complementary filtering
✅ **Multi-sensor sync** - handle different frame rates
✅ **Synthetic data** - automated dataset generation
✅ **Quality validation** - ensure dataset integrity

## Next Steps

- **Chapter 4**: Use these sensor streams for VLM training
- **Advanced**: Implement custom perception pipelines
- **Deployment**: Transfer to real robots (Jetson, physical hardware)

---

## Resources

- **ROS 2 Sensor Messages**: https://docs.ros.org/en/humble/Conceptual-Overview/Understanding-ROS/Fundamentals/Basic-ROS-2-Concepts.html#sensor-messages
- **OpenCV Point Cloud Processing**: https://docs.opencv.org/master/modules.html
- **COCO Dataset Format**: https://cocodataset.org/
- **Sensor Noise Models**: https://www.gazebosim.org/docs

---

[← Back to Chapter 3 Overview](./chapter-3-index.md) | [← Previous: Isaac Sim](./lesson-3-3-isaac-sim.md)
