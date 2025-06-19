<script lang="ts">
    import { Check } from 'lucide-svelte';
    import * as Command from '$lib/components/ui/command';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { Separator } from '$lib/components/ui/separator';
    import { theme, isDarkMode, type Theme, type ThemeInfo } from '../../stores/theme';

    export let systemThemes: ThemeInfo[] = [];
    export let builtInThemes: ThemeInfo[] = [];
    export let onThemeSelect: (themeValue: Theme) => void;

    function getThemeColors(themeInfo: ThemeInfo): {
        background: string;
        primary: string;
        secondary: string;
    } {
        if ($isDarkMode && themeInfo.colorsDark) {
            return themeInfo.colorsDark;
        }
        return themeInfo.colors;
    }

    function handleThemeSelect(themeValue: Theme) {
        onThemeSelect(themeValue);
    }
</script>

<ScrollArea class="h-[400px] max-h-[70vh]">
    <Command.Empty>No themes found.</Command.Empty>

    <!-- System Theme Group -->
    {#if systemThemes.length > 0}
        <Command.Group heading="System">
            {#each systemThemes as themeOption}
                {#if themeOption}
                    {@const colors = getThemeColors(themeOption)}
                    <Command.Item
                        value={themeOption.value}
                        onSelect={() => handleThemeSelect(themeOption.value)}
                        class="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                    >
                        <div class="flex gap-0.5">
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.primary}"
                            ></div>
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.secondary}"
                            ></div>
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.background}"
                            ></div>
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                            <span
                                class="line-clamp-1 text-sm font-medium capitalize"
                            >
                                {themeOption.name}
                            </span>
                        </div>
                        {#if $theme === themeOption.value}
                            <Check class="h-4 w-4 shrink-0 opacity-70" />
                        {/if}
                    </Command.Item>
                {/if}
            {/each}
        </Command.Group>
        {#if builtInThemes.length > 0}
            <Separator class="my-2" />
        {/if}
    {/if}

    <!-- Built-in Themes Group -->
    {#if builtInThemes.length > 0}
        <Command.Group heading="Built-in Themes">
            {#each builtInThemes as themeOption}
                {#if themeOption}
                    {@const colors = getThemeColors(themeOption)}
                    <Command.Item
                        value={themeOption.value}
                        onSelect={() => handleThemeSelect(themeOption.value)}
                        class="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                    >
                        <div class="flex gap-0.5">
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.primary}"
                            ></div>
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.secondary}"
                            ></div>
                            <div
                                class="h-3 w-3 rounded-sm border border-muted"
                                style="background-color: {colors.background}"
                            ></div>
                        </div>
                        <div class="flex flex-1 items-center gap-2">
                            <span
                                class="line-clamp-1 text-sm font-medium capitalize"
                            >
                                {themeOption.name}
                            </span>
                        </div>
                        {#if $theme === themeOption.value}
                            <Check class="h-4 w-4 shrink-0 opacity-70" />
                        {/if}
                    </Command.Item>
                {/if}
            {/each}
        </Command.Group>
    {/if}
</ScrollArea>