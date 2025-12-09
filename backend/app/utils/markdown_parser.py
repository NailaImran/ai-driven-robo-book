"""Markdown parser utility for lesson content."""

import os
import re
from pathlib import Path
from typing import Dict, List, Optional
import frontmatter
import markdown


def parse_lesson_markdown(file_path: str) -> Dict:
    """
    Parse markdown file with YAML frontmatter.

    Args:
        file_path: Path to markdown file

    Returns:
        Dictionary with parsed lesson data:
        - id: Lesson ID from frontmatter
        - title: Lesson title from frontmatter
        - description: First paragraph or explicit description
        - keywords: Keywords from frontmatter
        - content_markdown: Full markdown content
        - content_text: Plain text version
        - prerequisites: Prerequisites list from frontmatter
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Lesson file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        post = frontmatter.load(f)

    # Extract metadata
    metadata = post.metadata or {}
    content = post.content

    # Convert markdown to plain text
    html = markdown.markdown(content)
    plain_text = html2text(html)

    # Extract description from first paragraph if not in metadata
    description = metadata.get("description", extract_first_paragraph(plain_text))

    return {
        "id": metadata.get("id", "unknown"),
        "title": metadata.get("title", "Untitled"),
        "description": description,
        "keywords": metadata.get("keywords", []),
        "prerequisites": metadata.get("prerequisites", []),
        "sidebar_position": metadata.get("sidebar_position", 0),
        "content_markdown": content,
        "content_text": plain_text,
    }


def extract_first_paragraph(text: str, max_length: int = 200) -> str:
    """
    Extract first paragraph from plain text.

    Args:
        text: Plain text content
        max_length: Maximum length of description

    Returns:
        First paragraph truncated to max_length
    """
    # Split by double newline to get paragraphs
    paragraphs = text.split("\n\n")

    if paragraphs:
        first = paragraphs[0].strip()
        if len(first) > max_length:
            first = first[: max_length - 3] + "..."
        return first

    return text[: max_length - 3] + "..." if len(text) > max_length else text


def html2text(html: str) -> str:
    """
    Convert HTML to plain text.

    Args:
        html: HTML content

    Returns:
        Plain text version
    """
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", html)

    # Decode HTML entities
    text = text.replace("&nbsp;", " ")
    text = text.replace("&lt;", "<")
    text = text.replace("&gt;", ">")
    text = text.replace("&amp;", "&")

    # Clean up whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def extract_quiz_questions(content: str) -> List[Dict]:
    """
    Extract quiz questions from markdown content.

    Args:
        content: Markdown content with quiz questions

    Returns:
        List of question dictionaries with:
        - question_number
        - question_text
        - options (list of A, B, C, D options)
        - correct_answer (A, B, C, or D)
        - explanation
    """
    questions = []
    question_pattern = r"### Question (\d+)\n(.*?)(?=### Question|\Z)"
    matches = re.findall(question_pattern, content, re.DOTALL)

    for question_num, question_block in matches:
        lines = question_block.strip().split("\n")

        # Extract question text (first non-empty line)
        question_text = lines[0].strip() if lines else ""

        # Extract options (lines starting with A), B), C), D))
        options = []
        for line in lines[1:]:
            match = re.match(r"^([A-D])\)\s*(.*?)(?:\s*\(Correct\))?$", line.strip())
            if match:
                options.append(match.group(2).strip())

        # Extract correct answer and explanation
        correct_answer = ""
        explanation = ""

        # Look for (Correct) marker or details section
        details_match = re.search(r"<details>.*?<summary>Answer</summary>(.*?)</details>", question_block, re.DOTALL)
        if details_match:
            details_content = details_match.group(1)

            # Find correct answer
            answer_match = re.search(r"\*\*([A-D])\)", details_content)
            if answer_match:
                correct_answer = answer_match.group(1)

            # Extract explanation
            explanation = details_content.split("\*\*", 1)[-1].strip() if "\*\*" in details_content else ""
            explanation = html2text(explanation)
        else:
            # Try to find correct marker in options
            for i, line in enumerate(lines[1:]):
                if "(Correct)" in line:
                    correct_answer = chr(65 + i % 4)  # A=65, B=66, C=67, D=68
                    break

        if question_text and options and correct_answer:
            questions.append(
                {
                    "question_number": int(question_num),
                    "question_text": question_text,
                    "options": options,
                    "correct_answer": correct_answer,
                    "explanation": explanation,
                }
            )

    return questions


def estimate_reading_time(text: str) -> int:
    """
    Estimate reading time in minutes.

    Args:
        text: Plain text content

    Returns:
        Estimated reading time in minutes
    """
    # Average reading speed: 200 words per minute
    word_count = len(text.split())
    minutes = max(1, round(word_count / 200))
    return minutes
