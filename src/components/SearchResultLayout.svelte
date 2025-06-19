<script lang="ts">
    import { get } from 'svelte/store';
    
    // For now, we'll use a simple querystring implementation
    // In a real application, you might want to use URLSearchParams
    let querystring = '';
    if (typeof window !== 'undefined') {
        querystring = window.location.search.substring(1);
    }
    import Fetcher from './Fetcher.svelte';
    import Breadcrumbs from './Breadcrumbs.svelte';
    import { breadcrumbs } from '../stores/breadcrumbs';
    import type { RouteParams } from '../types/api';

    export let params: RouteParams = {};
    export let apiPath: string;
    export let paramKey: string;
    export let breadcrumbLabel: string;
    export let formatBreadcrumb: (value: string) => string = (v) => v;

    $: paramValue = params[paramKey];
    $: endpoint = `/api/v1/${apiPath}/${paramValue}?${querystring}`;

    $: if (paramValue) {
        const displayValue = formatBreadcrumb(decodeURIComponent(paramValue));
        breadcrumbs.addFromLocation(`${breadcrumbLabel}: ${displayValue}`);
    }
</script>

<div class="space-y-8">
    <Breadcrumbs />
    <div class="px-4 py-8 space-y-8">
        <Fetcher {endpoint} />
        <slot />
    </div>
</div>