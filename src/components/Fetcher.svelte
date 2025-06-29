<script lang="ts">
    import type { SearchResult } from '../types/api';
    import Results from './Results.svelte';
    import LoadingStates from './LoadingStates.svelte';
    import { useAPI } from '../composables/useFetch.svelte';

    export let endpoint: string;

    // Use the modern fetch composable with automatic retry and error handling
    const { data: results, loading, error, isSuccess } = useAPI<SearchResult[]>(endpoint);
</script>

<div class="px-4 py-8">
    {#if loading}
        <LoadingStates type="spinner" message="Searching database..." />
    {:else if error}
        <div class="max-w-4xl mx-auto">
            <div class="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-destructive"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-destructive">
                            Failed to fetch results
                        </h3>
                        <p class="mt-2 text-sm text-destructive">
                            {error.message}
                        </p>
                        <p class="mt-2 text-sm text-destructive">
                            Please check your API host configuration and try again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {:else if isSuccess && results}
        {#if results.length === 0}
            <div class="max-w-4xl mx-auto">
                <div class="text-center py-12">
                    <svg
                        class="mx-auto h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-foreground">No results found</h3>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search terms
                    </p>
                </div>
            </div>
        {:else}
            <Results results={results} />
        {/if}
    {/if}
</div>
