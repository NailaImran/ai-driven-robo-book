#!/bin/bash
################################################################################
# Physical AI - Chapter 1: ROS 2 Humble Environment Setup Script
################################################################################
#
# This script installs ROS 2 Humble Hawksbill on Ubuntu 22.04 (Jammy Jellyfish)
# and sets up a basic workspace for Physical AI development.
#
# Prerequisites:
#   - Ubuntu 22.04 LTS (fresh install recommended)
#   - Internet connection
#   - sudo privileges
#
# Usage:
#   chmod +x environment_setup.sh
#   ./environment_setup.sh
#
# Estimated time: 15-30 minutes (depending on internet speed)
#
# What this script does:
#   1. Set up ROS 2 apt repository
#   2. Install ROS 2 Humble Desktop (full GUI tools)
#   3. Install development tools (colcon, rosdep)
#   4. Create and initialize a ROS 2 workspace
#   5. Build a hello-world package
#   6. Configure environment variables (.bashrc)
#
################################################################################

set -e  # Exit on error

echo "============================================================================="
echo "  Physical AI - ROS 2 Humble Environment Setup"
echo "============================================================================="
echo ""

# Check Ubuntu version
if ! grep -q "22.04" /etc/os-release; then
    echo "❌ Error: This script requires Ubuntu 22.04 LTS (Jammy Jellyfish)"
    echo "   Your version: $(lsb_release -d | cut -f2)"
    exit 1
fi

echo "✅ Ubuntu 22.04 detected"
echo ""

################################################################################
# Step 1: Set locale
################################################################################
echo "📝 Step 1/8: Setting up locale..."
sudo apt update && sudo apt install -y locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
echo "✅ Locale configured"
echo ""

################################################################################
# Step 2: Add ROS 2 apt repository
################################################################################
echo "📝 Step 2/8: Adding ROS 2 apt repository..."

# Ensure Ubuntu Universe repository is enabled
sudo apt install -y software-properties-common
sudo add-apt-repository universe -y

# Add ROS 2 GPG key
sudo apt update && sudo apt install -y curl
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \
    -o /usr/share/keyrings/ros-archive-keyring.gpg

# Add repository to sources list
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] \
http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" \
    | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update
echo "✅ ROS 2 repository added"
echo ""

################################################################################
# Step 3: Install ROS 2 Humble Desktop
################################################################################
echo "📝 Step 3/8: Installing ROS 2 Humble Desktop (this may take 10-15 minutes)..."

# Desktop install includes: ROS base, RViz, demos, tutorials
sudo apt install -y ros-humble-desktop

echo "✅ ROS 2 Humble Desktop installed"
echo ""

################################################################################
# Step 4: Install development tools
################################################################################
echo "📝 Step 4/8: Installing ROS 2 development tools..."

# rosdep: manages dependencies
sudo apt install -y python3-rosdep
if [ ! -f "/etc/ros/rosdep/sources.list.d/20-default.list" ]; then
    sudo rosdep init
fi
rosdep update

# colcon: build tool for ROS 2
sudo apt install -y python3-colcon-common-extensions

# Additional useful tools
sudo apt install -y \
    python3-pip \
    python3-argcomplete \
    python3-vcstool \
    git \
    build-essential

echo "✅ Development tools installed"
echo ""

################################################################################
# Step 5: Set up environment variables
################################################################################
echo "📝 Step 5/8: Configuring environment variables..."

# Add ROS 2 setup to .bashrc (if not already present)
if ! grep -q "source /opt/ros/humble/setup.bash" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# ROS 2 Humble Environment" >> ~/.bashrc
    echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
    echo "export ROS_DOMAIN_ID=0  # Change if you have multiple robots on same network" >> ~/.bashrc
    echo "export ROS_LOCALHOST_ONLY=1  # Security: only allow local connections" >> ~/.bashrc
    echo "✅ Added ROS 2 environment to ~/.bashrc"
else
    echo "✅ ROS 2 environment already configured in ~/.bashrc"
fi

# Source for current session
source /opt/ros/humble/setup.bash
echo ""

