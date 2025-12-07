/**
 * Unit tests for useURDFValidator hook
 *
 * Tests:
 * - URDF XML parsing
 * - Link and joint extraction
 * - Validation rules
 * - Error detection
 *
 * Implementation: T016 (Phase 2: Foundational Components)
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useURDFValidator } from '../../src/hooks/useURDFValidator';

describe('useURDFValidator', () => {
  const validURDF = `
    <?xml version="1.0"?>
    <robot name="test_robot">
      <link name="base_link">
        <visual>
          <geometry>
            <box size="0.1 0.1 0.1"/>
          </geometry>
          <material name="blue">
            <color rgba="0 0 1 1"/>
          </material>
        </visual>
        <collision>
          <geometry>
            <box size="0.1 0.1 0.1"/>
          </geometry>
        </collision>
        <inertial>
          <mass value="1.0"/>
          <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
        </inertial>
      </link>
      <link name="arm_link"/>
      <joint name="base_to_arm" type="revolute">
        <parent link="base_link"/>
        <child link="arm_link"/>
        <origin xyz="0 0 0.1" rpy="0 0 0"/>
        <axis xyz="0 0 1"/>
        <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
      </joint>
    </robot>
  `;

  describe('URDF Parsing', () => {
    it('should parse valid URDF', () => {
      const { result } = renderHook(() => useURDFValidator());

      let robot;
      act(() => {
        robot = result.current.parseURDF(validURDF);
      });

      expect(robot).not.toBeNull();
      expect(robot?.name).toBe('test_robot');
      expect(robot?.links).toHaveLength(2);
      expect(robot?.joints).toHaveLength(1);
    });

    it('should extract link properties correctly', () => {
      const { result } = renderHook(() => useURDFValidator());

      let robot;
      act(() => {
        robot = result.current.parseURDF(validURDF);
      });

      const baseLink = robot?.links.find((link) => link.name === 'base_link');
      expect(baseLink).toBeDefined();
      expect(baseLink?.visual).toHaveLength(1);
      expect(baseLink?.visual?.[0].geometry?.type).toBe('box');
      expect(baseLink?.visual?.[0].geometry?.size).toEqual([0.1, 0.1, 0.1]);
      expect(baseLink?.visual?.[0].material?.color?.rgba).toEqual([0, 0, 1, 1]);
      expect(baseLink?.collision).toHaveLength(1);
      expect(baseLink?.inertial?.mass).toBe(1.0);
    });

    it('should extract joint properties correctly', () => {
      const { result } = renderHook(() => useURDFValidator());

      let robot;
      act(() => {
        robot = result.current.parseURDF(validURDF);
      });

      const joint = robot?.joints[0];
      expect(joint?.name).toBe('base_to_arm');
      expect(joint?.type).toBe('revolute');
      expect(joint?.parent).toBe('base_link');
      expect(joint?.child).toBe('arm_link');
      expect(joint?.origin?.xyz).toEqual([0, 0, 0.1]);
      expect(joint?.axis?.xyz).toEqual([0, 0, 1]);
      expect(joint?.limits).toEqual({
        lower: -1.57,
        upper: 1.57,
        effort: 10,
        velocity: 1.0,
      });
    });

    it('should handle invalid XML', () => {
      const { result } = renderHook(() => useURDFValidator());

      const invalidXML = '<robot><link></robot>';

      let robot;
      act(() => {
        robot = result.current.parseURDF(invalidXML);
      });

      expect(robot).toBeNull();
    });

    it('should handle missing robot element', () => {
      const { result } = renderHook(() => useURDFValidator());

      const noRobot = '<?xml version="1.0"?><notarobot></notarobot>';

      let robot;
      act(() => {
        robot = result.current.parseURDF(noRobot);
      });

      expect(robot).toBeNull();
    });
  });

  describe('Validation', () => {
    it('should validate correct URDF', async () => {
      const { result } = renderHook(() => useURDFValidator());

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(validURDF);
      });

      expect(validationResult?.valid).toBe(true);
      expect(validationResult?.errors).toHaveLength(0);
    });

    it('should detect duplicate link names', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const duplicateLinks = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <link name="link1"/>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(duplicateLinks);
      });

      expect(validationResult?.valid).toBe(false);
      expect(validationResult?.errors).toContain('Duplicate link name: link1');
    });

    it('should detect duplicate joint names', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const duplicateJoints = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <link name="link2"/>
          <link name="link3"/>
          <joint name="joint1" type="fixed">
            <parent link="link1"/>
            <child link="link2"/>
          </joint>
          <joint name="joint1" type="fixed">
            <parent link="link2"/>
            <child link="link3"/>
          </joint>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(duplicateJoints);
      });

      expect(validationResult?.valid).toBe(false);
      expect(validationResult?.errors).toContain('Duplicate joint name: joint1');
    });

    it('should detect non-existent parent link', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const badParent = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <joint name="joint1" type="fixed">
            <parent link="nonexistent"/>
            <child link="link1"/>
          </joint>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(badParent);
      });

      expect(validationResult?.valid).toBe(false);
      expect(
        validationResult?.errors.some((err) => err.includes('non-existent parent link'))
      ).toBe(true);
    });

    it('should detect non-existent child link', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const badChild = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <joint name="joint1" type="fixed">
            <parent link="link1"/>
            <child link="nonexistent"/>
          </joint>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(badChild);
      });

      expect(validationResult?.valid).toBe(false);
      expect(
        validationResult?.errors.some((err) => err.includes('non-existent child link'))
      ).toBe(true);
    });

    it('should warn about missing limits on revolute joints', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const noLimits = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <link name="link2"/>
          <joint name="joint1" type="revolute">
            <parent link="link1"/>
            <child link="link2"/>
          </joint>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(noLimits);
      });

      expect(validationResult?.valid).toBe(true); // warning, not error
      expect(
        validationResult?.warnings.some((warn) => warn.includes('should have limits'))
      ).toBe(true);
    });

    it('should detect invalid joint limits', async () => {
      const { result } = renderHook(() => useURDFValidator());

      const invalidLimits = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1"/>
          <link name="link2"/>
          <joint name="joint1" type="revolute">
            <parent link="link1"/>
            <child link="link2"/>
            <limit lower="1.0" upper="0.5" effort="10" velocity="1.0"/>
          </joint>
        </robot>
      `;

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateURDF(invalidLimits);
      });

      expect(validationResult?.valid).toBe(false);
      expect(
        validationResult?.errors.some((err) => err.includes('invalid limits'))
      ).toBe(true);
    });
  });

  describe('Different Geometry Types', () => {
    it('should parse cylinder geometry', () => {
      const { result } = renderHook(() => useURDFValidator());

      const cylinderURDF = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1">
            <visual>
              <geometry>
                <cylinder radius="0.05" length="0.2"/>
              </geometry>
            </visual>
          </link>
        </robot>
      `;

      let robot;
      act(() => {
        robot = result.current.parseURDF(cylinderURDF);
      });

      const geometry = robot?.links[0].visual?.[0].geometry;
      expect(geometry?.type).toBe('cylinder');
      expect(geometry?.radius).toBe(0.05);
      expect(geometry?.length).toBe(0.2);
    });

    it('should parse sphere geometry', () => {
      const { result } = renderHook(() => useURDFValidator());

      const sphereURDF = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1">
            <visual>
              <geometry>
                <sphere radius="0.1"/>
              </geometry>
            </visual>
          </link>
        </robot>
      `;

      let robot;
      act(() => {
        robot = result.current.parseURDF(sphereURDF);
      });

      const geometry = robot?.links[0].visual?.[0].geometry;
      expect(geometry?.type).toBe('sphere');
      expect(geometry?.radius).toBe(0.1);
    });

    it('should parse mesh geometry', () => {
      const { result } = renderHook(() => useURDFValidator());

      const meshURDF = `
        <?xml version="1.0"?>
        <robot name="test">
          <link name="link1">
            <visual>
              <geometry>
                <mesh filename="package://robot/meshes/arm.stl" scale="0.001 0.001 0.001"/>
              </geometry>
            </visual>
          </link>
        </robot>
      `;

      let robot;
      act(() => {
        robot = result.current.parseURDF(meshURDF);
      });

      const geometry = robot?.links[0].visual?.[0].geometry;
      expect(geometry?.type).toBe('mesh');
      expect(geometry?.filename).toBe('package://robot/meshes/arm.stl');
      expect(geometry?.scale).toEqual([0.001, 0.001, 0.001]);
    });
  });
});
