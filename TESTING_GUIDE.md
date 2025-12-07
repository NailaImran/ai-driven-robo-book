# Translation System Testing Guide

**Date**: 2025-12-07
**Status**: Ready to Test

---

## Quick Start - Testing the Translation System

### Step 1: Start Development Server

```bash
cd /c/Users/lenovo/Desktop/Hackathone1/physical-ai-textbook
npm start
```

Wait for the server to start. You should see:
```
✔ [webpack 5.x] compiled successfully
Listening on: http://localhost:3000
```

### Step 2: Navigate to a Lesson Page

Open your browser and go to one of these lesson pages:

**Lesson 3.1 - Physics Simulation with Gazebo**
```
http://localhost:3000/docs/chapter-3/lesson-3-1-gazebo
```

**Lesson 3.2 - High-Fidelity Rendering with Unity**
```
http://localhost:3000/docs/chapter-3/lesson-3-2-unity
```

**Lesson 3.3 - NVIDIA Isaac Sim Platform**
```
http://localhost:3000/docs/chapter-3/lesson-3-3-isaac-sim
```

**Lesson 3.4 - Sensor Simulation & Synthetic Data**
```
http://localhost:3000/docs/chapter-3/lesson-3-4-sensors
```

---

## Step 3: Verify Lesson Component Displays

When you load a lesson page, you should see:

1. **Lesson Header** (in large text)
   - English: "Lesson 3.1: Physics Simulation with Gazebo"
   - Should be at the top of the page

2. **Overview Section**
   - Shows "Overview" heading
   - Contains estimated duration and exercise count
   - Shows descriptive paragraph

3. **Learning Objectives Section**
   - Heading: "Learning Objectives"
   - Intro text: "By the end of this lesson, you will be able to:"
   - Numbered list of 6-7 objectives

4. **Prerequisites Section**
   - Heading: "Prerequisites"
   - Bulleted list of requirements

5. **Navigation Buttons**
   - Bottom of component
   - "← Previous Lesson" button
   - "Next Lesson →" button

---

## Step 4: Test the Language Toggle

### Locate the Translation Toggle Button
- Look at the **top-right corner of the navbar**
- You should see a button with flag icons
- English flag: 🇬🇧
- Pakistani flag (Urdu): 🇵🇰

### Click the Toggle Button
1. Click the flag button
2. Watch the entire page components update

### Verify Urdu Translation

After clicking the toggle, you should see:

**English → Urdu Translation Examples**

| Component | English | Urdu (expected) |
|-----------|---------|-----------------|
| Lesson Title | "Physics Simulation with Gazebo" | "فزکس سمولیشن گیزیبو کے ساتھ" |
| Overview | "Overview" | "جائزہ" |
| Learning Objectives | "Learning Objectives" | "سیکھنے کے مقاصد" |
| Prerequisites | "Prerequisites" | "ضروری شرائط" |
| Navigation | "Next Lesson →" | "اگلا سبق →" |

---

## Step 5: Test Language Persistence

1. **Switch to Urdu**
   - Click the translation toggle button
   - All lesson content switches to Urdu

2. **Refresh the page**
   - Press F5 or Cmd+R
   - The page should **stay in Urdu**
   - If it reverts to English, localStorage persistence isn't working

3. **Navigate to another lesson**
   - Click a navigation button (Next/Previous)
   - The new lesson should **load in Urdu**
   - Language preference persists across navigation

4. **Switch back to English**
   - Click the toggle button again
   - All content reverts to English

---

## Step 6: Test Across Different Lessons

Navigate through all 4 lessons and verify:

### Lesson 3.1 - Gazebo
- [ ] Lesson title displays correctly
- [ ] "Overview" section visible
- [ ] Learning objectives list shows 7 items
- [ ] Prerequisites section shows 5 items
- [ ] Navigation buttons work
- [ ] Language toggle works

### Lesson 3.2 - Unity
- [ ] Lesson title displays correctly
- [ ] "Overview" section visible
- [ ] Learning objectives list shows 6 items
- [ ] Prerequisites section shows 5 items
- [ ] Navigation buttons work
- [ ] Language toggle works

### Lesson 3.3 - Isaac Sim
- [ ] Lesson title displays correctly
- [ ] "Overview" section visible
- [ ] Learning objectives list shows 7 items
- [ ] Prerequisites section shows 5 items
- [ ] Navigation buttons work
- [ ] Language toggle works

