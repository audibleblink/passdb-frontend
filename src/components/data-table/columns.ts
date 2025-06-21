import type { ColumnDef } from '@tanstack/table-core';
import type { SearchResult } from '../../types/api';
import { renderComponent } from '$lib/components/ui/data-table';
import TableActions from './table-actions.svelte';

export const columns: ColumnDef<SearchResult>[] = [
    {
        accessorKey: 'username',
        header: 'Username',
        enableSorting: true,
        enableGlobalFilter: true,
        cell: ({ row }) => {
            const username = row.getValue('username') as string;
            const domain = row.original.domain;
            return renderComponent(TableActions, {
                type: 'username',
                username,
                domain,
                showEmailLink: true
            });
        }
    },
    {
        accessorKey: 'domain',
        header: 'Domain',
        enableSorting: true,
        enableGlobalFilter: true,
        cell: ({ row }) => {
            const domain = row.getValue('domain') as string;
            return renderComponent(TableActions, {
                type: 'domain',
                domain
            });
        }
    },
    {
        accessorKey: 'password',
        header: 'Password',
        enableSorting: false,
        enableGlobalFilter: true,
        cell: ({ row }) => {
            const password = row.getValue('password') as string;
            return renderComponent(TableActions, {
                type: 'password',
                password
            });
        }
    }
];