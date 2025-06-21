import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { navigation } from './navigation';
import { currentRoute, navigate } from '../router';

export interface BreadcrumbItem {
    label: string;
    path: string;
    timestamp: number;
}

const STORAGE_KEY = 'passdb-breadcrumbs';

function createBreadcrumbStore() {
    // Initialize from localStorage or with Home
    const initialBreadcrumbs: BreadcrumbItem[] = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        : [];
    
    // Always ensure Home is the first breadcrumb
    if (initialBreadcrumbs.length === 0 || initialBreadcrumbs[0].path !== '/') {
        initialBreadcrumbs.unshift({
            label: 'Home',
            path: '/',
            timestamp: Date.now()
        });
    }

    const { subscribe, set, update } = writable<BreadcrumbItem[]>(initialBreadcrumbs);

    function persistBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(breadcrumbs));
        }
    }

    function addBreadcrumb(label: string, path: string) {
        // Don't add breadcrumbs during back navigation
        const currentNavigationType = get(navigation);
        if (currentNavigationType === 'back') {
            return;
        }

        update(breadcrumbs => {
            // Don't add if it's the same as the last breadcrumb
            const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
            if (lastBreadcrumb && lastBreadcrumb.path === path) {
                return breadcrumbs;
            }

            // Don't add Home if we're already on Home
            if (path === '/' && breadcrumbs.some(b => b.path === '/')) {
                return breadcrumbs;
            }

            const newBreadcrumb: BreadcrumbItem = {
                label,
                path,
                timestamp: Date.now()
            };

            const updatedBreadcrumbs = [...breadcrumbs, newBreadcrumb];

            persistBreadcrumbs(updatedBreadcrumbs);
            return updatedBreadcrumbs;
        });
    }

    function navigateToBreadcrumb(index: number) {
        update(breadcrumbs => {
            // Remove all breadcrumbs after the clicked one
            const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
            persistBreadcrumbs(newBreadcrumbs);
            return newBreadcrumbs;
        });
    }

    function goBack() {
        const currentBreadcrumbs = get({ subscribe });
        if (currentBreadcrumbs.length > 1) {
            // Set navigation type to prevent adding breadcrumb on route change
            navigation.setNavigationType('back');
            
            // Remove the last breadcrumb and navigate to the previous one
            const previousBreadcrumb = currentBreadcrumbs[currentBreadcrumbs.length - 2];
            
            update(breadcrumbs => {
                const newBreadcrumbs = breadcrumbs.slice(0, -1);
                persistBreadcrumbs(newBreadcrumbs);
                return newBreadcrumbs;
            });
            
            // Navigate to the previous breadcrumb
            navigate(previousBreadcrumb.path);
        }
    }

    function clearBreadcrumbs() {
        const homeBreadcrumb: BreadcrumbItem[] = [{
            label: 'Home',
            path: '/',
            timestamp: Date.now()
        }];
        set(homeBreadcrumb);
        persistBreadcrumbs(homeBreadcrumb);
    }

    function reset() {
        clearBreadcrumbs();
    }

    // Auto-add breadcrumbs based on current location
    function addFromLocation(customLabel?: string) {
        const currentLocation = get(currentRoute);
        if (!currentLocation) return;

        let label = customLabel;
        if (!label) {
            // Generate label from route
            if (currentLocation === '/') {
                label = 'Home';
            } else if (currentLocation.startsWith('/username/')) {
                const username = currentLocation.split('/')[2];
                label = `Username: ${decodeURIComponent(username)}`;
            } else if (currentLocation.startsWith('/domain/')) {
                const domain = currentLocation.split('/')[2];
                label = `Domain: ${decodeURIComponent(domain)}`;
            } else if (currentLocation.startsWith('/password/')) {
                const password = currentLocation.split('/')[2];
                // Truncate long passwords for display
                const displayPassword = password.length > 20 
                    ? password.substring(0, 20) + '...' 
                    : password;
                label = `Password: ${decodeURIComponent(displayPassword)}`;
            } else if (currentLocation.startsWith('/email/')) {
                const email = currentLocation.split('/')[2];
                label = `Email: ${decodeURIComponent(email)}`;
            } else {
                label = 'Page';
            }
        }

        addBreadcrumb(label, currentLocation);
    }

    return {
        subscribe,
        addBreadcrumb,
        navigateToBreadcrumb,
        goBack,
        clearBreadcrumbs,
        reset,
        addFromLocation
    };
}

export const breadcrumbs = createBreadcrumbStore();