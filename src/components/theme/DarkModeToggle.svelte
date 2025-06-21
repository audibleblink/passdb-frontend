<script lang="ts">
    import { Moon, Sun } from 'lucide-svelte';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { isDarkMode } from '../../stores/theme';

    export let onToggle: () => void;

    function handleToggle() {
        isDarkMode.toggle();
        onToggle();
    }
</script>

<Tooltip.Root>
    <Tooltip.Trigger>
        <button
            class="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground"
            on:click={handleToggle}
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