import { writable } from 'svelte/store';

export type NavigationType = 'forward' | 'back' | 'none';

function createNavigationStore() {
    const { subscribe, set } = writable<NavigationType>('none');

    return {
        subscribe,
        setNavigationType: (type: NavigationType) => {
            set(type);
            // Reset to 'none' after a brief delay to avoid affecting subsequent navigations
            setTimeout(() => set('none'), 100);
        }
    };
}

export const navigation = createNavigationStore();