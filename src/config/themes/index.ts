export type Theme = 
  | 'system'
  | 'catppuccin'
  | 'claude'
  | 'vercel'
  | 'mono';

export interface ThemeInfo {
  name: string;
  value: Theme;
  colors: {
    background: string;
    primary: string;
    secondary: string;
  };
  colorsDark?: {
    background: string;
    primary: string;
    secondary: string;
  };
}

// Core system themes (always loaded)
export const systemThemes: ThemeInfo[] = [
  {
    name: 'Default',
    value: 'system',
    colors: {
      background: 'rgb(249, 249, 250)',
      primary: 'rgb(52, 168, 90)',
      secondary: 'rgb(100, 149, 237)'
    },
    colorsDark: {
      background: 'rgb(26, 29, 35)',
      primary: 'rgb(52, 168, 90)',
      secondary: 'rgb(70, 130, 180)'
    }
  }
];

// Theme groups for lazy loading (only actual themes)
export const themeGroups = {
  popular: ['catppuccin', 'claude', 'vercel', 'mono'],
  colorful: [], // No colorful themes available yet
  professional: [], // No professional themes available yet
  creative: [] // No creative themes available yet
} as const;

// Lazy theme loader
export async function loadTheme(themeName: Theme): Promise<ThemeInfo | null> {
  if (themeName === 'system') {
    return systemThemes[0];
  }

  try {
    const themeModule = await import(`./themes/${themeName}.js`);
    return themeModule.theme;
  } catch (error) {
    console.warn(`Failed to load theme: ${themeName}`, error);
    return null;
  }
}

// Load multiple themes
export async function loadThemes(themeNames: Theme[]): Promise<ThemeInfo[]> {
  const promises = themeNames.map(loadTheme);
  const results = await Promise.all(promises);
  return results.filter((theme): theme is ThemeInfo => theme !== null);
}

// Load theme group
export async function loadThemeGroup(groupName: keyof typeof themeGroups): Promise<ThemeInfo[]> {
  return loadThemes([...themeGroups[groupName]]);
}

// Get all available theme names (only actual themes)
export function getAvailableThemes(): Theme[] {
  return [
    'system',
    'catppuccin',
    'claude', 
    'vercel',
    'mono'
  ];
}