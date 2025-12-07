---
id: lesson-3-2-unity
title: Lesson 3.2 - High-Fidelity Rendering with Unity
sidebar_position: 2
keywords: [unity, high-fidelity-rendering, robotics-hub, ros-tcp, materials, lighting]
---

import { Lesson32 } from '@site/src/components/chapter-3/Lesson32Wrapper';

<Lesson32 />

---

# Lesson 3.2: High-Fidelity Rendering with Unity (Detailed Content)

## Overview

Transform your Gazebo physics simulation into a visually stunning environment using Unity and the NVIDIA Robotics Hub. This lesson bridges physics-accurate simulation with photorealistic graphics.

**Learning Duration**: 3 hours
**Hands-On Exercises**: 3 interactive projects

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Install Unity Robotics Hub** - set up ROS-TCP-Connector for real-time integration
2. **Import robot models** - convert URDF/Gazebo meshes to Unity assets
3. **Configure materials** - apply textures, metals, and physically-based rendering (PBR)
4. **Design lighting** - use HDRI, directional, and area lights for photorealism
5. **Build interactive scenes** - enable real-time ROS 2 control in Unity
6. **Export and optimize** - prepare scenes for deployment

## Prerequisites

- ✅ Lesson 3.1 (Gazebo) completed
- ✅ Unity 2022 LTS or newer installed
- ✅ ROS 2 Humble or Iron working
- ✅ Basic understanding of 3D graphics (meshes, materials, lighting)

## Key Concepts

### Why High-Fidelity Rendering?

| Use Case | Gazebo Only | + Unity Rendering |
|----------|-------------|-------------------|
| Physics development | ✅ Efficient | ❌ Overkill |
| Visualization for stakeholders | ⚠️ Basic | ✅ Professional |
| Debugging complex behavior | ⚠️ Limited | ✅ Visual clues |
| Sim-to-real validation | ⚠️ Physics only | ✅ Includes visual realism |
| ML training data | ❌ Low visual fidelity | ✅ Photorealistic |

### Unity Robotics Hub Overview

Unity Robotics Hub provides:
- **ROS-TCP-Connector**: bidirectional communication over TCP
- **Joint publishers/subscribers**: sync Gazebo and Unity
- **TF2 support**: transform visualization
- **Asset import tools**: URDF/SDF to Unity conversion
- **Example projects**: learning resources

---

## Section 1: Setting Up Unity + ROS 2

### 1.1 Install Dependencies

```bash
# Unity Robotics Hub via Package Manager
# In Unity: Window → TextMesh Pro → Import TMP Essential Resources
# Then: Window → Package Manager
# Add by git URL: https://github.com/Unity-Technologies/ROS-TCP-Connector.git
```

### 1.2 Configure ROS-TCP-Connector

Create `RosTcpConnector.cs`:

```csharp
using RosMessageTypes.Std;
using Unity.Robotics.ROSTcp;
using UnityEngine;

public class RosTcpManager : MonoBehaviour
{
    public ROSConnection ros;
    public string rosNodeName = "/unity_node";

    void Start()
    {
        ros = GetComponent<ROSConnection>();

        // Connect to ROS 2 (localhost:10000)
        ros.Connect(
            "127.0.0.1",  // ROS 2 host
            10000,        // ROS bridge port
            onConnect: OnRosConnected
        );
    }

    void OnRosConnected()
    {
        Debug.Log("Connected to ROS 2!");
    }
}
```

### 1.3 Subscribe to Joint States

```csharp
// Subscribe to /joint_states from Gazebo
ros.Subscribe<sensor_msgs.JointState>(
    "/joint_states",
    JointStateCallback
);

void JointStateCallback(sensor_msgs.JointState msg)
{
    // Update Unity joint positions based on Gazebo data
    for (int i = 0; i < msg.name.Length; i++)
    {
        UpdateJointAngle(msg.name[i], msg.position[i]);
    }
}
```

---

## Section 2: Importing Robot Models

### 2.1 Export URDF from Gazebo

