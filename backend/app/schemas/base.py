"""Base Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class TimestampSchema(BaseModel):
    """Base schema with timestamp fields."""
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResponseBase(BaseModel):
    """Base response schema with standard fields."""
    success: bool = True
    message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    success: bool = False
    error: str
    detail: Optional[str] = None
    correlation_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaginationParams(BaseModel):
    """Standard pagination parameters."""
    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(default=20, ge=1, le=100, description="Maximum number of records to return")


class PaginatedResponse(BaseModel):
    """Base paginated response schema."""
    total: int = Field(description="Total number of records")
    skip: int = Field(description="Number of records skipped")
    limit: int = Field(description="Maximum number of records returned")
    items: list = Field(default_factory=list, description="List of items")

    model_config = ConfigDict(from_attributes=True)


class HealthCheckResponse(BaseModel):
    """Health check response schema."""
    status: str = Field(description="Service status: healthy, degraded, unhealthy")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = Field(description="API version")
    services: dict = Field(default_factory=dict, description="Status of dependent services")

    model_config = ConfigDict(from_attributes=True)


# Example usage for inherited schemas
class UserBase(BaseModel):
    """Base user schema for shared fields."""
    email: EmailStr
    full_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(min_length=8, description="Password must be at least 8 characters")


class UserResponse(UserBase, TimestampSchema):
    """Schema for user responses (without sensitive data)."""
    id: UUID

    model_config = ConfigDict(from_attributes=True)
