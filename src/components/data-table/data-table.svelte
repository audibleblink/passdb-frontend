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
    import {
        ChevronLeft,
        ChevronRight,
        ChevronsLeft,
        ChevronsRight,
        ArrowUpDown,
    } from 'lucide-svelte';
    import { tableSettings } from '../../stores/table';

    type Props = {
        columns: ColumnDef<TData>[];
        data: TData[];
        pageSize?: number;
    };

    let { columns, data, pageSize }: Props = $props();
    
    // Use the persisted page size from the store, fallback to prop or default
    const effectivePageSize = $derived(pageSize || $tableSettings.pageSize);

    // Simple state variables
    let globalFilter = $state('');
    let sorting: SortingState = $state([]);
    let columnFilters: ColumnFiltersState = $state([]);
    let pageIndex = $state(0);
    
    // Derive pagination from pageIndex and effectivePageSize
    const pagination = $derived({ pageIndex, pageSize: effectivePageSize });

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
            pageIndex = 0;
        },
        onSortingChange: (updater) => {
            sorting = typeof updater === 'function' ? updater(sorting) : updater;
        },
        onColumnFiltersChange: (updater) => {
            columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
            pageIndex = newPagination.pageIndex;
            // Note: pageSize changes are handled through the store, not here
        },
        globalFilterFn: 'includesString',
    });

    // Simple handlers
    function handleFilterChange(event: Event) {
        const target = event.target as HTMLInputElement;
        table.setGlobalFilter(target.value);
    }
</script>

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
        
        <!-- Center: Result count (only show when filtering) -->
        {#if table.getState().globalFilter && table.getState().globalFilter.length > 0}
            <div class="text-sm text-muted-foreground flex-shrink-0">
                {#if table.getFilteredRowModel().rows.length > 0}
                    Showing {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} results
                {:else}
                    No results found for current filter
                {/if}
            </div>
        {/if}
        
        <!-- Right: Pagination controls -->
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
                Page {table.getState().pagination.pageIndex + 1} of {Math.max(
                    1,
                    table.getPageCount()
                )}
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
    </div>

    <!-- Table -->
    <div class="bg-card rounded-lg shadow-md border-border overflow-hidden">
        <Table.Root>
            <Table.Header class="bg-muted/50">
                {#each table.getHeaderGroups() as headerGroup}
                    <Table.Row class=" border-border hover:bg-transparent bg-background">
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
                {#if table.getRowModel().rows?.length}
                    {#each table.getRowModel().rows as row, index}
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
                    tableSettings.setPageSize(value);
                }
            }}
            class="w-20 h-8 text-center"
        />
    </div>
</div>