```bash
# Export URDF to mesh formats (DAE, FBX)
rosrun urdf_to_gazebo humanoid_robot.urdf > humanoid.gazebo
collada_urdf_to_mesh humanoid_robot.urdf output/humanoid.dae
```

### 2.2 Import into Unity

1. **Asset Structure**:
   ```
   Assets/
   ├── Models/
   │   ├── Humanoid/
   │   │   ├── humanoid.fbx
   │   │   └── meshes/
   │   │       ├── torso.obj
   │   │       ├── arm_left.obj
   │   │       └── leg_right.obj
   │   └── Environment/
   │       └── ground_plane.fbx
   ├── Materials/
   └── Scenes/
       └── SimulationScene.unity
   ```

2. **Configure Import Settings**:
   - Select `.fbx` file
   - Inspector: Rig → Humanoid (or Generic)
   - Animation → set to None (physics-driven)
   - Materials → Generate Materials

### 2.3 Set Up Joint Hierarchy

```csharp
public class RobotJoint : MonoBehaviour
{
    public string jointName;
    public Rigidbody rigidbody;
    public Quaternion initialRotation;

    void Start()
    {
        rigidbody = GetComponent<Rigidbody>();
        initialRotation = transform.localRotation;
    }

    public void SetRotation(float angle)
    {
        // angle in radians
        Quaternion targetRotation =
            Quaternion.AngleAxis(Mathf.Rad2Deg * angle, Vector3.up);
        transform.localRotation = initialRotation * targetRotation;
    }
}
```

---

## Section 3: Materials & Lighting

### 3.1 Physically-Based Rendering (PBR)

Create `Assets/Materials/RobotSkin.mat`:

```
Material Properties:
├── Base Color: RGB(0.8, 0.8, 0.8) - light gray
├── Metallic: 0.3 (slight metal)
├── Smoothness: 0.6 (realistic roughness)
├── Normal Map: robot_normal.png
└── Occlusion Map: robot_ao.png
```

Apply to robot meshes:
```csharp
Renderer renderer = GetComponent<Renderer>();
renderer.material = Resources.Load<Material>("Materials/RobotSkin");
```

### 3.2 Lighting Setup

**HDRI Background + Three-Point Lighting**:

1. **HDRI (High Dynamic Range Image)**:
   ```csharp
   // Assets > Create > Light > Environment → HDRI texture
   RenderSettings.skybox = Resources.Load<Material>("HDRI/studio_lighting");
   RenderSettings.ambientIntensity = 1.2f;
   ```

2. **Key Light** (Main illumination):
   ```csharp
   Light keyLight = Instantiate(lightPrefab);
   keyLight.type = LightType.Directional;
   keyLight.intensity = 1.5f;
   keyLight.transform.rotation = Quaternion.Euler(45, 45, 0);
   ```

3. **Fill Light** (Shadow softening):
   ```csharp
   Light fillLight = Instantiate(lightPrefab);
   fillLight.intensity = 0.5f;
   fillLight.color = Color.white;
   fillLight.transform.rotation = Quaternion.Euler(-30, -45, 0);
   ```

---

## Section 4: Real-Time ROS 2 Integration

### 4.1 Publisher (Unity → Gazebo)

```csharp
public class CommandPublisher : MonoBehaviour
{
    private ROSConnection ros;
    private string topicName = "/cmd_vel";

    void Start()
    {
        ros = GetComponent<ROSConnection>();
    }

    public void PublishCommand(float linearX, float angularZ)
    {
        var twist = new geometry_msgs.Twist
        {
            linear = new geometry_msgs.Vector3 { x = linearX },
            angular = new geometry_msgs.Vector3 { z = angularZ }
        };

        ros.Publish(topicName, twist);
    }
}
```

### 4.2 Example: Interactive Movement

```csharp
void Update()
{
    float moveInput = Input.GetAxis("Vertical");  // W/S keys
    float rotateInput = Input.GetAxis("Horizontal");  // A/D keys

    PublishCommand(moveInput * 1.0f, rotateInput * 0.5f);
}
```

---

## Section 5: Scene Composition Example

