/**
 * Custom hook for connecting to ROS 2 via rosbridge_suite WebSocket
 *
 * This hook manages:
 * - WebSocket connection to rosbridge_suite
 * - ROS 2 topic subscriptions
 * - Publishing messages to topics
 * - Service calls
 *
 * Implementation: T010 (Phase 2: Foundational Components)
 *
 * @example
 * ```tsx
 * const { connected, error, subscribe, publish, getTopics } = useROS2Bridge({
 *   url: 'ws://localhost:9090',
 *   autoConnect: true
 * });
 *
 * useEffect(() => {
 *   if (connected) {
 *     const unsubscribe = subscribe('/chatter', 'std_msgs/String', (message) => {
 *       console.log('Received:', message);
 *     });
 *     return unsubscribe;
 *   }
 * }, [connected]);
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as ROSLIB from 'roslib';

export interface ROS2BridgeConfig {
  url: string;
  autoConnect?: boolean;
  reconnectDelay?: number; // milliseconds
  maxReconnectAttempts?: number;
}

export interface ROS2Topic {
  name: string;
  type: string;
}

export interface ROS2Node {
  name: string;
  namespace: string;
}

export interface ROS2Service {
  name: string;
  type: string;
}

type MessageCallback = (message: any) => void;

export const useROS2Bridge = (config: ROS2BridgeConfig) => {
  const {
    url,
    autoConnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
  } = config;

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const rosRef = useRef<ROSLIB.Ros | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscribersRef = useRef<Map<string, ROSLIB.Topic>>(new Map());

  // Initialize ROS connection
  const connect = useCallback(() => {
    if (rosRef.current) {
      rosRef.current.close();
    }

    const ros = new ROSLIB.Ros({
      url: url,
    });

    ros.on('connection', () => {
      console.log('[ROS2Bridge] Connected to rosbridge_suite');
      setConnected(true);
      setError(null);
      setReconnecting(false);
      reconnectAttemptsRef.current = 0;
    });

    ros.on('error', (errorEvent: any) => {
      console.error('[ROS2Bridge] Connection error:', errorEvent);
      setError(errorEvent.message || 'Connection error');
      setConnected(false);
    });

    ros.on('close', () => {
      console.log('[ROS2Bridge] Connection closed');
      setConnected(false);

      // Attempt to reconnect
      if (
        autoConnect &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        setReconnecting(true);
        reconnectAttemptsRef.current += 1;
        console.log(
          `[ROS2Bridge] Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
        );
        setTimeout(() => {
          connect();
        }, reconnectDelay);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setError('Max reconnection attempts reached');
        setReconnecting(false);
      }
    });

    rosRef.current = ros;
  }, [url, autoConnect, reconnectDelay, maxReconnectAttempts]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Cleanup: unsubscribe from all topics
      subscribersRef.current.forEach((topic) => topic.unsubscribe());
      subscribersRef.current.clear();

      // Close ROS connection
      if (rosRef.current) {
        rosRef.current.close();
      }
    };
  }, [autoConnect, connect]);

  // Subscribe to a topic
  const subscribe = useCallback(
    (topicName: string, messageType: string, callback: MessageCallback) => {
      if (!rosRef.current) {
        console.warn('[ROS2Bridge] Cannot subscribe: not connected');
        return () => {};
      }

      const topic = new ROSLIB.Topic({
        ros: rosRef.current,
        name: topicName,
        messageType: messageType,
      });

      topic.subscribe(callback);
      subscribersRef.current.set(topicName, topic);

      console.log(`[ROS2Bridge] Subscribed to ${topicName} (${messageType})`);

      // Return unsubscribe function
      return () => {
        topic.unsubscribe();
        subscribersRef.current.delete(topicName);
        console.log(`[ROS2Bridge] Unsubscribed from ${topicName}`);
      };
    },
    []
  );

  // Publish to a topic
  const publish = useCallback(
    (topicName: string, messageType: string, message: any) => {
      if (!rosRef.current) {
        console.warn('[ROS2Bridge] Cannot publish: not connected');
        return;
      }

      const topic = new ROSLIB.Topic({
        ros: rosRef.current,
        name: topicName,
        messageType: messageType,
      });

      const rosMessage = new ROSLIB.Message(message);
      topic.publish(rosMessage);

      console.log(`[ROS2Bridge] Published to ${topicName}:`, message);
    },
    []
  );

  // Get list of topics
  const getTopics = useCallback(async (): Promise<ROS2Topic[]> => {
    if (!rosRef.current) {
      console.warn('[ROS2Bridge] Cannot get topics: not connected');
      return [];
    }

    return new Promise((resolve, reject) => {
      rosRef.current!.getTopics(
        (result: any) => {
          const topics: ROS2Topic[] = result.topics.map(
            (name: string, index: number) => ({
              name,
              type: result.types[index],
            })
          );
          resolve(topics);
        },
        (error: any) => {
          console.error('[ROS2Bridge] Failed to get topics:', error);
          reject(error);
        }
      );
    });
  }, []);

  // Get list of nodes
  const getNodes = useCallback(async (): Promise<ROS2Node[]> => {
    if (!rosRef.current) {
      console.warn('[ROS2Bridge] Cannot get nodes: not connected');
      return [];
    }

    return new Promise((resolve, reject) => {
      rosRef.current!.getNodes(
        (nodeNames: string[]) => {
          const nodes: ROS2Node[] = nodeNames.map((name) => {
            const parts = name.split('/');
            return {
              name: parts[parts.length - 1],
              namespace: parts.slice(0, -1).join('/') || '/',
            };
          });
          resolve(nodes);
        },
        (error: any) => {
          console.error('[ROS2Bridge] Failed to get nodes:', error);
          reject(error);
        }
      );
    });
  }, []);

  // Call a service
  const callService = useCallback(
    async (
      serviceName: string,
      serviceType: string,
      request: any
    ): Promise<any> => {
      if (!rosRef.current) {
        console.warn('[ROS2Bridge] Cannot call service: not connected');
        return Promise.reject(new Error('Not connected'));
      }

      return new Promise((resolve, reject) => {
        const service = new ROSLIB.Service({
          ros: rosRef.current!,
          name: serviceName,
          serviceType: serviceType,
        });

        const serviceRequest = new ROSLIB.ServiceRequest(request);

        service.callService(
          serviceRequest,
          (result: any) => {
            console.log(`[ROS2Bridge] Service ${serviceName} response:`, result);
            resolve(result);
          },
          (error: any) => {
            console.error(`[ROS2Bridge] Service ${serviceName} error:`, error);
            reject(error);
          }
        );
      });
    },
    []
  );

  // Disconnect
  const disconnect = useCallback(() => {
    if (rosRef.current) {
      rosRef.current.close();
      rosRef.current = null;
    }
    subscribersRef.current.forEach((topic) => topic.unsubscribe());
    subscribersRef.current.clear();
    setConnected(false);
  }, []);

  return {
    connected,
    error,
    reconnecting,
    connect,
    disconnect,
    subscribe,
    publish,
    getTopics,
    getNodes,
    callService,
    ros: rosRef.current,
  };
};
