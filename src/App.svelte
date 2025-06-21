<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Navbar from './components/Navbar.svelte';
    import ErrorBoundary from './components/ErrorBoundary.svelte';
    import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp.svelte';
    import { TooltipProvider } from '$lib/components/ui/tooltip';
    import { keyboardShortcuts } from './lib/keyboard-shortcuts';
    import { setupRouter, component, routeParams } from './router';

    let error: Error | null = null;

    onMount(() => {
        setupRouter();
        // Initialize keyboard shortcuts
        // The service is already instantiated, just need to make sure it's active
    });

    onDestroy(() => {
        // Clean up keyboard shortcuts
        keyboardShortcuts.destroy();
    });
</script>

<TooltipProvider>
    <ErrorBoundary {error} reset={() => (error = null)}>
        <div class="min-h-screen bg-card">
            <div class="max-w-5xl mx-auto bg-background text-foreground min-h-screen shadow-2xl">
                <Navbar />
                <main>
                    {#if $component}
                        <svelte:component this={$component} params={$routeParams} />
                    {/if}
                </main>
            </div>
        </div>
        
        <!-- Keyboard shortcuts help modal -->
        <KeyboardShortcutsHelp />
    </ErrorBoundary>
</TooltipProvider>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