################################################################################
# Step 6: Create ROS 2 workspace
################################################################################
echo "📝 Step 6/8: Creating ROS 2 workspace..."

WORKSPACE_DIR=~/ros2_ws

if [ -d "$WORKSPACE_DIR" ]; then
    echo "⚠️  Workspace directory $WORKSPACE_DIR already exists, skipping creation"
else
    mkdir -p $WORKSPACE_DIR/src
    echo "✅ Created workspace at $WORKSPACE_DIR"
fi

# Add workspace to .bashrc (if not already present)
if ! grep -q "source $WORKSPACE_DIR/install/setup.bash" ~/.bashrc; then
    echo "source $WORKSPACE_DIR/install/setup.bash" >> ~/.bashrc
    echo "✅ Added workspace to ~/.bashrc"
fi

cd $WORKSPACE_DIR
echo ""

################################################################################
# Step 7: Create hello-world package
################################################################################
echo "📝 Step 7/8: Creating hello-world ROS 2 package..."

HELLO_PKG_DIR=$WORKSPACE_DIR/src/hello_physical_ai

if [ -d "$HELLO_PKG_DIR" ]; then
    echo "⚠️  Package hello_physical_ai already exists, skipping creation"
else
    cd $WORKSPACE_DIR/src

    # Create Python package
    ros2 pkg create --build-type ament_python hello_physical_ai \
        --dependencies rclpy

    # Create a simple publisher node
    cat > $HELLO_PKG_DIR/hello_physical_ai/talker.py << 'EOF'
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class HelloPublisher(Node):
    def __init__(self):
        super().__init__('hello_publisher')
        self.publisher_ = self.create_publisher(String, 'hello_topic', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.count = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello Physical AI! Count: {self.count}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.count += 1


def main(args=None):
    rclpy.init(args=args)
    node = HelloPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
EOF

    chmod +x $HELLO_PKG_DIR/hello_physical_ai/talker.py

    # Update setup.py to include the script
    sed -i "s/'console_scripts': \[/'console_scripts': [\n            'talker = hello_physical_ai.talker:main',/" \
        $HELLO_PKG_DIR/setup.py

    echo "✅ Created hello_physical_ai package with talker node"
fi

cd $WORKSPACE_DIR
echo ""

################################################################################
# Step 8: Build workspace
################################################################################
echo "📝 Step 8/8: Building ROS 2 workspace..."

cd $WORKSPACE_DIR
colcon build --symlink-install

# Source the workspace
source $WORKSPACE_DIR/install/setup.bash

echo "✅ Workspace built successfully"
echo ""

################################################################################
# Verification
################################################################################
echo "============================================================================="
echo "  ✅ ROS 2 Humble Environment Setup Complete!"
echo "============================================================================="
echo ""
echo "📋 Verification Steps:"
echo ""
echo "1. Open a NEW terminal (to load .bashrc changes)"
echo ""
echo "2. Check ROS 2 version:"
echo "   $ ros2 --version"
echo "   Expected: ros2 doctor 0.10.x"
echo ""
echo "3. Test the hello-world publisher:"
echo "   Terminal 1: ros2 run hello_physical_ai talker"
echo "   Terminal 2: ros2 topic echo /hello_topic"
echo ""
echo "4. View available ROS 2 packages:"
echo "   $ ros2 pkg list | grep hello"
echo "   Expected: hello_physical_ai"
echo ""
echo "5. Launch RViz (3D visualization tool):"
echo "   $ rviz2"
echo "   (A window should open with a 3D view)"
echo ""
echo "============================================================================="
echo "📚 Next Steps:"
echo "============================================================================="
echo ""
echo "  - Learn ROS 2 basics: https://docs.ros.org/en/humble/Tutorials.html"
echo "  - Install Isaac Sim: https://developer.nvidia.com/isaac-sim"
echo "  - Explore TurtleBot3 simulation: sudo apt install ros-humble-turtlebot3*"
echo "  - Join ROS Discourse: https://discourse.ros.org/"
echo ""
echo "🤖 Welcome to the Physical AI community!"
echo ""
