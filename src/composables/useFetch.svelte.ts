import { tick } from 'svelte';

export interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface FetchOptions extends RequestInit {
  immediate?: boolean;
  retry?: number;
  retryDelay?: number;
}

export function useFetch<T>(
  url: string | (() => string),
  options: FetchOptions = {}
) {
  const { immediate = true, retry = 3, retryDelay = 1000, ...fetchOptions } = options;
  
  let data = $state<T | null>(null);
  let error = $state<Error | null>(null);
  let loading = $state(false);
  
  const getUrl = () => typeof url === 'function' ? url() : url;
  
  async function executeWithRetry(attempt = 0): Promise<void> {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(getUrl(), fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as T;
      }
      
      loading = false;
      await tick();
    } catch (e) {
      const fetchError = e as Error;
      
      if (attempt < retry) {
        // Don't set loading to false when retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return executeWithRetry(attempt + 1);
      }
      
      error = fetchError;
      data = null;
      loading = false;
      await tick();
    }
  }
  
  async function execute(): Promise<void> {
    return executeWithRetry(0);
  }
  
  async function mutate(newData: T | null): Promise<void> {
    data = newData;
    await tick();
  }
  
  // Auto-execute if immediate is true
  if (immediate && typeof window !== 'undefined') {
    execute();
  }
  
  // Watch for URL changes if it's a function
  if (typeof url === 'function') {
    $effect(() => {
      const currentUrl = getUrl();
      if (currentUrl && immediate) {
        execute();
      }
    });
  }
  
  return {
    get data() { return data; },
    get error() { return error; },
    get loading() { return loading; },
    get isIdle() { return !loading && !error && !data; },
    get isSuccess() { return !loading && !error && data !== null; },
    get isError() { return !loading && error !== null; },
    execute,
    mutate,
    refresh: execute,
    reset: async () => {
      data = null;
      error = null;
      loading = false;
      await tick();
    }
  };
}

// Specialized hooks for common patterns
export function useAPI<T>(endpoint: string, options?: FetchOptions) {
  const baseUrl = typeof window !== 'undefined' 
    ? (window as any).__API_BASE_URL__ || 'http://localhost:4567'
    : 'http://localhost:4567';
    
  return useFetch<T>(`${baseUrl}${endpoint}`, options);
}

export function useSearch<T>(
  endpoint: string,
  searchTerm: () => string,
  options?: FetchOptions
) {
  const baseUrl = typeof window !== 'undefined' 
    ? (window as any).__API_BASE_URL__ || 'http://localhost:4567'
    : 'http://localhost:4567';
    
  return useFetch<T>(
    () => {
      const term = searchTerm();
      return term ? `${baseUrl}${endpoint}/${encodeURIComponent(term)}` : '';
    },
    { immediate: false, ...options }
  );
}