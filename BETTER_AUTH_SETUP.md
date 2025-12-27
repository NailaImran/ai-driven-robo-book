# Better Auth + Personalization Integration

This document describes the Better Auth integration with the personalization system.

## Overview

The system uses Better Auth for authentication on the frontend, integrated with a FastAPI backend for personalization preferences.

## Architecture

### Frontend Components

1. **Auth Client** (`src/lib/auth-client.ts`)
   - Configures Better Auth to work with FastAPI endpoints
   - Provides `signIn`, `signUp`, `signOut`, and `useSession` functions

2. **PersonalizationContext** (`src/context/PersonalizationContext.tsx`)
   - Integrates Better Auth with personalization state
   - Syncs preferences to backend when user is authenticated
   - Stores preferences in localStorage for anonymous users

3. **AuthModal** (`src/components/AuthModal.tsx`)
   - Sign in/sign up modal component
   - Handles email/password authentication
   - Integrates with personalization context

4. **AuthWidget** (`src/components/AuthWidget.tsx`)
   - Navbar widget showing authentication status
   - User menu with profile and sign out options
   - Shows "Sign In" button for unauthenticated users

5. **PersonalizationButton** (`src/components/PersonalizationButton.tsx`)
   - Allows users to set their learning preferences
   - Persona (student, educator, self-learner, industry professional)
   - Skill level (beginner, intermediate, advanced)
   - Learning pace (accelerated, standard, extended)

6. **Navbar Integration** (`src/theme/Navbar/Content/index.tsx`)
   - Custom Docusaurus theme component
   - Adds AuthWidget and PersonalizationButton to navbar

### Backend Integration

The Better Auth frontend client talks to these FastAPI endpoints:

- `POST /api/auth/signup` - Create new user account with preferences
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out current user
- `GET /api/auth/session` - Get current session
- `GET /api/personalization/profile` - Get user preferences
- `PUT /api/personalization/profile` - Update user preferences
- `POST /api/personalization/sync-from-localStorage` - Sync anonymous preferences on login

## Features

### Anonymous Users
- Can set personalization preferences
- Preferences stored in browser localStorage
- See personalized content without account

### Authenticated Users
- All anonymous user features
- Preferences synced across devices
- Preferences persist after logout
- Can export/import preferences (TODO)

### Preference Types

1. **Persona**
   - Student: Academic learner in formal education
   - Educator: Teaching robotics or AI
   - Self Learner: Independent study
   - Industry Professional: Working in robotics/AI field

2. **Skill Level**
   - Beginner: New to robotics and programming
   - Intermediate: Some experience with robotics or programming
   - Advanced: Experienced in robotics, AI, or both

3. **Learning Pace**
   - Accelerated: 8 weeks (fast track)
   - Standard: 13 weeks (recommended)
   - Extended: 20 weeks (in-depth exploration)

## Usage

### For Users

1. **Without Account**
   - Click "Personalize" in navbar
   - Select your preferences
   - Start learning with personalized content

2. **Create Account**
   - Click "Sign In" in navbar
   - Click "Sign up" tab
   - Enter email, password, and optional name
   - Preferences automatically synced

3. **Sign In**
   - Click "Sign In" in navbar
   - Enter credentials
   - Preferences loaded from server

### For Developers

#### Using PersonalizationContext

```typescript
import { usePersonalization } from '../hooks/usePersonalization';

function MyComponent() {
  const {
    persona,
    skillLevel,
    learningPace,
    isAuthenticated,
    updatePersona,
    signIn,
    signUp,
    signOut,
  } = usePersonalization();

  // Use persona to customize content
  if (persona === 'beginner') {
    return <BeginnerContent />;
  }

  return <AdvancedContent />;
}
```

#### Adding Personalized Content

Use the personalization hooks to adapt content:

```typescript
function ContentSection() {
  const { skillLevel } = usePersonalization();

  return (
    <div>
      <h2>Introduction to ROS 2</h2>
      {skillLevel === 'beginner' && (
        <BeginnerExplanation />
      )}
      {skillLevel === 'advanced' && (
        <AdvancedDetails />
      )}
    </div>
  );
}
```

## Next Steps

- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add social authentication (Google, GitHub)
- [ ] Add user profile page
- [ ] Add preference export/import
- [ ] Add learning progress tracking
- [ ] Add recommendation engine based on preferences

## Testing

To test the authentication flow:

1. Start the dev server: `npm start`
2. Start the backend: `cd ../backend && uvicorn app.main:app --reload`
3. Open http://localhost:3000/learn-humanoid-robotics/
4. Click "Personalize" to set preferences
5. Click "Sign In" to create an account or sign in
6. Verify preferences are synced after authentication

## Environment Variables

Add these to your `.env` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```
