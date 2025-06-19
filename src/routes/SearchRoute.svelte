<script lang="ts">
    import SearchResultLayout from '../components/SearchResultLayout.svelte';
    import HIBP from '../components/HIBP.svelte';
    import { currentRoute } from '../router';
    import type { RouteParams } from '../types/api';

    export let params: RouteParams = {};

    function formatPassword(password: string): string {
        return password.length > 20 ? password.substring(0, 20) + '...' : password;
    }

    $: searchType = $currentRoute.split('/')[1] as keyof typeof routeConfig;
    
    const routeConfig = {
        email: { 
            apiPath: 'emails', 
            paramKey: 'email', 
            label: 'Email', 
            hasHIBP: true,
            formatter: undefined
        },
        domain: { 
            apiPath: 'domains', 
            paramKey: 'domain', 
            label: 'Domain',
            hasHIBP: false,
            formatter: undefined
        },
        password: { 
            apiPath: 'passwords', 
            paramKey: 'password', 
            label: 'Password', 
            hasHIBP: false,
            formatter: formatPassword 
        },
        username: { 
            apiPath: 'usernames', 
            paramKey: 'name', 
            label: 'Username',
            hasHIBP: false,
            formatter: undefined
        }
    } as const;

    $: config = routeConfig[searchType];
    $: paramValue = params[config?.paramKey];
</script>

{#if config}
    <SearchResultLayout 
        {params} 
        apiPath={config.apiPath} 
        paramKey={config.paramKey} 
        breadcrumbLabel={config.label}
        formatBreadcrumb={config.formatter || ((v) => v)}
    >
        {#if config.hasHIBP && paramValue}
            <HIBP email={paramValue} />
        {/if}
    </SearchResultLayout>
{/if}