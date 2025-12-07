/**
 * Lesson 3.4: Sensor Simulation & Synthetic Data
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson34Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-3-4-title')}</h1>
    </header>
  );
};

export const Lesson34Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>{t('lesson-3-4-overview')}</p>
      <p>
        <strong>{t('estimated-time')}</strong> 4 hours
      </p>
      <p>
        <strong>{t('exercises')}</strong> 3 code examples + 1 dataset generation pipeline + validation scripts
      </p>
    </section>
  );
};

export const Lesson34LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ol>
        <li>Configure realistic LiDAR point cloud sensors</li>
        <li>Simulate RGB-D depth cameras with artifacts</li>
        <li>Model IMU (accelerometer, gyroscope) with bias and drift</li>
        <li>Generate labeled datasets for computer vision</li>
        <li>Apply domain randomization techniques</li>
        <li>Export data in standard formats (COCO, YOLO)</li>
        <li>Validate synthetic data quality</li>
      </ol>
    </section>
  );
};

export const Lesson34Prerequisites: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="prerequisites">
      <h2>{t('prerequisites')}</h2>
      <ul>
        <li>{t('prereq-1')}</li>
        <li>Completed Lesson 3.1 (Gazebo fundamentals)</li>
        <li>Python 3.10+ with NumPy, OpenCV, PIL</li>
        <li>ROS 2 message and bag file knowledge</li>
      </ul>
    </section>
  );
};

export const Lesson34KeyConcepts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="key-concepts">
      <h2>{t('key-concepts')}</h2>

      <h3>Sensor Types</h3>
      <p>Learn about different sensor types used in robotics:</p>

      <h4>{t('lidar-simulation')}</h4>
      <p>LiDAR provides 3D point clouds with configurable noise, beam count, and range.</p>

      <h4>{t('depth-camera')}</h4>
      <p>Depth cameras capture RGB images with depth channels, subject to quantization and noise.</p>

      <h4>{t('imu-simulation')}</h4>
      <p>IMUs measure acceleration and angular velocity with realistic bias, noise, and drift.</p>

      <h3>{t('data-augmentation')}</h3>
      <p>Techniques to make synthetic data more realistic for training robust perception models.</p>
    </section>
  );
};

export const Lesson34DataGeneration: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="data-generation">
      <h2>{t('Synthetic Data Generation')}</h2>

      <h3>{t('synthetic-data-generation')}</h3>
      <p>Generate large-scale datasets with automatic annotations:</p>
      <ul>
        <li>RGB images from rendered scenes</li>
        <li>Depth maps and segmentation masks</li>
        <li>Pose annotations and bounding boxes</li>
        <li>Instance segmentation and class labels</li>
      </ul>

      <h3>{t('export-formats')}</h3>
      <p>{t('export-formats')}</p>

      <h3>{t('synthetic-dataset')}</h3>
      <p>Generate 5000+ labeled images with automatic groundtruth labels.</p>
    </section>
  );
};

export const Lesson34Validation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="validation">
      <h2>{t('validation-checklist')}</h2>
      <p>Ensure synthetic data quality before training perception models:</p>
      <ul>
        <li>Verify point cloud density and range</li>
        <li>Check depth map accuracy within expected error bounds</li>
        <li>Validate IMU noise characteristics</li>
        <li>Confirm annotation correctness with visual inspection</li>
        <li>Test sim-to-real transfer on physical robot</li>
      </ul>
    </section>
  );
};

export const Lesson34Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-3/lesson-3-3-isaac-sim`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-3/chapter-3-quiz`} className="btn btn-primary">
        {t('take-quiz')} →
      </a>
    </nav>
  );
};

/**
 * Main wrapper component for Lesson 3.4
 */
export const Lesson34: React.FC = () => {
  return (
    <article className="lesson-3-4">
      <Lesson34Header />
      <Lesson34Overview />
      <Lesson34LearningObjectives />
      <Lesson34Prerequisites />
      <Lesson34KeyConcepts />
      <Lesson34DataGeneration />
      <Lesson34Validation />
      <Lesson34Navigation />
    </article>
  );
};

export default Lesson34;
