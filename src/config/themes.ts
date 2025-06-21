export type Theme = 
  | 'system'
  | 'modern-minimal'
  | 't3-chat'
  | 'twitter'
  | 'mocha-mousse'
  | 'bubblegum'
  | 'amethyst-haze'
  | 'notebook'
  | 'doom-64'
  | 'catppuccin'
  | 'graphite'
  | 'perpetuity'
  | 'kodama-grove'
  | 'cosmic-night'
  | 'tangerine'
  | 'quantum-rose'
  | 'nature'
  | 'bold-tech'
  | 'elegant-luxury'
  | 'amber-minimal'
  | 'supabase'
  | 'neo-brutalism'
  | 'solar-dusk'
  | 'claymorphism'
  | 'cyberpunk'
  | 'pastel-dreams'
  | 'clean-slate'
  | 'caffeine'
  | 'ocean-breeze'
  | 'retro-arcade'
  | 'midnight-bloom'
  | 'candyland'
  | 'northern-lights'
  | 'vintage-paper'
  | 'sunset-horizon'
  | 'starry-night'
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

export const THEME_CLASSES = [
  'dark',
  'theme-modern-minimal',
  'theme-t3-chat', 
  'theme-twitter',
  'theme-mocha-mousse',
  'theme-bubblegum',
  'theme-amethyst-haze',
  'theme-notebook',
  'theme-doom-64',
  'theme-catppuccin',
  'theme-graphite',
  'theme-perpetuity',
  'theme-kodama-grove',
  'theme-cosmic-night',
  'theme-tangerine',
  'theme-quantum-rose',
  'theme-nature',
  'theme-bold-tech',
  'theme-elegant-luxury',
  'theme-amber-minimal',
  'theme-supabase',
  'theme-neo-brutalism',
  'theme-solar-dusk',
  'theme-claymorphism',
  'theme-cyberpunk',
  'theme-pastel-dreams',
  'theme-clean-slate',
  'theme-caffeine',
  'theme-ocean-breeze',
  'theme-retro-arcade',
  'theme-midnight-bloom',
  'theme-candyland',
  'theme-northern-lights',
  'theme-vintage-paper',
  'theme-sunset-horizon',
  'theme-starry-night',
  'theme-claude',
  'theme-vercel',
  'theme-mono'
];

