# Developer Quickstart: Chapter 2 Implementation

**Purpose**: Get your development environment ready to implement Chapter 2 content and interactive components

**Estimated Setup Time**: 30-60 minutes

---

## Prerequisites

Before you begin, ensure you have:

### Required Software

- ✅ **Ubuntu 22.04** (native, dual-boot, VM, or WSL2)
- ✅ **ROS 2 Humble** (see installation below)
- ✅ **Node.js 18+** and **npm 9+**
- ✅ **Git 2.x**
- ✅ **Docker 24+** (for testing and CI/CD)
- ✅ **Python 3.10+** (comes with Ubuntu 22.04)

### Recommended Tools

- **VS Code** with extensions:
  - ROS 2 Extension Pack
  - MDX Extension
  - ESLint
  - Prettier
- **Terminator** or **Tmux** (multi-pane terminal)

### Hardware (Optional)

- **NVIDIA Jetson** (Nano, Xavier NX, Orin Nano) for deployment testing
- **Webcam** or **RealSense camera** for computer vision examples

---

## Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/panaversity/physical-ai-textbook.git
cd physical-ai-textbook

# Checkout the feature branch
git checkout 001-physical-ai-textbook

# Verify you're on the right branch
git branch
```

---

## Step 2: Install ROS 2 Humble

### Option A: Native Installation (Recommended)

```bash
# Set locale
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# Add ROS 2 apt repository
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 Humble Desktop
sudo apt update
sudo apt install ros-humble-desktop ros-dev-tools -y

# Install additional packages for Chapter 2
sudo apt install -y \
  ros-humble-rosbridge-suite \
  ros-humble-robot-state-publisher \
  ros-humble-joint-state-publisher-gui \
  ros-humble-xacro \
  ros-humble-gazebo-ros-pkgs \
  python3-colcon-common-extensions \
  python3-rosdep

# Initialize rosdep
sudo rosdep init
rosdep update

# Source ROS 2 in your shell (add to ~/.bashrc for persistence)
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Verify installation
ros2 --version
# Expected output: ros2 cli version: 0.25.x
```

### Option B: Docker (For Testing Only)

```bash
# Pull ROS 2 Humble Docker image
docker pull osrf/ros:humble-desktop

# Run container
docker run -it --rm \
  --name ros2-humble \
  --network host \
  osrf/ros:humble-desktop \
  bash
```

**Note**: Docker is suitable for testing code examples but not for development of interactive components.

---

## Step 3: Install Node.js Dependencies

```bash
# Navigate to project root
cd physical-ai-textbook

# Install npm dependencies
npm install

# Expected packages installed:
# - @docusaurus/core, @docusaurus/preset-classic
# - react, react-dom
# - three, @types/three (for URDF Editor)
# - d3, @types/d3 (for Node Visualizer)
# - recharts (for PID Tuner)
# - socket.io-client (for WebSocket)
# - monaco-editor (for URDF code editor)

# Verify installation
npm list --depth=0
```

---

## Step 4: Set Up ROS 2 Workspace

```bash
# Create ROS 2 workspace for code examples
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Clone any example packages (optional, for testing)
cd src
# git clone https://github.com/ros2/examples.git

# Build workspace
cd ~/ros2_ws
colcon build --symlink-install

# Source workspace
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc
source ~/ros2_ws/install/setup.bash

# Test workspace
ros2 pkg list | grep examples
```

---

## Step 5: Install Backend Services (Optional)

Backend services are needed for:
- **Node Visualizer**: rosbridge WebSocket server
- **URDF Editor**: URDF validation API
- **Deployment Dashboard**: Jetson metrics agent

### 5.1: Install rosbridge_suite

```bash
# Already installed in Step 2, verify:
ros2 pkg list | grep rosbridge

# Test rosbridge server
ros2 launch rosbridge_server rosbridge_websocket_launch.xml &

# You should see: "Rosbridge WebSocket server started on port 9090"

# Test connection (optional)
curl http://localhost:9090
# Should return "Rosbridge WebSocket Server"

# Stop the test server
killall rosbridge_websocket_launch.xml
```

### 5.2: Install URDF Validator (FastAPI)

```bash
# Navigate to backend directory
cd physical-ai-textbook/backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-multipart

