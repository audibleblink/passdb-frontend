<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    // Simple querystring implementation
    let querystring = '';
    if (typeof window !== 'undefined') {
        querystring = window.location.search.substring(1);
    }
    import type { SearchResult, SearchParams } from '../types/api';
    import DataTable from './data-table/data-table.svelte';
    import { columns } from './data-table/columns';
    import { keyboardShortcuts } from '../lib/keyboard-shortcuts';

    export let results: SearchResult[];

    const qParams = (querystring || '').split('&').filter(Boolean);
    const params: SearchParams = qParams.reduce((memo: SearchParams, param: string) => {
        const [key, val] = param.split('=');
        if (key && val) {
            memo[key] = val;
        }
        return memo;
    }, {});

    // Parse pagination parameters
    params.page = params.page ? parseInt(String(params.page)) : 1;
    params.per_page = params.per_page ? parseInt(String(params.per_page)) : undefined;

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
