import Mousetrap from 'mousetrap';
import { goto } from '$app/navigation';
import { theme, themes, isDarkMode } from '../stores/theme';
import { breadcrumbs } from '../stores/breadcrumbs';
import { get } from 'svelte/store';

export type ShortcutContext = 'global' | 'results' | 'table';

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  context?: ShortcutContext;
}

export interface ShortcutGroup {
  title: string;
  shortcuts: KeyboardShortcut[];
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private currentContext: string = 'global';
  private helpModalOpen = false;
  private onShowHelp?: () => void;
  private onHideHelp?: () => void;

  constructor() {
    this.setupGlobalShortcuts();
  }

  private setupGlobalShortcuts() {
    // Help modal
    this.bind('?', 'Show keyboard shortcuts help', () => {
      this.toggleHelp();
    }, 'global');

    // Navigation
    this.bind('/', 'Focus search bar', () => {
      this.focusSearchBar();
    }, 'global');

    this.bind('g h', 'Go to home page', () => {
      goto('/');
    }, 'global');

    this.bind('ctrl+o', 'Navigate back through breadcrumbs', () => {
      this.navigateBack();
    }, 'global');

    // Theme shortcuts
    this.bind('] t', 'Next theme', () => {
      this.nextTheme();
    }, 'global');

    this.bind('[ t', 'Previous theme', () => {
      this.previousTheme();
    }, 'global');

    this.bind('c t', 'Open theme picker', () => {
      this.openThemePicker();
    }, 'global');

    this.bind('c m', 'Toggle dark/light mode', () => {
      isDarkMode.toggle();
    }, 'global');
  }

  setupResultsShortcuts() {
    this.setContext('results');

    // Filter focus
    this.bind('f', 'Focus filter input', () => {
      this.focusFilter();
    }, 'results');

    // Pagination
    this.bind('] ]', 'Next page', () => {
      this.nextPage();
    }, 'results');

    this.bind('[ [', 'Previous page', () => {
      this.previousPage();
    }, 'results');
  }

  setupTableShortcuts() {
    this.setContext('table');

    // Table navigation
    this.bind('j', 'Focus next table row', () => {
      this.focusNextRow();
    }, 'table');

    this.bind('k', 'Focus previous table row', () => {
      this.focusPreviousRow();
    }, 'table');

    this.bind('h', 'Focus previous cell in row', () => {
      this.focusPreviousCell();
    }, 'table');

    this.bind('l', 'Focus next cell in row', () => {
      this.focusNextCell();
    }, 'table');

    this.bind('enter', 'Click active cell link', () => {
      this.clickActiveCell();
    }, 'table');
  }

  private bind(key: string, description: string, action: () => void, context: ShortcutContext = 'global') {
    const shortcut: KeyboardShortcut = { key, description, action, context };
    this.shortcuts.set(key, shortcut);
    
    Mousetrap.bind(key, (e) => {
      e.preventDefault();
      action();
      return false;
    });
  }

  private unbind(key: string) {
    Mousetrap.unbind(key);
    this.shortcuts.delete(key);
  }

  setContext(context: string) {
    this.currentContext = context;
  }

  // Global actions
  private toggleHelp() {
    this.helpModalOpen = !this.helpModalOpen;
    if (this.helpModalOpen && this.onShowHelp) {
      this.onShowHelp();
    } else if (!this.helpModalOpen && this.onHideHelp) {
      this.onHideHelp();
    }
  }

  private focusSearchBar() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  private navigateBack() {
    breadcrumbs.goBack();
  }

  private nextTheme() {
    const currentTheme = get(theme);
    const availableThemes = get(themes);
    const currentIndex = availableThemes.findIndex(t => t.value === currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    theme.setTheme(availableThemes[nextIndex].value);
  }

  private previousTheme() {
    const currentTheme = get(theme);
    const availableThemes = get(themes);
    const currentIndex = availableThemes.findIndex(t => t.value === currentTheme);
    const previousIndex = currentIndex === 0 ? availableThemes.length - 1 : currentIndex - 1;
    theme.setTheme(availableThemes[previousIndex].value);
  }

  private openThemePicker() {
    // This will trigger the theme switcher component - we'll implement this integration later
    const themeButton = document.querySelector('[data-theme-trigger]') as HTMLButtonElement;
    if (themeButton) {
      themeButton.click();
    }
  }

  // Results page actions
  private focusFilter() {
    const filterInput = document.querySelector('[data-filter-input]') as HTMLInputElement;
    if (filterInput) {
      filterInput.focus();
      filterInput.select();
    }
  }

  private nextPage() {
    const nextButton = document.querySelector('[data-pagination-next]') as HTMLButtonElement;
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
    }
  }

  private previousPage() {
    const prevButton = document.querySelector('[data-pagination-prev]') as HTMLButtonElement;
    if (prevButton && !prevButton.disabled) {
      prevButton.click();
    }
  }

  // Table navigation actions
  private focusNextRow() {
    const currentRow = document.querySelector('.table-row-focused') as HTMLElement;
    let nextRow: HTMLElement | null = null;

    if (currentRow) {
      nextRow = currentRow.nextElementSibling as HTMLElement;
    } else {
      // Focus first row if none focused
      nextRow = document.querySelector('[data-table-row]') as HTMLElement;
    }

    if (nextRow) {
      this.setRowFocus(nextRow);
    }
  }

  private focusPreviousRow() {
    const currentRow = document.querySelector('.table-row-focused') as HTMLElement;
    let prevRow: HTMLElement | null = null;

    if (currentRow) {
      prevRow = currentRow.previousElementSibling as HTMLElement;
    } else {
      // Focus last row if none focused
      const rows = document.querySelectorAll('[data-table-row]');
      prevRow = rows[rows.length - 1] as HTMLElement;
    }

    if (prevRow) {
      this.setRowFocus(prevRow);
    }
  }

