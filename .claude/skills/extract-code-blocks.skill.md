# Skill: extract-code-blocks

**Purpose**: Extract and format code examples (Python, ROS2, XML, YAML) with syntax highlighting.

## Input

- `language`: Programming language (python, xml, yaml, bash, cpp)
- `code`: Code content
- `description`: Optional code description

## Output

- Formatted code block with syntax highlighting and optional description

## Implementation

```mdx
{description && (
  <p className="code-description">{description}</p>
)}

\`\`\`{language}
{code}
\`\`\`
```

## Supported Languages

- `python`: Python code
- `xml`: ROS2 launch files, URDF
- `yaml`: Configuration files
- `bash`: Shell commands
- `cpp`: C++ code
- `json`: JSON data

## Example

Input:
```
language: "python"
code: "import rclpy\nfrom rclpy.node import Node"
description: "Import ROS2 Python libraries"
```

Output:
```mdx
Import ROS2 Python libraries:

\`\`\`python
import rclpy
from rclpy.node import Node
\`\`\`
```
