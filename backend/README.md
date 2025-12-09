# QuantumPages Backend

FastAPI backend for personalized physics AI learning platform with Neon PostgreSQL and Qdrant vector database.

## Features

- **User Authentication**: JWT-based signup/signin with background questionnaire
- **Progress Tracking**: Track lesson completion, quiz scores, time spent
- **Personalization**: Expertise-based content filtering (Beginner/Intermediate/Advanced)
- **Quiz Management**: Parse, store, and grade quizzes from markdown
- **AI Recommendations**: Suggest next lessons based on weak areas
- **Language Preference**: Store user's language choice (English/Urdu)
- **Analytics**: Progress summary, weak area identification

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── dependencies.py      # JWT auth dependency
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic request/response models
│   ├── routers/             # API endpoint routers
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── scripts/
│   └── seed_lessons.py      # Populate lessons from markdown
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container configuration
├── railway.json             # Railway deployment config
└── .env.example             # Environment variables template
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `QDRANT_URL` & `QDRANT_API_KEY`: Vector database (if using)
- `OPENAI_API_KEY`: For embeddings
- `JWT_SECRET_KEY`: Min 32 characters

### 3. Initialize Database

```bash
python scripts/seed_lessons.py
```

This will:
- Create database tables
- Parse markdown lessons from `physical-ai-textbook/docs/`
- Populate lessons table
- Extract and store quiz questions

### 4. Run Development Server

```bash
uvicorn app.main:app --reload
```

Server will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register with background info
- `POST /api/v1/auth/signin` - Login
- `GET /api/v1/auth/session` - Validate session

### Users
- `GET /api/v1/users/me` - Current user profile
- `GET /api/v1/users/me/preferences` - User preferences
- `PATCH /api/v1/users/me/preferences` - Update preferences
- `GET /api/v1/users/me/background` - User background

### Lessons
- `GET /api/v1/lessons` - List all lessons
- `GET /api/v1/lessons/{lesson_id}` - Get lesson with content
- `POST /api/v1/lessons/{lesson_id}/complete` - Mark complete
- `POST /api/v1/lessons/{lesson_id}/update-progress` - Update progress

### Quizzes
- `GET /api/v1/quizzes/{chapter_id}` - Get quiz questions
- `POST /api/v1/quizzes/{quiz_id}/submit` - Submit answers
- `GET /api/v1/quizzes/scores` - Quiz history

### Progress
- `GET /api/v1/progress/summary` - Overall progress
- `GET /api/v1/progress/weak-areas` - Identify weak areas
- `GET /api/v1/progress/lessons/{lesson_id}` - Lesson-specific progress

### Recommendations
- `GET /api/v1/recommendations/next-lesson` - Get next lesson
- `GET /api/v1/recommendations/by-keywords/{keywords}` - Find by keywords
- `GET /api/v1/recommendations/difficulty/{difficulty}` - Get by difficulty

## Database Schema

### users
- id (UUID, PK)
- email (unique)
- password_hash
- name
- is_active, email_verified
- created_at, updated_at

### user_backgrounds
- user_id (FK)
- python_experience, cpp_experience, ros_experience
- learning_goals, current_role, learning_pace
- expertise_level (computed)

### user_preferences
- user_id (FK)
- language (en/ur)
- display preferences (dark_mode, show_detailed_explanations, etc.)

### lessons
- id (lesson-chapter-number)
- chapter_id, lesson_number
- title, description
- content_markdown, content_text
- keywords, prerequisites
- difficulty, estimated_duration
- has_quiz, has_exercises

### quizzes
- id (UUID)
- chapter_id
- title
- questions (JSON)
- passing_score

### quiz_attempts
- user_id, quiz_id (FK)
- score, passed
- answers (JSON)

### user_progress
- user_id, lesson_id (FK)
- status (not_started, in_progress, completed)
- completion_percentage, time_spent_seconds
- quiz_score, quiz_attempts
- started_at, completed_at, last_accessed_at

## Deployment to Railway

### Prerequisites
1. Neon PostgreSQL database
2. Qdrant Cloud instance (optional, for recommendations)
3. OpenAI API key (optional, for embeddings)
4. Railway account

### Steps

1. **Create Railway project**
   ```bash
   railway init
   railway link
   ```

2. **Set environment variables**
   ```bash
   railway variables set DATABASE_URL="postgresql+asyncpg://..."
   railway variables set QDRANT_URL="https://..."
   railway variables set QDRANT_API_KEY="..."
   railway variables set OPENAI_API_KEY="sk-..."
   railway variables set JWT_SECRET_KEY="..."
   railway variables set CORS_ORIGINS='["https://quantum-pages.vercel.app"]'
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Run initialization**
   ```bash
   railway run python scripts/seed_lessons.py
   ```

5. **Check deployment**
   - Railway dashboard shows deployment status
   - Health check: `GET /health`
   - API docs: `/docs`

## Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "name": "John Doe",
    "background": {
      "python_experience": 2,
      "learning_goals": ["Learn ROS2"]
    }
  }'
```

### Get Lesson
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/v1/lessons/chapter-1-lesson-1
```

## Documentation

- **API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **ReDoc**: `http://localhost:8000/redoc`
- **Config**: `app/config.py`
- **Models**: `app/models/`
- **Schemas**: `app/schemas/`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL async URL | `postgresql+asyncpg://...@neon.tech/dbname` |
| `QDRANT_URL` | Vector DB URL | `https://xxx.qdrant.io:6333` |
| `QDRANT_API_KEY` | Vector DB API key | `xxx` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-xxx` |
| `JWT_SECRET_KEY` | JWT signing key | Min 32 chars |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_HOURS` | Token expiry | `168` (7 days) |
| `CORS_ORIGINS` | CORS allowed origins | `["http://localhost:3000"]` |
| `DEBUG` | Debug mode | `False` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Architecture

### Authentication Flow
1. User signs up with email, password, background info
2. Expertise level computed from background
3. Password hashed with bcrypt
4. User, background, preferences stored in database
5. JWT token generated (7-day expiry)
6. Token stored in client localStorage
7. Bearer token sent in Authorization header for protected routes

### Lesson Management
1. Markdown files parsed from physical-ai-textbook/docs/
2. Metadata (title, keywords, difficulty) extracted from frontmatter
3. Content stored in database as markdown + plain text
4. User progress tracked per lesson
5. Quiz questions extracted from content

### Personalization
1. User expertise level determined from background questionnaire
2. Lessons filtered by user's expertise level
3. Quiz scores tracked, weak areas identified
4. Recommendations based on weak areas + next lesson sequence

## Performance Considerations

- Async database operations with asyncpg
- Connection pooling (20 pool size, 10 overflow)
- Indexed queries on frequently accessed fields
- JWT tokens avoid database lookups for auth
- Markdown parsing on seeding, not on request

## Security

- Passwords hashed with bcrypt
- JWT tokens with HS256 algorithm
- CORS configured for specific origins
- HTTPBearer dependency for token validation
- SQL injection prevented with SQLAlchemy parameterization
- Environment variables for secrets (no hardcoding)

## Next Steps

1. **Vector Database Integration**: Implement Qdrant for semantic search
2. **Embeddings Generation**: Create embeddings for lessons
3. **Advanced Recommendations**: Use vector similarity for suggestions
4. **Frontend Integration**: Connect Next.js frontend to API
5. **Monitoring**: Setup Sentry for error tracking
6. **Testing**: Add pytest for unit/integration tests

## Support

For issues or questions:
1. Check API docs at `/docs`
2. Review environment variables
3. Check database connection
4. Look at logs in Railway dashboard