export const themes: ThemeInfo[] = [
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
  },
  {
    name: 'Modern Minimal',
    value: 'modern-minimal',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(59, 130, 246)',
      secondary: 'rgb(243, 244, 246)'
    },
    colorsDark: {
      background: 'rgb(23, 23, 23)',
      primary: 'rgb(59, 130, 246)',
      secondary: 'rgb(38, 38, 38)'
    }
  },
  {
    name: 'T3 Chat',
    value: 't3-chat',
    colors: {
      background: 'rgb(250, 245, 250)',
      primary: 'rgb(168, 67, 112)',
      secondary: 'rgb(241, 196, 230)'
    },
    colorsDark: {
      background: 'rgb(34, 29, 39)',
      primary: 'rgb(163, 0, 76)',
      secondary: 'rgb(54, 45, 61)'
    }
  },
  {
    name: 'Twitter',
    value: 'twitter',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(30, 157, 241)',
      secondary: 'rgb(15, 20, 25)'
    },
    colorsDark: {
      background: 'rgb(0, 0, 0)',
      primary: 'rgb(28, 156, 240)',
      secondary: 'rgb(240, 243, 244)'
    }
  },
  {
    name: 'Mocha Mousse',
    value: 'mocha-mousse',
    colors: {
      background: 'rgb(241, 240, 229)',
      primary: 'rgb(163, 119, 100)',
      secondary: 'rgb(186, 171, 146)'
    },
    colorsDark: {
      background: 'rgb(45, 37, 33)',
      primary: 'rgb(195, 158, 136)',
      secondary: 'rgb(138, 101, 90)'
    }
  },
  {
    name: 'Bubblegum',
    value: 'bubblegum',
    colors: {
      background: 'rgb(246, 230, 238)',
      primary: 'rgb(208, 79, 153)',
      secondary: 'rgb(138, 207, 209)'
    },
    colorsDark: {
      background: 'rgb(18, 36, 46)',
      primary: 'rgb(251, 226, 167)',
      secondary: 'rgb(228, 162, 177)'
    }
  },
  {
    name: 'Amethyst Haze',
    value: 'amethyst-haze',
    colors: {
      background: 'rgb(248, 247, 250)',
      primary: 'rgb(138, 121, 171)',
      secondary: 'rgb(223, 217, 236)'
    },
    colorsDark: {
      background: 'rgb(26, 24, 35)',
      primary: 'rgb(169, 149, 201)',
      secondary: 'rgb(90, 83, 112)'
    }
  },
  {
    name: 'Notebook',
    value: 'notebook',
    colors: {
      background: 'rgb(249, 249, 249)',
      primary: 'rgb(96, 96, 96)',
      secondary: 'rgb(222, 222, 222)'
    },
    colorsDark: {
      background: 'rgb(43, 43, 43)',
      primary: 'rgb(176, 176, 176)',
      secondary: 'rgb(90, 90, 90)'
    }
  },
  {
    name: 'Doom 64',
    value: 'doom-64',
    colors: {
      background: 'rgb(204, 204, 204)',
      primary: 'rgb(183, 28, 28)',
      secondary: 'rgb(85, 107, 47)'
    },
    colorsDark: {
      background: 'rgb(26, 26, 26)',
      primary: 'rgb(229, 57, 53)',
      secondary: 'rgb(104, 159, 56)'
    }
  },
  {
    name: 'Catppuccin',
    value: 'catppuccin',
    colors: {
      background: 'rgb(239, 241, 245)',
      primary: 'rgb(136, 57, 239)',
      secondary: 'rgb(204, 208, 218)'
    },
    colorsDark: {
      background: 'rgb(24, 24, 37)',
      primary: 'rgb(203, 166, 247)',
      secondary: 'rgb(88, 91, 112)'
    }
  },
  {
    name: 'Graphite',
    value: 'graphite',
    colors: {
      background: 'rgb(240, 240, 240)',
      primary: 'rgb(96, 96, 96)',
      secondary: 'rgb(224, 224, 224)'
    },
    colorsDark: {
      background: 'rgb(26, 26, 26)',
      primary: 'rgb(160, 160, 160)',
      secondary: 'rgb(48, 48, 48)'
    }
  },
  {
    name: 'Perpetuity',
    value: 'perpetuity',
    colors: {
      background: 'rgb(232, 240, 240)',
      primary: 'rgb(6, 133, 142)',
      secondary: 'rgb(217, 234, 234)'
    },
    colorsDark: {
      background: 'rgb(10, 26, 32)',
      primary: 'rgb(77, 232, 232)',
      secondary: 'rgb(22, 73, 85)'
    }
  },
  {
    name: 'Kodama Grove',
    value: 'kodama-grove',
    colors: {
      background: 'rgb(228, 215, 176)',
      primary: 'rgb(141, 157, 79)',
      secondary: 'rgb(222, 206, 160)'
    },
    colorsDark: {
      background: 'rgb(58, 53, 41)',
      primary: 'rgb(138, 159, 123)',
      secondary: 'rgb(90, 83, 69)'
    }
  },
  {
    name: 'Cosmic Night',
    value: 'cosmic-night',
    colors: {
      background: 'rgb(245, 245, 255)',
      primary: 'rgb(110, 86, 207)',
      secondary: 'rgb(228, 223, 255)'
    },
    colorsDark: {
      background: 'rgb(15, 15, 26)',
      primary: 'rgb(164, 143, 255)',
      secondary: 'rgb(45, 43, 85)'
    }
  },
  {
    name: 'Tangerine',
    value: 'tangerine',
    colors: {
      background: 'rgb(232, 235, 237)',
      primary: 'rgb(224, 93, 56)',
      secondary: 'rgb(243, 244, 246)'
    },
    colorsDark: {
      background: 'rgb(28, 36, 51)',
      primary: 'rgb(224, 93, 56)',
      secondary: 'rgb(42, 48, 62)'
    }
  },
  {
    name: 'Quantum Rose',
    value: 'quantum-rose',
    colors: {
      background: 'rgb(255, 240, 248)',
      primary: 'rgb(230, 6, 122)',
      secondary: 'rgb(255, 214, 255)'
    },
    colorsDark: {
      background: 'rgb(26, 9, 34)',
      primary: 'rgb(255, 107, 239)',
      secondary: 'rgb(70, 32, 79)'
    }
  },
  {
    name: 'Nature',
    value: 'nature',
    colors: {
      background: 'rgb(248, 245, 240)',
      primary: 'rgb(46, 125, 50)',
      secondary: 'rgb(232, 245, 233)'
    },
    colorsDark: {
      background: 'rgb(28, 42, 31)',
      primary: 'rgb(76, 175, 80)',
      secondary: 'rgb(62, 74, 61)'
    }
  },
  {
    name: 'Bold Tech',
    value: 'bold-tech',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(139, 92, 246)',
      secondary: 'rgb(243, 240, 255)'
    },
    colorsDark: {
      background: 'rgb(15, 23, 42)',
      primary: 'rgb(139, 92, 246)',
      secondary: 'rgb(30, 27, 75)'
    }
  },
  {
    name: 'Elegant Luxury',
    value: 'elegant-luxury',
    colors: {
      background: 'rgb(250, 247, 245)',
      primary: 'rgb(155, 44, 44)',
      secondary: 'rgb(253, 242, 214)'
    },
    colorsDark: {
      background: 'rgb(28, 25, 23)',
      primary: 'rgb(185, 28, 28)',
      secondary: 'rgb(146, 64, 14)'
    }
  },
  {
    name: 'Amber Minimal',
    value: 'amber-minimal',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(245, 158, 11)',
      secondary: 'rgb(243, 244, 246)'
    },
    colorsDark: {
      background: 'rgb(23, 23, 23)',
      primary: 'rgb(245, 158, 11)',
      secondary: 'rgb(38, 38, 38)'
    }
  },
  {
    name: 'Supabase',
    value: 'supabase',
    colors: {
      background: 'rgb(252, 252, 252)',
      primary: 'rgb(114, 227, 173)',
      secondary: 'rgb(253, 253, 253)'
    },
    colorsDark: {
      background: 'rgb(18, 18, 18)',
      primary: 'rgb(0, 98, 57)',
      secondary: 'rgb(36, 36, 36)'
    }
  },
  {
    name: 'Neo Brutalism',
    value: 'neo-brutalism',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(255, 51, 51)',
      secondary: 'rgb(255, 255, 0)'
    },
    colorsDark: {
      background: 'rgb(0, 0, 0)',
      primary: 'rgb(255, 102, 102)',
      secondary: 'rgb(255, 255, 51)'
    }
  },
  {
    name: 'Solar Dusk',
    value: 'solar-dusk',
    colors: {
      background: 'rgb(253, 251, 247)',
      primary: 'rgb(180, 83, 9)',
      secondary: 'rgb(228, 192, 144)'
    },
    colorsDark: {
      background: 'rgb(28, 25, 23)',
      primary: 'rgb(249, 115, 22)',
      secondary: 'rgb(87, 83, 78)'
    }
  },
  {
    name: 'Claymorphism',
    value: 'claymorphism',
    colors: {
      background: 'rgb(231, 229, 228)',
      primary: 'rgb(99, 102, 241)',
      secondary: 'rgb(214, 211, 209)'
    },
    colorsDark: {
      background: 'rgb(30, 27, 24)',
      primary: 'rgb(129, 140, 248)',
      secondary: 'rgb(58, 54, 51)'
    }
  },
  {
    name: 'Cyberpunk',
    value: 'cyberpunk',
    colors: {
      background: 'rgb(248, 249, 250)',
      primary: 'rgb(255, 0, 200)',
      secondary: 'rgb(240, 240, 255)'
    },
    colorsDark: {
      background: 'rgb(12, 12, 29)',
      primary: 'rgb(255, 0, 200)',
      secondary: 'rgb(30, 30, 63)'
    }
  },
  {
    name: 'Pastel Dreams',
    value: 'pastel-dreams',
    colors: {
      background: 'rgb(247, 243, 249)',
      primary: 'rgb(167, 139, 250)',
      secondary: 'rgb(233, 216, 253)'
    },
    colorsDark: {
      background: 'rgb(28, 25, 23)',
      primary: 'rgb(192, 170, 253)',
      secondary: 'rgb(63, 50, 74)'
    }
  },
  {
    name: 'Clean Slate',
    value: 'clean-slate',
    colors: {
      background: 'rgb(248, 250, 252)',
      primary: 'rgb(99, 102, 241)',
      secondary: 'rgb(229, 231, 235)'
    },
    colorsDark: {
      background: 'rgb(15, 23, 42)',
      primary: 'rgb(129, 140, 248)',
      secondary: 'rgb(45, 55, 72)'
    }
  },
  {
    name: 'Caffeine',
    value: 'caffeine',
    colors: {
      background: 'rgb(249, 249, 249)',
      primary: 'rgb(100, 74, 64)',
      secondary: 'rgb(255, 223, 181)'
    },
    colorsDark: {
      background: 'rgb(17, 17, 17)',
      primary: 'rgb(255, 224, 194)',
      secondary: 'rgb(57, 48, 40)'
    }
  },
  {
    name: 'Ocean Breeze',
    value: 'ocean-breeze',
    colors: {
      background: 'rgb(240, 248, 255)',
      primary: 'rgb(34, 197, 94)',
      secondary: 'rgb(224, 242, 254)'
    },
    colorsDark: {
      background: 'rgb(15, 23, 42)',
      primary: 'rgb(52, 211, 153)',
      secondary: 'rgb(45, 55, 72)'
    }
  },
  {
    name: 'Retro Arcade',
    value: 'retro-arcade',
    colors: {
      background: 'rgb(253, 246, 227)',
      primary: 'rgb(211, 54, 130)',
      secondary: 'rgb(42, 161, 152)'
    },
    colorsDark: {
      background: 'rgb(0, 43, 54)',
      primary: 'rgb(211, 54, 130)',
      secondary: 'rgb(42, 161, 152)'
    }
  },
  {
    name: 'Midnight Bloom',
    value: 'midnight-bloom',
    colors: {
      background: 'rgb(249, 249, 249)',
      primary: 'rgb(108, 92, 231)',
      secondary: 'rgb(161, 201, 242)'
    },
    colorsDark: {
      background: 'rgb(26, 29, 35)',
      primary: 'rgb(108, 92, 231)',
      secondary: 'rgb(75, 0, 130)'
    }
  },
  {
    name: 'Candyland',
    value: 'candyland',
    colors: {
      background: 'rgb(247, 249, 250)',
      primary: 'rgb(255, 192, 203)',
      secondary: 'rgb(135, 206, 235)'
    },
    colorsDark: {
      background: 'rgb(26, 29, 35)',
      primary: 'rgb(255, 153, 204)',
      secondary: 'rgb(51, 204, 51)'
    }
  },
  {
    name: 'Northern Lights',
    value: 'northern-lights',
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
  },
  {
    name: 'Vintage Paper',
    value: 'vintage-paper',
    colors: {
      background: 'rgb(245, 241, 230)',
      primary: 'rgb(166, 124, 82)',
      secondary: 'rgb(226, 216, 195)'
    },
    colorsDark: {
      background: 'rgb(45, 38, 33)',
      primary: 'rgb(192, 160, 128)',
      secondary: 'rgb(74, 64, 57)'
    }
  },
  {
    name: 'Sunset Horizon',
    value: 'sunset-horizon',
    colors: {
      background: 'rgb(255, 249, 245)',
      primary: 'rgb(255, 126, 95)',
      secondary: 'rgb(255, 237, 234)'
    },
    colorsDark: {
      background: 'rgb(42, 32, 36)',
      primary: 'rgb(255, 126, 95)',
      secondary: 'rgb(70, 58, 65)'
    }
  },
  {
    name: 'Starry Night',
    value: 'starry-night',
    colors: {
      background: 'rgb(245, 247, 250)',
      primary: 'rgb(58, 91, 160)',
      secondary: 'rgb(247, 200, 115)'
    },
    colorsDark: {
      background: 'rgb(24, 26, 36)',
      primary: 'rgb(58, 91, 160)',
      secondary: 'rgb(255, 224, 102)'
    }
  },
  {
    name: 'Claude',
    value: 'claude',
    colors: {
      background: 'rgb(250, 249, 245)',
      primary: 'rgb(201, 100, 66)',
      secondary: 'rgb(233, 230, 220)'
    },
    colorsDark: {
      background: 'rgb(38, 38, 36)',
      primary: 'rgb(217, 119, 87)',
      secondary: 'rgb(250, 249, 245)'
    }
  },
  {
    name: 'Vercel',
    value: 'vercel',
    colors: {
      background: 'rgb(252, 252, 252)',
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgb(240, 240, 240)'
    },
    colorsDark: {
      background: 'rgb(0, 0, 0)',
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(64, 64, 64)'
    }
  },
  {
    name: 'Mono',
    value: 'mono',
    colors: {
      background: 'rgb(255, 255, 255)',
      primary: 'rgb(115, 115, 115)',
      secondary: 'rgb(245, 245, 245)'
    },
    colorsDark: {
      background: 'rgb(10, 10, 10)',
      primary: 'rgb(115, 115, 115)',
      secondary: 'rgb(38, 38, 38)'
    }
  }
];