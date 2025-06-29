<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { breadcrumbs } from '../../stores/breadcrumbs';
    
    type Props = {
        type: 'username' | 'domain' | 'password';
        username?: string;
        domain?: string;
        password?: string;
        showEmailLink?: boolean;
    };

    let { type, username, domain, password, showEmailLink = false }: Props = $props();

    function handleLinkClick(path: string, label: string) {
        breadcrumbs.addBreadcrumb(label, path);
        goto(path);
    }
</script>

{#if type === 'username'}
    <div class="flex items-center gap-2">
        {#if showEmailLink && !$page.route.id?.includes('/email/') && username && username !== '-' && domain && domain !== '-'}
            <button 
                class="text-muted-foreground hover:text-secondary-foreground transition-colors"
                title="View email breach info"
                aria-label="View email breach info for {username}@{domain}"
                onclick={() => handleLinkClick(`/email/${username}@${domain}`, `Email: ${username}@${domain}`)}
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </button>
        {:else if showEmailLink && !$page.route.id?.includes('/email/')}
            <div class="w-4 h-4"></div>
        {/if}
        {#if username && username !== '-'}
            <button 
                class="text-primary hover:text-secondary-foreground hover:underline cursor-pointer transition-colors"
                onclick={() => handleLinkClick(`/username/${username}`, `Username: ${username}`)}
            >
                {username}
            </button>
        {:else}
            <span class="text-muted-foreground">-</span>
        {/if}
    </div>
{:else if type === 'domain'}
    {#if domain && domain !== '-'}
        <button 
            class="text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors"
            onclick={() => handleLinkClick(`/domain/${domain}`, `Domain: ${domain}`)}
        >
            {domain}
        </button>
    {:else}
        <span class="text-muted-foreground">-</span>
    {/if}
{:else if type === 'password'}
    <div class="font-mono max-w-xs">
        {#if password && password !== '-'}
            <button 
                class="text-primary hover:text-secondary-foreground hover:underline cursor-pointer transition-colors block truncate hover:whitespace-normal hover:break-all"
                title={password}
                onclick={() => handleLinkClick(`/password/${password}`, `Password: ${password.length > 20 ? password.substring(0, 20) + '...' : password}`)}
            >
                {password}
            </button>
        {:else}
            <span class="text-muted-foreground">-</span>
        {/if}
    </div>
{/if}
