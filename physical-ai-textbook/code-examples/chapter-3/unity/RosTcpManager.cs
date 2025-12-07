using UnityEngine;
using Unity.Robotics.ROSTcp;
using RosMessageTypes.Geometry;
using RosMessageTypes.Sensor;

/// <summary>
/// Chapter 3.2: Unity ROS 2 TCP Manager
///
/// This script manages bidirectional communication between Unity and ROS 2 using ROS-TCP-Connector.
/// It demonstrates:
/// - Connecting to ROS 2 bridge
/// - Publishing velocity commands to move the robot
/// - Subscribing to joint state feedback from Gazebo
/// - Real-time robot animation based on sensor data
///
/// Setup:
/// 1. Create empty GameObject called "ROSBridge"
/// 2. Add this script as a component
/// 3. Set ROS bridge IP (default: 127.0.0.1)
/// 4. Set ROS bridge port (default: 10000)
/// 5. Attach humanoid model with RobotAnimator script
///
/// Usage:
/// - Press W/A/S/D to move/rotate robot
/// - Robot in Gazebo mirrors movements in real-time
/// - Joint positions update animation in real-time
/// </summary>
public class RosTcpManager : MonoBehaviour
{
    [Header("ROS Connection Settings")]
    [SerializeField] private string rosNodeName = "/unity_node";
    [SerializeField] private string rosHostIp = "127.0.0.1";
    [SerializeField] private int rosHostPort = 10000;

    [Header("Robot References")]
    [SerializeField] private RobotAnimator robotAnimator;

    [Header("Movement Settings")]
    [SerializeField] private float linearSpeed = 0.5f;  // m/s
    [SerializeField] private float angularSpeed = 0.3f;  // rad/s

    private ROSConnection ros;
    private bool isConnected = false;
    private string cmdVelTopic = "/cmd_vel";
    private string jointStatesTopic = "/joint_states";


    private void Start()
    {
        // Get or create ROSConnection component
        ros = GetComponent<ROSConnection>();
        if (ros == null)
        {
            ros = gameObject.AddComponent<ROSConnection>();
        }

        // Connect to ROS 2 bridge
        ConnectToROS();
    }


    private void ConnectToROS()
    {
        Debug.Log($"[RosTcpManager] Connecting to ROS 2 at {rosHostIp}:{rosHostPort}");

        ros.Connect(
            ipAddress: rosHostIp,
            port: rosHostPort,
            onConnect: OnRosConnected,
            onDisconnect: OnRosDisconnected,
            timeoutS: 5
        );
    }


    private void OnRosConnected()
    {
        Debug.Log("[RosTcpManager] Successfully connected to ROS 2!");
        isConnected = true;

        // Subscribe to joint states from Gazebo
        ros.Subscribe<JointStateMsg>(
            topic: jointStatesTopic,
            callback: OnJointStatesReceived
        );

        Debug.Log($"[RosTcpManager] Subscribed to {jointStatesTopic}");
    }


    private void OnRosDisconnected()
    {
        Debug.LogWarning("[RosTcpManager] Disconnected from ROS 2");
        isConnected = false;
    }


    private void Update()
    {
        if (!isConnected)
            return;

        // Handle keyboard input
        HandleInput();
    }


    private void HandleInput()
    {
        float linearX = 0f;
        float angularZ = 0f;

        // W/S keys for forward/backward movement
        if (Input.GetKey(KeyCode.W))
        {
            linearX = linearSpeed;
        }
        else if (Input.GetKey(KeyCode.S))
        {
            linearX = -linearSpeed;
        }

        // A/D keys for left/right rotation
        if (Input.GetKey(KeyCode.A))
        {
            angularZ = angularSpeed;
        }
        else if (Input.GetKey(KeyCode.D))
        {
            angularZ = -angularSpeed;
        }

        // Publish velocity command if there's movement
        if (linearX != 0f || angularZ != 0f)
        {
            PublishVelocityCommand(linearX, angularZ);
        }
        else
        {
            // Stop the robot if no input
            PublishVelocityCommand(0f, 0f);
        }
    }


    private void PublishVelocityCommand(float linearX, float angularZ)
    {
        // Create Twist message (geometry_msgs/Twist)
        var twistMsg = new TwistMsg
        {
            linear = new Vector3Msg
            {
                x = linearX,
                y = 0f,
                z = 0f
            },
            angular = new Vector3Msg
            {
                x = 0f,
                y = 0f,
                z = angularZ
            }
        };

        // Publish to /cmd_vel topic
        ros.Publish(cmdVelTopic, twistMsg);
    }


    private void OnJointStatesReceived(JointStateMsg msg)
    {
        if (robotAnimator == null)
        {
            Debug.LogWarning("[RosTcpManager] RobotAnimator not assigned!");
            return;
        }

        // Update robot animation based on joint state feedback
        for (int i = 0; i < msg.name.Length; i++)
        {
            string jointName = msg.name[i];
            double jointPosition = msg.position[i];
            double jointVelocity = msg.velocity[i];

            // Convert radians to degrees for Unity
            float angleDegrees = (float)(jointPosition * 180f / System.Math.PI);

            // Update the corresponding joint in the animator
            robotAnimator.UpdateJointAngle(jointName, angleDegrees);
        }
    }


    public bool IsConnected => isConnected;

    public void SetLinearSpeed(float speed) => linearSpeed = speed;
    public void SetAngularSpeed(float speed) => angularSpeed = speed;
}


/// <summary>
/// Helper class to animate robot joints based on joint state updates from Gazebo.
/// </summary>
public class RobotAnimator : MonoBehaviour
{
    [System.Serializable]
    private class JointMapping
    {
        public string rosJointName;
        public Transform unityBoneTransform;
        public Vector3 rotationAxis = Vector3.Y;
    }

    [SerializeField] private JointMapping[] jointMappings;


    public void UpdateJointAngle(string jointName, float angleDegrees)
    {
        // Find matching joint mapping
        foreach (var mapping in jointMappings)
        {
            if (mapping.rosJointName == jointName && mapping.unityBoneTransform != null)
            {
                // Apply rotation based on axis
                Vector3 localRotation = mapping.rotationAxis * angleDegrees;
                mapping.unityBoneTransform.localRotation = Quaternion.Euler(localRotation);
                break;
            }
        }
    }


    public void SetupJointMappings(JointMapping[] mappings)
    {
        jointMappings = mappings;
    }
}
