# Theme Guide - Dark & Light Mode

The Physical AI & Humanoid Robotics textbook supports both **Light** and **Dark** modes with smooth transitions and a robotics-inspired color palette.

## Features

### 🌓 Automatic Theme Detection
- **Respects system preferences**: The site automatically detects your operating system's theme preference
- **Manual override**: Users can manually switch between light and dark modes using the theme toggle in the navbar
- **Persistent preference**: Theme choice is saved in browser localStorage

### 🎨 Color Schemes

#### Light Mode
- **Primary Color**: Fresh green (`#2e8555`)
- **Background**: Clean white
- **Code Blocks**: GitHub light theme
- **Hero Section**: Purple gradient

#### Dark Mode - Robotics Theme
- **Primary Color**: Cyber cyan (`#00d9ff`) - Tech/robotics aesthetic
- **Background**: Deep dark (`#1a1a1a`)
- **Code Blocks**: Dracula dark theme with cyan highlights
- **Hero Section**: Deep blue gradient
- **Enhanced Contrast**: Optimized for readability

### ✨ Enhanced Components

All components are optimized for both themes:

- ✅ **Tables**: Proper contrast and borders
- ✅ **Admonitions**: Color-coded alerts (info, warning, success, danger)
- ✅ **Code Blocks**: Syntax highlighting with appropriate themes
- ✅ **Mermaid Diagrams**: Automatic theme switching
- ✅ **Learning Outcome Boxes**: Styled backgrounds
- ✅ **Assessment Boxes**: Warning-colored borders
- ✅ **Smooth Transitions**: 200ms ease transitions when switching themes

## Usage

### For Users

**Toggle Theme:**
1. Look for the sun/moon icon in the top-right navbar
2. Click to switch between light and dark modes
3. Your preference is automatically saved

**Keyboard Shortcut:**
- The theme toggle is accessible via keyboard navigation (Tab to focus, Enter to toggle)

### For Developers

**Color Variables:**

The theme uses CSS custom properties (variables) defined in `src/css/custom.css`:

```css
/* Light mode (default) */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-background-color: #ffffff;
  /* ... more variables */
}

/* Dark mode */
[data-theme='dark'] {
  --ifm-color-primary: #00d9ff;
  --ifm-background-color: #1a1a1a;
  /* ... more variables */
}
```

**Adding Dark Mode to Custom Components:**

```css
/* Your component */
.my-component {
  background-color: white;
  color: black;
}

/* Dark mode variant */
[data-theme='dark'] .my-component {
  background-color: #242424;
  color: #e0e0e0;
}
```

**Configuration:**

Located in `docusaurus.config.js`:

```javascript
colorMode: {
  defaultMode: 'light',              // Default theme on first visit
  disableSwitch: false,              // Allow users to toggle
  respectPrefersColorScheme: true,   // Use system preference
}
```

## Customization

### Changing Default Theme

Edit `docusaurus.config.js`:

```javascript
colorMode: {
  defaultMode: 'dark',  // Start with dark mode
}
```

### Customizing Colors

Edit `website/src/css/custom.css`:

```css
[data-theme='dark'] {
  --ifm-color-primary: #your-color;
  --ifm-background-color: #your-background;
}
```

### Disabling Theme Toggle

```javascript
colorMode: {
  disableSwitch: true,  // Hide the toggle button
  defaultMode: 'light',
}
```

## Accessibility

- ✅ **WCAG 2.1 AA Compliant**: All color combinations meet contrast requirements
- ✅ **Keyboard Accessible**: Theme toggle accessible via Tab navigation
- ✅ **Screen Reader Friendly**: Proper ARIA labels on toggle button
- ✅ **Focus Indicators**: Clear focus outlines in both themes

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

CSS custom properties (variables) are supported in all modern browsers.

## Performance

- **Fast Transitions**: 200ms transitions for smooth theme switching
- **No Flash**: Theme is applied before page render (no FOUC)
- **Lightweight**: Minimal CSS overhead (~2KB additional)

## Testing Dark Mode

### Local Development

```bash
cd website
npm start
```

1. Open http://localhost:3000
2. Click the theme toggle (sun/moon icon) in the navbar
3. Verify all components look correct in both modes

### Manual Test Checklist

- [ ] Navbar colors correct
- [ ] Footer colors correct
- [ ] Code blocks readable
- [ ] Tables properly styled
- [ ] Admonitions (info, warning, success, danger) visible
- [ ] Links have proper contrast
- [ ] Mermaid diagrams render correctly
- [ ] Hero section gradient looks good
- [ ] Smooth transition when toggling

### System Preference Test

1. Change your OS theme (Windows: Settings → Personalization → Colors)
2. Refresh the page
3. Site should match your OS preference

## Troubleshooting

### Theme Not Switching

**Solution:** Clear browser localStorage:
```javascript
// In browser console
localStorage.removeItem('theme');
location.reload();
```

### Colors Look Wrong

**Check:**
1. Browser DevTools → Elements → Check `[data-theme='dark']` is applied to `<html>`
2. Verify CSS custom properties are defined
3. Clear browser cache

### Mermaid Diagrams Not Theming

**Verify** `docusaurus.config.js` has:
```javascript
mermaid: {
  theme: {light: 'neutral', dark: 'dark'},
}
```

## Future Enhancements

Potential improvements:

- [ ] Additional color scheme options (blue, purple, etc.)
- [ ] Custom theme builder UI
- [ ] High contrast mode for accessibility
- [ ] Theme-aware images (different versions for light/dark)
- [ ] Animated theme transitions

---

**Created**: 2025-12-28
**Version**: 1.0.0
**Framework**: Docusaurus 3.x
