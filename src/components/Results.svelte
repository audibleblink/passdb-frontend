<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import type { SearchResult, SearchParams } from '../types/api';
    import DataTable from './data-table/data-table.svelte';
    import { columns } from './data-table/columns';
    import { keyboardShortcuts } from '../lib/keyboard-shortcuts';

    export let results: SearchResult[];

    $: searchParams = $page.url.searchParams;
    $: params = {
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
        per_page: searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined,
        ...Object.fromEntries(searchParams.entries())
    } as SearchParams;

    onMount(() => {
        // Setup results page shortcuts
        keyboardShortcuts.setupResultsShortcuts();
        keyboardShortcuts.setupTableShortcuts();
    });

    onDestroy(() => {
        // Reset to global context
        keyboardShortcuts.setContext('global');
    });
</script>

<div class="max-w-4xl mx-auto">
    <DataTable {columns} data={results} pageSize={params.per_page} />
</div>
