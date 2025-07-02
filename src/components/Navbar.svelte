<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import ThemeSwitcher from './ThemeSwitcher.svelte';
    import { theme } from '../stores/theme';
    import { navigate, currentRoute } from '../router';
    import * as HoverCard from '$lib/components/ui/hover-card';
    import * as Popover from '$lib/components/ui/popover';
    import { Badge } from '$lib/components/ui/badge';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Separator } from '$lib/components/ui/separator';

    let searchValue = '';
    const host = writable(localStorage.getItem('host') || __DEFAULT_API_HOST__);
    host.subscribe((val) => localStorage.setItem('host', val));

    onMount(() => {
        theme.init();
    });

    function handleSearch(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const query = searchValue;

            if (!query) {
                navigate('/rtfm');
                return;
            }

            const [type] = query.split(':');
            const rest = query.slice(2);

            switch (type) {
                case 'u':
                    navigate(`/username/${rest}`);
                    break;
                case 'p':
                    navigate(`/password/${rest}`);
                    break;
                case 'd':
                    navigate(`/domain/${rest}`);
                    break;
                case 'e':
                    navigate(`/email/${rest}`);
                    break;
                default:
                    navigate('/rtfm');
            }
        }
    }
</script>

<nav class="bg-primary shadow-lg">
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center">
                <button
                    on:click={() => navigate('/')}
                    class="text-primary-foreground text-xl font-semibold hover:text-secondary-foreground transition-colors"
                >
                    PassDB Search
                </button>
                <div class="flex items-center m-8">
                    <!-- Theme Switcher -->
                    <ThemeSwitcher />
                </div>
            </div>

            <!-- Search and Settings -->
            <div class="flex items-center space-x-4">
                <!-- Search Input - hidden on root route -->
                {#if $currentRoute !== '/' && !$currentRoute.startsWith('/?')}
                    <div class="relative">
                        <input
                            bind:value={searchValue}
                            on:keydown={handleSearch}
                            type="text"
                            placeholder="Search "
                            class="flex h-10 w-64 rounded-md border border-input bg-background pl-3 pr-10 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        <div class="absolute right-2 top-1/2 -translate-y-1/2">
                            <HoverCard.Root>
                                <HoverCard.Trigger>
                                    <button
                                        type="button"
                                        class="text-muted-foreground hover:text-secondary-foreground transition-colors p-1"
                                        aria-label="Search help"
                                    >
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                </HoverCard.Trigger>
                                <HoverCard.Content
                                    class="w-80 bg-background border-0 shadow-2xl p-6"
                                >
                                    <div class="space-y-2">
                                        <h4 class="text-sm font-semibold">Search Operators</h4>
                                        <div class="p-3">
                                            <Separator />
                                        </div>
                                        <div class="grid grid-cols-2 gap-2 text-sm">
                                            <div class="flex items-center gap-2">
                                                <Badge variant="default" class="font-mono">u:</Badge
                                                >
                                                <span>Username search</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <Badge variant="default" class="font-mono">p:</Badge
                                                >
                                                <span>Password check</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <Badge variant="default" class="font-mono">d:</Badge
                                                >
                                                <span>Domain search</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <Badge variant="default" class="font-mono">e:</Badge
                                                >
                                                <span>Email search</span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCard.Content>
                            </HoverCard.Root>
                        </div>
                    </div>
                {/if}

                <!-- Settings Popover -->
                <Popover.Root>
                    <Popover.Trigger
                        class="p-2 text-primary-foreground bg-primary hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors"
                        aria-label="Settings"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </Popover.Trigger>
                    <Popover.Content class="w-80 bg-background border-0 shadow-2xl p-6" align="end">
                        <div class="grid gap-4">
                            <div class="space-y-2">
                                <h4 class="font-medium leading-none">API Settings</h4>
                                <p class="text-muted-foreground text-sm">
                                    Configure the API endpoint for PassDB backend.
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <div class="grid grid-cols-3 items-center gap-4">
                                    <Label for="api-host">API Host</Label>
                                    <Input
                                        id="api-host"
                                        bind:value={$host}
                                        placeholder={__DEFAULT_API_HOST__}
                                        class="col-span-2 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </Popover.Content>
                </Popover.Root>
            </div>
        </div>
    </div>
</nav>
