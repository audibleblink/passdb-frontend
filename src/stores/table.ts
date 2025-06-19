import { writable } from 'svelte/store';

interface TableSettings {
    pageSize: number;
}

const STORAGE_KEY = 'passdb-table-settings';
const DEFAULT_SETTINGS: TableSettings = {
    pageSize: 15
};

function createTableSettingsStore() {
    // Initialize from localStorage or with defaults
    const initialSettings: TableSettings = (() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return { ...DEFAULT_SETTINGS, ...parsed };
                }
            } catch (error) {
                console.warn('Failed to parse table settings from localStorage:', error);
            }
        }
        return DEFAULT_SETTINGS;
    })();

    const { subscribe, set, update } = writable<TableSettings>(initialSettings);

    // Persist changes to localStorage
    function persistSettings(settings: TableSettings) {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (error) {
                console.warn('Failed to save table settings to localStorage:', error);
            }
        }
    }

    return {
        subscribe,
        setPageSize: (pageSize: number) => {
            update(settings => {
                const newSettings = { ...settings, pageSize };
                persistSettings(newSettings);
                return newSettings;
            });
        },
        reset: () => {
            persistSettings(DEFAULT_SETTINGS);
            set(DEFAULT_SETTINGS);
        }
    };
}

export const tableSettings = createTableSettingsStore();