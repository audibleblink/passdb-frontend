<script lang="ts">
    import { theme, themes, isDarkMode, type Theme, type ThemeInfo } from '../stores/theme';
    import { Button } from '$lib/components/ui/button';
    import * as Command from '$lib/components/ui/command';
    import * as Popover from '$lib/components/ui/popover';
    import { Separator } from '$lib/components/ui/separator';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { ArrowLeft, ArrowRight, Palette } from 'lucide-svelte';
    import { cn } from '$lib/utils';
    import { ThemeSearch, ThemeGrid, DarkModeToggle } from './theme';

    export let withCycleThemes: boolean = false;
    export let className: string = '';
    export let compact: boolean = false;

    let open = false;
    let search = '';

    $: currentTheme = $themes.find((t) => t.value === $theme) || $themes[0];

    $: filteredThemes = $themes.filter(
        (theme: { name: string }) =>
            search.trim() === '' || theme.name.toLowerCase().includes(search.toLowerCase())
    );

    $: builtInThemes = filteredThemes.filter((t) => t.value !== 'system');
    $: systemThemes = filteredThemes.filter((t) => t.value === 'system');
    

    function handleThemeSelect(themeValue: Theme) {
        theme.setTheme(themeValue);
        open = false;
        search = '';
    }

    function handleDarkModeToggle() {
        isDarkMode.toggle();
    }

    function randomizeTheme() {
        const randomIndex = Math.floor(Math.random() * $themes.length);
        theme.setTheme($themes[randomIndex].value);
    }

    function cycleTheme(direction: 'prev' | 'next') {
        const currentIndex = $themes.findIndex((t) => t.value === $theme);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % $themes.length;
        } else {
            newIndex = (currentIndex - 1 + $themes.length) % $themes.length;
        }

        theme.setTheme($themes[newIndex].value);
    }

    function handleSearchInput(event: Event) {
        const target = event.target as HTMLInputElement;
        search = target.value;
    }
</script>

{#if compact}
    <!-- Compact version -->
    <Popover.Root bind:open>
        <Popover.Trigger>
            <button
                class="p-2 text-primary-foreground bg-white/10 hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors flex items-center gap-2"
                title="Change theme"
                data-theme-trigger
            >
                <Palette class="w-5 h-5" />
                <span class="sr-only">Change theme</span>
            </button>
        </Popover.Trigger>
        <Popover.Content class="w-[300px] p-0 border-0 bg-background shadow-2xl" align="end">
            <Command.Root class="h-100 w-full rounded-lg shadow-2xl bg-background">
                <ThemeSearch
                    bind:search
                    {filteredThemes}
                    onSearchInput={handleSearchInput}
                    onDarkModeToggle={handleDarkModeToggle}
                    onRandomizeTheme={randomizeTheme}
                />
                <ThemeGrid
                    {systemThemes}
                    {builtInThemes}
                    onThemeSelect={handleThemeSelect}
                />
            </Command.Root>
        </Popover.Content>
    </Popover.Root>
{:else}
    <!-- Full version with cycle controls -->
    <div class="flex w-full items-center">
        {#if withCycleThemes}
            <Separator orientation="vertical" class="min-h-8" />
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <button
                        class="aspect-square min-h-8 w-auto inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground"
                        on:click={() => cycleTheme('prev')}
                    >
                        <ArrowLeft class="h-4 w-4" />
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content>Previous theme</Tooltip.Content>
            </Tooltip.Root>
            <Separator orientation="vertical" class="min-h-8" />
        {/if}

        <Popover.Root bind:open>
            <Popover.Trigger>
                <button
                    class={cn(
                        'p-2 text-primary-foreground bg-white/10 hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors flex items-center gap-2',
                        className
                    )}
                    title="Change theme"
                    data-theme-trigger
                >
                    <Palette class="w-5 h-5" />
                    <span class="sr-only">Change theme</span>
                </button>
            </Popover.Trigger>
            <Popover.Content class="w-[300px] p-0 border-0 bg-background shadow-2xl" align="center">
                <Command.Root class="h-100 w-full rounded-lg shadow-2xl bg-background p-3">
                    <ThemeSearch
                        bind:search
                        {filteredThemes}
                        onSearchInput={handleSearchInput}
                        onDarkModeToggle={handleDarkModeToggle}
                        onRandomizeTheme={randomizeTheme}
                    />
                    <ThemeGrid
                        {systemThemes}
                        {builtInThemes}
                        onThemeSelect={handleThemeSelect}
                    />
                </Command.Root>
            </Popover.Content>
        </Popover.Root>

        {#if withCycleThemes}
            <Separator orientation="vertical" class="min-h-8" />
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <button
                        class="aspect-square min-h-8 w-auto inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground"
                        on:click={() => cycleTheme('next')}
                    >
                        <ArrowRight class="h-4 w-4" />
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content>Next theme</Tooltip.Content>
            </Tooltip.Root>
        {/if}
    </div>
{/if}