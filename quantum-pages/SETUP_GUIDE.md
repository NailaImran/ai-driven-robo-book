# QuantumPages Setup and Deployment Guide 🚀

## Local Development Setup

### Step 1: Prerequisites
- Node.js v18 or higher
- npm, yarn, or pnpm
- Git (for version control)

### Step 2: Installation

```bash
# Navigate to the quantum-pages directory
cd quantum-pages

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Architecture 🏗️

### Directory Structure

```
quantum-pages/
├── app/                          # Next.js 13+ App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage
│   ├── chapters/
│   │   ├── page.tsx            # All chapters listing
│   │   └── [id]/page.tsx       # Individual chapter page
│   └── about/page.tsx           # About page
│
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Navigation bar with language switcher
│   ├── Footer.tsx               # Footer with links
│   ├── Hero.tsx                 # Homepage hero section
│   ├── FeaturedChapters.tsx     # Featured chapters grid
│   ├── Features.tsx             # Features showcase
│   ├── CTASection.tsx           # Call-to-action section
│   ├── LanguageSwitcher.tsx     # Language switcher component
│   ├── ChapterGrid.tsx          # Chapter grid display
│   └── ChapterContent.tsx       # Chapter content viewer
│
├── lib/                          # Utilities and shared logic
│   └── chapters.ts              # Chapter data and configuration
│
├── types/                        # TypeScript type definitions
│   └── chapter.ts               # Chapter interface
│
├── styles/                       # Global styles
│   └── globals.css              # Global CSS and Tailwind directives
│
├── public/                       # Static assets
│
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## Key Features 🎯

### 1. **Modern UI/UX**
- Clean, responsive design using Tailwind CSS
- Custom quantum color scheme (blue gradients)
- Smooth animations and transitions
- Mobile-first approach

### 2. **Dynamic Routing**
- Homepage with hero section
- Chapters listing page
- Individual chapter detail pages
- About page

### 3. **Language Support**
- Language switcher component (English/Urdu)
- Ready for i18next integration
- Bilingual content support

### 4. **TypeScript Support**
- Full TypeScript configuration
- Type-safe components
- Path aliases for clean imports (@/*)

### 5. **Performance Optimized**
- Next.js 16 with latest optimizations
- Static generation where possible
- Image optimization ready
- Code splitting

## Customization Guide 🎨

### Adding New Chapters

1. Open `lib/chapters.ts`
2. Add new chapter object to the `chapters` array:

```typescript
{
  id: 'chapter-7',
  title: 'Your Chapter Title',
  description: 'Brief description',
  icon: '📝', // Emoji icon
  lessons: 5,
  duration: '3 hours',
  level: 'Intermediate',
}
```

### Changing Colors

Edit `tailwind.config.ts` to modify the quantum color scheme:

```typescript
colors: {
  quantum: {
    50: '#f0f9ff',
    // ... modify color values
  },
}
```

### Adding New Pages

1. Create new file in `app/` directory
2. Use the existing layout structure
3. Example: `app/tutorials/page.tsx`

## Environment Variables

Create a `.env.local` file for local configuration:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Build and Deployment

### Building for Production

```bash
# Build the project
npm run build

# Start production server
npm run start
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Deployment Platforms 🌐

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t quantum-pages .
docker run -p 3000:3000 quantum-pages
```

## Integration with Physical AI Textbook 📚

This QuantumPages frontend can be integrated with the existing Physical AI textbook:

1. **Content Sync**: Import chapters from docusaurus build
2. **Authentication**: Integrate with existing auth system
3. **API Integration**: Connect to backend services
4. **Database**: Store user progress and preferences

## Performance Optimization 🚀

### Image Optimization
- Use Next.js Image component
- Lazy loading by default
- Responsive image sizes

### Code Splitting
- Automatic route-based code splitting
- Dynamic imports for heavy components

### Caching
- Browser caching
- CDN integration ready
- Static generation

## Testing (Optional)

Install testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create test files alongside components with `.test.tsx` extension.

## Troubleshooting 🔧

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check types
npm run typecheck

# Fix issues in tsconfig.json or component files
```

## Contributing 🤝

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## Resources 📚

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [i18next Guide](https://www.i18next.com/)

## Support and Contact 💬

- Email: hello@quantumpages.com
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## License 📄

MIT License - Free to use and modify

---

**Happy Learning! 🎓**
