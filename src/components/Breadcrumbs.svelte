<script lang="ts">
    import { breadcrumbs } from '../stores/breadcrumbs';
    import { navigate } from '../router';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { ChevronRight } from 'lucide-svelte';

    function handleBreadcrumbClick(index: number, path: string) {
        breadcrumbs.navigateToBreadcrumb(index);
        navigate(path);
    }

    // Reactive statement to determine which breadcrumbs to show
    $: displayBreadcrumbs = (() => {
        const total = $breadcrumbs.length;

        if (total <= 4) {
            // Show all breadcrumbs if 4 or fewer
            return $breadcrumbs.map((breadcrumb, index) => ({
                ...breadcrumb,
                originalIndex: index,
                showEllipsis: false,
            }));
        } else {
            // Show Home + ellipsis + last 3 breadcrumbs (total of 4 visible)
            const result = [];

            // Always include Home (first breadcrumb)
            result.push({
                ...$breadcrumbs[0],
                originalIndex: 0,
                showEllipsis: false,
            });

            // Add ellipsis indicator
            result.push({
                label: '...',
                path: '',
                timestamp: 0,
                originalIndex: -1,
                showEllipsis: true,
            });

            // Add last 3 breadcrumbs
            const lastThree = $breadcrumbs.slice(-3);
            lastThree.forEach((breadcrumb, index) => {
                result.push({
                    ...breadcrumb,
                    originalIndex: total - 3 + index,
                    showEllipsis: false,
                });
            });

            return result;
        }
    })();

    // Calculate responsive classes based on breadcrumb count - only shrink when needed
    $: responsiveClasses = (() => {
        const total = $breadcrumbs.length;
        // Start with normal size, only shrink when we need to fit more items
        if (total <= 3) return 'text-sm px-3 py-1.5';
        if (total <= 4) return 'text-sm px-2.5 py-1.5';
        return 'text-xs px-2 py-1.5'; // When showing 4 items with ellipsis
    })();

    // Calculate if we need to show truncated text
    $: needsTextTruncation = $breadcrumbs.length > 4;
</script>

{#if $breadcrumbs.length > 1}
    <div class="max-w-4xl mx-auto mt-6 mb-6 px-4">
        <div class="bg-muted/20 rounded-md py-2 px-3 border border-border/30">
            <Breadcrumb.Root>
                <Breadcrumb.List class="gap-1 flex-nowrap overflow-hidden">
                    {#each displayBreadcrumbs as breadcrumb, index}
                        <Breadcrumb.Item
                            class={needsTextTruncation ? 'flex-shrink min-w-0' : 'flex-shrink-0'}
                        >
                            {#if breadcrumb.showEllipsis}
                                <!-- Ellipsis indicator - make it more visible -->
                                <div
                                    class="px-2 py-1.5 text-sm font-bold text-muted-foreground bg-muted/30 rounded border border-border/20 flex items-center justify-center min-w-[32px]"
                                >
                                    ...
                                </div>
                            {:else if breadcrumb.originalIndex === $breadcrumbs.length - 1}
                                <!-- Current page - not clickable -->
                                <Breadcrumb.Page
                                    class="{responsiveClasses} font-medium text-foreground bg-background/40 rounded border border-border/40 {needsTextTruncation
                                        ? 'truncate max-w-[200px]'
                                        : ''}"
                                    title={breadcrumb.label}
                                >
                                    {breadcrumb.label}
                                </Breadcrumb.Page>
                            {:else}
                                <!-- Clickable breadcrumb -->
                                <button
                                    class="{responsiveClasses} text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/60 transition-all duration-200 cursor-pointer rounded border border-transparent hover:border-border/40 {needsTextTruncation
                                        ? 'truncate max-w-[200px]'
                                        : ''}"
                                    title={breadcrumb.label}
                                    on:click={() =>
                                        handleBreadcrumbClick(
                                            breadcrumb.originalIndex,
                                            breadcrumb.path
                                        )}
                                >
                                    {breadcrumb.label}
                                </button>
                            {/if}
                        </Breadcrumb.Item>

                        {#if index < displayBreadcrumbs.length - 1}
                            <Breadcrumb.Separator class="mx-1 flex-shrink-0">
                                <ChevronRight class="h-3 w-3 text-muted-foreground/50" />
                            </Breadcrumb.Separator>
                        {/if}
                    {/each}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
    </div>
{/if}
