import router from 'page';
import { writable } from 'svelte/store';
import type { RouteParams } from './types/api';

export const currentRoute = writable<string>('');
export const routeParams = writable<RouteParams>({});

let currentComponent: any = null;

export const component = writable<any>(null);

export function setupRouter() {
    router('/', () => {
        currentRoute.set('/');
        routeParams.set({});
        loadComponent(() => import('./routes/Home.svelte'));
    });

    router('/email/:email', (ctx) => {
        currentRoute.set(ctx.path);
        routeParams.set({ email: ctx.params.email });
        loadComponent(() => import('./routes/SearchRoute.svelte'));
    });

    router('/domain/:domain', (ctx) => {
        currentRoute.set(ctx.path);
        routeParams.set({ domain: ctx.params.domain });
        loadComponent(() => import('./routes/SearchRoute.svelte'));
    });

    router('/password/:password', (ctx) => {
        currentRoute.set(ctx.path);
        routeParams.set({ password: ctx.params.password });
        loadComponent(() => import('./routes/SearchRoute.svelte'));
    });

    router('/username/:name', (ctx) => {
        currentRoute.set(ctx.path);
        routeParams.set({ name: ctx.params.name });
        loadComponent(() => import('./routes/SearchRoute.svelte'));
    });

    router('*', () => {
        currentRoute.set('*');
        routeParams.set({});
        loadComponent(() => import('./routes/NotFound.svelte'));
    });

    router.start();
}

async function loadComponent(componentLoader: () => Promise<any>) {
    try {
        const module = await componentLoader();
        currentComponent = module.default;
        component.set(currentComponent);
    } catch (error) {
        console.error('Failed to load component:', error);
        component.set(null);
    }
}

export function navigate(path: string) {
    router(path);
}

export { router };
