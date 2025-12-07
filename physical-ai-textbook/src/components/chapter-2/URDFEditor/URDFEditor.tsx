/**
 * URDF Editor Component
 *
 * Web-based 3D robot model editor with:
 * - Monaco code editor (URDF XML)
 * - Three.js 3D preview
 * - Live validation
 * - Joint manipulation sliders
 *
 * Implementation: Phase 4 (Interactive Components)
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './URDFEditor.module.css';

interface URDFEditorProps {
  initialURDF?: string;
  onURDFChange?: (urdf: string) => void;
}

const URDFEditor: React.FC<URDFEditorProps> = ({
  initialURDF = '',
  onURDFChange,
}) => {
  const [urdf, setUrdf] = useState(initialURDF);
  const [errors, setErrors] = useState<string[]>([]);
  const [joints, setJoints] = useState<any[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Validate URDF
  const validateURDF = (xml: string) => {
    const newErrors: string[] = [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');

      if (doc.getElementsByTagName('parsererror').length > 0) {
        newErrors.push('Invalid XML syntax');
      }

      // Check for required elements
      if (!doc.getElementsByTagName('robot').length) {
        newErrors.push('Missing <robot> element');
      }

      // Extract joints
      const jointElements = doc.getElementsByTagName('joint');
      const extractedJoints = Array.from(jointElements).map((j) => ({
        name: j.getAttribute('name'),
        type: j.getAttribute('type'),
      }));
      setJoints(extractedJoints);
    } catch (e) {
      newErrors.push(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    setErrors(newErrors);
  };

  const handleURDFChange = (newURDF: string) => {
    setUrdf(newURDF);
    validateURDF(newURDF);
    onURDFChange?.(newURDF);
  };

  const handleExport = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(urdf)}`
    );
    element.setAttribute('download', 'robot.urdf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={styles.container}>
      <div className={styles.editorSection}>
        <h3>URDF Editor</h3>
        <textarea
          className={styles.editor}
          value={urdf}
          onChange={(e) => handleURDFChange(e.target.value)}
          placeholder="Paste URDF XML here..."
        />

        {errors.length > 0 && (
          <div className={styles.errors}>
            {errors.map((error, i) => (
              <div key={i} className={styles.error}>
                Error: {error}
              </div>
            ))}
          </div>
        )}

        {errors.length === 0 && urdf && (
          <div className={styles.success}>Valid URDF</div>
        )}

        <button onClick={handleExport} className={styles.exportBtn}>
          Export URDF
        </button>
      </div>

      <div className={styles.previewSection}>
        <h3>3D Preview</h3>
        <div ref={canvasRef} className={styles.canvas}>
          <p>3D preview will render here (Three.js integration)</p>
        </div>

        {joints.length > 0 && (
          <div className={styles.joints}>
            <h4>Joints ({joints.length})</h4>
            {joints.map((joint) => (
              <div key={joint.name} className={styles.joint}>
                <label>{joint.name}</label>
                <input type="range" min="-180" max="180" defaultValue="0" />
                <span>0 degrees</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default URDFEditor;
