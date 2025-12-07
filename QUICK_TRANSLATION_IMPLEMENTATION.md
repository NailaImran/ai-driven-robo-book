# Quick Translation Implementation Guide

**Purpose**: Quick copy-paste templates for adding translations to lesson pages
**Time to Complete**: 1-2 hours for all 4 lessons
**Difficulty**: Easy (just copy patterns)

---

## Template 1: Lesson Overview Section

Use this template for the lesson overview:

```tsx
import { useTranslation } from '../contexts/TranslationContext';

const LessonOverview = () => {
  const { t } = useTranslation();

  return (
    <div className="lesson-overview">
      <h2>{t('lesson-3-1-subtitle')}</h2>

      <p>{t('lesson-3-1-overview')}</p>

      <div className="learning-info">
        <p>
          <strong>{t('estimated-time')}</strong> {t('lesson-3-1-learning-duration')}
        </p>
        <p>
          <strong>{t('exercises')}</strong> {t('lesson-3-1-exercises')}
        </p>
      </div>
    </div>
  );
};

export default LessonOverview;
```

---

## Template 2: Key Concepts Section

Use for any section with concept definitions:

```tsx
const KeyConceptsSection = () => {
  const { t } = useTranslation();

  return (
    <div className="concepts">
      <h3>{t('key-concepts')}</h3>

      <h4>{t('what-is-gazebo')}</h4>
      <p>{t('gazebo-provides')}</p>

      <ul>
        <li>{t('physics-simulation')}</li>
        <li>{t('sensor-simulation')}</li>
        <li>{t('ros2-integration')}</li>
        <li>{t('plugin-system')}</li>
        <li>{t('physics-engines')}</li>
      </ul>
    </div>
  );
};

export default KeyConceptsSection;
```

---

## Template 3: Architecture Section

Use for architecture diagrams and explanations:

```tsx
const ArchitectureSection = () => {
  const { t } = useTranslation();

  return (
    <div className="architecture">
      <h3>{t('gazebo-architecture')}</h3>

      <p>{t('gazebo-consists-of')}</p>

      <ol>
        <li>{t('server')}</li>
        <li>{t('client')}</li>
        <li>{t('plugins')}</li>
        <li>{t('ros2-bridge')}</li>
      </ol>

      {/* ASCII diagram or image here */}
    </div>
  );
};

export default ArchitectureSection;
```

---

## Template 4: Full Lesson Page

Complete lesson page with all sections:

```tsx
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

export const Lesson31Gazebo = () => {
  const { t } = useTranslation();

  return (
    <article className="lesson-content">
      {/* Header */}
      <header className="lesson-header">
        <h1>{t('lesson-3-1-title')}</h1>
        <p>{t('lesson-3-1-overview')}</p>
      </header>

      {/* Overview Section */}
      <section className="overview">
        <h2>{t('overview-section')}</h2>
        <p>{t('lesson-3-1-learning-duration')}</p>
        <p>{t('lesson-3-1-exercises')}</p>
      </section>

      {/* Learning Objectives */}
      <section className="objectives">
        <h2>{t('learning-objectives')}</h2>
        <ol>
          <li>{t('objective-1')}</li>
          <li>{t('objective-2')}</li>
          <li>{t('objective-3')}</li>
          <li>{t('objective-4')}</li>
          <li>{t('objective-5')}</li>
          <li>{t('objective-6')}</li>
        </ol>
      </section>

      {/* Prerequisites */}
      <section className="prerequisites">
        <h2>{t('prerequisites')}</h2>
        <ul>
          <li>{t('prereq-1')}</li>
          <li>{t('prereq-2')}</li>
          <li>{t('prereq-3')}</li>
        </ul>
      </section>

      {/* Key Concepts */}
      <section className="concepts">
        <h2>{t('key-concepts')}</h2>

        <h3>{t('what-is-gazebo')}</h3>
        <p>{t('gazebo-provides')}</p>
        <ul>
          <li>{t('physics-simulation')}</li>
          <li>{t('sensor-simulation')}</li>
          <li>{t('ros2-integration')}</li>
          <li>{t('plugin-system')}</li>
          <li>{t('physics-engines')}</li>
        </ul>

        <h3>{t('gazebo-fundamentals')}</h3>
        <p>{t('gazebo-architecture')}</p>
      </section>

      {/* Architecture */}
      <section className="architecture">
        <h2>{t('architecture')}</h2>
        <p>{t('gazebo-consists-of')}</p>
        <ol>
          <li>{t('server')}</li>
          <li>{t('client')}</li>
          <li>{t('plugins')}</li>
          <li>{t('ros2-bridge')}</li>
        </ol>
      </section>

      {/* Code Examples */}
      <section className="examples">
        <h2>{t('code-examples')}</h2>
        {/* Include code examples here */}
      </section>

      {/* Exercises */}
      <section className="exercises">
        <h2>{t('exercises')}</h2>
        {/* Include exercises here */}
      </section>

      {/* Navigation */}
      <nav className="lesson-nav">
        <a href="#" className="btn-prev">{t('previous-lesson')}</a>
        <a href="#" className="btn-next">{t('next-lesson')}</a>
      </nav>
    </article>
  );
};

export default Lesson31Gazebo;
```

