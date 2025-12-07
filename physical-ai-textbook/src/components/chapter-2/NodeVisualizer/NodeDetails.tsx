import React from 'react';
import styles from './NodeDetails.module.css';

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

interface NodeDetailsProps {
  node: Node;
  allTopics: Topic[];
  onTopicSelect: (topicName: string) => void;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({
  node,
  allTopics,
  onTopicSelect
}) => {
  const publishedTopics = allTopics.filter(t => t.publishers.includes(node.id));
  const subscribedTopics = allTopics.filter(t => t.subscribers.includes(node.id));

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'publisher':
        return '📤 Publisher';
      case 'subscriber':
        return '📥 Subscriber';
      case 'both':
        return '🔄 Both';
      default:
        return type;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.nodeIcon} style={{ backgroundColor: node.color }} />
        <div>
          <h3>{node.name}</h3>
          <p className={styles.typeLabel}>{getTypeLabel(node.type)}</p>
        </div>
      </div>

      <div className={styles.description}>
        <p>{node.description}</p>
      </div>

      <div className={styles.section}>
        <h4>Node Information</h4>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Node ID:</span>
            <code className={styles.code}>{node.id}</code>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Type:</span>
            <span>{node.type}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Total Connections:</span>
            <span>{publishedTopics.length + subscribedTopics.length}</span>
          </div>
        </div>
      </div>

      {publishedTopics.length > 0 && (
        <div className={styles.section}>
          <h4>📤 Published Topics ({publishedTopics.length})</h4>
          <div className={styles.topicList}>
            {publishedTopics.map(topic => (
              <div key={topic.name} className={styles.topicItem}>
                <button
                  className={styles.topicName}
                  onClick={() => onTopicSelect(topic.name)}
                >
                  {topic.name}
                </button>
                <div className={styles.topicMeta}>
                  <span className={styles.badge}>{topic.type}</span>
                  {topic.messageRate && (
                    <span className={styles.rate}>{topic.messageRate} Hz</span>
                  )}
                </div>
                <p className={styles.subscribers}>
                  {topic.subscribers.length} subscriber{topic.subscribers.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subscribedTopics.length > 0 && (
        <div className={styles.section}>
          <h4>📥 Subscribed Topics ({subscribedTopics.length})</h4>
          <div className={styles.topicList}>
            {subscribedTopics.map(topic => (
              <div key={topic.name} className={styles.topicItem}>
                <button
                  className={styles.topicName}
                  onClick={() => onTopicSelect(topic.name)}
                >
                  {topic.name}
                </button>
                <div className={styles.topicMeta}>
                  <span className={styles.badge}>{topic.type}</span>
                  {topic.messageRate && (
                    <span className={styles.rate}>{topic.messageRate} Hz</span>
                  )}
                </div>
                <p className={styles.publishers}>
                  {topic.publishers.length} publisher{topic.publishers.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.topics.length === 0 && (
        <div className={styles.emptyState}>
          <p>This node has no topic connections yet.</p>
        </div>
      )}
    </div>
  );
};
