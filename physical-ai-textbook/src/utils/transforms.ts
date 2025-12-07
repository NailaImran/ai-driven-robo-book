/**
 * Coordinate transformation utilities for robotics
 *
 * Includes:
 * - Euler angles <-> Quaternions
 * - Transformation matrices
 * - Frame transformations
 * - Forward kinematics helpers
 *
 * Implementation: T014 (Phase 2: Foundational Components)
 */

import type { Vector3, Quaternion, Transform } from '../types/chapter2';

// ====================
// Angle Conversions
// ====================

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Normalize angle to [-π, π]
 */
export const normalizeAngle = (angle: number): number => {
  let normalized = angle % (2 * Math.PI);
  if (normalized > Math.PI) {
    normalized -= 2 * Math.PI;
  } else if (normalized < -Math.PI) {
    normalized += 2 * Math.PI;
  }
  return normalized;
};

// ====================
// Euler <-> Quaternion
// ====================

/**
 * Convert Euler angles (roll, pitch, yaw) to Quaternion
 * Assumes ZYX rotation order (yaw-pitch-roll)
 */
export const eulerToQuaternion = (
  roll: number,
  pitch: number,
  yaw: number
): Quaternion => {
  const cy = Math.cos(yaw * 0.5);
  const sy = Math.sin(yaw * 0.5);
  const cp = Math.cos(pitch * 0.5);
  const sp = Math.sin(pitch * 0.5);
  const cr = Math.cos(roll * 0.5);
  const sr = Math.sin(roll * 0.5);

  return {
    w: cr * cp * cy + sr * sp * sy,
    x: sr * cp * cy - cr * sp * sy,
    y: cr * sp * cy + sr * cp * sy,
    z: cr * cp * sy - sr * sp * cy,
  };
};

/**
 * Convert Quaternion to Euler angles (roll, pitch, yaw)
 * Returns angles in radians
 */
export const quaternionToEuler = (q: Quaternion): { roll: number; pitch: number; yaw: number } => {
  // Roll (x-axis rotation)
  const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
  const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  // Pitch (y-axis rotation)
  const sinp = 2 * (q.w * q.y - q.z * q.x);
  let pitch: number;
  if (Math.abs(sinp) >= 1) {
    pitch = Math.sign(sinp) * (Math.PI / 2); // use 90 degrees if out of range
  } else {
    pitch = Math.asin(sinp);
  }

  // Yaw (z-axis rotation)
  const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
  const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
};

/**
 * Normalize quaternion to unit length
 */
export const normalizeQuaternion = (q: Quaternion): Quaternion => {
  const length = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  return {
    w: q.w / length,
    x: q.x / length,
    y: q.y / length,
    z: q.z / length,
  };
};

// ====================
// Vector Operations
// ====================

/**
 * Add two vectors
 */
export const addVectors = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

/**
 * Subtract two vectors
 */
export const subtractVectors = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

/**
 * Scale vector by scalar
 */
export const scaleVector = (v: Vector3, scale: number): Vector3 => ({
  x: v.x * scale,
  y: v.y * scale,
  z: v.z * scale,
});

/**
 * Compute dot product of two vectors
 */
export const dotProduct = (a: Vector3, b: Vector3): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

/**
 * Compute cross product of two vectors
 */
export const crossProduct = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

/**
 * Compute magnitude (length) of vector
 */
export const vectorMagnitude = (v: Vector3): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

/**
 * Normalize vector to unit length
 */
