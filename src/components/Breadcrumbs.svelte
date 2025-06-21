<script lang="ts">
    import { breadcrumbs } from '../stores/breadcrumbs';
    import { navigate } from '../router';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { ChevronRight } from 'lucide-svelte';

    function handleBreadcrumbClick(index: number, path: string) {
        breadcrumbs.navigateToBreadcrumb(index);
        navigate(path);
    }
</script>

{#if $breadcrumbs.length > 1}
    <div class="max-w-4xl mx-auto mt-6 mb-6 px-4">
        <div class="bg-muted/20 rounded-md py-2 px-3 border border-border/30">
            <Breadcrumb.Root>
                <Breadcrumb.List class="gap-1">
                    {#each $breadcrumbs as breadcrumb, index}
                        <Breadcrumb.Item>
                            {#if index === $breadcrumbs.length - 1}
                                <!-- Current page - not clickable -->
                                <Breadcrumb.Page
                                    class="px-2.5 py-1.5 text-sm font-medium text-foreground bg-background/40 rounded border border-border/40"
                                >
                                    {breadcrumb.label}
                                </Breadcrumb.Page>
                            {:else}
                                <!-- Clickable breadcrumb -->
                                <button
                                    class="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/60 transition-all duration-200 cursor-pointer rounded border border-transparent hover:border-border/40"
                                    on:click={() => handleBreadcrumbClick(index, breadcrumb.path)}
                                >
                                    {breadcrumb.label}
                                </button>
                            {/if}
                        </Breadcrumb.Item>

                        {#if index < $breadcrumbs.length - 1}
                            <Breadcrumb.Separator class="mx-1">
                                <ChevronRight class="h-3 w-3 text-muted-foreground/50" />
                            </Breadcrumb.Separator>
                        {/if}
                    {/each}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
    </div>
{/if}

