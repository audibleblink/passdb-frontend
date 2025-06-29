import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        port: 5000,
        host: true,
    },
    build: {
        target: 'es2022',
    },
    optimizeDeps: {
        include: ['bits-ui', 'clsx', 'tailwind-merge', 'lucide-svelte', '@tanstack/table-core', 'mousetrap']
    }
});
