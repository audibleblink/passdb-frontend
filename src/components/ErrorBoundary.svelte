<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        error?: Error | null;
        reset?: () => void;
        children?: import('svelte').Snippet;
    }
    
    let { 
        error = $bindable(null), 
        reset = () => window.location.reload(),
        children
    }: Props = $props();

    let showDetails = $state(false);

    onMount(() => {
        const handleError = (event: ErrorEvent) => {
            event.preventDefault();
            error = new Error(event.message);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            event.preventDefault();
            error = new Error(event.reason);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    });
</script>

{#if error}
    <div
        class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-4xl mx-auto px-4">
            <div class="max-w-md mx-auto space-y-8">
                <div class="bg-card p-8 rounded-lg shadow-lg border">
                    <div
                        class="flex items-center justify-center w-12 h-12 mx-auto bg-destructive/10 rounded-full"
                >
                    <svg
                        class="w-6 h-6 text-destructive"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                    <div class="mt-4 text-center">
                        <h3 class="text-lg font-medium text-foreground">Oops! Something went wrong</h3>
                        <p class="mt-2 text-sm text-muted-foreground">
                            We encountered an unexpected error. Please try again.
                        </p>
                    </div>

                    <div class="mt-6 space-y-3">
                        <button
                            onclick={reset}
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                        >
                            Reload Page
                        </button>

                        <button
                            onclick={() => (showDetails = !showDetails)}
                            class="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                        >
                            {showDetails ? 'Hide' : 'Show'} Details
                        </button>
                    </div>

                    {#if showDetails}
                        <div class="mt-4 p-4 bg-muted rounded-md">
                            <p class="text-xs text-muted-foreground font-mono break-all">
                                {error.message}
                            </p>
                            {#if error.stack}
                                <pre
                                    class="mt-2 text-xs text-muted-foreground overflow-x-auto">{error.stack}</pre>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
    {@render children?.()}
{/if}
