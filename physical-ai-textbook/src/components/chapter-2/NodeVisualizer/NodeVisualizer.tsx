import React, { useState, useEffect, useRef } from 'react';
import styles from './NodeVisualizer.module.css';
import { SimulationVisualization } from './SimulationVisualization';
import { NodeDetails } from './NodeDetails';
import { TopicBrowser } from './TopicBrowser';

/**
 * Node Visualizer Component
 *
 * Interactive visualization of ROS 2 node graph.
 * Shows nodes, topics, publishers, and subscribers in real-time.
 */

interface Node {
  id: string;
  name: string;
  type: 'publisher' | 'subscriber' | 'both';
  topics: string[];
  description: string;
  color: string;
}

interface Topic {
  name: string;
  type: string;
  publishers: string[];
  subscribers: string[];
  messageRate?: number;
}

interface ConnectionVisualizerProps {
  selectedNode?: string;
  selectedTopic?: string;
  onNodeSelect?: (nodeId: string) => void;
  onTopicSelect?: (topicName: string) => void;
}

const DEMO_NODES: Node[] = [
  {
    id: 'camera_driver',
    name: 'Camera Driver',
    type: 'publisher',
    topics: ['/camera/image_raw', '/camera/camera_info'],
    description: 'Publishes raw camera images at 30Hz',
    color: '#1976d2'
  },
  {
    id: 'object_detector',
    name: 'Object Detector',
    type: 'both',
    topics: ['/camera/image_raw', '/detections'],
    description: 'Subscribes to images, publishes detected objects',
    color: '#388e3c'
  },
  {
    id: 'motion_planner',
    name: 'Motion Planner',
    type: 'both',
    topics: ['/detections', '/trajectory'],
    description: 'Plans robot motion based on detected objects',
    color: '#f57c00'
  },
  {
    id: 'arm_controller',
    name: 'Arm Controller',
    type: 'subscriber',
    topics: ['/trajectory', '/joint_commands'],
    description: 'Executes trajectories on robot arm',
    color: '#c62828'
  },
  {
    id: 'imu_sensor',
    name: 'IMU Sensor',
    type: 'publisher',
    topics: ['/imu/data'],
    description: 'Publishes accelerometer and gyro data',
    color: '#7b1fa2'
  },
  {
    id: 'logger_monitor',
    name: 'Logger/Monitor',
    type: 'subscriber',
    topics: ['/camera/image_raw', '/detections', '/trajectory', '/imu/data'],
    description: 'Records all system data to disk',
    color: '#0097a7'
  }
];

const DEMO_TOPICS: Topic[] = [
  {
    name: '/camera/image_raw',
    type: 'sensor_msgs/Image',
    publishers: ['camera_driver'],
    subscribers: ['object_detector', 'logger_monitor'],
    messageRate: 30
  },
  {
    name: '/camera/camera_info',
    type: 'sensor_msgs/CameraInfo',
    publishers: ['camera_driver'],
    subscribers: [],
    messageRate: 30
  },
  {
    name: '/detections',
    type: 'custom_msgs/Detections',
    publishers: ['object_detector'],
    subscribers: ['motion_planner', 'logger_monitor'],
    messageRate: 30
  },
  {
    name: '/trajectory',
    type: 'trajectory_msgs/JointTrajectory',
    publishers: ['motion_planner'],
    subscribers: ['arm_controller', 'logger_monitor'],
    messageRate: 10
  },
  {
    name: '/joint_commands',
    type: 'sensor_msgs/JointState',
    publishers: ['arm_controller'],
    subscribers: ['logger_monitor'],
    messageRate: 100
  },
  {
    name: '/imu/data',
    type: 'sensor_msgs/Imu',
    publishers: ['imu_sensor'],
    subscribers: ['logger_monitor'],
    messageRate: 200
  }
];

