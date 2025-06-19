export interface SearchResult {
  username: string;
  domain: string;
  password: string;
}

export interface BreachInfo {
  Title: string;
  Domain: string;
  Date: string;
  Count: string;
  Description: string;
  LogoPath: string;
}

export interface SearchParams {
  page?: number;
  per_page?: number;
  [key: string]: string | number | undefined;
}

export type SearchType = 'username' | 'password' | 'domain' | 'email';

export interface RouteParams {
  [key: string]: string;
}
