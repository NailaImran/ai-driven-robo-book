# Authentication & Content Personalization System

## Overview

The Physical AI Textbook now includes a comprehensive authentication system with user profiling and content personalization. This system allows users to create accounts with detailed background information, which is then used to personalize their learning experience.

## Features

### 1. User Authentication
- **Sign Up**: Create new account with email and password
- **Sign In**: Login with existing credentials
- **Sign Out**: Logout functionality with session management
- **Session Persistence**: User sessions are maintained across browser sessions using localStorage

### 2. User Background Profiling

At signup, users are asked about:

#### Software Experience
- Python proficiency (None, Beginner, Intermediate, Advanced)
- C++ proficiency (None, Beginner, Intermediate, Advanced)
- ROS/ROS2 experience (None, Beginner, Intermediate, Advanced)
- Number of software projects completed

#### Hardware & Robotics Experience
- Robotics experience level
- Number of hardware projects completed
- Familiar hardware platforms:
  - Arduino
  - Raspberry Pi
  - Jetson Nano
  - Jetson Orin
  - ROS Robot
  - Quadcopter
  - Humanoid

#### Learning Preferences
- Current role: Student, Researcher, Hobbyist, Professional, Other
- Preferred language: Python, C++, or Both
- Learning pace: Slow & Detailed, Moderate (Balanced), Fast (Challenge me!)
- Learning goals (select multiple):
  - Bipedal Walking
  - Control Theory
  - Path Planning
  - Hardware Integration
  - Simulation
  - ROS2 Mastery
  - Computer Vision

### 3. Content Personalization

Based on user background, the system:

- **Calculates expertise level**:
  - Advanced: 2+ advanced skills
  - Intermediate: 1 advanced OR 2+ intermediate skills
  - Beginner: Default

- **Generates learning path recommendations**:
  - Suggests chapters based on learning goals
  - Recommends difficulty level
  - Determines focus areas
  - Identifies topics to skip

- **Personalizes content**:
  - Filters code examples by preferred language
  - Adjusts reading time estimates based on learning pace
  - Shows/hides content based on experience level

## Project Structure

```
src/
├── components/Auth/
│   ├── index.ts                          # Exports all auth components
│   ├── SignupForm.tsx                    # Signup with questionnaire
│   ├── SigninForm.tsx                    # Login form
│   ├── AuthGateway.tsx                   # Auth page wrapper
│   ├── UserMenu.tsx                      # User dropdown menu
│   ├── PersonalizationBanner.tsx         # Welcome banner with recommendations
│   ├── AuthForm.module.css               # Form styling
│   ├── AuthGateway.module.css            # Gateway page styling
│   └── UserMenu.module.css               # Menu styling
│
├── contexts/
│   └── AuthContext.tsx                   # Auth state management
│
├── hooks/
│   └── usePersonalization.ts             # Personalization hook
│
├── pages/auth/
│   ├── signin.tsx                        # Sign in page
│   └── signup.tsx                        # Sign up page
│
├── theme/
│   ├── Root.jsx                          # Provides AuthProvider wrapper
│   ├── Navbar/index.jsx                  # Integrated UserMenu
│   └── Navbar/styles.module.css
│
├── types/
│   └── index.ts                          # UserBackground, User, AuthState types
│
└── utils/
    └── contentPersonalization.ts         # Personalization logic
```

## API & Functions

### AuthContext

```typescript
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, background?: UserBackground) => Promise<User>;
  logout: () => void;
  updateUserProfile: (background: Partial<UserBackground>) => Promise<void>;
  updateUserPreferences: (preferences: any) => void;
}
```

### useAuth Hook

```typescript
const { user, loading, isAuthenticated, login, signup, logout, updateUserProfile } = useAuth();
```

### usePersonalization Hook

```typescript
const {
  recommendations,          // PersonalizationRecommendations
  languagePreference,       // 'python' | 'cpp' | 'both'
  shouldShow,              // (contentType: string) => boolean
  getReadingTime,          // (baseMinutes: number) => number
  isPersonalized           // boolean
} = usePersonalization();
```

### Personalization Functions

```typescript
// Get recommendations based on user background
const recommendations = generatePersonalizedRecommendations(user);

// Check language preference
const lang = getLanguagePreference(user);

// Check if content should be shown
const show = shouldShowContent('hardware-integration', user);

// Adjust reading time
const adjustedTime = getPersonalizedReadingTime(45, user);
```

## Demo Account

A demo account is automatically created for testing:

```
Email: demo@student.com
Password: demo123
```

This account has an intermediate expertise level with:
- Python (Intermediate), C++ (Beginner), ROS2 (Beginner)
- 3 software projects, 1 hardware project
- Familiar with Raspberry Pi and Arduino
- Goals: Bipedal Walking, ROS2 Mastery
- Prefers Python, moderate learning pace
```

## Component Usage

### Signin/Signup Pages

```typescript
import { AuthGateway } from '@site/src/components/Auth';

export default function AuthPage() {
  return <AuthGateway redirectTo="/" />;
}
```

### User Menu in Navbar

```typescript
import { UserMenu } from '@site/src/components/Auth';

