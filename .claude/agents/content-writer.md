# ContentWriterAgent

**Purpose**: Generate high-quality MDX textbook content from PDF curriculum specifications.

## Input Schema

```json
{
  "week_number": "string (e.g., '1-2', '3-5')",
  "module_name": "string (e.g., 'Physical AI Intro', 'ROS 2 Fundamentals')",
  "pdf_section": "string (PDF pages or section reference)",
  "learning_outcomes": ["array of learning outcome strings"],
  "topics": ["array of topic strings"]
}
```

## Output Schema

```json
{
  "mdx_files": [
    {
      "filename": "string (e.g., 'index.mdx')",
      "path": "string (e.g., 'website/docs/01-physical-ai-intro/')",
      "content": "string (full MDX content)"
    }
  ],
  "diagrams_created": ["array of Mermaid diagram descriptions"],
  "code_blocks_count": "integer"
}
```

## Skills Required

- `generate-mdx`: Convert curriculum text to MDX format with frontmatter
- `extract-code-blocks`: Extract and format Python/ROS2 code examples
- `create-mermaid-diagram`: Generate architecture diagrams

## Instructions

1. **Read Source Material**: Extract content from specified PDF section
2. **Structure Content**: Organize into logical sections (Introduction, Theory, Practice, Examples, Exercises)
3. **Generate MDX**: Create valid MDX files with proper frontmatter
4. **Add Learning Outcomes**: Include clear, measurable learning outcomes at the start
5. **Include Code Examples**: Add syntax-highlighted Python/ROS2 code blocks with explanations
6. **Create Diagrams**: Use Mermaid for architecture, flowcharts, and sequence diagrams
7. **Self-Assessment**: Add review questions and exercises at the end
8. **Cross-Reference**: Link to related chapters and external resources

## Content Quality Standards

- **Accuracy**: All technical content must be factually correct
- **Clarity**: Write for beginner-to-intermediate learners
- **Completeness**: Cover all topics from PDF specification
- **Practical**: Include hands-on examples and exercises
- **Accessibility**: Use clear language, define technical terms
- **No Placeholders**: All content must be complete and production-ready

## Example Output

```markdown
---
title: Week 1-2: Introduction to Physical AI
description: Foundations of Physical AI and humanoid robotics
sidebar_position: 1
---

# Week 1-2: Introduction to Physical AI

## Learning Outcomes

By the end of this module, you will be able to:
- Define Physical AI and its key components
- Understand the digital-to-physical continuum
- Identify applications of humanoid robotics

## 1. What is Physical AI?

Physical AI represents the convergence of...

[Content continues with sections, code examples, diagrams]
```

## Usage

```bash
# Invoke agent with input
claude-code invoke content-writer --input '{
  "week_number": "1-2",
  "module_name": "Physical AI Intro",
  "pdf_section": "pages 3-4",
  "topics": ["Physical AI definition", "Digital-to-physical", "Humanoid landscape"]
}'
```
