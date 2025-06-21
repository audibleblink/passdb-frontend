import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
    plugins: [
        svelte({
            preprocess: vitePreprocess(),
        }),
    ],
    server: {
        port: 5000,
        host: true,
    },
    build: {
        target: 'es2022',
        outDir: 'docs',
        emptyOutDir: true,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['svelte', 'page'],
                    'ui-core': ['bits-ui', 'clsx', 'tailwind-merge', 'lucide-svelte'],
                    'ui-table': ['@tanstack/table-core'],
                    'utils': ['mousetrap']
                }
            }
        }
    },
    base: './',
    resolve: {
        alias: {
            $lib: path.resolve('./src/lib'),
        },
    },
    optimizeDeps: {
        include: ['svelte', 'page', 'bits-ui', 'clsx', 'tailwind-merge']
    }
});
