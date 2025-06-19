<script lang="ts">
    import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import TabbedSearch from '../components/TabbedSearch.svelte';
    import { breadcrumbs } from '../stores/breadcrumbs';

    onMount(() => {
        breadcrumbs.clearBreadcrumbs();
    });
</script>

<div class="px-4 py-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-foreground mb-8">PassDB Search</h1>

        <Card.Root class="p-6 border-0">
            <TabbedSearch />
        </Card.Root>
    </div>
</div>