export const NodeVisualizer: React.FC<ConnectionVisualizerProps> = ({
  selectedNode: initialNode,
  selectedTopic: initialTopic,
  onNodeSelect,
  onTopicSelect
}) => {
  const [selectedNode, setSelectedNode] = useState<string | undefined>(initialNode);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(initialTopic);
  const [viewMode, setViewMode] = useState<'graph' | 'details' | 'topics'>('graph');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [messageFlow, setMessageFlow] = useState<string | null>(null);

  // Handle node selection
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId);
    setViewMode('details');
    onNodeSelect?.(nodeId);
  };

  // Handle topic selection
  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName);
    setViewMode('topics');
    onTopicSelect?.(topicName);
  };

  // Simulate message flow animation
  useEffect(() => {
    if (!isAutoPlay) return;

    const topics = DEMO_TOPICS;
    let currentIndex = 0;

    const interval = setInterval(() => {
      setMessageFlow(topics[currentIndex].name);
      currentIndex = (currentIndex + 1) % topics.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const selectedNodeData = DEMO_NODES.find(n => n.id === selectedNode);
  const selectedTopicData = DEMO_TOPICS.find(t => t.name === selectedTopic);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ROS 2 Node Graph Visualizer</h2>
        <p>Interactive visualization of nodes, topics, and message flow</p>
      </div>

      <div className={styles.controlBar}>
        <div className={styles.viewModes}>
          <button
            className={`${styles.modeButton} ${viewMode === 'graph' ? styles.active : ''}`}
            onClick={() => setViewMode('graph')}
          >
            Graph View
          </button>
          <button
            className={`${styles.modeButton} ${viewMode === 'details' ? styles.active : ''}`}
            onClick={() => setViewMode('details')}
          >
            Node Details
          </button>
          <button
            className={`${styles.modeButton} ${viewMode === 'topics' ? styles.active : ''}`}
            onClick={() => setViewMode('topics')}
          >
            Topic Browser
          </button>
        </div>

        <div className={styles.controls}>
          <label className={styles.autoPlayLabel}>
            <input
              type="checkbox"
              checked={isAutoPlay}
              onChange={(e) => setIsAutoPlay(e.target.checked)}
            />
            Auto-play message flow
          </label>
        </div>
      </div>

      <div className={styles.content}>
        {viewMode === 'graph' && (
          <SimulationVisualization
            nodes={DEMO_NODES}
            topics={DEMO_TOPICS}
            selectedNode={selectedNode}
            selectedTopic={selectedTopic}
            messageFlow={messageFlow}
            onNodeSelect={handleNodeSelect}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {viewMode === 'details' && selectedNodeData && (
          <NodeDetails
            node={selectedNodeData}
            allTopics={DEMO_TOPICS}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {viewMode === 'topics' && selectedTopicData && (
          <TopicBrowser
            topic={selectedTopicData}
            allNodes={DEMO_NODES}
            onNodeSelect={handleNodeSelect}
          />
        )}

        {viewMode === 'details' && !selectedNodeData && (
          <div className={styles.emptyState}>
            <p>Select a node from the graph to view details</p>
          </div>
        )}

        {viewMode === 'topics' && !selectedTopicData && (
          <div className={styles.emptyState}>
            <p>Select a topic from the graph to view details</p>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <details>
          <summary>How to Use This Visualizer</summary>
          <div className={styles.infoContent}>
            <h4>Graph View</h4>
            <ul>
              <li>Click on a node to see its details</li>
              <li>Click on a topic to browse its information</li>
              <li>Watch the message flow animation to see data moving through the system</li>
              <li>Each connection shows publishers → subscribers</li>
            </ul>

            <h4>Node Details</h4>
            <ul>
              <li>View detailed information about each node</li>
              <li>See which topics the node publishes to or subscribes from</li>
              <li>Inspect message types and rates</li>
            </ul>

            <h4>Topic Browser</h4>
            <ul>
              <li>Explore all publishers and subscribers for a topic</li>
              <li>See message type and update frequency</li>
              <li>Navigate to related nodes</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default NodeVisualizer;
