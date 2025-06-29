import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-static for static site generation (GitHub Pages)
        adapter: adapter({
            pages: 'docs',
            assets: 'docs',
            fallback: 'index.html',
            precompress: false,
            strict: true
        }),

        // Configure paths for GitHub Pages deployment
        paths: {
            base: process.env.NODE_ENV === 'production' ? '' : '',
        },

        // Prerender all routes for static deployment
        prerender: {
            handleHttpError: 'warn',
            handleMissingId: 'warn'
        }
    }
};

export default config;
