import { writable, derived } from 'svelte/store';
import type { Theme, ThemeInfo } from '../config/themes/index';
import { systemThemes, loadThemeGroup } from '../config/themes/index';

// Store for all loaded themes
const allThemes = writable<ThemeInfo[]>(systemThemes);

// Load all available themes on startup
async function loadInitialThemes() {
  try {
    // Load all available themes (currently just the popular group)
    const allAvailableThemes = await loadThemeGroup('popular');
    allThemes.update(themes => [...themes.filter(t => t.value === 'system'), ...allAvailableThemes]);
  } catch (error) {
    console.warn('Failed to load themes:', error);
  }
}

// Load themes on module initialization
if (typeof window !== 'undefined') {
  loadInitialThemes();
}

// Export store for components
export const availableThemes = derived(allThemes, $themes => $themes);

// Function to load more themes
export async function loadMoreThemes(groupName: 'colorful' | 'professional' | 'creative') {
  try {
    const newThemes = await loadThemeGroup(groupName);
    allThemes.update(themes => {
      const existing = new Set(themes.map(t => t.value));
      const filtered = newThemes.filter(t => !existing.has(t.value));
      return [...themes, ...filtered];
    });
  } catch (error) {
    console.warn(`Failed to load ${groupName} themes:`, error);
  }
}

// Get theme by value
export function getThemeByValue(themes: ThemeInfo[], value: Theme): ThemeInfo | undefined {
  return themes.find(t => t.value === value);
}

// Get current theme info
export function getCurrentTheme(themes: ThemeInfo[], currentTheme: Theme): ThemeInfo {
  return getThemeByValue(themes, currentTheme) || themes[0];
}

// Filter themes
export function filterThemes(themes: ThemeInfo[], searchTerm: string): ThemeInfo[] {
  if (!searchTerm) return themes;
  const term = searchTerm.toLowerCase();
  return themes.filter(theme => 
    theme.name.toLowerCase().includes(term) || 
    theme.value.toLowerCase().includes(term)
  );
}

// Theme navigation
export function getNextTheme(themes: ThemeInfo[], current: Theme): Theme {
  const currentIndex = themes.findIndex(t => t.value === current);
  const nextIndex = (currentIndex + 1) % themes.length;
  return themes[nextIndex].value;
}

export function getPreviousTheme(themes: ThemeInfo[], current: Theme): Theme {
  const currentIndex = themes.findIndex(t => t.value === current);
  const previousIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
  return themes[previousIndex].value;
}