export const normalizeVector = (v: Vector3): Vector3 => {
  const mag = vectorMagnitude(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return scaleVector(v, 1 / mag);
};

/**
 * Distance between two points
 */
export const distance = (a: Vector3, b: Vector3): number => {
  return vectorMagnitude(subtractVectors(a, b));
};

// ====================
// Transformation Matrices
// ====================

/**
 * 4x4 homogeneous transformation matrix
 */
export type Matrix4x4 = number[][];

/**
 * Create identity matrix
 */
export const identityMatrix = (): Matrix4x4 => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

/**
 * Create translation matrix
 */
export const translationMatrix = (v: Vector3): Matrix4x4 => [
  [1, 0, 0, v.x],
  [0, 1, 0, v.y],
  [0, 0, 1, v.z],
  [0, 0, 0, 1],
];

/**
 * Create rotation matrix from quaternion
 */
export const rotationMatrixFromQuaternion = (q: Quaternion): Matrix4x4 => {
  const { w, x, y, z } = q;

  return [
    [
      1 - 2 * (y * y + z * z),
      2 * (x * y - w * z),
      2 * (x * z + w * y),
      0,
    ],
    [
      2 * (x * y + w * z),
      1 - 2 * (x * x + z * z),
      2 * (y * z - w * x),
      0,
    ],
    [
      2 * (x * z - w * y),
      2 * (y * z + w * x),
      1 - 2 * (x * x + y * y),
      0,
    ],
    [0, 0, 0, 1],
  ];
};

/**
 * Create transformation matrix from transform
 */
export const transformToMatrix = (transform: Transform): Matrix4x4 => {
  const rotMat = rotationMatrixFromQuaternion(transform.orientation);
  const { x, y, z } = transform.position;

  rotMat[0][3] = x;
  rotMat[1][3] = y;
  rotMat[2][3] = z;

  return rotMat;
};

/**
 * Multiply two 4x4 matrices
 */
export const multiplyMatrices = (a: Matrix4x4, b: Matrix4x4): Matrix4x4 => {
  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
};

/**
 * Apply transformation matrix to a point
 */
export const transformPoint = (matrix: Matrix4x4, point: Vector3): Vector3 => {
  const x = matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2] * point.z + matrix[0][3];
  const y = matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2] * point.z + matrix[1][3];
  const z = matrix[2][0] * point.x + matrix[2][1] * point.y + matrix[2][2] * point.z + matrix[2][3];

  return { x, y, z };
};

// ====================
// Forward Kinematics (DH Parameters)
// ====================

export interface DHParameters {
  a: number; // link length
  alpha: number; // link twist (radians)
  d: number; // link offset
  theta: number; // joint angle (radians)
}

/**
 * Compute transformation matrix from Denavit-Hartenberg parameters
 */
export const dhToMatrix = (dh: DHParameters): Matrix4x4 => {
  const { a, alpha, d, theta } = dh;

  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);

  return [
    [ct, -st * ca, st * sa, a * ct],
    [st, ct * ca, -ct * sa, a * st],
    [0, sa, ca, d],
    [0, 0, 0, 1],
  ];
};

/**
 * Compute forward kinematics given DH parameters for each joint
 */
export const forwardKinematics = (dhParams: DHParameters[]): Matrix4x4 => {
  let transform = identityMatrix();

  for (const dh of dhParams) {
    const dhMatrix = dhToMatrix(dh);
    transform = multiplyMatrices(transform, dhMatrix);
  }

  return transform;
};

/**
 * Extract position from transformation matrix
 */
export const extractPosition = (matrix: Matrix4x4): Vector3 => ({
  x: matrix[0][3],
  y: matrix[1][3],
  z: matrix[2][3],
});

/**
 * Extract rotation (as quaternion) from transformation matrix
 */
export const extractQuaternion = (matrix: Matrix4x4): Quaternion => {
  const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1.0);
    return {
      w: 0.25 / s,
      x: (matrix[2][1] - matrix[1][2]) * s,
      y: (matrix[0][2] - matrix[2][0]) * s,
      z: (matrix[1][0] - matrix[0][1]) * s,
    };
  } else if (matrix[0][0] > matrix[1][1] && matrix[0][0] > matrix[2][2]) {
    const s = 2.0 * Math.sqrt(1.0 + matrix[0][0] - matrix[1][1] - matrix[2][2]);
    return {
      w: (matrix[2][1] - matrix[1][2]) / s,
      x: 0.25 * s,
      y: (matrix[0][1] + matrix[1][0]) / s,
      z: (matrix[0][2] + matrix[2][0]) / s,
    };
  } else if (matrix[1][1] > matrix[2][2]) {
    const s = 2.0 * Math.sqrt(1.0 + matrix[1][1] - matrix[0][0] - matrix[2][2]);
    return {
      w: (matrix[0][2] - matrix[2][0]) / s,
      x: (matrix[0][1] + matrix[1][0]) / s,
      y: 0.25 * s,
      z: (matrix[1][2] + matrix[2][1]) / s,
    };
  } else {
    const s = 2.0 * Math.sqrt(1.0 + matrix[2][2] - matrix[0][0] - matrix[1][1]);
    return {
      w: (matrix[1][0] - matrix[0][1]) / s,
      x: (matrix[0][2] + matrix[2][0]) / s,
      y: (matrix[1][2] + matrix[2][1]) / s,
      z: 0.25 * s,
    };
  }
};
