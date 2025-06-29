<script lang="ts">
    import { page } from '$app/stores';
    import SearchResultLayout from '../../../components/SearchResultLayout.svelte';

    $: domain = $page.params.domain;
</script>

<SearchResultLayout 
    params={{ domain }}
    apiPath="domains" 
    paramKey="domain" 
    breadcrumbLabel="Domain"
    formatBreadcrumb={(v) => v}
/>
