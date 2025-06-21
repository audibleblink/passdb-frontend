import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
    // Base configuration for all files
    {
        files: ['**/*.{js,ts,svelte}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                extraFileExtensions: ['.svelte'],
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                globalThis: 'readonly',
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                location: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                Event: 'readonly',
                CustomEvent: 'readonly',
                ErrorEvent: 'readonly',
                PromiseRejectionEvent: 'readonly',
                KeyboardEvent: 'readonly',
                MouseEvent: 'readonly',
                HTMLElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLSpanElement: 'readonly',
                HTMLParagraphElement: 'readonly',
                HTMLTableRowElement: 'readonly',
                HTMLTableSectionElement: 'readonly',
                HTMLAnchorElement: 'readonly',
                Element: 'readonly',
                Node: 'readonly',
                FileList: 'readonly',
                // Svelte 5 runes
                $state: 'readonly',
                $effect: 'readonly',
                $derived: 'readonly',
                $props: 'readonly',
                $bindable: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },

    // Svelte-specific configuration
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsParser,
            },
        },
        plugins: {
            svelte: sveltePlugin,
        },
        rules: {
            ...sveltePlugin.configs.recommended.rules,
            'svelte/no-at-html-tags': 'off',
        },
    },

    // Svelte.ts files (for runes)
    {
        files: ['**/*.svelte.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                extraFileExtensions: ['.svelte'],
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },

    // Configuration files
    {
        files: ['*.config.js', '*.config.ts'],
        languageOptions: {
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
        },
    },

    // Prettier configuration (must be last)
    prettier,

    // Ignore patterns
    {
        ignores: ['docs/', 'dist/', 'node_modules/'],
    },
];
