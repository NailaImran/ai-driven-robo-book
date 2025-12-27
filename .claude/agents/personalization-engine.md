# PersonalizationEngineAgent

**Purpose**: Implement adaptive content personalization based on user persona, skill level, and learning pace.

## Input Schema

```json
{
  "user_profile": {
    "persona": "enum: student | educator | self-learner | professional",
    "skill_level": "enum: beginner | intermediate | advanced",
    "learning_pace": "enum: accelerated | standard | extended"
  },
  "content_section": "string (module or page ID)"
}
```

## Output Schema

```json
{
  "backend_models": ["User", "UserPreference"],
  "api_endpoints": ["/api/auth/signup", "/api/personalization/profile"],
  "frontend_components": ["PersonalizationContext", "PersonalizationButton", "AuthWidget"],
  "content_variants": {
    "beginner": "detailed_explanations",
    "intermediate": "balanced_content",
    "advanced": "condensed_technical"
  }
}
```

## Skills Required

- `generate-content-variants`: Create beginner/intermediate/advanced versions of content
- `better-auth-integration`: Configure Better-Auth for user management
- `context-management`: React Context for state management

## Instructions

### **Backend Implementation**

1. **User Model** (`backend/app/models/user.py`):
   - Email, password hash, full name
   - Persona, skill level, learning pace
   - Created/updated timestamps

2. **UserPreference Model** (`backend/app/models/personalization.py`):
   - One-to-one relationship with User
   - Language preference (en/ur)
   - Custom settings (JSON field)

3. **Authentication Endpoints**:
   - POST `/api/auth/signup` - Create account with persona selection
   - POST `/api/auth/signin` - Login and return JWT
   - POST `/api/auth/signout` - Invalidate session
   - GET `/api/auth/session` - Get current user

4. **Personalization Endpoints**:
   - GET `/api/personalization/profile` - Fetch user preferences
   - PUT `/api/personalization/profile` - Update preferences

### **Frontend Implementation**

1. **PersonalizationContext** (`website/src/context/PersonalizationContext.tsx`):
   - Global state: persona, skillLevel, learningPace, language
   - Actions: updatePersona, updateSkillLevel, updatePace, updateLanguage
   - Persistence: sync with localStorage (anonymous) or backend (authenticated)

2. **usePersonalization Hook** (`website/src/hooks/usePersonalization.ts`):
   - Access PersonalizationContext
   - Helper functions: `isAuthenticated()`, `syncToBackend()`, `loadFromBackend()`

3. **PersonalizationButton Component** (`website/src/components/PersonalizationButton.tsx`):
   - Modal with persona/skill/pace selectors
   - Preview of content changes
   - Save to localStorage or backend

4. **AuthWidget Component** (`website/src/components/AuthWidget.tsx`):
   - Signup form (email, password, persona, skill level)
   - Signin form
   - User profile dropdown
   - Signout button

5. **Conditional Content Rendering**:
   - MDX components: `<ForBeginner>`, `<ForIntermediate>`, `<ForAdvanced>`
   - Automatically show/hide based on user's skill level

### **Content Variants Strategy**

**Beginner**:
- Step-by-step explanations
- More diagrams and visualizations
- Simpler code examples with extensive comments
- "What does this mean?" callouts

**Intermediate**:
- Balanced explanations
- Code examples with moderate comments
- Links to deeper resources
- Assumes some prior knowledge

**Advanced**:
- Condensed technical content
- Advanced code patterns (decorators, async/await)
- Research paper references
- Performance optimization tips

## Example Usage

**Backend**:
```python
# GET /api/personalization/profile
{
  "persona": "student",
  "skill_level": "beginner",
  "learning_pace": "standard",
  "language": "en"
}
```

**Frontend**:
```tsx
import { usePersonalization } from '@site/src/hooks/usePersonalization';

function MyComponent() {
  const { persona, skillLevel, updateSkillLevel } = usePersonalization();

  return (
    <div>
      {skillLevel === 'beginner' && <p>Detailed explanation...</p>}
      {skillLevel === 'advanced' && <p>Condensed version...</p>}
    </div>
  );
}
```

**Conditional MDX**:
```mdx
<ForBeginner>
This is a detailed explanation for beginners...
</ForBeginner>

<ForAdvanced>
Advanced users: use `asyncio.gather()` for parallel execution.
</ForAdvanced>
```
