"""Seed lessons from markdown files into database."""

import asyncio
import os
from pathlib import Path
from datetime import datetime

# Add parent directory to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import init_db, async_session_maker, engine
from app.models import Lesson
from app.utils.markdown_parser import (
    parse_lesson_markdown,
    estimate_reading_time,
    extract_quiz_questions,
)
from app.config import settings
from sqlalchemy import select


# Map lessons from docs directory
LESSON_FILE_MAPPING = {
    "chapter-1": {
        1: "chapter-1/1-1-intro-to-physical-ai.md",
        2: "chapter-1/1-2-embodied-intelligence.md",
        3: "chapter-1/1-3-hardware-landscape.md",
        4: "chapter-1/1-4-lab-setup-guide.md",
    },
    "chapter-2": {
        1: "chapter-2/lesson-2-1-ros2-fundamentals.md",
        2: "chapter-2/lesson-2-2-urdf-modeling.md",
        3: "chapter-2/lesson-2-3-control-theory.md",
        4: "chapter-2/lesson-2-4-deployment.md",
    },
    "chapter-3": {
        1: "chapter-3/lesson-3-1-gazebo.md",
        2: "chapter-3/lesson-3-2-unity.md",
        3: "chapter-3/lesson-3-3-isaac-sim.md",
        4: "chapter-3/lesson-3-4-sensors.md",
    },
}


async def seed_lessons():
    """Seed lessons from markdown files."""
    print("🌱 Starting lesson seeding...")

    # Initialize database
    try:
        await init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database init: {e}")

    async with async_session_maker() as db:
        # Iterate through lessons
        total_created = 0
        total_skipped = 0

        for chapter_id, lessons in LESSON_FILE_MAPPING.items():
            for lesson_num, file_path in lessons.items():
                lesson_id = f"{chapter_id}-lesson-{lesson_num}"

                # Check if lesson already exists
                stmt = select(Lesson).where(Lesson.id == lesson_id)
                result = await db.execute(stmt)
                existing = result.scalars().first()

                if existing:
                    print(f"⏭️  Skipping {lesson_id} (already exists)")
                    total_skipped += 1
                    continue

                # Parse markdown file
                full_path = os.path.join(settings.LESSONS_DIR, file_path)

                try:
                    parsed = parse_lesson_markdown(full_path)
                except FileNotFoundError:
                    print(f"❌ File not found: {full_path}")
                    continue
                except Exception as e:
                    print(f"❌ Error parsing {lesson_id}: {e}")
                    continue

                # Estimate reading time
                estimated_duration = estimate_reading_time(parsed["content_text"])

                # Create lesson object
                lesson = Lesson(
                    id=lesson_id,
                    chapter_id=chapter_id,
                    lesson_number=lesson_num,
                    title=parsed["title"],
                    description=parsed["description"],
                    content_path=full_path,
                    content_markdown=parsed["content_markdown"],
                    content_text=parsed["content_text"],
                    keywords=parsed["keywords"],
                    prerequisites=parsed["prerequisites"],
                    difficulty="Beginner" if int(chapter_id.split("-")[-1]) <= 1 else "Intermediate" if int(chapter_id.split("-")[-1]) <= 2 else "Advanced",
                    estimated_duration=estimated_duration,
                    has_quiz=False,
                    has_exercises=True,
                )

                db.add(lesson)
                total_created += 1

                print(f"✅ Created {lesson_id}: {lesson.title} ({estimated_duration} min)")

        # Commit all changes
        try:
            await db.commit()
            print(f"\n📊 Seeding complete!")
            print(f"   Created: {total_created}")
            print(f"   Skipped: {total_skipped}")
        except Exception as e:
            await db.rollback()
            print(f"❌ Error committing lessons: {e}")
            raise


async def seed_quizzes():
    """Seed quizzes from markdown files."""
    print("\n🎯 Seeding quizzes...")

    quiz_files = {
        "chapter-1": "chapter-1/quiz.md",
        "chapter-3": "chapter-3/chapter-3-quiz.md",
    }

    from app.models import Quiz

    async with async_session_maker() as db:
        for chapter_id, quiz_file in quiz_files.items():
            full_path = os.path.join(settings.LESSONS_DIR, quiz_file)

            if not os.path.exists(full_path):
                print(f"⏭️  Quiz file not found: {full_path}")
                continue

            try:
                # Parse quiz file
                parsed = parse_lesson_markdown(full_path)

                # Extract questions
                questions = extract_quiz_questions(parsed["content_markdown"])

                if not questions:
                    print(f"⏭️  No questions found in {quiz_file}")
                    continue

                # Check if quiz exists
                stmt = select(Quiz).where(Quiz.chapter_id == chapter_id)
                result = await db.execute(stmt)
                existing = result.scalars().first()

                if existing:
                    print(f"⏭️  Quiz for {chapter_id} already exists")
                    continue

                # Create quiz
                quiz = Quiz(
                    chapter_id=chapter_id,
                    title=parsed["title"],
                    questions=questions,
                    passing_score=70.0,
                )

                db.add(quiz)
                print(f"✅ Created quiz for {chapter_id}: {len(questions)} questions")

            except Exception as e:
                print(f"❌ Error seeding quiz for {chapter_id}: {e}")

        try:
            await db.commit()
            print("✅ Quizzes seeded successfully")
        except Exception as e:
            await db.rollback()
            print(f"❌ Error committing quizzes: {e}")


async def main():
    """Main seeding function."""
    try:
        await seed_lessons()
        await seed_quizzes()
        print("\n🎉 Seeding complete!")
    except Exception as e:
        print(f"\n❌ Seeding failed: {e}")
        raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    # Run seeding
    asyncio.run(main())
