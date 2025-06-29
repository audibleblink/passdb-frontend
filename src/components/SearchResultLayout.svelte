<script lang="ts">
    import { page } from '$app/stores';
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
    $: querystring = $page.url.search;
    $: endpoint = `/api/v1/${apiPath}/${paramValue}${querystring}`;

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