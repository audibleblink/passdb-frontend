import { a3 as current_component, E as spread_attributes, X as clsx, F as bind_props, y as pop, w as push, O as sanitize_props, a4 as rest_props, Q as fallback, T as ensure_array_like, Y as element, P as slot } from "./index.js";
import { c as cn, b as breadcrumbs } from "./breadcrumbs.js";
import { tv } from "tailwind-variants";
import Mousetrap from "mousetrap";
import { g as goto } from "./client.js";
import { i as derived, w as writable, j as get } from "./exports.js";
function lifecycle_function_unavailable(name) {
  const error = new Error(`lifecycle_function_unavailable
\`${name}(...)\` is not available on the server
https://svelte.dev/e/lifecycle_function_unavailable`);
  error.name = "Svelte error";
  throw error;
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function mount() {
  lifecycle_function_unavailable("mount");
}
function unmount() {
  lifecycle_function_unavailable("unmount");
}
async function tick() {
}
const THEME_CLASSES$1 = [
  "dark",
  "theme-modern-minimal",
  "theme-t3-chat",
  "theme-twitter",
  "theme-mocha-mousse",
  "theme-bubblegum",
  "theme-amethyst-haze",
  "theme-notebook",
  "theme-doom-64",
  "theme-catppuccin",
  "theme-graphite",
  "theme-perpetuity",
  "theme-kodama-grove",
  "theme-cosmic-night",
  "theme-tangerine",
  "theme-quantum-rose",
  "theme-nature",
  "theme-bold-tech",
  "theme-elegant-luxury",
  "theme-amber-minimal",
  "theme-supabase",
  "theme-neo-brutalism",
  "theme-solar-dusk",
  "theme-claymorphism",
  "theme-cyberpunk",
  "theme-pastel-dreams",
  "theme-clean-slate",
  "theme-caffeine",
  "theme-ocean-breeze",
  "theme-retro-arcade",
  "theme-midnight-bloom",
  "theme-candyland",
  "theme-northern-lights",
  "theme-vintage-paper",
  "theme-sunset-horizon",
  "theme-starry-night",
  "theme-claude",
  "theme-vercel",
  "theme-mono"
];
const themes$1 = [
  {
    name: "Default",
    value: "system",
    colors: {
      background: "rgb(249, 249, 250)",
      primary: "rgb(52, 168, 90)",
      secondary: "rgb(100, 149, 237)"
    },
    colorsDark: {
      background: "rgb(26, 29, 35)",
      primary: "rgb(52, 168, 90)",
      secondary: "rgb(70, 130, 180)"
    }
  },
  {
    name: "Modern Minimal",
    value: "modern-minimal",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(59, 130, 246)",
      secondary: "rgb(243, 244, 246)"
    },
    colorsDark: {
      background: "rgb(23, 23, 23)",
      primary: "rgb(59, 130, 246)",
      secondary: "rgb(38, 38, 38)"
    }
  },
  {
    name: "T3 Chat",
    value: "t3-chat",
    colors: {
      background: "rgb(250, 245, 250)",
      primary: "rgb(168, 67, 112)",
      secondary: "rgb(241, 196, 230)"
    },
    colorsDark: {
      background: "rgb(34, 29, 39)",
      primary: "rgb(163, 0, 76)",
      secondary: "rgb(54, 45, 61)"
    }
  },
  {
    name: "Twitter",
    value: "twitter",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(30, 157, 241)",
      secondary: "rgb(15, 20, 25)"
    },
    colorsDark: {
      background: "rgb(0, 0, 0)",
      primary: "rgb(28, 156, 240)",
      secondary: "rgb(240, 243, 244)"
    }
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
    colors: {
      background: "rgb(241, 240, 229)",
      primary: "rgb(163, 119, 100)",
      secondary: "rgb(186, 171, 146)"
    },
    colorsDark: {
      background: "rgb(45, 37, 33)",
      primary: "rgb(195, 158, 136)",
      secondary: "rgb(138, 101, 90)"
    }
  },
  {
    name: "Bubblegum",
    value: "bubblegum",
    colors: {
      background: "rgb(246, 230, 238)",
      primary: "rgb(208, 79, 153)",
      secondary: "rgb(138, 207, 209)"
    },
    colorsDark: {
      background: "rgb(18, 36, 46)",
      primary: "rgb(251, 226, 167)",
      secondary: "rgb(228, 162, 177)"
    }
  },
  {
    name: "Amethyst Haze",
    value: "amethyst-haze",
    colors: {
      background: "rgb(248, 247, 250)",
      primary: "rgb(138, 121, 171)",
      secondary: "rgb(223, 217, 236)"
    },
    colorsDark: {
      background: "rgb(26, 24, 35)",
      primary: "rgb(169, 149, 201)",
      secondary: "rgb(90, 83, 112)"
    }
  },
  {
    name: "Notebook",
    value: "notebook",
    colors: {
      background: "rgb(249, 249, 249)",
      primary: "rgb(96, 96, 96)",
      secondary: "rgb(222, 222, 222)"
    },
    colorsDark: {
      background: "rgb(43, 43, 43)",
      primary: "rgb(176, 176, 176)",
      secondary: "rgb(90, 90, 90)"
    }
  },
  {
    name: "Doom 64",
    value: "doom-64",
    colors: {
      background: "rgb(204, 204, 204)",
      primary: "rgb(183, 28, 28)",
      secondary: "rgb(85, 107, 47)"
    },
    colorsDark: {
      background: "rgb(26, 26, 26)",
      primary: "rgb(229, 57, 53)",
      secondary: "rgb(104, 159, 56)"
    }
  },
  {
    name: "Catppuccin",
    value: "catppuccin",
    colors: {
      background: "rgb(239, 241, 245)",
      primary: "rgb(136, 57, 239)",
      secondary: "rgb(204, 208, 218)"
    },
    colorsDark: {
      background: "rgb(24, 24, 37)",
      primary: "rgb(203, 166, 247)",
      secondary: "rgb(88, 91, 112)"
    }
  },
  {
    name: "Graphite",
    value: "graphite",
    colors: {
      background: "rgb(240, 240, 240)",
      primary: "rgb(96, 96, 96)",
      secondary: "rgb(224, 224, 224)"
    },
    colorsDark: {
      background: "rgb(26, 26, 26)",
      primary: "rgb(160, 160, 160)",
      secondary: "rgb(48, 48, 48)"
    }
  },
  {
    name: "Perpetuity",
    value: "perpetuity",
    colors: {
      background: "rgb(232, 240, 240)",
      primary: "rgb(6, 133, 142)",
      secondary: "rgb(217, 234, 234)"
    },
    colorsDark: {
      background: "rgb(10, 26, 32)",
      primary: "rgb(77, 232, 232)",
      secondary: "rgb(22, 73, 85)"
    }
  },
  {
    name: "Kodama Grove",
    value: "kodama-grove",
    colors: {
      background: "rgb(228, 215, 176)",
      primary: "rgb(141, 157, 79)",
      secondary: "rgb(222, 206, 160)"
    },
    colorsDark: {
      background: "rgb(58, 53, 41)",
      primary: "rgb(138, 159, 123)",
      secondary: "rgb(90, 83, 69)"
    }
  },
  {
    name: "Cosmic Night",
    value: "cosmic-night",
    colors: {
      background: "rgb(245, 245, 255)",
      primary: "rgb(110, 86, 207)",
      secondary: "rgb(228, 223, 255)"
    },
    colorsDark: {
      background: "rgb(15, 15, 26)",
      primary: "rgb(164, 143, 255)",
      secondary: "rgb(45, 43, 85)"
    }
  },
  {
    name: "Tangerine",
    value: "tangerine",
    colors: {
      background: "rgb(232, 235, 237)",
      primary: "rgb(224, 93, 56)",
      secondary: "rgb(243, 244, 246)"
    },
    colorsDark: {
      background: "rgb(28, 36, 51)",
      primary: "rgb(224, 93, 56)",
      secondary: "rgb(42, 48, 62)"
    }
  },
  {
    name: "Quantum Rose",
    value: "quantum-rose",
    colors: {
      background: "rgb(255, 240, 248)",
      primary: "rgb(230, 6, 122)",
      secondary: "rgb(255, 214, 255)"
    },
    colorsDark: {
      background: "rgb(26, 9, 34)",
      primary: "rgb(255, 107, 239)",
      secondary: "rgb(70, 32, 79)"
    }
  },
  {
    name: "Nature",
    value: "nature",
    colors: {
      background: "rgb(248, 245, 240)",
      primary: "rgb(46, 125, 50)",
      secondary: "rgb(232, 245, 233)"
    },
    colorsDark: {
      background: "rgb(28, 42, 31)",
      primary: "rgb(76, 175, 80)",
      secondary: "rgb(62, 74, 61)"
    }
  },
  {
    name: "Bold Tech",
    value: "bold-tech",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(139, 92, 246)",
      secondary: "rgb(243, 240, 255)"
    },
    colorsDark: {
      background: "rgb(15, 23, 42)",
      primary: "rgb(139, 92, 246)",
      secondary: "rgb(30, 27, 75)"
    }
  },
  {
    name: "Elegant Luxury",
    value: "elegant-luxury",
    colors: {
      background: "rgb(250, 247, 245)",
      primary: "rgb(155, 44, 44)",
      secondary: "rgb(253, 242, 214)"
    },
    colorsDark: {
      background: "rgb(28, 25, 23)",
      primary: "rgb(185, 28, 28)",
      secondary: "rgb(146, 64, 14)"
    }
  },
  {
    name: "Amber Minimal",
    value: "amber-minimal",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(245, 158, 11)",
      secondary: "rgb(243, 244, 246)"
    },
    colorsDark: {
      background: "rgb(23, 23, 23)",
      primary: "rgb(245, 158, 11)",
      secondary: "rgb(38, 38, 38)"
    }
  },
  {
    name: "Supabase",
    value: "supabase",
    colors: {
      background: "rgb(252, 252, 252)",
      primary: "rgb(114, 227, 173)",
      secondary: "rgb(253, 253, 253)"
    },
    colorsDark: {
      background: "rgb(18, 18, 18)",
      primary: "rgb(0, 98, 57)",
      secondary: "rgb(36, 36, 36)"
    }
  },
  {
    name: "Neo Brutalism",
    value: "neo-brutalism",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(255, 51, 51)",
      secondary: "rgb(255, 255, 0)"
    },
    colorsDark: {
      background: "rgb(0, 0, 0)",
      primary: "rgb(255, 102, 102)",
      secondary: "rgb(255, 255, 51)"
    }
  },
  {
    name: "Solar Dusk",
    value: "solar-dusk",
    colors: {
      background: "rgb(253, 251, 247)",
      primary: "rgb(180, 83, 9)",
      secondary: "rgb(228, 192, 144)"
    },
    colorsDark: {
      background: "rgb(28, 25, 23)",
      primary: "rgb(249, 115, 22)",
      secondary: "rgb(87, 83, 78)"
    }
  },
  {
    name: "Claymorphism",
    value: "claymorphism",
    colors: {
      background: "rgb(231, 229, 228)",
      primary: "rgb(99, 102, 241)",
      secondary: "rgb(214, 211, 209)"
    },
    colorsDark: {
      background: "rgb(30, 27, 24)",
      primary: "rgb(129, 140, 248)",
      secondary: "rgb(58, 54, 51)"
    }
  },
  {
    name: "Cyberpunk",
    value: "cyberpunk",
    colors: {
      background: "rgb(248, 249, 250)",
      primary: "rgb(255, 0, 200)",
      secondary: "rgb(240, 240, 255)"
    },
    colorsDark: {
      background: "rgb(12, 12, 29)",
      primary: "rgb(255, 0, 200)",
      secondary: "rgb(30, 30, 63)"
    }
  },
  {
    name: "Pastel Dreams",
    value: "pastel-dreams",
    colors: {
      background: "rgb(247, 243, 249)",
      primary: "rgb(167, 139, 250)",
      secondary: "rgb(233, 216, 253)"
    },
    colorsDark: {
      background: "rgb(28, 25, 23)",
      primary: "rgb(192, 170, 253)",
      secondary: "rgb(63, 50, 74)"
    }
  },
  {
    name: "Clean Slate",
    value: "clean-slate",
    colors: {
      background: "rgb(248, 250, 252)",
      primary: "rgb(99, 102, 241)",
      secondary: "rgb(229, 231, 235)"
    },
    colorsDark: {
      background: "rgb(15, 23, 42)",
      primary: "rgb(129, 140, 248)",
      secondary: "rgb(45, 55, 72)"
    }
  },
  {
    name: "Caffeine",
    value: "caffeine",
    colors: {
      background: "rgb(249, 249, 249)",
      primary: "rgb(100, 74, 64)",
      secondary: "rgb(255, 223, 181)"
    },
    colorsDark: {
      background: "rgb(17, 17, 17)",
      primary: "rgb(255, 224, 194)",
      secondary: "rgb(57, 48, 40)"
    }
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: {
      background: "rgb(240, 248, 255)",
      primary: "rgb(34, 197, 94)",
      secondary: "rgb(224, 242, 254)"
    },
    colorsDark: {
      background: "rgb(15, 23, 42)",
      primary: "rgb(52, 211, 153)",
      secondary: "rgb(45, 55, 72)"
    }
  },
  {
    name: "Retro Arcade",
    value: "retro-arcade",
    colors: {
      background: "rgb(253, 246, 227)",
      primary: "rgb(211, 54, 130)",
      secondary: "rgb(42, 161, 152)"
    },
    colorsDark: {
      background: "rgb(0, 43, 54)",
      primary: "rgb(211, 54, 130)",
      secondary: "rgb(42, 161, 152)"
    }
  },
  {
    name: "Midnight Bloom",
    value: "midnight-bloom",
    colors: {
      background: "rgb(249, 249, 249)",
      primary: "rgb(108, 92, 231)",
      secondary: "rgb(161, 201, 242)"
    },
    colorsDark: {
      background: "rgb(26, 29, 35)",
      primary: "rgb(108, 92, 231)",
      secondary: "rgb(75, 0, 130)"
    }
  },
  {
    name: "Candyland",
    value: "candyland",
    colors: {
      background: "rgb(247, 249, 250)",
      primary: "rgb(255, 192, 203)",
      secondary: "rgb(135, 206, 235)"
    },
    colorsDark: {
      background: "rgb(26, 29, 35)",
      primary: "rgb(255, 153, 204)",
      secondary: "rgb(51, 204, 51)"
    }
  },
  {
    name: "Northern Lights",
    value: "northern-lights",
    colors: {
      background: "rgb(249, 249, 250)",
      primary: "rgb(52, 168, 90)",
      secondary: "rgb(100, 149, 237)"
    },
    colorsDark: {
      background: "rgb(26, 29, 35)",
      primary: "rgb(52, 168, 90)",
      secondary: "rgb(70, 130, 180)"
    }
  },
  {
    name: "Vintage Paper",
    value: "vintage-paper",
    colors: {
      background: "rgb(245, 241, 230)",
      primary: "rgb(166, 124, 82)",
      secondary: "rgb(226, 216, 195)"
    },
    colorsDark: {
      background: "rgb(45, 38, 33)",
      primary: "rgb(192, 160, 128)",
      secondary: "rgb(74, 64, 57)"
    }
  },
  {
    name: "Sunset Horizon",
    value: "sunset-horizon",
    colors: {
      background: "rgb(255, 249, 245)",
      primary: "rgb(255, 126, 95)",
      secondary: "rgb(255, 237, 234)"
    },
    colorsDark: {
      background: "rgb(42, 32, 36)",
      primary: "rgb(255, 126, 95)",
      secondary: "rgb(70, 58, 65)"
    }
  },
  {
    name: "Starry Night",
    value: "starry-night",
    colors: {
      background: "rgb(245, 247, 250)",
      primary: "rgb(58, 91, 160)",
      secondary: "rgb(247, 200, 115)"
    },
    colorsDark: {
      background: "rgb(24, 26, 36)",
      primary: "rgb(58, 91, 160)",
      secondary: "rgb(255, 224, 102)"
    }
  },
  {
    name: "Claude",
    value: "claude",
    colors: {
      background: "rgb(250, 249, 245)",
      primary: "rgb(201, 100, 66)",
      secondary: "rgb(233, 230, 220)"
    },
    colorsDark: {
      background: "rgb(38, 38, 36)",
      primary: "rgb(217, 119, 87)",
      secondary: "rgb(250, 249, 245)"
    }
  },
  {
    name: "Vercel",
    value: "vercel",
    colors: {
      background: "rgb(252, 252, 252)",
      primary: "rgb(0, 0, 0)",
      secondary: "rgb(240, 240, 240)"
    },
    colorsDark: {
      background: "rgb(0, 0, 0)",
      primary: "rgb(255, 255, 255)",
      secondary: "rgb(64, 64, 64)"
    }
  },
  {
    name: "Mono",
    value: "mono",
    colors: {
      background: "rgb(255, 255, 255)",
      primary: "rgb(115, 115, 115)",
      secondary: "rgb(245, 245, 245)"
    },
    colorsDark: {
      background: "rgb(10, 10, 10)",
      primary: "rgb(115, 115, 115)",
      secondary: "rgb(38, 38, 38)"
    }
  }
];
const THEME_CLASSES = THEME_CLASSES$1;
const themeCache = /* @__PURE__ */ new Map();
themes$1.forEach((theme2) => themeCache.set(theme2.value, theme2));
function createThemeStore() {
  const rawStoredTheme = localStorage.getItem("theme");
  const validThemes = themes$1.map((t) => t.value);
  const storedTheme = rawStoredTheme && validThemes.includes(rawStoredTheme) ? rawStoredTheme : "system";
  if (rawStoredTheme && rawStoredTheme !== storedTheme) {
    localStorage.setItem("theme", storedTheme);
  }
  const { subscribe, set } = writable(storedTheme);
  return {
    subscribe,
    setTheme: async (theme2) => {
      localStorage.setItem("theme", theme2);
      set(theme2);
      const currentDarkMode = localStorage.getItem("darkMode") === "true";
      await applyTheme(theme2, currentDarkMode);
    },
    init: async () => {
      const currentDarkMode = localStorage.getItem("darkMode") === "true";
      await applyTheme(storedTheme, currentDarkMode);
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", async () => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "system") {
          const currentDarkMode2 = localStorage.getItem("darkMode") === "true";
          await applyTheme("system", currentDarkMode2);
        }
      });
    }
  };
}
function createDarkModeStore() {
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const store = writable(storedDarkMode);
  return {
    subscribe: store.subscribe,
    toggle: async () => {
      const currentValue = localStorage.getItem("darkMode") === "true";
      const newValue = !currentValue;
      localStorage.setItem("darkMode", String(newValue));
      store.set(newValue);
      const currentTheme = localStorage.getItem("theme");
      await applyTheme(currentTheme || "system", newValue);
    },
    set: async (value) => {
      localStorage.setItem("darkMode", String(value));
      store.set(value);
      const currentTheme = localStorage.getItem("theme");
      await applyTheme(currentTheme || "system", value);
    }
  };
}
async function applyTheme(theme2, darkMode) {
  const root = document.documentElement;
  const validThemes = themes$1.map((t) => t.value);
  if (!validThemes.includes(theme2)) {
    console.warn(`Invalid theme "${theme2}", falling back to system`);
    theme2 = "system";
  }
  root.classList.remove(...THEME_CLASSES);
  let shouldBeDark = darkMode;
  if (theme2 === "system") {
    shouldBeDark = darkMode;
  } else {
    root.classList.add(`theme-${theme2}`);
    if (theme2 === "midnight-bloom") {
      shouldBeDark = true;
    }
  }
  if (shouldBeDark) {
    root.classList.add("dark");
  }
}
const allThemesList = writable(themes$1);
const themes = derived(allThemesList, ($themes) => $themes);
const isDarkMode = createDarkModeStore();
const theme = createThemeStore();
const buttonVariants = tv({
  base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-secondary hover:text-secondary-foreground",
      outline: "border-input bg-background hover:bg-secondary hover:text-secondary-foreground border",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-secondary hover:text-secondary-foreground",
      link: "text-primary underline-offset-4 hover:underline hover:text-secondary-foreground"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Button($$payload, $$props) {
  push();
  let {
    class: className,
    variant = "default",
    size = "default",
    ref = null,
    href = void 0,
    type = "button",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (href) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${spread_attributes(
      {
        class: clsx(cn(buttonVariants({ variant, size }), className)),
        href,
        ...restProps
      }
    )}>`;
    children?.($$payload);
    $$payload.out += `<!----></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes(
      {
        class: clsx(cn(buttonVariants({ variant, size }), className)),
        type,
        ...restProps
      }
    )}>`;
    children?.($$payload);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
/**
 * @license lucide-svelte v0.517.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  push();
  let name = fallback($$props["name"], void 0);
  let color = fallback($$props["color"], "currentColor");
  let size = fallback($$props["size"], 24);
  let strokeWidth = fallback($$props["strokeWidth"], 2);
  let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
  let iconNode = fallback($$props["iconNode"], () => [], true);
  const mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && array.indexOf(className) === index;
  }).join(" ");
  const each_array = ensure_array_like(iconNode);
  $$payload.out += `<svg${spread_attributes(
    {
      ...defaultAttributes,
      ...$$restProps,
      width: size,
      height: size,
      stroke: color,
      "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
    },
    null,
    void 0,
    void 0,
    3
  )}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let [tag, attrs] = each_array[$$index];
    element($$payload, tag, () => {
      $$payload.out += `${spread_attributes({ ...attrs }, null, void 0, void 0, 3)}`;
    });
  }
  $$payload.out += `<!--]--><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></svg>`;
  bind_props($$props, {
    name,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode
  });
  pop();
}
function Input($$payload, $$props) {
  push();
  let {
    ref = null,
    value = void 0,
    type,
    files = void 0,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (type === "file") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input${spread_attributes(
      {
        class: clsx(cn("border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
        type: "file",
        ...restProps
      }
    )}/>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<input${spread_attributes(
      {
        class: clsx(cn("border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
        type,
        value,
        ...restProps
      }
    )}/>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, value, files });
  pop();
}
class KeyboardShortcutManager {
  shortcuts = /* @__PURE__ */ new Map();
  currentContext = "global";
  helpModalOpen = false;
  onShowHelp;
  onHideHelp;
  constructor() {
    this.setupGlobalShortcuts();
  }
  setupGlobalShortcuts() {
    this.bind("?", "Show keyboard shortcuts help", () => {
      this.toggleHelp();
    }, "global");
    this.bind("/", "Focus search bar", () => {
      this.focusSearchBar();
    }, "global");
    this.bind("g h", "Go to home page", () => {
      goto();
    }, "global");
    this.bind("ctrl+o", "Navigate back through breadcrumbs", () => {
      this.navigateBack();
    }, "global");
    this.bind("] t", "Next theme", () => {
      this.nextTheme();
    }, "global");
    this.bind("[ t", "Previous theme", () => {
      this.previousTheme();
    }, "global");
    this.bind("c t", "Open theme picker", () => {
      this.openThemePicker();
    }, "global");
    this.bind("c m", "Toggle dark/light mode", () => {
      isDarkMode.toggle();
    }, "global");
  }
  setupResultsShortcuts() {
    this.setContext("results");
    this.bind("f", "Focus filter input", () => {
      this.focusFilter();
    }, "results");
    this.bind("] ]", "Next page", () => {
      this.nextPage();
    }, "results");
    this.bind("[ [", "Previous page", () => {
      this.previousPage();
    }, "results");
  }
  setupTableShortcuts() {
    this.setContext("table");
    this.bind("j", "Focus next table row", () => {
      this.focusNextRow();
    }, "table");
    this.bind("k", "Focus previous table row", () => {
      this.focusPreviousRow();
    }, "table");
    this.bind("h", "Focus previous cell in row", () => {
      this.focusPreviousCell();
    }, "table");
    this.bind("l", "Focus next cell in row", () => {
      this.focusNextCell();
    }, "table");
    this.bind("enter", "Click active cell link", () => {
      this.clickActiveCell();
    }, "table");
  }
  bind(key, description, action, context = "global") {
    const shortcut = { key, description, action, context };
    this.shortcuts.set(key, shortcut);
    Mousetrap.bind(key, (e) => {
      e.preventDefault();
      action();
      return false;
    });
  }
  unbind(key) {
    Mousetrap.unbind(key);
    this.shortcuts.delete(key);
  }
  setContext(context) {
    this.currentContext = context;
  }
  // Global actions
  toggleHelp() {
    this.helpModalOpen = !this.helpModalOpen;
    if (this.helpModalOpen && this.onShowHelp) {
      this.onShowHelp();
    } else if (!this.helpModalOpen && this.onHideHelp) {
      this.onHideHelp();
    }
  }
  focusSearchBar() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  navigateBack() {
    breadcrumbs.goBack();
  }
  nextTheme() {
    const currentTheme = get(theme);
    const availableThemes = get(themes);
    const currentIndex = availableThemes.findIndex((t) => t.value === currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    theme.setTheme(availableThemes[nextIndex].value);
  }
  previousTheme() {
    const currentTheme = get(theme);
    const availableThemes = get(themes);
    const currentIndex = availableThemes.findIndex((t) => t.value === currentTheme);
    const previousIndex = currentIndex === 0 ? availableThemes.length - 1 : currentIndex - 1;
    theme.setTheme(availableThemes[previousIndex].value);
  }
  openThemePicker() {
    const themeButton = document.querySelector("[data-theme-trigger]");
    if (themeButton) {
      themeButton.click();
    }
  }
  // Results page actions
  focusFilter() {
    const filterInput = document.querySelector("[data-filter-input]");
    if (filterInput) {
      filterInput.focus();
      filterInput.select();
    }
  }
  nextPage() {
    const nextButton = document.querySelector("[data-pagination-next]");
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
    }
  }
  previousPage() {
    const prevButton = document.querySelector("[data-pagination-prev]");
    if (prevButton && !prevButton.disabled) {
      prevButton.click();
    }
  }
  // Table navigation actions
  focusNextRow() {
    const currentRow = document.querySelector(".table-row-focused");
    let nextRow = null;
    if (currentRow) {
      nextRow = currentRow.nextElementSibling;
    } else {
      nextRow = document.querySelector("[data-table-row]");
    }
    if (nextRow) {
      this.setRowFocus(nextRow);
    }
  }
  focusPreviousRow() {
    const currentRow = document.querySelector(".table-row-focused");
    let prevRow = null;
    if (currentRow) {
      prevRow = currentRow.previousElementSibling;
    } else {
      const rows = document.querySelectorAll("[data-table-row]");
      prevRow = rows[rows.length - 1];
    }
    if (prevRow) {
      this.setRowFocus(prevRow);
    }
  }
  focusNextCell() {
    const currentCell = document.querySelector(".table-cell-focused");
    let nextCell = null;
    if (currentCell) {
      nextCell = currentCell.nextElementSibling;
    } else {
      const focusedRow = document.querySelector(".table-row-focused");
      if (focusedRow) {
        nextCell = focusedRow.querySelector("[data-table-cell]");
      }
    }
    if (nextCell) {
      this.setCellFocus(nextCell);
    }
  }
  focusPreviousCell() {
    const currentCell = document.querySelector(".table-cell-focused");
    let prevCell = null;
    if (currentCell) {
      prevCell = currentCell.previousElementSibling;
    } else {
      const focusedRow = document.querySelector(".table-row-focused");
      if (focusedRow) {
        const cells = focusedRow.querySelectorAll("[data-table-cell]");
        prevCell = cells[cells.length - 1];
      }
    }
    if (prevCell) {
      this.setCellFocus(prevCell);
    }
  }
  clickActiveCell() {
    const activeCell = document.querySelector(".table-cell-focused");
    if (activeCell) {
      const link = activeCell.querySelector("a");
      if (link) {
        link.click();
      }
    }
  }
  setRowFocus(row) {
    document.querySelectorAll(".table-row-focused").forEach((el) => {
      el.classList.remove("table-row-focused");
    });
    document.querySelectorAll(".table-cell-focused").forEach((el) => {
      el.classList.remove("table-cell-focused");
    });
    row.classList.add("table-row-focused");
    row.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  setCellFocus(cell) {
    document.querySelectorAll(".table-cell-focused").forEach((el) => {
      el.classList.remove("table-cell-focused");
    });
    cell.classList.add("table-cell-focused");
  }
  // Help modal management
  onHelpShow(callback) {
    this.onShowHelp = callback;
  }
  onHelpHide(callback) {
    this.onHideHelp = callback;
  }
  getShortcutGroups() {
    const allShortcuts = /* @__PURE__ */ new Map();
    this.shortcuts.forEach((shortcut, key) => {
      allShortcuts.set(key, shortcut);
    });
    const possibleShortcuts = [
      { key: "?", description: "Show keyboard shortcuts help", action: () => {
      }, context: "global" },
      { key: "/", description: "Focus search bar", action: () => {
      }, context: "global" },
      { key: "g h", description: "Go to home page", action: () => {
      }, context: "global" },
      { key: "ctrl+o", description: "Navigate back through breadcrumbs", action: () => {
      }, context: "global" },
      { key: "] t", description: "Next theme", action: () => {
      }, context: "global" },
      { key: "[ t", description: "Previous theme", action: () => {
      }, context: "global" },
      { key: "c t", description: "Open theme picker", action: () => {
      }, context: "global" },
      { key: "c m", description: "Toggle dark/light mode", action: () => {
      }, context: "global" },
      { key: "f", description: "Focus filter input", action: () => {
      }, context: "results" },
      { key: "] ]", description: "Next page", action: () => {
      }, context: "results" },
      { key: "[ [", description: "Previous page", action: () => {
      }, context: "results" },
      { key: "j", description: "Focus next table row", action: () => {
      }, context: "table" },
      { key: "k", description: "Focus previous table row", action: () => {
      }, context: "table" },
      { key: "h", description: "Focus previous cell in row", action: () => {
      }, context: "table" },
      { key: "l", description: "Focus next cell in row", action: () => {
      }, context: "table" },
      { key: "enter", description: "Click active cell link", action: () => {
      }, context: "table" }
    ];
    possibleShortcuts.forEach((shortcut) => {
      if (!allShortcuts.has(shortcut.key)) {
        allShortcuts.set(shortcut.key, shortcut);
      }
    });
    const groups = [
      {
        title: "Navigation",
        shortcuts: Array.from(allShortcuts.values()).filter(
          (s) => ["/", "g h", "ctrl+o"].includes(s.key)
        )
      },
      {
        title: "Theme Management",
        shortcuts: Array.from(allShortcuts.values()).filter(
          (s) => ["] t", "[ t", "c t", "c m"].includes(s.key)
        )
      },
      {
        title: "Results Page",
        shortcuts: Array.from(allShortcuts.values()).filter(
          (s) => ["f", "] ]", "[ ["].includes(s.key)
        )
      },
      {
        title: "Table Navigation",
        shortcuts: Array.from(allShortcuts.values()).filter(
          (s) => ["j", "k", "h", "l", "enter"].includes(s.key)
        )
      }
    ];
    return groups.filter((group) => group.shortcuts.length > 0);
  }
  destroy() {
    this.shortcuts.forEach((_, key) => {
      Mousetrap.unbind(key);
    });
    this.shortcuts.clear();
  }
}
const keyboardShortcuts = new KeyboardShortcutManager();
export {
  Button as B,
  Icon as I,
  theme as a,
  themes as b,
  Input as c,
  isDarkMode as i,
  keyboardShortcuts as k,
  mount as m,
  onDestroy as o,
  tick as t,
  unmount as u
};
