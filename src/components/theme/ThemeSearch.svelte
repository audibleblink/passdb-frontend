<script lang="ts">
    import { Search, Shuffle, Moon, Sun } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { isDarkMode } from '../../stores/theme';

    export let search: string = '';
    export let filteredThemes: any[] = [];
    export let onSearchInput: (event: Event) => void;
    export let onDarkModeToggle: () => void;
    export let onRandomizeTheme: () => void;

    function handleSearchInput(event: Event) {
        const target = event.target as HTMLInputElement;
        search = target.value;
        onSearchInput(event);
    }
</script>

<div class="flex w-full items-center">
    <div class="flex w-full items-center border-b px-3 py-1">
        <Search class="size-4 shrink-0 opacity-50" />
        <input
            placeholder="Search themes..."
            class="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            bind:value={search}
            on:input={handleSearchInput}
        />
    </div>
</div>
<div class="flex items-center justify-between px-4 py-2">
    <div class="text-muted-foreground text-xs">
        {filteredThemes.length} theme{filteredThemes.length !== 1 ? 's' : ''}
    </div>
    <div class="flex gap-1">
        <Tooltip.Root>
            <Tooltip.Trigger>
                <button
                    class="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground"
                    on:click={onDarkModeToggle}
                >
                    {#if $isDarkMode}
                        <Moon class="h-3.5 w-3.5" />
                    {:else}
                        <Sun class="h-3.5 w-3.5" />
                    {/if}
                </button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
                <p class="text-xs">Toggle dark mode</p>
            </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
            <Tooltip.Trigger>
                <button
                    class="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground"
                    on:click={onRandomizeTheme}
                >
                    <Shuffle class="h-3.5 w-3.5" />
                </button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
                <p class="text-xs">Random theme</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </div>
</div>
<Separator />