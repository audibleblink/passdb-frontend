<script lang="ts">
    import { page } from '$app/stores';
    import SearchResultLayout from '../../../components/SearchResultLayout.svelte';
    import HIBP from '../../../components/HIBP.svelte';

    $: email = $page.params.email;
</script>

<SearchResultLayout 
    params={{ email }}
    apiPath="emails" 
    paramKey="email" 
    breadcrumbLabel="Email"
    formatBreadcrumb={(v) => v}
>
    {#if email}
        <HIBP {email} />
    {/if}
</SearchResultLayout>
