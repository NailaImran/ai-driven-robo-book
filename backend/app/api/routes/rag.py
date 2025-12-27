"""RAG chatbot API endpoints."""

from fastapi import APIRouter, HTTPException, status
from app.schemas.rag import (
    RAGQueryRequest,
    RAGQueryResponse,
    RAGSelectionRequest,
    Source,
)
from app.services.rag import rag_service
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/rag", tags=["RAG Chatbot"])


@router.post("/query", response_model=RAGQueryResponse)
async def query_chatbot(request: RAGQueryRequest):
    """
    Query the RAG chatbot with a question.

    The chatbot uses retrieval-augmented generation to answer questions
    based on the course textbook content.

    Args:
        request: RAG query request with question and optional parameters

    Returns:
        RAGQueryResponse with answer, sources, and metadata

    Raises:
        HTTPException: If query fails
    """
    try:
        logger.info(
            f"RAG query received",
            extra={
                "query_length": len(request.query),
                "conversation_id": request.conversation_id,
            }
        )

        result = await rag_service.query(
            question=request.query,
            conversation_id=request.conversation_id,
            max_sources=request.max_sources,
            temperature=request.temperature,
        )

        return RAGQueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            conversation_id=result["conversation_id"],
            tokens_used=result.get("tokens_used"),
        )

    except Exception as e:
        logger.error(f"RAG query failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}"
        )


@router.post("/query-selection", response_model=RAGQueryResponse)
async def query_selected_text(request: RAGSelectionRequest):
    """
    Ask a question about selected text from a page.

    This endpoint is used when users highlight text on a page and ask
    a question about it. The chatbot provides context-aware answers.

    Args:
        request: RAG selection request with selected text and question

    Returns:
        RAGQueryResponse with answer and sources

    Raises:
        HTTPException: If query fails
    """
    try:
        logger.info(
            f"Selection query received",
            extra={
                "selection_length": len(request.selected_text),
                "question_length": len(request.question),
                "page_url": request.page_url,
            }
        )

        result = await rag_service.query_selection(
            selected_text=request.selected_text,
            question=request.question,
            page_url=request.page_url,
        )

        return RAGQueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            conversation_id=result["conversation_id"],
            tokens_used=result.get("tokens_used"),
        )

    except Exception as e:
        logger.error(f"Selection query failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process selection query: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Check RAG service health.

    Returns:
        dict: Health status of RAG components
    """
    try:
        # Check if OpenAI API is accessible
        # (We don't actually call the API to avoid costs)
        has_api_key = bool(rag_service.client.api_key)

        return {
            "status": "healthy" if has_api_key else "degraded",
            "components": {
                "openai_api": "configured" if has_api_key else "missing_key",
                "vector_store_id": rag_service.vector_store_id,
                "model": rag_service.model,
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }
