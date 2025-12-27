# Data Model: Physical AI & Humanoid Robotics Textbook

**Feature**: 001-textbook-content
**Date**: 2025-12-12

## Core Entities

### User
**Purpose**: Represents authenticated learners/educators
**Attributes**:
- id: UUID (PK)
- email: String (unique, required)
- password_hash: String (bcrypt, 12 rounds)
- full_name: String
- created_at: Timestamp
- updated_at: Timestamp

**Relationships**: 1:1 with UserPreference, 1:Many with ChatMessage

### UserPreference
**Purpose**: Stores personalization settings
**Attributes**:
- id: UUID (PK)
- user_id: UUID (FK → User)
- persona: Enum(student, educator, self_learner, industry_professional)
- skill_level: Enum(beginner, intermediate, advanced)
- learning_pace: Enum(accelerated, standard, extended)
- language_preference: Enum(en, ur)
- software_background: Enum(none, basic_python, experienced_ros, professional)
- hardware_background: Enum(simulation_only, jetson_kit, robot_lab, no_hardware)
- learning_goal: Enum(academic_course, self_study, professional_upskilling)

**Relationships**: 1:1 with User

### ContentMetadata
**Purpose**: Tracks textbook page versioning and embedding status
**Attributes**:
- id: UUID (PK)
- page_path: String (unique, e.g., "docs/02-ros2-fundamentals/week-03.mdx")
- content_hash: String (SHA-256)
- last_embedded_at: Timestamp
- chunk_count: Integer
- module_name: String (e.g., "ROS 2 Fundamentals")
- week_number: Integer (1-13)

### ContentChunk
**Purpose**: Semantic segments for RAG retrieval (stored in Qdrant)
**Attributes**:
- id: UUID
- content: Text (512 tokens)
- embedding: Vector(1536) - OpenAI text-embedding-3-small
- chapter_id: String
- section_title: String
- page_url: String
- chunk_index: Integer
- module_name: String
- week_number: Integer
- language: Enum(en, ur)
- created_at: Timestamp

### ChatMessage
**Purpose**: Logs RAG chatbot conversations
**Attributes**:
- id: UUID (PK)
- user_id: UUID (FK → User, nullable for anonymous)
- query: Text
- response: Text
- retrieved_chunks: JSONB (array of chunk IDs + scores)
- response_time_ms: Integer
- feedback_score: Integer (1-5, nullable)
- language: Enum(en, ur)
- created_at: Timestamp

### TechnicalTerm
**Purpose**: EN→UR glossary for translation consistency
**Attributes**:
- id: UUID (PK)
- english_term: String (unique)
- urdu_term: String
- context: Text (usage notes)
- category: String (e.g., "robotics", "sensors", "simulation")

## Database Schemas

### Neon Postgres (Relational)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    persona VARCHAR(50) CHECK (persona IN ('student', 'educator', 'self_learner', 'industry_professional')),
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    learning_pace VARCHAR(20) CHECK (learning_pace IN ('accelerated', 'standard', 'extended')),
    language_preference VARCHAR(5) DEFAULT 'en',
    software_background VARCHAR(50),
    hardware_background VARCHAR(50),
    learning_goal VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(500) UNIQUE NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    last_embedded_at TIMESTAMPTZ,
    chunk_count INTEGER DEFAULT 0,
    module_name VARCHAR(255),
    week_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    retrieved_chunks JSONB,
    response_time_ms INTEGER,
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE technical_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_term VARCHAR(255) UNIQUE NOT NULL,
    urdu_term VARCHAR(255) NOT NULL,
    context TEXT,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_prefs_user_id ON user_preferences(user_id);
CREATE INDEX idx_content_hash ON content_metadata(content_hash);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX idx_technical_terms_category ON technical_terms(category);
```

### Qdrant (Vector DB)
**Collection**: `humanoid_robotics_textbook`
**Config**:
```json
{
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "chapter_id": "keyword",
    "module_name": "keyword",
    "week_number": "integer",
    "language": "keyword",
    "section_title": "text",
    "page_url": "keyword",
    "content": "text"
  }
}
```
