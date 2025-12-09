"""Generate and upload lesson embeddings to Qdrant."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import async_session_maker, engine
from app.models import Lesson
from app.services.vector_service import get_vector_service
from sqlalchemy import select
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def generate_embeddings():
    """Generate embeddings for all lessons in database."""
    logger.info("🚀 Starting embedding generation...")

    vector_service = get_vector_service()

    # Ensure collection exists
    if not vector_service.ensure_collection_exists():
        logger.error("❌ Failed to create Qdrant collection")
        return False

    async with async_session_maker() as db:
        # Get all lessons
        stmt = select(Lesson).order_by(Lesson.chapter_id, Lesson.lesson_number)
        result = await db.execute(stmt)
        lessons = result.scalars().all()

        logger.info(f"📚 Found {len(lessons)} lessons to embed")

        total_success = 0
        total_failed = 0

        for lesson in lessons:
            try:
                # Prepare lesson data for embedding
                lesson_data = {
                    "title": lesson.title,
                    "description": lesson.description,
                    "keywords": lesson.keywords or [],
                    "content_text": lesson.content_text or "",
                    "chapter_id": lesson.chapter_id,
                    "difficulty": lesson.difficulty,
                    "prerequisites": lesson.prerequisites or [],
                }

                # Upsert to Qdrant
                success = vector_service.upsert_lesson(lesson.id, lesson_data)

                if success:
                    logger.info(f"✅ Embedded {lesson.id}: {lesson.title}")
                    total_success += 1
                else:
                    logger.warning(f"⚠️  Failed to embed {lesson.id}")
                    total_failed += 1

            except Exception as e:
                logger.error(f"❌ Error embedding {lesson.id}: {e}")
                total_failed += 1

        logger.info(f"\n📊 Embedding Summary:")
        logger.info(f"   Success: {total_success}")
        logger.info(f"   Failed: {total_failed}")
        logger.info(f"   Total: {len(lessons)}")

        # Get collection info
        info = vector_service.get_collection_info()
        if info:
            logger.info(f"\n📈 Qdrant Collection Stats:")
            logger.info(f"   Points: {info.get('points_count', 0)}")
            logger.info(f"   Status: {info.get('status', 'unknown')}")

        return total_failed == 0


async def main():
    """Main function."""
    try:
        success = await generate_embeddings()
        if success:
            logger.info("\n🎉 Embedding generation complete!")
            return 0
        else:
            logger.error("\n❌ Embedding generation completed with errors")
            return 1
    except Exception as e:
        logger.error(f"\n💥 Fatal error: {e}")
        return 1
    finally:
        await engine.dispose()


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