---

## Template 5: Using LessonContent Components

Quick way using the new components:

```tsx
import { LessonContent, OnLanguage, BilingualContent } from '../components/LessonContent';
import { useTranslation } from '../contexts/TranslationContext';

const SimpleLesson = () => {
  const { t } = useTranslation();

  return (
    <>
      <LessonContent tKey="lesson-3-1-subtitle" as="h2" />
      <LessonContent tKey="lesson-3-1-overview" as="p" />

      <h3>{t('key-concepts')}</h3>
      <BilingualContent
        en={<p>Learning about Gazebo physics simulation...</p>}
        ur={<p>Gazebo فزکس نقالی کے بارے میں سیکھنا...</p>}
      />

      <OnLanguage lang="ur">
        <div dir="rtl">
          <p>یہ صرف اردو میں دکھایا جائے گا</p>
        </div>
      </OnLanguage>
    </>
  );
};
```

---

## Lesson-by-Lesson Checklist

### Lesson 3.1 - Gazebo

- [ ] Import `useTranslation` from contexts
- [ ] Replace heading with `t('lesson-3-1-subtitle')`
- [ ] Replace overview paragraph with `t('lesson-3-1-overview')`
- [ ] Translate learning objectives (6 items)
- [ ] Translate prerequisites (3 items)
- [ ] Translate key concepts:
  - `what-is-gazebo`
  - `gazebo-provides`
  - `physics-simulation`
  - `sensor-simulation`
  - `ros2-integration`
- [ ] Translate architecture section
- [ ] Test toggle - verify Urdu text appears
- [ ] Commit changes

### Lesson 3.2 - Unity

- [ ] Import `useTranslation`
- [ ] Replace heading with `t('lesson-3-2-subtitle')`
- [ ] Replace overview with `t('lesson-3-2-overview')`
- [ ] Translate key concepts:
  - `unity-architecture`
  - `unity-rendering`
  - `pbr-materials`
  - `lighting-setup`
  - `camera-configuration`
  - `real-time-control`
- [ ] Test translation toggle
- [ ] Commit changes

### Lesson 3.3 - Isaac Sim

- [ ] Import `useTranslation`
- [ ] Replace heading with `t('lesson-3-3-subtitle')`
- [ ] Replace overview with `t('lesson-3-3-overview')`
- [ ] Translate key concepts:
  - `isaac-sim-platform`
  - `photorealistic-rendering`
  - `reinforcement-learning`
  - `synthetic-data-generation`
  - `domain-randomization`
  - `task-graphs`
  - `rl-environments`
- [ ] Test translation toggle
- [ ] Commit changes

### Lesson 3.4 - Sensors

