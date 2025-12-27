# Skill: generate-content-variants

**Purpose**: Create beginner, intermediate, and advanced versions of technical content for personalized learning.

## Input

- `topic`: Content topic (e.g., "Forward Kinematics")
- `base_content`: Original technical explanation
- `code_example`: Optional code snippet

## Output

- `beginner_variant`: Detailed, step-by-step explanation
- `intermediate_variant`: Balanced explanation
- `advanced_variant`: Condensed technical summary

## Rules

### **Beginner Variant**
1. **Explain jargon**: Define every technical term
2. **Step-by-step**: Break complex concepts into small steps
3. **Analogies**: Use real-world analogies
4. **Visuals**: Suggest diagrams or illustrations
5. **Code**: Heavily commented, simple patterns

### **Intermediate Variant**
1. **Assume basics**: Readers know fundamental concepts
2. **Moderate depth**: Explain "why" and "how"
3. **References**: Link to deeper resources
4. **Code**: Moderate comments, standard patterns

### **Advanced Variant**
1. **Technical precision**: Use proper terminology
2. **Condensed**: Get to the point quickly
3. **Trade-offs**: Discuss alternatives and edge cases
4. **Code**: Minimal comments, advanced patterns
5. **Research**: Link to papers or advanced topics

## Example

**Input**:
```
topic: "Forward Kinematics"
base_content: "Forward kinematics computes the end-effector pose given joint angles using transformation matrices."
```

**Output**:

### Beginner Variant
```markdown
## What is Forward Kinematics?

Imagine a robot arm like a human arm with joints (shoulder, elbow, wrist). **Forward kinematics** answers the question: *"If I know the angle of each joint, where is the hand?"*

### How It Works (Step-by-Step)

1. **Start at the base**: The robot arm is attached to a fixed point
2. **Apply joint angles**: Each joint rotates by a certain angle
3. **Calculate position**: Use math (transformation matrices) to track where each link goes
4. **Result**: The final position and orientation of the end-effector (gripper)

### Why Is This Useful?

- **Simulation**: Visualize where the robot arm will be before moving it
- **Planning**: Check if the arm can reach a target
- **Safety**: Ensure the arm won't collide with objects

### Simple Example (2D Arm)

\`\`\`python
import numpy as np

# Robot arm with 2 links
link1_length = 1.0  # meters
link2_length = 0.5  # meters

# Joint angles (in radians)
theta1 = np.pi / 4  # 45 degrees
theta2 = np.pi / 6  # 30 degrees

# Forward kinematics calculation
x1 = link1_length * np.cos(theta1)
y1 = link1_length * np.sin(theta1)

x2 = x1 + link2_length * np.cos(theta1 + theta2)
y2 = y1 + link2_length * np.sin(theta1 + theta2)

print(f"End-effector position: ({x2:.2f}, {y2:.2f})")
# Output: End-effector position: (0.93, 0.93)
\`\`\`

**Next**: Try changing the joint angles and see how the position changes!
```

### Intermediate Variant
```markdown
## Forward Kinematics

Forward kinematics (FK) computes the end-effector pose (position + orientation) from joint angles using transformation matrices.

### Mathematical Foundation

For a serial manipulator with $n$ joints:

$$
T_0^n = T_0^1 \cdot T_1^2 \cdot \ldots \cdot T_{n-1}^n
$$

Where $T_i^{i+1}$ is the homogeneous transformation matrix from frame $i$ to $i+1$.

### Denavit-Hartenberg Convention

The DH parameters define each link:
- $\theta_i$: Joint angle
- $d_i$: Link offset
- $a_i$: Link length
- $\alpha_i$: Link twist

\`\`\`python
def dh_transform(theta, d, a, alpha):
    """Compute transformation matrix using DH parameters"""
    return np.array([
        [np.cos(theta), -np.sin(theta)*np.cos(alpha),  np.sin(theta)*np.sin(alpha), a*np.cos(theta)],
        [np.sin(theta),  np.cos(theta)*np.cos(alpha), -np.cos(theta)*np.sin(alpha), a*np.sin(theta)],
        [0,              np.sin(alpha),                 np.cos(alpha),                d],
        [0,              0,                             0,                            1]
    ])

def forward_kinematics(joint_angles, dh_params):
    """Compute end-effector pose from joint angles"""
    T = np.eye(4)
    for i, (theta, d, a, alpha) in enumerate(dh_params):
        theta += joint_angles[i]
        T = T @ dh_transform(theta, d, a, alpha)
    return T
\`\`\`

**Applications**: Simulation, collision checking, workspace analysis.

**Next**: See [Inverse Kinematics](./inverse-kinematics) to solve the reverse problem.
```

### Advanced Variant
```markdown
## Forward Kinematics

Compute end-effector pose $T_0^n \in SE(3)$ from joint configuration $\mathbf{q} \in \mathbb{R}^n$ via product of exponentials:

$$
T_0^n(\mathbf{q}) = e^{[\mathcal{S}_1]\theta_1} \cdots e^{[\mathcal{S}_n]\theta_n} M
$$

Where $\mathcal{S}_i$ are screw axes and $M$ is the home configuration.

**DH vs. POE**: DH requires careful frame assignment; POE is coordinate-free but requires screw axis computation.

\`\`\`python
from spatialmath import SE3, Twist3

def fk_poe(screws, thetas, M):
    """FK using Product of Exponentials"""
    T = SE3()
    for S, theta in zip(screws, thetas):
        T = T * Twist3(S).exp(theta)
    return T * M

# Example: PUMA 560
screws = [Twist3([0,0,1,0,0,0]), ...]  # 6 screws
thetas = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
M = SE3.Tx(0.8)
pose = fk_poe(screws, thetas, M)
\`\`\`

**Performance**: $O(n)$ matrix multiplications. Consider caching for real-time control.

**See**: [Modern Robotics, Ch. 4](http://hades.mech.northwestern.edu/index.php/Modern_Robotics)
```

## Usage in Code

```python
# Generate variants for a topic
variants = generate_content_variants(
    topic="Forward Kinematics",
    base_content="FK computes end-effector pose from joint angles",
    code_example="def fk(q): ..."
)

# Save to MDX with conditional rendering
mdx_content = f"""
<ForBeginner>
{variants['beginner_variant']}
</ForBeginner>

<ForIntermediate>
{variants['intermediate_variant']}
</ForIntermediate>

<ForAdvanced>
{variants['advanced_variant']}
</ForAdvanced>
```
