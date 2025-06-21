velte 5 Migration Analysis & Plan                                                    │ │
│ │                                                                                       │ │
│ │ Current State Analysis                                                                │ │
│ │                                                                                       │ │
│ │ Component Inventory & Classification                                                  │ │
│ │                                                                                       │ │
│ │ Already Using Svelte 5 Patterns:                                                      │ │
│ │ - /src/components/data-table/data-table.svelte - Uses $props(), $state(), generics ✅  │ │
│ │                                                                                       │ │
│ │ Mixed/Hybrid Components (Partial Svelte 5):                                           │ │
│ │ - /src/lib/components/ui/button/button.svelte - Uses $props() but also has complex    │ │
│ │ $bindable() patterns                                                                  │ │
│ │ - /src/lib/components/ui/input/input.svelte - Uses $props() with $bindable()          │ │
│ │ - /src/lib/components/ui/card/card.svelte - Uses $props() with {@render children?.()} │ │
│ │                                                                                       │ │
│ │ Legacy Svelte 4 Components (Need Full Migration):                                     │ │
│ │                                                                                       │ │
│ │ High Priority (Core Application Logic):                                               │ │
│ │ 1. /src/App.svelte - Root component, simple structure, uses stores                    │ │
│ │ 2. /src/components/TabbedSearch.svelte - Main search interface, moderate complexity   │ │
│ │ 3. /src/components/Fetcher.svelte - Data fetching logic, uses export let endpoint     │ │
│ │ 4. /src/components/Results.svelte - Results display, simple component                 │ │
│ │                                                                                       │ │
│ │ Medium Priority (Route Components):                                                   │ │
│ │ 5. /src/routes/Home.svelte - Simple route, minimal logic                              │ │
│ │ 6. /src/routes/Email.svelte - Route with reactive statements                          │ │
│ │ 7. /src/routes/Username.svelte - Simple route component                               │ │
│ │ 8. /src/routes/Password.svelte - Simple route component9. /src/routes/Domain.svelte - │ │
│ │  Simple route component                                                               │ │
│ │ 10. /src/routes/NotFound.svelte - Static component, minimal changes needed            │ │
│ │                                                                                       │ │
│ │ Low Priority (Complex/Feature Components):                                            │ │
│ │ 11. /src/components/Navbar.svelte - Complex component with search logic and stores    │ │
│ │ 12. /src/components/ThemeSwitcher.svelte - Very complex component with multiple       │ │
│ │ features                                                                              │ │
│ │ 13. /src/components/HIBP.svelte - Async data fetching component                       │ │
│ │ 14. /src/components/ErrorBoundary.svelte - Error handling logic                       │ │
│ │ 15. /src/components/LoadingStates.svelte - Simple presentational component            │ │
│ │                                                                                       │ │
│ │ Utility Components:                                                                   │ │
│ │ 16. /src/components/Breadcrumbs.svelte - Uses stores, moderate complexity             │ │
│ │ 17. /src/components/KeyboardShortcutsHelp.svelte - Complex modal component            │ │
│ │                                                                                       │ │
│ │ Migration Strategy by Priority                                                        │ │
│ │                                                                                       │ │
│ │ Phase 1: Core Application Components (Days 1-2)                                       │ │
│ │                                                                                       │ │
│ │ Rationale: Start with simple, foundational components that other components depend    │ │
│ │ on.                                                                                   │ │
│ │                                                                                       │ │
│ │ 1. LoadingStates.svelte - Simple props only, no complex logic                         │ │
│ │ 2. Results.svelte - Simple component with basic prop usage                            │ │
│ │ 3. App.svelte - Root component, straightforward migration                             │ │
│ │ 4. Home.svelte - Simple route component                                               │ │
│ │                                                                                       │ │
│ │ Phase 2: Data & Route Components (Days 3-4)                                           │ │
│ │                                                                                       │ │
│ │ Rationale: Migrate components with data fetching and routing logic.                   │ │
│ │                                                                                       │ │
│ │ 5. Fetcher.svelte - Core data fetching logic, moderate complexity                     │ │
│ │ 6. Domain.svelte, Password.svelte, Username.svelte - Simple route components          │ │
│ │ 7. Email.svelte - Route with reactive statements                                      │ │
│ │                                                                                       │ │
│ │ Phase 3: Search & Navigation (Days 5-6)                                               │ │
│ │                                                                                       │ │
│ │ Rationale: Complex components with business logic and user interactions.              │ │
│ │                                                                                       │ │
│ │ 8. TabbedSearch.svelte - Main search interface                                        │ │
│ │ 9. NotFound.svelte - Static component                                                 │ │
│ │ 10. Breadcrumbs.svelte - Navigation component with store usage                        │ │
│ │                                                                                       │ │
│ │ Phase 4: Advanced Features (Days 7-9)                                                 │ │
│ │                                                                                       │ │
│ │ Rationale: Most complex components with advanced patterns and multiple concerns.      │ │
│ │                                                                                       │ │
│ │ 11. HIBP.svelte - Async component with error handling                                 │ │
│ │ 12. ErrorBoundary.svelte - Error handling patterns                                    │ │
│ │ 13. KeyboardShortcutsHelp.svelte - Complex modal component                            │ │
│ │ 14. Navbar.svelte - Complex search and settings logic                                 │ │
│ │                                                                                       │ │
│ │ Phase 5: Theme System (Days 10-11)                                                    │ │
│ │                                                                                       │ │
│ │ Rationale: Most complex component, defer until all dependencies are migrated.         │ │
│ │                                                                                       │ │
│ │ 15. ThemeSwitcher.svelte - Extremely complex with multiple features, filters, and     │ │
│ │ interactions                                                                          │ │
│ │                                                                                       │ │
│ │ Key Migration Patterns Identified                                                     │ │
│ │                                                                                       │ │
│ │ Pattern 1: Simple Prop Migration                                                      │ │
│ │                                                                                       │ │
│ │ // Before (Svelte 4)                                                                  │ │
│ │ export let message: string = '';                                                      │ │
│ │ export let type: 'spinner' | 'skeleton' | 'dots' = 'spinner';                         │ │
│ │                                                                                       │ │
│ │ // After (Svelte 5)                                                                   │ │
│ │ interface Props {                                                                     │ │
│ │     message?: string;                                                                 │ │
│ │     type?: 'spinner' | 'skeleton' | 'dots';                                           │ │
│ │ }                                                                                     │ │
│ │ let { message = '', type = 'spinner' }: Props = $props();                             │ │
│ │                                                                                       │ │
│ │ Pattern 2: Store Usage (No Change Needed)                                             │ │
│ │                                                                                       │ │
│ │ // Stores work the same in Svelte 5                                                   │ │
│ │ $: if (params.email) {                                                                │ │
│ │     breadcrumbs.addFromLocation(`Email: ${decodeURIComponent(params.email)}`);        │ │
│ │ }                                                                                     │ │
│ │                                                                                       │ │
│ │ Pattern 3: Event Handler Conversion                                                   │ │
│ │                                                                                       │ │
│ │ // Before                                                                             │ │
│ │ on:click={handler}                                                                    │ │
│ │                                                                                       │ │
│ │ // After                                                                              │ │
│ │ onclick={handler}                                                                     │ │
│ │                                                                                       │ │
│ │ Pattern 4: Reactive Statement Preservation                                            │ │
│ │                                                                                       │ │
│ │ // These continue to work in Svelte 5                                                 │ │
│ │ $: endpoint = `/api/v1/emails/${email}?${$querystring}`;                              │ │
│ │ $: if (params.email) {                                                                │ │
│ │     breadcrumbs.addFromLocation(`Email: ${decodeURIComponent(params.email)}`);        │ │
│ │ }                                                                                     │ │
│ │                                                                                       │ │
│ │ Component Complexity Assessment                                                       │ │
│ │                                                                                       │ │
│ │ Simple (1-2 hours each):                                                              │ │
│ │ - LoadingStates, Results, Home, Domain, Password, Username, NotFound                  │ │
│ │                                                                                       │ │
│ │ Moderate (3-4 hours each):                                                            │ │
│ │ - App, Fetcher, Email, TabbedSearch, Breadcrumbs, HIBP                                │ │
│ │                                                                                       │ │
│ │ Complex (6-8 hours each):                                                             │ │
│ │ - ErrorBoundary, KeyboardShortcutsHelp, Navbar                                        │ │
│ │                                                                                       │ │
│ │ Very Complex (12-16 hours):                                                           │ │
│ │ - ThemeSwitcher (advanced filtering, search, theme management)                        │ │
│ │                                                                                       │ │
│ │ Architectural Considerations                                                          │ │
│ │                                                                                       │ │
│ │ Dependencies                                                                          │ │
│ │                                                                                       │ │
│ │ - Most components have minimal dependencies on each other                             │ │
│ │ - Store usage remains unchanged                                                       │ │
│ │ - shadcn-svelte components already use Svelte 5 patterns                              │ │
│ │ - Router and lifecycle hooks work similarly                                           │ │
│ │                                                                                       │ │
│ │ Testing Strategy                                                                      │ │
│ │                                                                                       │ │
│ │ - Migrate and test one component at a time                                            │ │
│ │ - Ensure the application remains functional after each component migration            │ │
│ │ - Focus on preserving existing behavior exactly                                       │ │
│ │                                                                                       │ │
│ │ Risk Assessment                                                                       │ │
│ │                                                                                       │ │
│ │ - Low Risk: Simple presentational components                                          │ │
│ │ - Medium Risk: Components with complex reactive statements                            │ │
│ │ - High Risk: ThemeSwitcher due to complexity and multiple features                    │ │
│ │                                                                                       │ │
│ │ Timeline Estimate                                                                     │ │
│ │                                                                                       │ │
│ │ - Total Effort: 11-15 working days                                                    │ │
│ │ - Recommended Approach: 1-2 components per day with thorough testing                  │ │
│ │ - Critical Path: Core components → Data components → Feature components → Theme       │ │
│ │ system                                                                                │ │
│ │                                                                                       │ │
│ │ This migration plan prioritizes stability and incremental progress, ensuring the      │ │
│ │ application remains functional throughout the process.