- [ ] Import `useTranslation`
- [ ] Replace heading with `t('lesson-3-4-subtitle')`
- [ ] Replace overview with `t('lesson-3-4-overview')`
- [ ] Translate key concepts:
  - `lidar-simulation`
  - `depth-camera`
  - `imu-simulation`
  - `data-augmentation`
  - `export-formats`
  - `synthetic-dataset`
- [ ] Test translation toggle
- [ ] Commit changes

---

## Common Mistakes to Avoid

❌ **Wrong**: Forgetting to import useTranslation
```tsx
// Won't work - t is undefined
const { t } = useTranslation(); // Missing import!
```

✅ **Correct**: Always import first
```tsx
import { useTranslation } from '../contexts/TranslationContext';
const { t } = useTranslation();
```

---

❌ **Wrong**: Using undefined translation keys
```tsx
<h2>{t('lesson-3-1-title-wrong-key')}</h2> // Key doesn't exist!
```

✅ **Correct**: Use existing keys from dictionary
```tsx
<h2>{t('lesson-3-1-subtitle')}</h2> // This key exists in TranslationContext
```

---

❌ **Wrong**: Forgetting RTL for Urdu content
```tsx
<OnLanguage lang="ur">
  <p>نمونہ متن</p> {/* RTL text without dir="rtl" */}
</OnLanguage>
```

✅ **Correct**: Always add dir="rtl" for Urdu
```tsx
<OnLanguage lang="ur">
  <div dir="rtl">
    <p>نمونہ متن</p>
  </div>
</OnLanguage>
```

---

## Testing Your Translations

After implementing translations:

1. **View English version**
   - Load chapter page
   - Verify English text displays correctly

2. **Click translation toggle** (🇬🇧 button in navbar)
   - Page should update to Urdu
   - All translated text should appear
   - RTL layout should apply

3. **Verify language persists**
   - Refresh page
   - Language should stay as Urdu
   - localStorage is working

4. **Test across browsers**
   - Chrome/Chromium
   - Firefox
   - Safari (mobile)

---

## Quick Copy-Paste Translation Keys

For Lesson 3.1 Gazebo:
```
lesson-3-1-subtitle
lesson-3-1-overview
lesson-3-1-learning-duration
lesson-3-1-exercises
what-is-gazebo
gazebo-provides
physics-simulation
sensor-simulation
ros2-integration
plugin-system
physics-engines
gazebo-fundamentals
gazebo-architecture
gazebo-consists-of
server
client
plugins
ros2-bridge
sdf-format
sdf-description
```

For Lesson 3.2 Unity:
```
lesson-3-2-subtitle
lesson-3-2-overview
unity-architecture
unity-rendering
pbr-materials
lighting-setup
camera-configuration
real-time-control
```

For Lesson 3.3 Isaac Sim:
```
lesson-3-3-subtitle
lesson-3-3-overview
isaac-sim-platform
photorealistic-rendering
reinforcement-learning
synthetic-data-generation
domain-randomization
task-graphs
rl-environments
```

For Lesson 3.4 Sensors:
```
lesson-3-4-subtitle
lesson-3-4-overview
lidar-simulation
depth-camera
imu-simulation
data-augmentation
export-formats
synthetic-dataset
```

---

## Expected Results

After full implementation:

✅ Chapter 3 pages fully translatable
✅ Toggle button switches all content
✅ Urdu text renders right-to-left
✅ Language preference persists
✅ All lessons support both languages
✅ Mobile responsive
✅ No console errors
✅ Docusaurus builds successfully

---

## Next Steps

1. **Today**: Implement translations in all 4 lesson pages
2. **Today**: Test full translation toggle
3. **Tomorrow**: Expand to Chapters 1 & 2 (if needed)

---

**Generated**: 2025-12-07
**Status**: Templates ready for implementation
**Estimated Time**: 1-2 hours for full integration
**Difficulty**: Easy (mostly copy-paste)
