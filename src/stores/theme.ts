import { writable } from 'svelte/store';
import type { Theme, ThemeInfo } from '../config/themes';
import { themes as allThemes, THEME_CLASSES as THEME_CLASSES_IMPORT } from '../config/themes';

export type { Theme, ThemeInfo };

// Theme classes for CSS cleanup
export const THEME_CLASSES = THEME_CLASSES_IMPORT;

// Cache for loaded themes
const themeCache = new Map<Theme, ThemeInfo>();
allThemes.forEach(theme => themeCache.set(theme.value, theme));


function createThemeStore() {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  // Get initial theme from localStorage or default to system
  const rawStoredTheme = isBrowser ? localStorage.getItem('theme') : null;
  const validThemes = allThemes.map(t => t.value);
  const storedTheme = (rawStoredTheme && validThemes.includes(rawStoredTheme as Theme))
    ? rawStoredTheme as Theme
    : 'system';

  // If we had to reset an invalid theme, update localStorage
  if (isBrowser && rawStoredTheme && rawStoredTheme !== storedTheme) {
    localStorage.setItem('theme', storedTheme);
  }
  
  const { subscribe, set } = writable<Theme>(storedTheme);

  return {
    subscribe,
    setTheme: async (theme: Theme) => {
      if (isBrowser) {
        localStorage.setItem('theme', theme);
      }
      set(theme);
      // Get current dark mode value
      const currentDarkMode = isBrowser ? localStorage.getItem('darkMode') === 'true' : false;
      await applyTheme(theme, currentDarkMode);
    },
    init: async () => {
      if (!isBrowser) return;

      // Get current dark mode value
      const currentDarkMode = localStorage.getItem('darkMode') === 'true';
      await applyTheme(storedTheme, currentDarkMode);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', async () => {
        const currentTheme = localStorage.getItem('theme') as Theme;
        if (currentTheme === 'system') {
          const currentDarkMode = localStorage.getItem('darkMode') === 'true';
          await applyTheme('system', currentDarkMode);
        }
      });
    },
  };
}

function createDarkModeStore() {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';
  const storedDarkMode = isBrowser ? localStorage.getItem('darkMode') === 'true' : false;
  const store = writable(storedDarkMode);

  return {
    subscribe: store.subscribe,
    toggle: async () => {
      if (!isBrowser) return;

      const currentValue = localStorage.getItem('darkMode') === 'true';
      const newValue = !currentValue;
      localStorage.setItem('darkMode', String(newValue));
      store.set(newValue);
      const currentTheme = localStorage.getItem('theme') as Theme;
      await applyTheme(currentTheme || 'system', newValue);
    },
    set: async (value: boolean) => {
      if (!isBrowser) return;

      localStorage.setItem('darkMode', String(value));
      store.set(value);
      const currentTheme = localStorage.getItem('theme') as Theme;
      await applyTheme(currentTheme || 'system', value);
    }
  };
}

async function applyTheme(theme: Theme, darkMode: boolean) {
  const root = document.documentElement;

  // Validate theme - fallback to system if invalid
  const validThemes = allThemes.map(t => t.value);
  if (!validThemes.includes(theme)) {
    console.warn(`Invalid theme "${theme}", falling back to system`);
    theme = 'system';
  }

  // Remove all theme classes
  root.classList.remove(...THEME_CLASSES);

  let shouldBeDark = darkMode;

  if (theme === 'system') {
    // For system theme, use the dark mode toggle to override system preference if needed
    shouldBeDark = darkMode;
  } else {
    // Theme is already cached from the main themes file
    // Apply custom theme class for all other themes
    root.classList.add(`theme-${theme}`);
    
    // Some themes might force dark mode
    if (theme === 'midnight-bloom') {
      shouldBeDark = true;
    }
  }

  // Apply dark mode if needed
  if (shouldBeDark) {
    root.classList.add('dark');
  }
}

// Helper function to get loaded themes
export async function getLoadedThemes(): Promise<ThemeInfo[]> {
  return Array.from(themeCache.values());
}

// Import all themes from the main themes file
import { themes as allAvailableThemes } from '../config/themes';
import { writable as writableThemes, derived } from 'svelte/store';

// Create a store with all themes immediately available
const allThemesList = writableThemes<ThemeInfo[]>(allAvailableThemes);

// All themes are now immediately available

export const themes = derived(allThemesList, $themes => $themes);

// Create stores
export const isDarkMode = createDarkModeStore();
export const theme = createThemeStore();
