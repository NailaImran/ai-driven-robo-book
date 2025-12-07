# Authentication, Personalization & Translation Implementation Plan

**Project**: Physical AI & Humanoid Robotics Textbook
**Objective**: Add login/signup with better-auth, content personalization, and Urdu translation
**Bonus Points**: Up to 150 points (50 each for auth, personalization, translation)

---

## Phase 1: Authentication System (50 points)

### Features
- Sign up with email/password using better-auth.com
- Background questions during signup:
  - Programming Experience (Beginner/Intermediate/Advanced)
  - Hardware Background (None/Basic/Intermediate/Advanced)
- Login/logout functionality
- User profile persistence
- Redirect non-authenticated users to login

### Implementation
1. Set up better-auth backend
2. Create signup form with background questions
3. Create login form
4. Add authentication context (React)
5. Protect chapter content behind auth
6. Store user profile (background level)

---

## Phase 2: Content Personalization (50 points)

### Features
- Personalize content based on background level
- **For Beginners**:
  - Show detailed explanations
  - Include more setup instructions
  - Simplify code examples
  - Add prerequisite warnings
- **For Advanced Users**:
  - Show concise explanations
  - Highlight theory and research papers
  - Provide advanced variations
  - Skip basic setup steps

### Implementation
1. Create personalization context
2. Add conditionals in lesson files
3. Mark sections with difficulty levels
4. Add personalization toggle button in chapter header
5. Cache user preferences

---

## Phase 3: Urdu Translation (50 points)

### Features
- Full chapter translation to Urdu
- Toggle button at chapter start
- Translations for:
  - Chapter title and overview
  - All lesson headings and body text
  - Key concepts and learning objectives
  - Code comments (optional)
  - Exercise descriptions

### Implementation
1. Create Urdu translation files
2. Add translation toggle button
3. Store language preference
4. Apply translations dynamically
5. Support bilingual search

---

## User Profiles

### Beginner Level (Score 1-4)
- Programming: Beginner
- Hardware: None/Basic
- **Content Adjustments**:
  - Detailed explanations with analogies
  - More prerequisite information
  - Simplified code examples
  - Step-by-step setup guides

### Intermediate Level (Score 5-7)
- Programming: Intermediate
- Hardware: Basic/Intermediate
- **Content Adjustments**:
  - Standard explanations
  - Some advanced variations
  - Standard code examples
  - Mixed detail level

### Advanced Level (Score 8+)
- Programming: Advanced
- Hardware: Intermediate/Advanced
- **Content Adjustments**:
  - Concise explanations
  - Advanced theory and papers
  - Complex code examples
  - Research-focused content

---

## Technical Stack

- **Authentication**: better-auth.com
- **Frontend**: React + TypeScript
- **State Management**: React Context (auth + personalization)
- **Storage**: Local Storage (preferences) + Database (user profile)
- **Translation**: JSON files (English/Urdu) + i18n library

---

## File Structure

```
src/
├── auth/
│   ├── AuthContext.tsx
│   ├── useAuth.ts
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── ProtectedRoute.tsx
├── personalization/
│   ├── PersonalizationContext.tsx
│   ├── usePersonalization.ts
│   ├── PersonalizationButton.tsx
│   └── contentLevels.ts
├── translation/
│   ├── i18n.config.ts
│   ├── locales/
│   │   ├── en.json
│   │   └── ur.json
│   └── TranslationToggle.tsx
└── components/
    ├── ChapterHeader.tsx
    ├── PersonalizedContent.tsx
    └── LessonView.tsx
```

---

## Database Schema (better-auth)

### Users Table
```
id (uuid)
email (string)
password (hashed)
programmmingLevel (1-5: Beginner-Advanced)
hardwareLevel (1-5: None-Advanced)
preferredLanguage (en/ur)
createdAt (timestamp)
updatedAt (timestamp)
```

---

## Bonus Points Calculation

- **Authentication (50 points)**: Functional signup/login with better-auth
- **Personalization (50 points)**: Content adjusts based on user level
- **Translation (50 points)**: Urdu toggle works for all chapters
- **Total**: 150 points

---

## Timeline

- Phase 1 (Auth): 2-3 hours
- Phase 2 (Personalization): 2-3 hours
- Phase 3 (Translation): 2-3 hours
- Testing & Integration: 1-2 hours
- **Total**: 7-11 hours

---

## Success Criteria

✅ User can sign up with background questions
✅ User can login with email/password
✅ Content personalizes based on background
✅ Personalization button works in chapter header
✅ Urdu toggle shows translated content
✅ Translations cover all lessons
✅ All 150 bonus points earned