**Scene Hierarchy**:
```
SimulationScene
├── World
│   ├── GroundPlane (Mesh, Material)
│   ├── Lighting
│   │   ├── KeyLight (Directional)
│   │   ├── FillLight (Directional)
│   │   └── Backlight (Directional)
│   └── Camera (Main)
├── Humanoid (Root)
│   ├── Base Link (RobotJoint.cs)
│   ├── Torso (RobotJoint.cs)
│   ├── Arm Left (Articulation)
│   │   ├── Shoulder (RobotJoint.cs)
│   │   ├── Elbow (RobotJoint.cs)
│   │   └── Wrist (RobotJoint.cs)
│   └── Leg Right (Articulation)
│       ├── Hip (RobotJoint.cs)
│       ├── Knee (RobotJoint.cs)
│       └── Ankle (RobotJoint.cs)
└── ROS Controllers
    ├── ROSConnection
    ├── JointStateSubscriber
    └── CommandPublisher
```

---

## Hands-On Exercises

### Exercise 1: Import Humanoid Model
**Duration**: 45 minutes

1. Export your Chapter 2 humanoid to FBX
2. Create new Unity project (3D)
3. Import FBX and configure materials
4. Test visualization in Scene view

### Exercise 2: Light a Scene Professionally
**Duration**: 1 hour

1. Add HDRI background
2. Set up three-point lighting
3. Adjust shadows and reflections
4. Screenshot for documentation

### Exercise 3: Real-Time ROS 2 Control
**Duration**: 1.5 hours

1. Install ROS-TCP-Connector
2. Subscribe to `/joint_states` from Gazebo
3. Animate robot in Unity based on Gazebo simulation
4. Publish `/cmd_vel` to move Gazebo robot from Unity

---

## Performance Optimization

### Rendering Bottlenecks

| Issue | Solution |
|-------|----------|
| Low FPS | Use LOD (Level of Detail) meshes, bake lighting |
| High memory | Compress textures, reduce mesh polygon count |
| Shader complexity | Use simpler PBR shaders for real-time |
| Lighting cost | Bake directional light, use reflection probes |

```csharp
// LOD Group for performance
LODGroup lodGroup = robot.AddComponent<LODGroup>();
LOD[] lods = new LOD[2];
lods[0] = new LOD(0.5f, highDetailRenderer);  // 50% screen size
lods[1] = new LOD(0.25f, lowDetailRenderer);  // 25% screen size
lodGroup.SetLODs(lods);
```

---

## Validation Checklist

Before moving to Lesson 3.3:

- [ ] Unity project set up and compiles
- [ ] Robot model imported and displayed
- [ ] Materials applied and realistic
- [ ] Lighting creates convincing shadows/reflections
- [ ] ROS-TCP-Connector communicates with ROS 2
- [ ] Joint states update in real-time from Gazebo
- [ ] Can control robot via keyboard input
- [ ] Frame rate > 30 FPS on standard hardware

---

## Summary

✅ **Unity Robotics Hub setup** - ROS-TCP-Connector running
✅ **Model import** - URDF → FBX → Unity
✅ **PBR materials** - realistic textures and properties
✅ **Professional lighting** - HDRI + three-point system
✅ **Real-time ROS 2** - full bidirectional sync with Gazebo

## Next Steps

- **Lesson 3.3**: Step up to NVIDIA Isaac Sim for even higher photorealism
- **Lesson 3.4**: Add realistic sensors to your scenes
- **Chapter 4**: Use these rendered scenes for VLM training

---

## Resources

- **Unity Robotics Hub**: https://github.com/Unity-Technologies/Robotics-Hub
- **ROS-TCP-Connector**: https://github.com/Unity-Technologies/ROS-TCP-Connector
- **Material Design**: https://docs.unity3d.com/Manual/StandardShaderMaterialCharts.html
- **Lighting Setup**: https://docs.unity3d.com/Manual/Lighting.html

---

[← Back to Chapter 3 Overview](./chapter-3-index.md) | [← Previous: Gazebo](./lesson-3-1-gazebo.md) | [Next: Isaac Sim →](./lesson-3-3-isaac-sim.md)
