/**
 * Custom hook for URDF validation and parsing
 *
 * This hook manages:
 * - Client-side URDF XML parsing
 * - Server-side validation via check_urdf endpoint
 * - Kinematic chain extraction
 * - Joint limits validation
 *
 * Implementation: T011 (Phase 2: Foundational Components)
 *
 * @example
 * ```tsx
 * const { validating, result, validateURDF, parseURDF } = useURDFValidator();
 *
 * const handleValidate = async () => {
 *   const validationResult = await validateURDF(urdfContent);
 *   if (validationResult.valid) {
 *     const { links, joints } = parseURDF(urdfContent);
 *     console.log('Parsed:', links, joints);
 *   }
 * };
 * ```
 */

import { useState, useCallback } from 'react';

export interface URDFValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface URDFJoint {
  name: string;
  type: 'revolute' | 'prismatic' | 'continuous' | 'fixed' | 'planar' | 'floating';
  parent: string;
  child: string;
  axis?: {
    xyz: [number, number, number];
  };
  origin?: {
    xyz: [number, number, number];
    rpy: [number, number, number];
  };
  limits?: {
    lower: number;
    upper: number;
    effort: number;
    velocity: number;
  };
}

export interface URDFVisual {
  geometry?: {
    type: 'box' | 'cylinder' | 'sphere' | 'mesh';
    size?: [number, number, number]; // for box
    radius?: number; // for cylinder/sphere
    length?: number; // for cylinder
    filename?: string; // for mesh
    scale?: [number, number, number]; // for mesh
  };
  origin?: {
    xyz: [number, number, number];
    rpy: [number, number, number];
  };
  material?: {
    name?: string;
    color?: {
      rgba: [number, number, number, number];
    };
  };
}

export interface URDFInertial {
  mass: number;
  inertia: {
    ixx: number;
    ixy: number;
    ixz: number;
    iyy: number;
    iyz: number;
    izz: number;
  };
  origin?: {
    xyz: [number, number, number];
    rpy: [number, number, number];
  };
}

export interface URDFLink {
  name: string;
  visual?: URDFVisual[];
  collision?: URDFVisual[]; // collision uses same structure as visual
  inertial?: URDFInertial;
}

export interface URDFRobot {
  name: string;
  links: URDFLink[];
  joints: URDFJoint[];
}

