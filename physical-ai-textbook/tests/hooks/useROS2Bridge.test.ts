/**
 * Unit tests for useROS2Bridge hook
 *
 * Tests:
 * - Connection initialization
 * - Topic subscription
 * - Message publishing
 * - Service calls
 * - Reconnection logic
 * - Cleanup
 *
 * Implementation: T016 (Phase 2: Foundational Components)
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useROS2Bridge } from '../../src/hooks/useROS2Bridge';
import * as ROSLIB from 'roslib';

// Mock roslibjs
jest.mock('roslib');

describe('useROS2Bridge', () => {
  let mockRos: jest.Mocked<ROSLIB.Ros>;
  let mockTopic: jest.Mocked<ROSLIB.Topic>;
  let mockService: jest.Mocked<ROSLIB.Service>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Ros instance
    mockRos = {
      on: jest.fn(),
      close: jest.fn(),
      getTopics: jest.fn(),
      getNodes: jest.fn(),
    } as any;

    // Mock Topic instance
    mockTopic = {
      subscribe: jest.fn(),
      publish: jest.fn(),
      unsubscribe: jest.fn(),
    } as any;

    // Mock Service instance
    mockService = {
      callService: jest.fn(),
    } as any;

    (ROSLIB.Ros as jest.MockedClass<typeof ROSLIB.Ros>).mockImplementation(
      () => mockRos
    );
    (ROSLIB.Topic as jest.MockedClass<typeof ROSLIB.Topic>).mockImplementation(
      () => mockTopic
    );
    (ROSLIB.Service as jest.MockedClass<typeof ROSLIB.Service>).mockImplementation(
      () => mockService
    );
    (ROSLIB.Message as jest.MockedClass<typeof ROSLIB.Message>).mockImplementation(
      (data) => data as any
    );
    (ROSLIB.ServiceRequest as jest.MockedClass<typeof ROSLIB.ServiceRequest>).mockImplementation(
      (data) => data as any
    );
  });

  describe('Connection', () => {
    it('should initialize with autoConnect=true', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      expect(ROSLIB.Ros).toHaveBeenCalledWith({ url: 'ws://localhost:9090' });
      expect(result.current.connected).toBe(false);
    });

    it('should set connected state on connection event', async () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection event
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
        expect(result.current.error).toBe(null);
      });
    });

    it('should set error state on error event', async () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate error event
      const errorCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'error'
      )?.[1];
      act(() => {
        errorCallback?.({ message: 'Connection failed' });
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(false);
        expect(result.current.error).toBe('Connection failed');
      });
    });

    it('should not auto-connect when autoConnect=false', () => {
      renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: false })
      );

      expect(ROSLIB.Ros).not.toHaveBeenCalled();
    });

    it('should manually connect when connect() is called', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: false })
      );

      act(() => {
        result.current.connect();
      });

      expect(ROSLIB.Ros).toHaveBeenCalledWith({ url: 'ws://localhost:9090' });
    });
  });

  describe('Topic Operations', () => {
    it('should subscribe to a topic', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      const callback = jest.fn();
      act(() => {
        result.current.subscribe('/chatter', 'std_msgs/String', callback);
      });

      expect(ROSLIB.Topic).toHaveBeenCalledWith({
        ros: mockRos,
        name: '/chatter',
        messageType: 'std_msgs/String',
      });
      expect(mockTopic.subscribe).toHaveBeenCalledWith(callback);
    });

    it('should publish a message to a topic', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      const message = { data: 'Hello ROS 2' };
      act(() => {
        result.current.publish('/chatter', 'std_msgs/String', message);
      });

      expect(ROSLIB.Topic).toHaveBeenCalledWith({
        ros: mockRos,
        name: '/chatter',
        messageType: 'std_msgs/String',
      });
      expect(mockTopic.publish).toHaveBeenCalled();
    });

    it('should unsubscribe when cleanup function is called', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      const callback = jest.fn();
      let unsubscribe: () => void;
      act(() => {
        unsubscribe = result.current.subscribe('/chatter', 'std_msgs/String', callback);
      });

      act(() => {
        unsubscribe();
      });

      expect(mockTopic.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Service Operations', () => {
    it('should call a service', async () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      const request = { data: 'test' };
      mockService.callService.mockImplementation((req, successCb) => {
        successCb({ result: 'success' });
      });

      let serviceResponse;
      await act(async () => {
        serviceResponse = await result.current.callService(
          '/test_service',
          'std_srvs/Trigger',
          request
        );
      });

      expect(ROSLIB.Service).toHaveBeenCalledWith({
        ros: mockRos,
        name: '/test_service',
        serviceType: 'std_srvs/Trigger',
      });
      expect(serviceResponse).toEqual({ result: 'success' });
    });
  });

  describe('Discovery', () => {
    it('should get list of topics', async () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      mockRos.getTopics.mockImplementation((successCb) => {
        successCb({
          topics: ['/chatter', '/cmd_vel'],
          types: ['std_msgs/String', 'geometry_msgs/Twist'],
        });
      });

      let topics;
      await act(async () => {
        topics = await result.current.getTopics();
      });

      expect(topics).toEqual([
        { name: '/chatter', type: 'std_msgs/String' },
        { name: '/cmd_vel', type: 'geometry_msgs/Twist' },
      ]);
    });

    it('should get list of nodes', async () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      // Simulate connection
      const connectionCallback = mockRos.on.mock.calls.find(
        (call) => call[0] === 'connection'
      )?.[1];
      act(() => {
        connectionCallback?.();
      });

      mockRos.getNodes.mockImplementation((successCb) => {
        successCb(['/talker', '/listener', '/namespace/node']);
      });

      let nodes;
      await act(async () => {
        nodes = await result.current.getNodes();
      });

      expect(nodes).toEqual([
        { name: 'talker', namespace: '/' },
        { name: 'listener', namespace: '/' },
        { name: 'node', namespace: '/namespace' },
      ]);
    });
  });

  describe('Cleanup', () => {
    it('should close connection on unmount', () => {
      const { unmount } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      unmount();

      expect(mockRos.close).toHaveBeenCalled();
    });

    it('should disconnect when disconnect() is called', () => {
      const { result } = renderHook(() =>
        useROS2Bridge({ url: 'ws://localhost:9090', autoConnect: true })
      );

      act(() => {
        result.current.disconnect();
      });

      expect(mockRos.close).toHaveBeenCalled();
    });
  });
});
