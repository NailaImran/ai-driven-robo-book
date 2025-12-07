# Physical AI & Humanoid Robotics Textbook

An interactive, AI-native textbook teaching Physical AI and Humanoid Robotics from theory to practice.

**Target Audience:** Senior undergraduates, graduate students, and industry professionals transitioning to robotics

## Features

- 📚 4 comprehensive chapters covering Physical AI foundations to advanced VLA models
- 💻 Executable code examples in Python and ROS 2
- 📊 Interactive diagrams and visualizations using Mermaid
- 🤖 RAG-powered chatbot for instant help (coming soon)
- 🌍 Urdu translation support
- 🎯 Hands-on projects and assessments

## Installation

```bash
npm install --legacy-peer-deps
```

## Local Development

```bash
npm start
```

This command starts a local development server at `localhost:3000`. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory.

## Chapter 1: Foundations of Physical AI

**Status:** 🚧 In Development

**Sections:**
- 1.1: Introduction to Physical AI
- 1.2: Embodied Intelligence Theory
- 1.3: Hardware Landscape Deep Dive
- 1.4: Lab Setup Guide

**Code Examples:**
- Physics simulation with NumPy
- Sensor data processing
- ROS 2 environment setup

## Tech Stack

- **Framework:** Docusaurus 3.x with TypeScript
- **Components:** React 19, D3, Recharts, Framer Motion
- **Code Examples:** Python 3.10+, ROS 2 Humble/Iron
- **Deployment:** GitHub Pages with GitHub Actions

## Development Workflow

1. Install dependencies: `npm install --legacy-peer-deps`
2. Start dev server: `npm start`
3. Make changes to content in `docs/chapter-1/`
4. Test changes locally
5. Build: `npm run build`
6. Deploy via GitHub Actions (automated on push to main)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on content authoring and code style.

## License

Copyright © 2025 Physical AI Textbook Project. Built with Docusaurus.
