# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev          # Start Vite dev server with HMR at http://localhost:5000
npm run build        # Build for production to docs/ directory
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run coverage     # Generate test coverage report
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run check        # TypeScript type checking with svelte-check
```

## Architecture

This is a modern Svelte 5.x single-page application built with TypeScript, Vite, Tailwind CSS 4.x, and shadcn-svelte that provides a web interface for searching password dump data via the passdb-backend API.

### Key Architectural Decisions

1. **Modern Build System**: Uses Vite instead of Rollup for faster builds and better DX
2. **TypeScript**: Full TypeScript support with proper types for API responses
3. **UI Framework**: Tailwind CSS 4.x with properly configured CSS variables
4. **Component System**: shadcn-svelte for consistent, accessible UI components with full theme integration
5. **Theme Support**: Seamless dark mode with system preference detection using CSS variables
6. **Error Handling**: Comprehensive error boundaries and retry logic
7. **Testing**: Vitest for unit testing with example tests
8. **Static Site Deployment**: Builds to `docs/` directory for GitHub Pages hosting

### Modern Features

- **Error Boundaries**: `ErrorBoundary.svelte` catches and displays errors gracefully
- **Loading States**: `LoadingStates.svelte` provides spinner, skeleton, and dot animations
- **Theme System**: `ThemeSwitcher.svelte` with light/dark/system modes
- **Retry Logic**: Automatic retry with exponential backoff for failed API requests
- **Type Safety**: Full TypeScript coverage with proper API types
- **shadcn-svelte**: Modern component library with consistent design tokens and accessibility
- **CSS Variable System**: Properly formatted RGB variables for Tailwind compatibility and theme switching

### Component Organization

#### UI Components

- **shadcn-svelte Components**: Modern, accessible component library at `src/lib/components/ui/`
- **Custom Components**: Application-specific components using Tailwind semantic color classes
- **Theme Integration**: All components automatically respond to dark/light mode via CSS variables
- **Accessible Design**: Proper ARIA labels and keyboard navigation
- **Color System**: Semantic color classes (`bg-background`, `text-foreground`, `bg-card`, etc.)

#### Core Patterns

- **Route Components** (`src/routes/`): Page-level components for different search types
- **Fetcher Pattern**: Wraps async data loading with loading/error states and retry logic
- **Theme Store**: Reactive theme management with localStorage persistence
- **Type-Safe API**: Strongly typed API responses and parameters

### Important Files

- `src/routes.ts` - Route definitions with dual UI support
- `src/stores/theme.ts` - Theme management store
- `src/types/api.ts` - TypeScript API type definitions
- `src/components/ErrorBoundary.svelte` - Global error handling
- `src/lib/utils.ts` - Utility functions for shadcn-svelte (cn function)
- `src/lib/components/ui/` - shadcn-svelte UI components
- `components.json` - shadcn-svelte configuration
- `vite.config.js` - Vite build configuration with $lib aliases
- `tailwind.config.js` - Tailwind CSS configuration with shadcn design tokens
- `src/index.css` - CSS variables in RGB format for Tailwind + shadcn theme system

### Development Notes

- **TypeScript**: Full TypeScript support with strict type checking
- **Testing**: Vitest configured with example tests in `src/lib/sanitize.test.js`
- **Linting**: ESLint with Svelte and TypeScript support
- **Formatting**: Prettier with Svelte plugin
- **API**: Requires passdb-backend API running at http://localhost:4567 (configurable)
- **Security**: HTML sanitization for user-generated content (HIBP descriptions)
- **HIBP Integration**: Enhanced Have I Been Pwned integration for email searches

### UI Features

The application uses Tailwind CSS 4.x with fully integrated shadcn-svelte and offers:

- Modern, clean design system with properly configured CSS variables
- shadcn-svelte component library with seamless theme integration
- Functional dark mode support with instant theme switching
- RGB-formatted CSS variables compatible with Tailwind's alpha channel syntax
- Semantic color system using `bg-background`, `text-foreground`, `bg-card`, etc.
- Responsive design optimized for mobile and desktop
- Accessible components with proper ARIA support and keyboard navigation
- Type-safe component props with TypeScript integration
- Working theme switcher with light/dark/system modes

### shadcn-svelte Integration

- **Installation**: Fully configured with `components.json` and proper aliases
- **Components**: Available at `src/lib/components/ui/` with TypeScript support
- **Utilities**: `cn()` function for class merging with clsx and tailwind-merge
- **Theme System**: Fully integrated with CSS variables in RGB format for Tailwind compatibility
- **Color Variables**: CSS variables formatted as `--primary: 52 168 90` for `rgb(var(--primary) / <alpha-value>)` syntax
- **Theme Switching**: Automatic theme switching across all components using semantic classes
- **Adding Components**: Use `npx shadcn-svelte@latest add [component-name]`

### CSS Variable Best Practices

**IMPORTANT**: CSS variables must be in RGB number format (not `rgb()` function) for Tailwind compatibility:

```css
/* ✅ Correct format */
:root {
  --background: 249 249 250;
  --foreground: 51 51 51;
  --primary: 52 168 90;
}

/* ❌ Incorrect format */
:root {
  --background: rgb(249, 249, 250);
  --foreground: rgb(51, 51, 51);
  --primary: rgb(52, 168, 90);
}
```

This enables Tailwind's `rgb(var(--background) / <alpha-value>)` syntax for proper alpha channel support.

## Development Workflow

### Claude-Specific Notes

- **Server State**: 
  - I have a running instance of the server running, you never need to start a new one, just ask if your changes are reflected
  - I'm always running a dev server, no need to start one