### Lesson 3.4 - Sensors
- [ ] Lesson title displays correctly
- [ ] "Overview" section visible
- [ ] Learning objectives list shows 7 items
- [ ] Prerequisites section shows 5 items
- [ ] Navigation buttons work
- [ ] Language toggle works

---

## Step 7: Test Browser Compatibility

Test in different browsers:

- [ ] **Chrome/Chromium**
  - Navigate to lesson page
  - Verify components display
  - Test language toggle

- [ ] **Firefox**
  - Navigate to lesson page
  - Verify components display
  - Test language toggle

- [ ] **Safari** (if available)
  - Navigate to lesson page
  - Verify components display
  - Test language toggle

- [ ] **Mobile Browser** (if available)
  - Open on mobile device
  - Components should be responsive
  - Translation toggle should be accessible

---

## Step 8: Test Responsive Design

### Desktop View
- Components should have proper spacing
- Navigation buttons should be on same line
- Text should be readable

### Tablet View
- Resize browser to 768px width
- Components should stack nicely
- Navigation buttons should remain accessible

### Mobile View
- Resize browser to 375px width (iPhone size)
- Components should stack vertically
- Translation button should be visible
- Navigation buttons should be touchable

---

## Troubleshooting

### Issue: Translation toggle button not visible

**Solution**:
1. Check if navbar is rendering
2. Verify TranslationProvider is in Root.jsx
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: Page loads in English but doesn't translate

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for JavaScript errors
3. Verify translation keys exist in TranslationContext
4. Check that useTranslation() is called in components

### Issue: Language doesn't persist after refresh

**Solution**:
1. Check that localStorage is enabled
2. Verify localStorage check in TranslationContext:
   ```tsx
   if (typeof window !== 'undefined') {
     const saved = localStorage.getItem('preferred-language');
   }
   ```
3. Clear browser cache and try again

### Issue: Build fails

**Solution**:
1. Check for syntax errors in component files
2. Verify all imports are correct
3. Run build again:
   ```bash
   npm run build
   ```
4. Check error message in build output

---

## Expected Results Summary

### ✅ Success Criteria

1. **Visual Components Display**
   - All lesson headers render correctly
   - Learning objectives list displays with proper formatting
   - Prerequisites section shows complete list
   - Navigation buttons are visible and clickable

2. **Language Toggle Works**
   - Click toggle button → components update to Urdu
   - Click toggle button → components revert to English
   - No page refresh needed
   - Smooth transition (< 100ms)

3. **Language Persists**
   - Switch to Urdu → Refresh page → Still in Urdu
   - Switch to English → Refresh page → Still in English
   - Navigate between lessons → Language preference maintained

4. **Responsive Design**
   - Desktop: Components display in wide layout
   - Tablet: Components stack appropriately
   - Mobile: All elements accessible without horizontal scroll

5. **No Errors**
   - Browser console shows no errors
   - Network tab shows successful resource loading
   - Build completes without warnings

---

## Test Execution Checklist

### Before Testing
- [ ] Development server running on localhost:3000
- [ ] No console errors in browser DevTools
- [ ] Docusaurus build completed successfully

### During Testing
- [ ] Visited all 4 lesson pages
- [ ] Clicked translation toggle on each page
- [ ] Verified Urdu text displays correctly
- [ ] Tested navigation between lessons
- [ ] Tested on multiple browsers
- [ ] Tested responsive design

### After Testing
- [ ] All tests passed ✅
- [ ] No critical issues found
- [ ] No warnings or errors
- [ ] Ready for deployment

---

## Sign-Off

**Tester Name**: ___________________

**Date Tested**: ___________________

**All Tests Passed**: [ ] Yes [ ] No

**Issues Found**:
```
[List any issues here]
```

**Notes**:
```
[Additional observations]
```

---

## Documentation Links

- **MDX Integration Document**: `MDX_INTEGRATION_COMPLETE.md`
- **Translation System Guide**: `TRANSLATION_SYSTEM_COMPLETE.md`
- **Lesson Components Document**: `LESSON_COMPONENTS_COMPLETE.md`
- **Quick Implementation Guide**: `QUICK_TRANSLATION_IMPLEMENTATION.md`

---

Generated: 2025-12-07
Status: Ready for Testing
