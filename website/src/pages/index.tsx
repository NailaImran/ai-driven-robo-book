import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { AuthWidget } from '../components/AuthWidget';
import { PersonalizationButton } from '../components/PersonalizationButton';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
          <PersonalizationButton />
          <AuthWidget />
        </div>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction">
            Start Learning - 13 Week Curriculum 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Complete 13-Week Curriculum',
    icon: '📚',
    description: (
      <>
        From ROS 2 fundamentals to autonomous humanoid development.
        Structured learning path with hands-on projects and assessments.
      </>
    ),
  },
  {
    title: 'AI-Powered Chatbot',
    icon: '🤖',
    description: (
      <>
        Ask questions and get instant, contextual answers with source citations.
        Your personal AI tutor for robotics.
      </>
    ),
  },
  {
    title: 'Personalized Learning',
    icon: '👤',
    description: (
      <>
        Adapt content based on your role (Student/Educator/Professional) and skill level
        (Beginner/Intermediate/Advanced).
      </>
    ),
  },
  {
    title: 'Urdu Translation',
    icon: '🌐',
    description: (
      <>
        Full RTL translation with technical accuracy for Urdu-speaking learners.
        Toggle between English and اردو seamlessly.
      </>
    ),
  },
  {
    title: 'Simulation-First',
    icon: '🎮',
    description: (
      <>
        Master Gazebo and NVIDIA Isaac Sim for high-fidelity robot testing.
        Zero hardware required to complete the entire course.
      </>
    ),
  },
  {
    title: 'Industry-Relevant Skills',
    icon: '💼',
    description: (
      <>
        Build production-grade skills with ROS 2, NVIDIA Isaac, and GPT integration.
        Capstone project for your portfolio.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CurriculumOverview(): JSX.Element {
  return (
    <section className={styles.curriculumSection}>
      <div className="container">
        <h2 className="text--center margin-bottom--lg">Curriculum Overview</h2>
        <div className="row">
          <div className="col col--6">
            <h3>Weeks 1-2: Physical AI Foundations</h3>
            <p>Introduction to embodied intelligence, humanoid landscape, sensor systems</p>

            <h3>Module 1: ROS 2 Fundamentals (Weeks 3-5)</h3>
            <p>Master the Robot Operating System for distributed robotics applications</p>

            <h3>Module 2: Simulation (Weeks 6-7)</h3>
            <p>Build high-fidelity simulations in Gazebo with URDF modeling</p>
          </div>
          <div className="col col--6">
            <h3>Module 3: NVIDIA Isaac (Weeks 8-10)</h3>
            <p>GPU-accelerated perception, RL training, and sim-to-real transfer</p>

            <h3>Module 4: Humanoid Development (Weeks 11-12)</h3>
            <p>Kinematics, dynamics, bipedal locomotion, and manipulation</p>

            <h3>Week 13: Conversational AI</h3>
            <p>Integrate GPT-4 for natural language interaction</p>
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/docs/introduction/course-overview">
            View Full Curriculum →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CapstoneProject(): JSX.Element {
  return (
    <section className={styles.capstoneSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h2 className="text--center">Capstone Project</h2>
            <p className="text--center margin-bottom--lg">
              Build an autonomous humanoid robot that can:
            </p>
            <ul className={styles.capstoneList}>
              <li>✅ Navigate to target locations using SLAM</li>
              <li>✅ Detect and grasp objects with vision-based manipulation</li>
              <li>✅ Walk stably and climb stairs</li>
              <li>✅ Respond to voice commands in natural language</li>
            </ul>
            <div className="text--center margin-top--lg">
              <Link
                className="button button--secondary button--lg"
                to="/docs/capstone">
                Learn About Capstone →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="A comprehensive interactive textbook for learning Physical AI and building autonomous humanoid robots">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CurriculumOverview />
        <CapstoneProject />
      </main>
    </Layout>
  );
}
