<script lang="ts">
    import { navigate } from '../router';
    import * as Tabs from '$lib/components/ui/tabs';

    let activeTab = 'smart';
    let searchValues = {
        smart: '',
        username: '',
        password: '',
        domain: '',
        email: '',
    };

    type SearchType = keyof typeof searchValues;

    function handleSearch(type: SearchType) {
        const value = searchValues[type];
        if (!value) return;

        switch (type) {
            case 'smart':
                // Auto-detect search type
                if (value.includes('@')) {
                    navigate(`/email/${value}`);
                } else if (value.includes('.') && !value.includes(' ')) {
                    navigate(`/domain/${value}`);
                } else {
                    navigate(`/username/${value}`);
                }
                break;
            case 'username':
                navigate(`/username/${value}`);
                break;
            case 'password':
                navigate(`/password/${value}`);
                break;
            case 'domain':
                navigate(`/domain/${value}`);
                break;
            case 'email':
                navigate(`/email/${value}`);
                break;
        }
    }

    function handleKeydown(e: KeyboardEvent, type: SearchType) {
        if (e.key === 'Enter') {
            handleSearch(type);
        }
    }
</script>

<Tabs.Root bind:value={activeTab} class="w-full">
    <Tabs.List class="grid w-full grid-cols-5 mb-6">
        <Tabs.Trigger value="smart" class="flex items-center gap-1">Smart Search</Tabs.Trigger>

        <Tabs.Trigger value="username" class="flex items-center gap-1">Username</Tabs.Trigger>

        <Tabs.Trigger value="password" class="flex items-center gap-1">Password</Tabs.Trigger>

        <Tabs.Trigger value="domain" class="flex items-center gap-1">Domain</Tabs.Trigger>

        <Tabs.Trigger value="email" class="flex items-center gap-1">Email</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="smart" class="space-y-4">
        <div class="relative">
            <input
                bind:value={searchValues.smart}
                on:keydown={(e) => handleKeydown(e, 'smart')}
                type="text"
                placeholder="Enter username, email, or domain"
                class="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                autofocus
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                    class="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
            </div>
        </div>
        <p class="text-sm text-muted-foreground">
            Press Enter to search. I'll automatically detect the type of search.
        </p>
    </Tabs.Content>

    <Tabs.Content value="username" class="space-y-4">
        <div class="relative">
            <input
                bind:value={searchValues.username}
                on:keydown={(e) => handleKeydown(e, 'username')}
                type="text"
                placeholder="Enter username (e.g., john_doe)"
                class="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                    class="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                </svg>
            </div>
        </div>
        <p class="text-sm text-muted-foreground">Search for usernames across breach databases.</p>
    </Tabs.Content>

    <Tabs.Content value="password" class="space-y-4">
        <div class="relative">
            <input
                bind:value={searchValues.password}
                on:keydown={(e) => handleKeydown(e, 'password')}
                type="password"
                placeholder="Enter password to check"
                class="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                    class="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    ></path>
                </svg>
            </div>
        </div>
        <div class="p-3 bg-destructive/20 rounded-md">
            <p class="text-sm text-destructive">
                ⚠️ Security Warning: This password will be checked against breach databases. Only
                test passwords you no longer use.
            </p>
        </div>
    </Tabs.Content>

    <Tabs.Content value="domain" class="space-y-4">
        <div class="relative">
            <input
                bind:value={searchValues.domain}
                on:keydown={(e) => handleKeydown(e, 'domain')}
                type="text"
                placeholder="Enter domain (e.g., example.com)"
                class="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                    class="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    ></path>
                </svg>
            </div>
        </div>
        <p class="text-sm text-muted-foreground">
            Find all accounts associated with a specific domain.
        </p>
    </Tabs.Content>

    <Tabs.Content value="email" class="space-y-4">
        <div class="relative">
            <input
                bind:value={searchValues.email}
                on:keydown={(e) => handleKeydown(e, 'email')}
                type="email"
                placeholder="Enter email address"
                class="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                    class="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                </svg>
            </div>
        </div>
        <p class="text-sm text-muted-foreground">
            Search for email addresses and view detailed breach information from Have I Been Pwned.
        </p>
    </Tabs.Content>
</Tabs.Root>
