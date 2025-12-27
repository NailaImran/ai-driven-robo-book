# Skill: generate-mdx

**Purpose**: Convert curriculum text to valid MDX format with proper frontmatter and structure.

## Input

- `title`: Page title
- `description`: Page description
- `sidebar_position`: Position in sidebar (integer)
- `content`: Raw content text

## Output

- Valid MDX file with frontmatter and formatted content

## Implementation

```markdown
---
title: [TITLE]
description: [DESCRIPTION]
sidebar_position: [POSITION]
---

# [TITLE]

[FORMATTED_CONTENT]
```

## Rules

1. **Frontmatter**: Always include title, description, sidebar_position
2. **Headings**: Use proper heading hierarchy (h1 for title, h2 for sections, h3 for subsections)
3. **Code Blocks**: Use triple backticks with language identifier
4. **Lists**: Use proper markdown list syntax
5. **Links**: Use relative links for internal pages, absolute for external
6. **Images**: Use MDX import syntax for images
7. **Components**: Use JSX syntax for React components

## Example

Input:
```
title: "ROS 2 Architecture"
description: "Understanding ROS 2 design patterns"
sidebar_position: 2
content: "ROS 2 uses a distributed..."
```

Output:
```mdx
---
title: ROS 2 Architecture
description: Understanding ROS 2 design patterns
sidebar_position: 2
---

# ROS 2 Architecture

ROS 2 uses a distributed...
```
