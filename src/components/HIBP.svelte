<script lang="ts">
    import type { BreachInfo } from '../types/api';
    import LoadingStates from './LoadingStates.svelte';
    import { sanitizeHtml } from '../lib/sanitize';

    export let email: string;

    let apiServer = localStorage.getItem('host');

    async function fetchBreaches(email: string): Promise<BreachInfo[]> {
        const res = await fetch(`${apiServer}/breaches/${email}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    }
</script>

{#await fetchBreaches(email)}
    <div class="max-w-4xl mx-auto mt-8">
        <LoadingStates type="spinner" message="Checking breach databases..." />
    </div>
{:then results}
    {#if results.length > 0}
        <div class="max-w-4xl mx-auto mt-8 bg-card rounded-lg shadow-md">
            <div class="px-6 py-4 border-b border-border">
                <h3 class="text-lg font-semibold text-card-foreground">Data Breaches</h3>
                <p class="text-sm text-muted-foreground">
                    Found {results.length} breach{results.length !== 1 ? 'es' : ''} for this email
                </p>
            </div>

            <div class="divide-y divide-border">
                {#each results as breach}
                    <div class="p-6">
                        <div class="flex items-start space-x-4">
                            {#if breach.LogoPath}
                                <div class="flex-shrink-0">
                                    <img
                                        src={breach.LogoPath}
                                        alt={breach.Title}
                                        class="w-12 h-12 rounded-lg object-cover shadow-sm"
                                    />
                                </div>
                            {/if}

                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-lg font-medium text-card-foreground">
                                        {breach.Title}
                                    </h4>
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive"
                                    >
                                        {Number(breach.Count).toLocaleString()} accounts
                                    </span>
                                </div>

                                <div
                                    class="mt-2 flex items-center space-x-4 text-sm text-muted-foreground"
                                >
                                    <span class="flex items-center">
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 0l-3-3m3 3l-3 3"
                                            />
                                        </svg>
                                        {breach.Domain}
                                    </span>
                                    <span class="flex items-center">
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 7V3a4 4 0 118 0v4m-4 6v8m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {breach.Date}
                                    </span>
                                </div>

                                <div class="mt-3 text-sm text-card-foreground">
                                    {@html sanitizeHtml(breach.Description)}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="max-w-4xl mx-auto mt-8 text-center py-6">
            <svg
                class="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-foreground">
                No breaches found
            </h3>
            <p class="mt-1 text-sm text-muted-foreground">
                This email hasn't been found in any known data breaches
            </p>
        </div>
    {/if}
{:catch error}
    <div class="max-w-4xl mx-auto">
        <div
            class="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-4"
        >
        <div class="flex">
            <div class="flex-shrink-0">
                <svg
                    class="h-5 w-5 text-amber-600 dark:text-amber-400"
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
            <div class="ml-3">
                <h3 class="text-sm font-medium text-accent-foreground">
                    Unable to check breaches
                </h3>
                <p class="mt-1 text-sm text-accent-foreground">
                    {error.message}
                </p>
            </div>
        </div>
    </div>
    </div>
{/await}
