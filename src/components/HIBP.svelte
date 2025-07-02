<script lang="ts">
    import type { BreachInfo } from '../types/api';
    import LoadingStates from './LoadingStates.svelte';
    import * as Accordion from '$lib/components/ui/accordion';
    import { Button } from '$lib/components/ui/button';

    export let email: string;

    let apiServer = localStorage.getItem('host');
    let expandedItems: string[] = [];
    let allExpanded = false;

    async function fetchBreaches(email: string): Promise<BreachInfo[]> {
        const res = await fetch(`${apiServer}/api/v1/breaches/${email}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        // If the response is a string, try to parse it
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Failed to parse string response:', e);
                return [];
            }
        }

        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
    }

    function toggleAllAccordions(breaches: BreachInfo[]) {
        if (allExpanded) {
            expandedItems = [];
        } else {
            expandedItems = breaches.map((_, index) => `item-${index}`);
        }
        allExpanded = !allExpanded;
    }
</script>

{#await fetchBreaches(email)}
    <div class="max-w-4xl mx-auto mt-8">
        <LoadingStates type="spinner" message="Checking breach databases..." />
    </div>
{:then results}
    {#if results && Array.isArray(results) && results.length > 0}
        <div class="max-w-4xl mx-auto mt-8 bg-accent/10">
            <div class="px-6 py-4 border-border rounded-t-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-card-foreground">Data Breaches</h3>
                        <p class="text-sm text-muted-foreground">
                            Found {results.length} breach{results.length !== 1 ? 'es' : ''} for this
                            email
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onclick={() => toggleAllAccordions(results)}
                    >
                        {allExpanded ? 'Collapse All' : 'Expand All'}
                    </Button>
                </div>
            </div>

            <Accordion.Root
                bind:value={expandedItems}
                type="multiple"
                class="w-full p-4 space-y-2 bg-background"
            >
                {#each results as breach, index}
                    <Accordion.Item
                        value="item-{index}"
                        class="border border-border rounded-lg overflow-hidden bg-muted/50"
                    >
                        <Accordion.Trigger
                            class="flex items-start justify-between w-full px-6 py-4 hover:bg-accent/50 transition-colors relative"
                        >
                            <div class="flex items-end space-x-4 flex-1 pr-20">
                                {#if breach.LogoPath}
                                    <div class="flex-shrink-0">
                                        <img
                                            src={breach.LogoPath}
                                            alt={breach.Title}
                                            class="w-16 h-16 rounded-lg object-contain shadow-sm"
                                        />
                                    </div>
                                {/if}
                                <div
                                    class="flex-1 text-left flex flex-col justify-between h-16 no-underline"
                                >
                                    <h4
                                        class="text-lg font-medium text-card-foreground no-underline"
                                    >
                                        {breach.Title}
                                    </h4>
                                    <span class="text-sm text-muted-foreground flex items-center">
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
                            </div>
                            <span
                                class="absolute bottom-4 right-6 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive"
                            >
                                {Number(breach.Count).toLocaleString()} accounts
                            </span>
                        </Accordion.Trigger>
                        <Accordion.Content class="px-6 pb-4">
                            <div class="space-y-3 pt-2">
                                <div
                                    class="flex items-center space-x-4 text-sm text-muted-foreground"
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
                                </div>
                                <div
                                    class="text-sm text-card-foreground prose prose-sm dark:prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                                >
                                    {@html breach.Description}
                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                {/each}
            </Accordion.Root>
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
            <h3 class="mt-2 text-sm font-medium text-foreground">No breaches found</h3>
            <p class="mt-1 text-sm text-muted-foreground">
                {#if !results || !Array.isArray(results)}
                    Unable to parse breach data from the API
                {:else}
                    This email hasn't been found in any known data breaches
                {/if}
            </p>
        </div>
    {/if}
{:catch error}
    <div class="max-w-4xl mx-auto">
        <div class="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-4">
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
