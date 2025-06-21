<script lang="ts">
    interface Props {
        type?: 'spinner' | 'skeleton' | 'dots';
        message?: string;
    }
    
    let { type = 'spinner', message = '' }: Props = $props();
</script>

{#if type === 'spinner'}
    <div class="flex flex-col items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        {#if message}
            <p class="mt-4 text-muted-foreground">{message}</p>
        {/if}
    </div>
{:else if type === 'skeleton'}
    <div class="space-y-4 p-4">
        {#each Array(3) as _}
            <div class="animate-pulse">
                <div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-muted rounded w-1/2"></div>
            </div>
        {/each}
    </div>
{:else if type === 'dots'}
    <div class="flex items-center justify-center space-x-2 p-8">
        <div
            class="w-3 h-3 bg-primary rounded-full animate-bounce"
            style="animation-delay: 0ms"
        ></div>
        <div
            class="w-3 h-3 bg-primary rounded-full animate-bounce"
            style="animation-delay: 150ms"
        ></div>
        <div
            class="w-3 h-3 bg-primary rounded-full animate-bounce"
            style="animation-delay: 300ms"
        ></div>
    </div>
{/if}
