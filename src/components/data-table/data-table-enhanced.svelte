<script lang="ts" generics="TData">
    import {
        type ColumnDef,
        type SortingState,
        type ColumnFiltersState,
        getCoreRowModel,
        getSortedRowModel,
        getFilteredRowModel,
        getPaginationRowModel,
    } from '@tanstack/table-core';
    import { createSvelteTable } from '$lib/components/ui/data-table';
    import { FlexRender } from '$lib/components/ui/data-table';
    import * as Table from '$lib/components/ui/table';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Badge } from '$lib/components/ui/badge';
    import {
        ChevronLeft,
        ChevronRight,
        ChevronsLeft,
        ChevronsRight,
        ArrowUpDown,
    } from 'lucide-svelte';

    type Props = {
        columns: ColumnDef<TData>[];
        data: TData[];
        pageSize?: number;
    };

    let { columns, data, pageSize = 15 }: Props = $props();

    // Simple state variables
    let globalFilter = $state('');
    let sorting: SortingState = $state([]);
    let columnFilters: ColumnFiltersState = $state([]);
    let pagination = $state({ pageIndex: 0, pageSize });

    // Create table instance
    const table = createSvelteTable({
        get data() {
            return data;
        },
        get columns() {
            return columns;
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            get globalFilter() {
                return globalFilter;
            },
            get sorting() {
                return sorting;
            },
            get columnFilters() {
                return columnFilters;
            },
            get pagination() {
                return pagination;
            },
        },
        onGlobalFilterChange: (updater) => {
            globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
            pagination = { ...pagination, pageIndex: 0 };
        },
        onSortingChange: (updater) => {
            sorting = typeof updater === 'function' ? updater(sorting) : updater;
        },
        onColumnFiltersChange: (updater) => {
            columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
        },
        onPaginationChange: (updater) => {
            pagination = typeof updater === 'function' ? updater(pagination) : updater;
        },
        globalFilterFn: 'includesString',
    });

    // Enhanced handlers with performance optimization
    function handleFilterChange(event: Event) {
        const target = event.target as HTMLInputElement;
        table.setGlobalFilter(target.value);
    }

    // Performance-optimized computed values
    const visibleRows = $derived(table.getRowModel().rows);
    const totalRows = $derived(table.getCoreRowModel().rows.length);
    const filteredRows = $derived(table.getFilteredRowModel().rows.length);
    const hasFilter = $derived(!!globalFilter?.length);
</script>

<!-- Snippet for cell rendering with type-specific formatting -->
{#snippet cellRenderer(value: any, type?: string)}
    {#if type === 'status'}
        <Badge variant={value?.variant || 'default'}>{value?.text || value}</Badge>
    {:else if type === 'date'}
        <time class="text-sm text-muted-foreground">
            {new Date(value).toLocaleDateString()}
        </time>
    {:else if type === 'email'}
        <a href="mailto:{value}" class="text-primary hover:underline">
            {value}
        </a>
    {:else if type === 'url'}
        <a href={value} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
            {value}
        </a>
    {:else}
        <span class="text-foreground">{value}</span>
    {/if}
{/snippet}

<!-- Snippet for table row with optimized rendering -->
{#snippet tableRow(row: any, index: number)}
    <Table.Row
        class="border-b border-border/50 transition-colors {index % 2 === 0
            ? 'bg-background/75 hover:bg-secondary/20'
            : 'bg-background/90 hover:bg-secondary/30'}"
        data-table-row
    >
        {#each row.getVisibleCells() as cell}
            <Table.Cell class="text-card-foreground" data-table-cell>
                <FlexRender
                    content={cell.column.columnDef.cell}
                    context={cell.getContext()}
                />
            </Table.Cell>
        {/each}
    </Table.Row>
{/snippet}

<!-- Snippet for pagination controls -->
{#snippet paginationControls()}
    <div class="flex items-center space-x-2 flex-shrink-0">
        <Button
            variant="outline"
            size="sm"
            onclick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
            <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
            variant="outline"
            size="sm"
            onclick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            data-pagination-prev
        >
            <ChevronLeft class="h-4 w-4" />
        </Button>
        <span class="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
        </span>
        <Button
            variant="outline"
            size="sm"
            onclick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            data-pagination-next
        >
            <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
            variant="outline"
            size="sm"
            onclick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
            <ChevronsRight class="h-4 w-4" />
        </Button>
    </div>
{/snippet}

<div class="space-y-4">
    <!-- Combined Filter and Pagination -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
        <!-- Left: Filter input -->
        <div class="flex-1 max-w-sm min-w-0">
            <Input
                placeholder="Filter results..."
                value={table.getState().globalFilter ?? ''}
                oninput={handleFilterChange}
                class="w-full"
                data-filter-input
            />
        </div>
        
        <!-- Center: Result count (optimized with derived values) -->
        {#if hasFilter}
            <div class="text-sm text-muted-foreground flex-shrink-0">
                {#if filteredRows > 0}
                    Showing {filteredRows} of {totalRows} results
                {:else}
                    No results found for current filter
                {/if}
            </div>
        {/if}
        
        <!-- Right: Pagination controls using snippet -->
        {@render paginationControls()}
    </div>

    <!-- Table with optimized rendering -->
    <div class="bg-card rounded-lg shadow-md border-border overflow-hidden">
        <Table.Root>
            <Table.Header class="bg-muted/50">
                {#each table.getHeaderGroups() as headerGroup}
                    <Table.Row class="border-border hover:bg-transparent bg-background">
                        {#each headerGroup.headers as header}
                            <Table.Head class="text-card-foreground font-semibold">
                                {#if !header.isPlaceholder}
                                    {#if header.column.getCanSort()}
                                        <Button
                                            variant="ghost"
                                            onclick={header.column.getToggleSortingHandler()}
                                            class="h-auto p-0 font-semibold hover:bg-secondary hover:text-secondary-foreground"
                                        >
                                            <FlexRender
                                                content={header.column.columnDef.header}
                                                context={header.getContext()}
                                            />
                                            <ArrowUpDown class="ml-2 h-4 w-4" />
                                        </Button>
                                    {:else}
                                        <FlexRender
                                            content={header.column.columnDef.header}
                                            context={header.getContext()}
                                        />
                                    {/if}
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#if visibleRows?.length}
                    {#each visibleRows as row, index}
                        {@render tableRow(row, index)}
                    {/each}
                {:else}
                    <Table.Row>
                        <Table.Cell colspan={columns.length} class="h-24 text-center">
                            No results found.
                        </Table.Cell>
                    </Table.Row>
                {/if}
            </Table.Body>
        </Table.Root>
    </div>
    
    <!-- Items per page control -->
    <div class="flex items-center justify-end gap-2">
        <span class="text-sm text-muted-foreground">Items per page:</span>
        <Input
            type="number"
            min="1"
            max="1000"
            value={table.getState().pagination.pageSize}
            oninput={(e) => {
                const target = e.target as HTMLInputElement;
                const value = parseInt(target.value);
                if (value > 0 && value <= 1000) {
                    table.setPageSize(value);
                }
            }}
            class="w-20 h-8 text-center"
        />
    </div>
</div>