  private focusNextCell() {
    const currentCell = document.querySelector('.table-cell-focused') as HTMLElement;
    let nextCell: HTMLElement | null = null;

    if (currentCell) {
      nextCell = currentCell.nextElementSibling as HTMLElement;
    } else {
      // Focus first cell in focused row
      const focusedRow = document.querySelector('.table-row-focused');
      if (focusedRow) {
        nextCell = focusedRow.querySelector('[data-table-cell]') as HTMLElement;
      }
    }

    if (nextCell) {
      this.setCellFocus(nextCell);
    }
  }

  private focusPreviousCell() {
    const currentCell = document.querySelector('.table-cell-focused') as HTMLElement;
    let prevCell: HTMLElement | null = null;

    if (currentCell) {
      prevCell = currentCell.previousElementSibling as HTMLElement;
    } else {
      // Focus last cell in focused row
      const focusedRow = document.querySelector('.table-row-focused');
      if (focusedRow) {
        const cells = focusedRow.querySelectorAll('[data-table-cell]');
        prevCell = cells[cells.length - 1] as HTMLElement;
      }
    }

    if (prevCell) {
      this.setCellFocus(prevCell);
    }
  }

  private clickActiveCell() {
    const activeCell = document.querySelector('.table-cell-focused') as HTMLElement;
    if (activeCell) {
      const link = activeCell.querySelector('a') as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    }
  }

  private setRowFocus(row: HTMLElement) {
    // Remove previous focus
    document.querySelectorAll('.table-row-focused').forEach(el => {
      el.classList.remove('table-row-focused');
    });
    document.querySelectorAll('.table-cell-focused').forEach(el => {
      el.classList.remove('table-cell-focused');
    });

    // Add focus to new row
    row.classList.add('table-row-focused');
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private setCellFocus(cell: HTMLElement) {
    // Remove previous cell focus
    document.querySelectorAll('.table-cell-focused').forEach(el => {
      el.classList.remove('table-cell-focused');
    });

    // Add focus to new cell
    cell.classList.add('table-cell-focused');
  }

  // Help modal management
  onHelpShow(callback: () => void) {
    this.onShowHelp = callback;
  }

  onHelpHide(callback: () => void) {
    this.onHideHelp = callback;
  }

  getShortcutGroups(): ShortcutGroup[] {
    // Always return all shortcuts, regardless of current context
    // This ensures the help modal shows complete information
    const allShortcuts = new Map<string, KeyboardShortcut>();
    
    // Add all currently bound shortcuts
    this.shortcuts.forEach((shortcut, key) => {
      allShortcuts.set(key, shortcut);
    });
    
    // Ensure we have all possible shortcuts by manually adding them if missing
    const possibleShortcuts: KeyboardShortcut[] = [
      { key: '?', description: 'Show keyboard shortcuts help', action: () => {}, context: 'global' },
      { key: '/', description: 'Focus search bar', action: () => {}, context: 'global' },
      { key: 'g h', description: 'Go to home page', action: () => {}, context: 'global' },
      { key: 'ctrl+o', description: 'Navigate back through breadcrumbs', action: () => {}, context: 'global' },
      { key: '] t', description: 'Next theme', action: () => {}, context: 'global' },
      { key: '[ t', description: 'Previous theme', action: () => {}, context: 'global' },
      { key: 'c t', description: 'Open theme picker', action: () => {}, context: 'global' },
      { key: 'c m', description: 'Toggle dark/light mode', action: () => {}, context: 'global' },
      { key: 'f', description: 'Focus filter input', action: () => {}, context: 'results' },
      { key: '] ]', description: 'Next page', action: () => {}, context: 'results' },
      { key: '[ [', description: 'Previous page', action: () => {}, context: 'results' },
      { key: 'j', description: 'Focus next table row', action: () => {}, context: 'table' },
      { key: 'k', description: 'Focus previous table row', action: () => {}, context: 'table' },
      { key: 'h', description: 'Focus previous cell in row', action: () => {}, context: 'table' },
      { key: 'l', description: 'Focus next cell in row', action: () => {}, context: 'table' },
      { key: 'enter', description: 'Click active cell link', action: () => {}, context: 'table' },
    ];
    
    // Add any missing shortcuts
    possibleShortcuts.forEach(shortcut => {
      if (!allShortcuts.has(shortcut.key)) {
        allShortcuts.set(shortcut.key, shortcut);
      }
    });

    const groups: ShortcutGroup[] = [
      {
        title: 'Navigation',
        shortcuts: Array.from(allShortcuts.values()).filter(s => 
          ['/', 'g h', 'ctrl+o'].includes(s.key)
        )
      },
      {
        title: 'Theme Management',
        shortcuts: Array.from(allShortcuts.values()).filter(s => 
          ['] t', '[ t', 'c t', 'c m'].includes(s.key)
        )
      },
      {
        title: 'Results Page',
        shortcuts: Array.from(allShortcuts.values()).filter(s => 
          ['f', '] ]', '[ ['].includes(s.key)
        )
      },
      {
        title: 'Table Navigation',
        shortcuts: Array.from(allShortcuts.values()).filter(s => 
          ['j', 'k', 'h', 'l', 'enter'].includes(s.key)
        )
      }
    ];

    return groups.filter(group => group.shortcuts.length > 0);
  }

  destroy() {
    // Unbind all shortcuts
    this.shortcuts.forEach((_, key) => {
      Mousetrap.unbind(key);
    });
    this.shortcuts.clear();
  }
}

// Create singleton instance
export const keyboardShortcuts = new KeyboardShortcutManager();