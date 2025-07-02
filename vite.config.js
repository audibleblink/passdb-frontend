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
    define: {
        __DEFAULT_API_HOST__: JSON.stringify(process.env.VITE_DEFAULT_API_HOST || 'http://127.0.0.1:3000'),
    },
    server: {
        port: 5000,
        host: true,
    },
    build: {
        target: 'es2022',
        outDir: 'docs',
        emptyOutDir: true,
        cssCodeSplit: false,
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['svelte', 'page', 'bits-ui', 'clsx', 'tailwind-merge', 'lucide-svelte', '@tanstack/table-core', 'mousetrap']
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
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
