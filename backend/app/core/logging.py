"""Structured logging with correlation IDs for request tracing."""

import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Any, Dict

import structlog
from pythonjsonlogger import jsonlogger

from app.core.config import settings

# Context variable to store correlation ID across async context
correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="")


def get_correlation_id() -> str:
    """Get current correlation ID from context."""
    return correlation_id_var.get()


def set_correlation_id(correlation_id: str) -> None:
    """Set correlation ID in context."""
    correlation_id_var.set(correlation_id)


def generate_correlation_id() -> str:
    """Generate a new correlation ID."""
    return str(uuid.uuid4())


def add_correlation_id(logger: Any, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Add correlation ID to log event."""
    correlation_id = get_correlation_id()
    if correlation_id:
        event_dict["correlation_id"] = correlation_id
    return event_dict


def add_log_level(logger: Any, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Add log level to event dict."""
    event_dict["level"] = method_name.upper()
    return event_dict


def setup_logging() -> None:
    """
    Configure structured logging for the application.

    Uses structlog for structured logging with JSON output.
    Adds correlation IDs for distributed tracing.
    """
    # Configure standard logging
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    # JSON formatter for structured logs
    json_formatter = jsonlogger.JsonFormatter(
        fmt="%(asctime)s %(name)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add JSON handler for stdout
    json_handler = logging.StreamHandler(sys.stdout)
    json_handler.setFormatter(json_formatter)
    root_logger.addHandler(json_handler)

    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.contextvars.merge_contextvars,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.stdlib.add_logger_name,
            add_log_level,
            add_correlation_id,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Reduce noise from external libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)


def get_logger(name: str) -> Any:
    """
    Get a structured logger instance.

    Usage:
        logger = get_logger(__name__)
        logger.info("user_authenticated", user_id=user.id, email=user.email)
    """
    return structlog.get_logger(name)


# Example usage functions for common log patterns
def log_api_request(endpoint: str, method: str, **kwargs: Any) -> None:
    """Log an API request."""
    logger = get_logger("api")
    logger.info(
        "api_request",
        endpoint=endpoint,
        method=method,
        **kwargs,
    )


def log_api_response(endpoint: str, status_code: int, duration_ms: float, **kwargs: Any) -> None:
    """Log an API response."""
    logger = get_logger("api")
    logger.info(
        "api_response",
        endpoint=endpoint,
        status_code=status_code,
        duration_ms=duration_ms,
        **kwargs,
    )


def log_rag_query(query: str, language: str, chunks_retrieved: int, response_time_ms: int, **kwargs: Any) -> None:
    """Log a RAG query."""
    logger = get_logger("rag")
    logger.info(
        "rag_query",
        query=query,
        language=language,
        chunks_retrieved=chunks_retrieved,
        response_time_ms=response_time_ms,
        **kwargs,
    )


def log_error(message: str, error: Exception, **kwargs: Any) -> None:
    """Log an error with exception details."""
    logger = get_logger("error")
    logger.error(
        message,
        error_type=type(error).__name__,
        error_message=str(error),
        **kwargs,
    )
