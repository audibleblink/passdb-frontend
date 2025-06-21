// Design tokens for semantic styling
export const semanticClasses = {
  // Backgrounds
  'bg-base': 'bg-background',
  'bg-elevated': 'bg-card',
  'bg-overlay': 'bg-popover',
  'bg-surface': 'bg-secondary',
  'bg-surface-hover': 'hover:bg-secondary/80',
  
  // Text
  'text-primary': 'text-foreground',
  'text-secondary': 'text-muted-foreground',
  'text-tertiary': 'text-muted-foreground/60',
  'text-inverse': 'text-background',
  'text-accent': 'text-accent-foreground',
  'text-brand': 'text-primary',
  
  // Borders
  'border-default': 'border-border',
  'border-emphasis': 'border-primary',
  'border-subtle': 'border-border/50',
  'border-muted': 'border-muted',
  
  // Interactive states
  'state-hover': 'hover:bg-accent hover:text-accent-foreground',
  'state-active': 'bg-primary text-primary-foreground',
  'state-focus': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'state-disabled': 'disabled:cursor-not-allowed disabled:opacity-50',
  
  // Buttons
  'btn-primary': 'bg-primary text-primary-foreground hover:bg-primary/90',
  'btn-secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  'btn-outline': 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  'btn-ghost': 'hover:bg-accent hover:text-accent-foreground',
  'btn-destructive': 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  
  // Cards and surfaces
  'card-base': 'bg-card text-card-foreground',
  'card-border': 'border border-border',
  'card-shadow': 'shadow-sm',
  'card-hover': 'hover:shadow-md transition-shadow',
  
  // Form elements
  'input-base': 'bg-background border border-input text-foreground',
  'input-focus': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'input-error': 'border-destructive text-destructive',
  'input-disabled': 'disabled:cursor-not-allowed disabled:opacity-50',
  
  // Status indicators
  'status-success': 'text-green-600 dark:text-green-400',
  'status-warning': 'text-yellow-600 dark:text-yellow-400',
  'status-error': 'text-destructive',
  'status-info': 'text-blue-600 dark:text-blue-400',
  
  // Loading states
  'loading-spinner': 'animate-spin text-muted-foreground',
  'loading-skeleton': 'animate-pulse bg-muted',
  'loading-dots': 'animate-bounce text-muted-foreground',
  
  // Navigation
  'nav-link': 'text-muted-foreground hover:text-foreground transition-colors',
  'nav-link-active': 'text-foreground bg-accent',
  'nav-brand': 'text-foreground font-semibold',
  
  // Tables
  'table-header': 'bg-muted/50 text-muted-foreground font-medium',
  'table-row': 'border-b border-border hover:bg-muted/50',
  'table-cell': 'text-foreground',
  
  // Badges and tags
  'badge-default': 'bg-secondary text-secondary-foreground',
  'badge-success': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'badge-warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'badge-error': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'badge-info': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
} as const;

export type SemanticClass = keyof typeof semanticClasses;

// Utility function to get semantic classes
export function getSemanticClass(className: SemanticClass): string {
  return semanticClasses[className];
}

// Utility function to combine semantic classes
export function combineSemanticClasses(...classNames: (SemanticClass | string)[]): string {
  return classNames
    .map(className => {
      if (typeof className === 'string' && className in semanticClasses) {
        return semanticClasses[className as SemanticClass];
      }
      return className;
    })
    .join(' ');
}

// Common component class combinations
export const componentClasses = {
  // Button variants
  buttonPrimary: combineSemanticClasses('btn-primary', 'state-focus', 'state-disabled'),
  buttonSecondary: combineSemanticClasses('btn-secondary', 'state-focus', 'state-disabled'),
  buttonOutline: combineSemanticClasses('btn-outline', 'state-focus', 'state-disabled'),
  buttonGhost: combineSemanticClasses('btn-ghost', 'state-focus', 'state-disabled'),
  buttonDestructive: combineSemanticClasses('btn-destructive', 'state-focus', 'state-disabled'),
  
  // Card variants
  cardBase: combineSemanticClasses('card-base', 'card-border', 'card-shadow'),
  cardInteractive: combineSemanticClasses('card-base', 'card-border', 'card-shadow', 'card-hover'),
  
  // Input variants
  inputBase: combineSemanticClasses('input-base', 'input-focus', 'input-disabled'),
  inputError: combineSemanticClasses('input-base', 'input-error', 'input-focus', 'input-disabled'),
  
  // Navigation
  navLink: combineSemanticClasses('nav-link'),
  navLinkActive: combineSemanticClasses('nav-link-active'),
  
  // Table
  tableHeader: combineSemanticClasses('table-header'),
  tableRow: combineSemanticClasses('table-row'),
  tableCell: combineSemanticClasses('table-cell'),
} as const;