<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { WithElementRef } from 'bits-ui';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
    bind:this={ref}
    class={cn(
        'hover:bg-secondary/20 hover:text-secondary-foreground data-[state=selected]:bg-muted border-b transition-colors',
        className
    )}
    {...restProps}
>
    {@render children?.()}
</tr>