export function CustomNavbar() {
  return <UserMenu />;
}
```

### Personalization Banner

```typescript
import { PersonalizationBanner } from '@site/src/components/Auth';

export function HomePage() {
  return (
    <div>
      <PersonalizationBanner />
      {/* rest of content */}
    </div>
  );
}
```

### Conditional Content Based on Experience

```typescript
import { usePersonalization } from '@site/src/hooks/usePersonalization';

export function AdvancedLesson() {
  const { shouldShow } = usePersonalization();

  return (
    <>
      {shouldShow('beginner') && <BeginnerGuide />}
      {shouldShow('advanced') && <AdvancedContent />}
    </>
  );
}
```

### Language-Specific Code Examples

```typescript
import { usePersonalization } from '@site/src/hooks/usePersonalization';

export function CodeExample() {
  const { languagePreference } = usePersonalization();

  return (
    <>
      {languagePreference === 'python' && <PythonCode />}
      {languagePreference === 'cpp' && <CppCode />}
      {languagePreference === 'both' && (
        <>
          <PythonCode />
          <CppCode />
        </>
      )}
    </>
  );
}
```

## Storage

User data is stored in localStorage with the following keys:

- `physical-ai-auth`: Current authenticated user session
- `physical-ai-users`: List of all registered users

**Note**: For production, this should be replaced with a backend API and secure session management.

## Security Considerations

Current implementation uses localStorage for demonstration. For production:

1. **Replace localStorage with secure backend**:
   - Use sessions with secure, httpOnly cookies
   - Implement proper password hashing (bcrypt, argon2)
   - Use SSL/TLS for all communications

2. **Implement Better Auth integration**:
   - Follow Better Auth documentation: https://www.better-auth.com/
   - Configure OAuth providers (GitHub, Google, etc.)
   - Implement 2FA and email verification

3. **Add rate limiting**:
   - Prevent brute force attacks on login/signup
   - Use CAPTCHA for signup

4. **Data protection**:
   - Encrypt sensitive user data
   - Implement GDPR/privacy compliance
   - Add audit logging

## Testing

### Manual Testing

1. **Sign Up Flow**:
   - Go to `/auth/signup`
   - Fill out account details
   - Complete background questionnaire
   - Verify account is created

2. **Sign In Flow**:
   - Go to `/auth/signin`
   - Use created account credentials
   - Verify login success

3. **Personalization**:
   - Login and view homepage
   - Check PersonalizationBanner shows correct details
   - Verify recommended chapters match learning goals

4. **User Menu**:
   - Click user avatar in navbar
   - Verify profile information displays
   - Test logout functionality

## Future Enhancements

1. **Profile Settings Page**:
   - Allow users to edit their background information
   - Update learning goals
   - Modify preferences

2. **Progress Tracking**:
   - Track completed lessons
   - Store quiz scores
   - Display learning progress dashboard

3. **Recommendations Engine**:
   - ML-based chapter recommendations
   - Difficulty adjustment based on quiz performance
   - Personalized resource suggestions

4. **Social Features**:
   - User forums
   - Study groups
   - Peer learning

5. **Advanced Personalization**:
   - Dynamic difficulty adjustment
   - Adaptive content delivery
   - Spaced repetition for reviews

## API Routes (Future)

When migrating to backend:

```
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout
GET    /api/auth/me
POST   /api/auth/verify-email
POST   /api/users/{userId}/profile
GET    /api/users/{userId}/recommendations
POST   /api/users/{userId}/progress
```

## Support

For issues or questions:
1. Check the implementation in `src/components/Auth/`
2. Review type definitions in `src/types/index.ts`
3. Check the Better Auth documentation
4. Test with the demo account credentials

## Files Created/Modified

### New Files
- `src/components/Auth/SignupForm.tsx`
- `src/components/Auth/SigninForm.tsx`
- `src/components/Auth/AuthGateway.tsx`
- `src/components/Auth/UserMenu.tsx`
- `src/components/Auth/PersonalizationBanner.tsx`
- `src/components/Auth/index.ts`
- `src/components/Auth/AuthForm.module.css`
- `src/components/Auth/AuthGateway.module.css`
- `src/components/Auth/UserMenu.module.css`
- `src/components/Auth/PersonalizationBanner.module.css`
- `src/contexts/AuthContext.tsx`
- `src/hooks/usePersonalization.ts`
- `src/pages/auth/signin.tsx`
- `src/pages/auth/signup.tsx`
- `src/utils/contentPersonalization.ts`

### Modified Files
- `src/types/index.ts` - Added UserBackground, User, AuthState interfaces
- `src/theme/Root.jsx` - Updated with user background in demo account
- `src/theme/Navbar/index.jsx` - Fixed UserMenu import
- `src/pages/index.tsx` - Added PersonalizationBanner

## Status

✅ Complete authentication system with user profiling
✅ Content personalization logic
✅ UI components for signup, signin, user menu
✅ Demo account with background information
✅ Integration with Docusaurus theme

Ready for production migration to Better Auth and backend API.
