"""API dependencies and error handling middleware."""

from typing import Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import get_logger, get_correlation_id, set_correlation_id, generate_correlation_id

logger = get_logger(__name__)


async def correlation_id_middleware(request: Request, call_next):
    """
    Middleware to generate and attach correlation ID to each request.

    Correlation ID is used for distributed tracing across logs.
    """
    # Check if correlation ID exists in headers, otherwise generate new one
    correlation_id = request.headers.get("X-Correlation-ID")
    if not correlation_id:
        correlation_id = generate_correlation_id()

    # Set correlation ID in context for logging
    set_correlation_id(correlation_id)

    # Process request
    response = await call_next(request)

    # Add correlation ID to response headers
    response.headers["X-Correlation-ID"] = correlation_id

    return response


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Handle HTTP exceptions with structured error responses.

    Returns consistent error format across all endpoints.
    """
    correlation_id = get_correlation_id()

    logger.warning(
        "http_exception",
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "correlation_id": correlation_id,
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle Pydantic validation errors with detailed error messages.

    Returns field-level validation errors for better client-side handling.
    """
    correlation_id = get_correlation_id()

    # Format validation errors
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        errors.append({
            "field": field,
            "message": message,
            "type": error["type"],
        })

    logger.warning(
        "validation_error",
        path=request.url.path,
        errors=errors,
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation error",
            "detail": errors,
            "correlation_id": correlation_id,
        },
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unhandled exceptions.

    Logs the full exception and returns a generic error to the client.
    """
    correlation_id = get_correlation_id()

    logger.error(
        "unhandled_exception",
        error_type=type(exc).__name__,
        error_message=str(exc),
        path=request.url.path,
        exc_info=True,
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": "An unexpected error occurred. Please try again later.",
            "correlation_id": correlation_id,
        },
    )


# Rate limiting dependency (basic implementation)
class RateLimiter:
    """
    Simple in-memory rate limiter.

    For production, use Redis-based rate limiting (e.g., slowapi, fastapi-limiter).
    """

    def __init__(self, requests_per_minute: int = 100):
        self.requests_per_minute = requests_per_minute
        self.requests: dict = {}  # {ip: [(timestamp, count)]}

    async def check_rate_limit(self, request: Request) -> Optional[str]:
        """
        Check if request exceeds rate limit.

        Args:
            request: FastAPI request object

        Returns:
            Optional[str]: Error message if rate limited, None otherwise
        """
        # Get client IP
        client_ip = request.client.host

        # For development/testing, skip rate limiting for localhost
        if client_ip in ["127.0.0.1", "localhost"]:
            return None

        # TODO: Implement actual rate limiting logic with Redis
        # This is a placeholder for the implementation
        return None


# Global rate limiter instance
rate_limiter = RateLimiter()
