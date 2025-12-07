import React, { useEffect, useRef } from 'react';
import styles from './SimulationVisualization.module.css';

interface Node {
  id: string;
  name: string;
  type: 'publisher' | 'subscriber' | 'both';
  topics: string[];
  color: string;
}

interface Topic {
  name: string;
  publishers: string[];
  subscribers: string[];
  messageRate?: number;
}

interface SimulationVisualizationProps {
  nodes: Node[];
  topics: Topic[];
  selectedNode?: string;
  selectedTopic?: string;
  messageFlow?: string | null;
  onNodeSelect: (nodeId: string) => void;
  onTopicSelect: (topicName: string) => void;
}

/**
 * Canvas-based visualization of ROS 2 node graph
 * Uses HTML5 Canvas for smooth performance
 */
export const SimulationVisualization: React.FC<SimulationVisualizationProps> = ({
  nodes,
  topics,
  selectedNode,
  selectedTopic,
  messageFlow,
  onNodeSelect,
  onTopicSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate node positions in a circle layout
  const getNodePositions = () => {
    const radius = 150;
    const positions: Record<string, { x: number; y: number }> = {};
    const angle = (2 * Math.PI) / nodes.length;

    nodes.forEach((node, index) => {
      const x = 250 + radius * Math.cos(index * angle);
      const y = 200 + radius * Math.sin(index * angle);
      positions[node.id] = { x, y };
    });

    return positions;
  };

  const nodePositions = getNodePositions();

  // Draw the graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections (topics)
    topics.forEach(topic => {
      const publishers = topic.publishers;
      const subscribers = topic.subscribers;

      publishers.forEach(pubId => {
        subscribers.forEach(subId => {
          const pubPos = nodePositions[pubId];
          const subPos = nodePositions[subId];

          if (pubPos && subPos) {
            ctx.strokeStyle = selectedTopic === topic.name ? '#ff6b6b' : '#ddd';
            ctx.lineWidth = selectedTopic === topic.name ? 3 : 1.5;
            ctx.setLineDash(selectedTopic === topic.name ? [5, 5] : []);

            ctx.beginPath();
            ctx.moveTo(pubPos.x, pubPos.y);
            ctx.lineTo(subPos.x, subPos.y);
            ctx.stroke();

            ctx.setLineDash([]);

            // Draw arrow
            const dx = subPos.x - pubPos.x;
            const dy = subPos.y - pubPos.y;
            const angle = Math.atan2(dy, dx);
            const arrowSize = 10;

            ctx.fillStyle = selectedTopic === topic.name ? '#ff6b6b' : '#999';
            ctx.beginPath();
            ctx.moveTo(subPos.x, subPos.y);
            ctx.lineTo(
              subPos.x - arrowSize * Math.cos(angle - Math.PI / 6),
              subPos.y - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              subPos.x - arrowSize * Math.cos(angle + Math.PI / 6),
              subPos.y - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.fill();

            // Draw topic label
            const midX = (pubPos.x + subPos.x) / 2;
            const midY = (pubPos.y + subPos.y) / 2;
            ctx.fillStyle = selectedTopic === topic.name ? '#ff6b6b' : '#999';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(topic.name.split('/').pop() || topic.name, midX, midY - 8);
          }
        });
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const radius = selectedNode === node.id ? 35 : 30;
      const isActive = messageFlow &&
        (topics.some(t =>
          t.name === messageFlow &&
          (t.publishers.includes(node.id) || t.subscribers.includes(node.id))
        ));

      // Draw node circle
      ctx.fillStyle = selectedNode === node.id ? '#000' : node.color;
      ctx.globalAlpha = isActive ? 1 : 0.7;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = selectedNode === node.id ? '#333' : '#fff';
      ctx.lineWidth = selectedNode === node.id ? 3 : 2;
      ctx.stroke();

      ctx.globalAlpha = 1;

      // Draw node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, pos.x, pos.y);
    });

    // Draw legend
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Node Types:', 10, 20);

    ctx.fillStyle = '#1976d2';
    ctx.beginPath();
    ctx.arc(15, 45, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.fillText('Publisher', 30, 50);

    ctx.fillStyle = '#388e3c';
    ctx.beginPath();
    ctx.arc(15, 70, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillText('Both', 30, 75);

    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.arc(15, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillText('Subscriber', 30, 100);
  }, [nodes, topics, selectedNode, selectedTopic, messageFlow, nodePositions]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Check click on nodes
          nodes.forEach(node => {
            const pos = nodePositions[node.id];
            if (pos && Math.hypot(x - pos.x, y - pos.y) < 35) {
              onNodeSelect(node.id);
            }
          });
        }}
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Nodes:</span>
          <span className={styles.value}>{nodes.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Topics:</span>
          <span className={styles.value}>{topics.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Connections:</span>
          <span className={styles.value}>
            {topics.reduce((acc, t) => acc + (t.publishers.length * t.subscribers.length), 0)}
          </span>
        </div>
      </div>

      {messageFlow && (
        <div className={styles.flowInfo}>
          <span className={styles.flowLabel}>Current Flow:</span>
          <span className={styles.flowValue}>{messageFlow}</span>
        </div>
      )}
    </div>
  );
};
