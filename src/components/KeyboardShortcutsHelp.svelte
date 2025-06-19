<script lang="ts">
  import { onMount } from 'svelte';
  import { keyboardShortcuts } from '../lib/keyboard-shortcuts';
  import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '$lib/components/ui/drawer/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Keyboard } from 'lucide-svelte';

  let isOpen = false;

  onMount(() => {
    keyboardShortcuts.onHelpShow(() => {
      isOpen = true;
    });

    keyboardShortcuts.onHelpHide(() => {
      isOpen = false;
    });
  });

  $: shortcutGroups = keyboardShortcuts.getShortcutGroups();

  function formatKey(key: string): string {
    return key
      .replace('ctrl+', 'Ctrl+')
      .replace('cmd+', 'Cmd+')
      .replace('shift+', 'Shift+')
      .replace('alt+', 'Alt+')
      .replace(' ', '+');
  }

  function handleOpenChange(open: boolean) {
    isOpen = open;
  }
</script>

<Drawer bind:open={isOpen} onOpenChange={handleOpenChange}>
  <DrawerContent class="max-w-full mx-4 md:mx-8 lg:mx-16 max-h-[85vh]">
    <DrawerHeader class="text-center">
      <DrawerTitle class="flex items-center justify-center gap-2">
        <Keyboard class="w-5 h-5" />
        Keyboard Shortcuts
      </DrawerTitle>
      <DrawerDescription>
        Navigate the application faster with these keyboard shortcuts
      </DrawerDescription>
    </DrawerHeader>
    
    <div class="px-6 pb-6 space-y-6 overflow-y-auto">
      <!-- Use a responsive grid layout to make better use of the full width -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each shortcutGroups as group}
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-foreground border-b border-border pb-2">{group.title}</h3>
            <div class="space-y-2">
              {#each group.shortcuts as shortcut}
                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <span class="text-sm text-muted-foreground">{shortcut.description}</span>
                    {#if shortcut.context && shortcut.context !== 'global'}
                      <span class="text-xs text-muted-foreground/70 italic">
                        Available on {shortcut.context === 'results' ? 'search results pages' : 'table navigation'}
                      </span>
                    {/if}
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                    {#each formatKey(shortcut.key).split('+') as keyPart}
                      <Badge variant="outline" class="text-xs font-mono px-2 py-1 bg-background">
                        {keyPart}
                      </Badge>
                      {#if formatKey(shortcut.key).split('+').indexOf(keyPart) < formatKey(shortcut.key).split('+').length - 1}
                        <span class="text-xs text-muted-foreground">+</span>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
      
      <div class="text-center pt-4 border-t">
        <p class="text-xs text-muted-foreground">
          Press <Badge variant="outline" class="text-xs font-mono px-2 py-1 bg-background">?</Badge> to open this help • Press <Badge variant="outline" class="text-xs font-mono px-2 py-1 bg-background">Esc</Badge> or click outside to close
        </p>
      </div>
    </div>
  </DrawerContent>
</Drawer>

<style>
  :global(.table-row-focused) {
    background-color: hsl(var(--muted) / 0.5);
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
  }
  
  :global(.table-cell-focused) {
    background-color: hsl(var(--primary) / 0.1);
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.4);
  }
</style>