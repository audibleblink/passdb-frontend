<script lang="ts">
    import { page } from '$app/stores';
    import SearchResultLayout from '../../../components/SearchResultLayout.svelte';

    $: password = $page.params.password;

    function formatPassword(password: string): string {
        return password.length > 20 ? password.substring(0, 20) + '...' : password;
    }
</script>

<SearchResultLayout 
    params={{ password }}
    apiPath="passwords" 
    paramKey="password" 
    breadcrumbLabel="Password"
    formatBreadcrumb={formatPassword}
/>
