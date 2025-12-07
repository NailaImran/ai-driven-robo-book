import React from 'react';
import styles from './TopicBrowser.module.css';

interface Node {
  id: string;
  name: string;
  type: 'publisher' | 'subscriber' | 'both';
}

interface Topic {
  name: string;
  type: string;
  publishers: string[];
  subscribers: string[];
  messageRate?: number;
}

interface TopicBrowserProps {
  topic: Topic;
  allNodes: Node[];
  onNodeSelect: (nodeId: string) => void;
}

export const TopicBrowser: React.FC<TopicBrowserProps> = ({
  topic,
  allNodes,
  onNodeSelect
}) => {
  const publisherNodes = allNodes.filter(n => topic.publishers.includes(n.id));
  const subscriberNodes = allNodes.filter(n => topic.subscribers.includes(n.id));

  // Parse message type for display
  const parseMessageType = (type: string) => {
    const parts = type.split('/');
    return {
      package: parts[0],
      message: parts[1]
    };
  };

  const msgType = parseMessageType(topic.type);

  // Estimate bandwidth (very rough approximation)
  const estimateBandwidth = () => {
    if (!topic.messageRate) return null;

    const typeSizeMap: Record<string, number> = {
      'Image': 614400, // 1280x480 RGB
      'Imu': 256,
      'JointState': 512,
      'JointTrajectory': 1024,
      'Detections': 4096,
      'CameraInfo': 256
    };

    const messageSize = typeSizeMap[msgType.message] || 1024;
    const bytesPerSecond = topic.messageRate * messageSize;
    const kbps = bytesPerSecond / 1024;

    if (kbps > 1024) {
      return `${(kbps / 1024).toFixed(1)} MB/s`;
    }
    return `${kbps.toFixed(1)} KB/s`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Topic: {topic.name}</h3>
      </div>

      <div className={styles.section}>
        <h4>Topic Information</h4>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Topic Name:</span>
            <code className={styles.code}>{topic.name}</code>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Message Type:</span>
            <code className={styles.code}>{topic.type}</code>
          </div>
          {topic.messageRate && (
            <>
              <div className={styles.infoItem}>
                <span className={styles.label}>Update Rate:</span>
                <span className={styles.value}>{topic.messageRate} Hz</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Est. Bandwidth:</span>
                <span className={styles.value}>{estimateBandwidth()}</span>
              </div>
            </>
          )}
          <div className={styles.infoItem}>
            <span className={styles.label}>Total Connections:</span>
            <span className={styles.value}>
              {topic.publishers.length} pub + {topic.subscribers.length} sub
            </span>
          </div>
        </div>
      </div>

      {topic.publishers.length > 0 && (
        <div className={styles.section}>
          <h4>📤 Publishers ({topic.publishers.length})</h4>
          <div className={styles.nodeList}>
            {publisherNodes.map(node => (
              <div key={node.id} className={styles.nodeItem}>
                <button
                  className={styles.nodeName}
                  onClick={() => onNodeSelect(node.id)}
                >
                  {node.name}
                </button>
                <span className={styles.nodeId}>{node.id}</span>
                <span className={styles.badge}>Publisher</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topic.subscribers.length > 0 && (
        <div className={styles.section}>
          <h4>📥 Subscribers ({topic.subscribers.length})</h4>
          <div className={styles.nodeList}>
            {subscriberNodes.map(node => (
              <div key={node.id} className={styles.nodeItem}>
                <button
                  className={styles.nodeName}
                  onClick={() => onNodeSelect(node.id)}
                >
                  {node.name}
                </button>
                <span className={styles.nodeId}>{node.id}</span>
                <span className={styles.badge}>Subscriber</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h4>Message Structure</h4>
        <div className={styles.messageStructure}>
          <p className={styles.comment}>// {msgType.package}/{msgType.message}</p>
          <code className={styles.code}>
            <div>header:</div>
            <div style={{ marginLeft: '20px' }}>
              <div>frame_id: string</div>
              <div>stamp: time</div>
            </div>
            <div>data: []</div>
          </code>
          <p className={styles.hint}>Actual structure depends on ROS message definition</p>
        </div>
      </div>

      <div className={styles.info}>
        <h4>Usage Hints</h4>
        <ul>
          <li>Use this topic for communication between the nodes above</li>
          <li>Ensure all subscribers use compatible QoS settings</li>
          <li>Monitor bandwidth for high-frequency topics in bandwidth-constrained environments</li>
        </ul>
      </div>
    </div>
  );
};