# Verify check_urdf is available (from ROS 2)
which check_urdf
# Should output: /opt/ros/humble/bin/check_urdf

# Test validator (create stub file first - will be implemented later)
# uvicorn urdf-validator.api:app --reload
```

### 5.3: Deployment Agent (For Jetson Only)

```bash
# On Jetson device, install dependencies
sudo apt install python3-pip python3-psutil
pip3 install websockets

# Install ROS 2 Humble on Jetson (same as Step 2)

# Agent will be implemented in later phase
```

---

## Step 6: Run Development Environment

### Terminal 1: Start Docusaurus Dev Server

```bash
cd physical-ai-textbook
npm start

# Docusaurus will open browser at http://localhost:3000
# Hot reload enabled - changes to MDX files will auto-refresh
```

### Terminal 2: Start rosbridge (For Node Visualizer)

```bash
source /opt/ros/humble/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml

# Leave running in background
# WebSocket server on ws://localhost:9090
```

### Terminal 3: Start URDF Validator API (For URDF Editor)

```bash
cd physical-ai-textbook/backend/urdf-validator
source venv/bin/activate
uvicorn api:app --reload --port 8000

# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

---

## Step 7: Verify Setup

### Test 1: Docusaurus Build

```bash
cd physical-ai-textbook
npm run build

# Should complete without errors
# Output in build/ directory
```

### Test 2: ROS 2 Communication

```bash
# Terminal 1: Start talker
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker

# Terminal 2: Start listener
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp listener

# You should see messages flowing
# Ctrl+C to stop both
```

### Test 3: URDF Validation

```bash
# Create test URDF
cat > /tmp/test.urdf <<'EOF'
<?xml version="1.0"?>
<robot name="test">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="1 1 1"/>
      </geometry>
    </visual>
    <inertial>
      <mass value="10"/>
      <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
    </inertial>
  </link>
</robot>
EOF

# Validate with check_urdf
check_urdf /tmp/test.urdf

# Should output: "robot name is: test" and "Successfully Parsed XML URD
F"
```

### Test 4: Interactive Component Stub

```bash
# Navigate to Chapter 2 components
cd physical-ai-textbook/src/components/chapter-2

# Verify directories exist (will be created during implementation)
# Expected:
# - NodeVisualizer/
# - URDFEditor/
# - PIDTuner/
# - DeploymentDashboard/
```

---

## Step 8: Development Workflow

### Creating Content

1. **Write MDX Lesson Files**:
   ```bash
   cd docs/chapter-2
   # Edit lesson-2-1-ros2-fundamentals.md
   code lesson-2-1-ros2-fundamentals.md
   ```

2. **Add Code Examples**:
   - Place in `docs/chapter-2/assets/code-examples/`
   - Use backticks in MDX for syntax highlighting
   - Test in ROS 2 workspace before adding

3. **Create Diagrams**:
   - Use draw.io, Figma, or Inkscape
   - Export as SVG (preferred) or PNG (high-res)
   - Place in `docs/chapter-2/assets/diagrams/`
   - Add alt text in MDX

### Developing Interactive Components

1. **Create Component File**:
   ```bash
   cd src/components/chapter-2/NodeVisualizer
   touch NodeVisualizer.tsx
   code NodeVisualizer.tsx
   ```

2. **Import in MDX**:
   ```mdx
   ---
   title: Lesson 2.1 - ROS 2 Fundamentals
   ---

   import NodeVisualizer from '@site/src/components/chapter-2/NodeVisualizer/NodeVisualizer';

   # ROS 2 Fundamentals

   ...content...

   ## Interactive Demo

   <NodeVisualizer
     demoNodes={["talker", "listener"]}
     demoTopics={["/chatter"]}
   />
   ```

3. **Test Component**:
   - Docusaurus dev server auto-reloads
   - Check browser console for errors
   - Test with different props

### Testing Code Examples

1. **Create Test File**:
   ```bash
   cd tests/ros2
   touch test_lesson_2_1_examples.py
   ```

2. **Write Test**:
   ```python
   import subprocess
   import tempfile

   def test_talker_node():
       code = """
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__('talker')
        self.publisher_ = self.create_publisher(String, 'chatter', 10)

def main():
    rclpy.init()
    talker = Talker()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
"""
       with tempfile.NamedTemporaryFile(mode='w', suffix='.py') as f:
           f.write(code)
           f.flush()
           result = subprocess.run(['python3', f.name], timeout=5, capture_output=True)
       assert result.returncode == 0
   ```