export const useURDFValidator = () => {
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<URDFValidationResult | null>(null);

  // Parse XML string to DOM
  const parseXML = useCallback((xmlString: string): Document | null => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.error('[URDFValidator] XML parsing error:', parserError.textContent);
        return null;
      }

      return xmlDoc;
    } catch (error) {
      console.error('[URDFValidator] Failed to parse XML:', error);
      return null;
    }
  }, []);

  // Extract array from space-separated string
  const parseArray = (str: string | null): number[] => {
    if (!str) return [0, 0, 0];
    return str.split(/\s+/).map(parseFloat);
  };

  // Parse origin element
  const parseOrigin = (element: Element | null) => {
    if (!element) return { xyz: [0, 0, 0] as [number, number, number], rpy: [0, 0, 0] as [number, number, number] };
    const xyz = parseArray(element.getAttribute('xyz'));
    const rpy = parseArray(element.getAttribute('rpy'));
    return {
      xyz: [xyz[0] || 0, xyz[1] || 0, xyz[2] || 0] as [number, number, number],
      rpy: [rpy[0] || 0, rpy[1] || 0, rpy[2] || 0] as [number, number, number],
    };
  };

  // Parse visual/collision element
  const parseVisual = (element: Element): URDFVisual => {
    const visual: URDFVisual = {};

    const originEl = element.querySelector('origin');
    if (originEl) {
      visual.origin = parseOrigin(originEl);
    }

    const geometryEl = element.querySelector('geometry');
    if (geometryEl) {
      const boxEl = geometryEl.querySelector('box');
      const cylinderEl = geometryEl.querySelector('cylinder');
      const sphereEl = geometryEl.querySelector('sphere');
      const meshEl = geometryEl.querySelector('mesh');

      if (boxEl) {
        const size = parseArray(boxEl.getAttribute('size'));
        visual.geometry = {
          type: 'box',
          size: [size[0], size[1], size[2]] as [number, number, number],
        };
      } else if (cylinderEl) {
        visual.geometry = {
          type: 'cylinder',
          radius: parseFloat(cylinderEl.getAttribute('radius') || '0'),
          length: parseFloat(cylinderEl.getAttribute('length') || '0'),
        };
      } else if (sphereEl) {
        visual.geometry = {
          type: 'sphere',
          radius: parseFloat(sphereEl.getAttribute('radius') || '0'),
        };
      } else if (meshEl) {
        const scale = parseArray(meshEl.getAttribute('scale'));
        visual.geometry = {
          type: 'mesh',
          filename: meshEl.getAttribute('filename') || '',
          scale: [scale[0] || 1, scale[1] || 1, scale[2] || 1] as [number, number, number],
        };
      }
    }

    const materialEl = element.querySelector('material');
    if (materialEl) {
      const colorEl = materialEl.querySelector('color');
      visual.material = {
        name: materialEl.getAttribute('name') || undefined,
        color: colorEl ? {
          rgba: parseArray(colorEl.getAttribute('rgba')) as [number, number, number, number]
        } : undefined,
      };
    }

    return visual;
  };

  // Parse URDF content
  const parseURDF = useCallback((urdfContent: string): URDFRobot | null => {
    console.log('[URDFValidator] Parsing URDF');

    const xmlDoc = parseXML(urdfContent);
    if (!xmlDoc) {
      return null;
    }

    const robotEl = xmlDoc.querySelector('robot');
    if (!robotEl) {
      console.error('[URDFValidator] No <robot> element found');
      return null;
    }

    const robotName = robotEl.getAttribute('name') || 'unnamed_robot';
    const links: URDFLink[] = [];
    const joints: URDFJoint[] = [];

    // Parse links
    const linkElements = robotEl.querySelectorAll('link');
    linkElements.forEach((linkEl) => {
      const name = linkEl.getAttribute('name') || 'unnamed_link';
      const link: URDFLink = { name };

      // Parse visual elements
      const visualEls = linkEl.querySelectorAll('visual');
      if (visualEls.length > 0) {
        link.visual = Array.from(visualEls).map(parseVisual);
      }

      // Parse collision elements
      const collisionEls = linkEl.querySelectorAll('collision');
      if (collisionEls.length > 0) {
        link.collision = Array.from(collisionEls).map(parseVisual);
      }

      // Parse inertial
      const inertialEl = linkEl.querySelector('inertial');
      if (inertialEl) {
        const massEl = inertialEl.querySelector('mass');
        const inertiaEl = inertialEl.querySelector('inertia');
        if (massEl && inertiaEl) {
          link.inertial = {
            mass: parseFloat(massEl.getAttribute('value') || '0'),
            inertia: {
              ixx: parseFloat(inertiaEl.getAttribute('ixx') || '0'),
              ixy: parseFloat(inertiaEl.getAttribute('ixy') || '0'),
              ixz: parseFloat(inertiaEl.getAttribute('ixz') || '0'),
              iyy: parseFloat(inertiaEl.getAttribute('iyy') || '0'),
              iyz: parseFloat(inertiaEl.getAttribute('iyz') || '0'),
              izz: parseFloat(inertiaEl.getAttribute('izz') || '0'),
            },
            origin: parseOrigin(inertialEl.querySelector('origin')),
          };
        }
      }

      links.push(link);
    });

    // Parse joints
    const jointElements = robotEl.querySelectorAll('joint');
    jointElements.forEach((jointEl) => {
      const name = jointEl.getAttribute('name') || 'unnamed_joint';
      const type = (jointEl.getAttribute('type') as URDFJoint['type']) || 'fixed';

      const parentEl = jointEl.querySelector('parent');
      const childEl = jointEl.querySelector('child');

      if (!parentEl || !childEl) {
        console.warn(`[URDFValidator] Joint ${name} missing parent or child`);
        return;
      }

      const joint: URDFJoint = {
        name,
        type,
        parent: parentEl.getAttribute('link') || '',
        child: childEl.getAttribute('link') || '',
      };

      // Parse origin
      const originEl = jointEl.querySelector('origin');
      if (originEl) {
        joint.origin = parseOrigin(originEl);
      }

      // Parse axis
      const axisEl = jointEl.querySelector('axis');
      if (axisEl) {
        const xyz = parseArray(axisEl.getAttribute('xyz'));
        joint.axis = {
          xyz: [xyz[0] || 0, xyz[1] || 0, xyz[2] || 0] as [number, number, number],
        };
      }

      // Parse limits
      const limitEl = jointEl.querySelector('limit');
      if (limitEl && type !== 'fixed' && type !== 'floating') {
        joint.limits = {
          lower: parseFloat(limitEl.getAttribute('lower') || '-Infinity'),
          upper: parseFloat(limitEl.getAttribute('upper') || 'Infinity'),
          effort: parseFloat(limitEl.getAttribute('effort') || '0'),
          velocity: parseFloat(limitEl.getAttribute('velocity') || '0'),
        };
      }

      joints.push(joint);
    });

    console.log(`[URDFValidator] Parsed ${links.length} links and ${joints.length} joints`);
    return { name: robotName, links, joints };
  }, [parseXML]);

  // Client-side validation
  const validateURDF = useCallback(async (
    urdfContent: string,
    serverValidation = false
  ): Promise<URDFValidationResult> => {
    setValidating(true);
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Parse URDF
      const robot = parseURDF(urdfContent);
      if (!robot) {
        errors.push('Failed to parse URDF XML');
        setResult({ valid: false, errors, warnings });
        return { valid: false, errors, warnings };
      }

      // Validation: Check for links
      if (robot.links.length === 0) {
        errors.push('URDF must contain at least one link');
      }

      // Validation: Check for duplicate link names
      const linkNames = new Set<string>();
      robot.links.forEach((link) => {
        if (linkNames.has(link.name)) {
          errors.push(`Duplicate link name: ${link.name}`);
        }
        linkNames.add(link.name);
      });

      // Validation: Check for duplicate joint names
      const jointNames = new Set<string>();
      robot.joints.forEach((joint) => {
        if (jointNames.has(joint.name)) {
          errors.push(`Duplicate joint name: ${joint.name}`);
        }
        jointNames.add(joint.name);
      });

      // Validation: Check joint references
      robot.joints.forEach((joint) => {
        if (!linkNames.has(joint.parent)) {
          errors.push(`Joint ${joint.name} references non-existent parent link: ${joint.parent}`);
        }
        if (!linkNames.has(joint.child)) {
          errors.push(`Joint ${joint.name} references non-existent child link: ${joint.child}`);
        }
      });

      // Validation: Check joint limits
      robot.joints.forEach((joint) => {
        if (joint.type === 'revolute' || joint.type === 'prismatic') {
          if (!joint.limits) {
            warnings.push(`Joint ${joint.name} of type ${joint.type} should have limits`);
          } else if (joint.limits.lower >= joint.limits.upper) {
            errors.push(`Joint ${joint.name} has invalid limits: lower (${joint.limits.lower}) >= upper (${joint.limits.upper})`);
          }
        }
      });

      // Server-side validation (optional)
      if (serverValidation) {
        try {
          const response = await fetch('/api/urdf/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: urdfContent,
          });

          if (!response.ok) {
            warnings.push('Server-side validation unavailable');
          } else {
            const serverResult = await response.json();
            if (serverResult.errors) {
              errors.push(...serverResult.errors);
            }
            if (serverResult.warnings) {
              warnings.push(...serverResult.warnings);
            }
          }
        } catch (error) {
          warnings.push('Server-side validation failed: ' + (error as Error).message);
        }
      }

      const validationResult = {
        valid: errors.length === 0,
        errors,
        warnings,
      };

      setResult(validationResult);
      return validationResult;
    } catch (error) {
      const errorMessage = 'Validation error: ' + (error as Error).message;
      errors.push(errorMessage);
      const validationResult = { valid: false, errors, warnings };
      setResult(validationResult);
      return validationResult;
    } finally {
      setValidating(false);
    }
  }, [parseURDF]);

  return {
    validating,
    result,
    validateURDF,
    parseURDF,
  };
};
