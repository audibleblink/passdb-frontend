<script lang="ts">
    import { page } from '$app/stores';
    import SearchResultLayout from '../../../components/SearchResultLayout.svelte';

    $: name = $page.params.name;
</script>

<SearchResultLayout 
    params={{ name }}
    apiPath="usernames" 
    paramKey="name" 
    breadcrumbLabel="Username"
    formatBreadcrumb={(v) => v}
/>