3. **Run Tests**:
   ```bash
   cd tests/ros2
   pytest test_lesson_2_1_examples.py -v
   ```

---

## Step 9: Docker Environment (For CI/CD Testing)

```bash
# Build Docker image for testing
cd physical-ai-textbook
docker build -t physical-ai-textbook:test -f Dockerfile.test .

# Run tests in container
docker run --rm physical-ai-textbook:test pytest tests/ros2/

# Build Docusaurus in container
docker run --rm -v $(pwd)/build:/app/build physical-ai-textbook:test npm run build
```

---

## Step 10: Deployment to Jetson (Optional)

### SSH Setup

```bash
# Generate SSH key (if not already done)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy key to Jetson
ssh-copy-id jetson@192.168.1.100

# Test connection
ssh jetson@192.168.1.100
```

### SSH Tunnel for Deployment Dashboard

```bash
# Create tunnel from local port 9091 to Jetson port 9091
ssh -L 9091:localhost:9091 jetson@192.168.1.100

# Keep this terminal open
# Dashboard will connect to ws://localhost:9091
```

### Deploy ROS 2 Package to Jetson

```bash
# On development machine, build package
cd ~/ros2_ws
colcon build --packages-select student_controller

# Create tarball
tar -czf student_controller.tar.gz install/student_controller

# Copy to Jetson
scp student_controller.tar.gz jetson@192.168.1.100:~/

# SSH to Jetson and extract
ssh jetson@192.168.1.100
cd ~
tar -xzf student_controller.tar.gz
source install/setup.bash

# Run node
ros2 run student_controller joint_commander
```

---

## Troubleshooting

### Issue: ROS 2 commands not found

**Solution**:
```bash
source /opt/ros/humble/setup.bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
```

### Issue: npm install fails with permission errors

**Solution**:
```bash
# Use nvm (Node Version Manager) instead of system Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Issue: rosbridge connection refused

**Solution**:
```bash
# Check if rosbridge is running
ps aux | grep rosbridge

# Restart rosbridge
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

### Issue: URDF validation fails

**Solution**:
```bash
# Verify check_urdf is installed
which check_urdf

# If not found, reinstall:
sudo apt install ros-humble-urdfdom-py
```

### Issue: Docusaurus build slow

**Solution**:
```bash
# Clear cache
npm run clear

# Rebuild
npm run build

# Use incremental builds
npm run start
```

---

## Next Steps

Now that your environment is set up, you're ready to:

1. ✅ **Review Planning Documents**:
   - `specs/002-chapter-2-ros2-control/spec.md`
   - `specs/002-chapter-2-ros2-control/plan.md`
   - `specs/002-chapter-2-ros2-control/research.md`
   - `specs/002-chapter-2-ros2-control/data-model.md`

2. ⏭️ **Generate Task List**:
   ```bash
   /sp.tasks
   ```

3. 🔨 **Begin Implementation**:
   ```bash
   /sp.implement
   ```

4. 📝 **Write Content**:
   - Start with Lesson 2.1 MDX file
   - Add code examples and diagrams
   - Embed Node Visualizer component

5. 🧪 **Test Everything**:
   - Run ROS 2 code examples
   - Test interactive components
   - Validate URDF models

---

## Additional Resources

### Official Documentation
- [ROS 2 Humble Docs](https://docs.ros.org/en/humble/)
- [Docusaurus Docs](https://docusaurus.io/docs)
- [Three.js Docs](https://threejs.org/docs/)
- [D3.js Docs](https://d3js.org/)

### Example Repositories
- [ROS 2 Examples](https://github.com/ros2/examples)
- [urdf-loaders](https://github.com/gkjohnson/urdf-loaders)
- [rosbridge_suite](https://github.com/RobotWebTools/rosbridge_suite)

### Community
- [ROS Discourse](https://discourse.ros.org/)
- [Docusaurus Discord](https://discord.gg/docusaurus)

---

**Quickstart Complete** ✅

You're now ready to implement Chapter 2!

**Document Version**: 1.0
**Last Updated**: 2025-12-06
