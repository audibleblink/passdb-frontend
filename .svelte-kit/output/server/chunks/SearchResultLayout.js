import { O as sanitize_props, I as spread_props, P as slot, J as escape_html, y as pop, w as push, E as spread_attributes, X as clsx, F as bind_props, R as store_get, T as ensure_array_like, V as stringify, S as unsubscribe_stores, K as attr, W as attr_class, Q as fallback } from "./index.js";
import { c as cn, p as page, b as breadcrumbs } from "./breadcrumbs.js";
import { I as Icon, c as Input, B as Button, o as onDestroy, k as keyboardShortcuts, t as tick } from "./keyboard-shortcuts.js";
import { createTable, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, getCoreRowModel } from "@tanstack/table-core";
import "clsx";
import { w as writable } from "./exports.js";
import "./client.js";
function Arrow_up_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m21 16-4 4-4-4" }],
    ["path", { "d": "M17 20V4" }],
    ["path", { "d": "m3 8 4-4 4 4" }],
    ["path", { "d": "M7 4v16" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-up-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-left" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_right($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevrons_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m11 17-5-5 5-5" }],
    ["path", { "d": "m18 17-5-5 5-5" }]
  ];
  Icon($$payload, spread_props([
    { name: "chevrons-left" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevrons_right($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m6 17 5-5-5-5" }],
    ["path", { "d": "m13 17 5-5-5-5" }]
  ];
  Icon($$payload, spread_props([
    { name: "chevrons-right" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
class RenderComponentConfig {
  component;
  props;
  constructor(component, props = {}) {
    this.component = component;
    this.props = props;
  }
}
class RenderSnippetConfig {
  snippet;
  params;
  constructor(snippet, params) {
    this.snippet = snippet;
    this.params = params;
  }
}
function renderComponent(component, props) {
  return new RenderComponentConfig(component, props);
}
function Flex_render($$payload, $$props) {
  push();
  let { content, context } = $$props;
  if (typeof content === "string") {
    $$payload.out += "<!--[-->";
    $$payload.out += `${escape_html(content)}`;
  } else if (content instanceof Function) {
    $$payload.out += "<!--[1-->";
    const result = content(context);
    if (result instanceof RenderComponentConfig) {
      $$payload.out += "<!--[-->";
      const { component: Component, props } = result;
      $$payload.out += `<!---->`;
      Component($$payload, spread_props([props]));
      $$payload.out += `<!---->`;
    } else if (result instanceof RenderSnippetConfig) {
      $$payload.out += "<!--[1-->";
      const { snippet, params } = result;
      snippet($$payload, params);
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html(result)}`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function createSvelteTable(options) {
  const resolvedOptions = mergeObjects(
    {
      state: {},
      onStateChange() {
      },
      renderFallbackValue: null,
      mergeOptions: (defaultOptions, options2) => {
        return mergeObjects(defaultOptions, options2);
      }
    },
    options
  );
  const table = createTable(resolvedOptions);
  let state = table.initialState;
  function updateOptions() {
    table.setOptions((prev) => {
      return mergeObjects(prev, options, {
        state: mergeObjects(state, options.state || {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onStateChange: (updater) => {
          if (updater instanceof Function) state = updater(state);
          else state = mergeObjects(state, updater);
          options.onStateChange?.(updater);
        }
      });
    });
  }
  updateOptions();
  return table;
}
function mergeObjects(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source);
      for (const key in descriptors) {
        if (key in target) continue;
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i2 = sources.length - 1; i2 >= 0; i2--) {
              let s = sources[i2];
              if (typeof s === "function") s = s();
              const v = (s || {})[key];
              if (v !== void 0) return v;
            }
          }
        });
      }
    }
  }
  return target;
}
function Table($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div class="relative w-full overflow-auto"><table${spread_attributes(
    {
      class: clsx(cn("w-full caption-bottom text-sm", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></table></div>`;
  bind_props($$props, { ref });
  pop();
}
function Table_body($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<tbody${spread_attributes(
    {
      class: clsx(cn("[&_tr:last-child]:border-0", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></tbody>`;
  bind_props($$props, { ref });
  pop();
}
function Table_cell($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<td${spread_attributes(
    {
      class: clsx(cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></td>`;
  bind_props($$props, { ref });
  pop();
}
function Table_head($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<th${spread_attributes(
    {
      class: clsx(cn("text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></th>`;
  bind_props($$props, { ref });
  pop();
}
function Table_header($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<thead${spread_attributes(
    {
      class: clsx(cn("[&_tr]:border-b", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></thead>`;
  bind_props($$props, { ref });
  pop();
}
function Table_row($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<tr${spread_attributes(
    {
      class: clsx(cn("hover:bg-secondary/20 hover:text-secondary-foreground data-[state=selected]:bg-muted border-b transition-colors", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></tr>`;
  bind_props($$props, { ref });
  pop();
}
const STORAGE_KEY = "passdb-table-settings";
const DEFAULT_SETTINGS = {
  pageSize: 15
};
function createTableSettingsStore() {
  const initialSettings = (() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (error) {
        console.warn("Failed to parse table settings from localStorage:", error);
      }
    }
    return DEFAULT_SETTINGS;
  })();
  const { subscribe, set, update } = writable(initialSettings);
  function persistSettings(settings) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn("Failed to save table settings to localStorage:", error);
      }
    }
  }
  return {
    subscribe,
    setPageSize: (pageSize) => {
      update((settings) => {
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
const tableSettings = createTableSettingsStore();
function Data_table($$payload, $$props) {
  push();
  var $$store_subs;
  let { columns: columns2, data, pageSize } = $$props;
  const effectivePageSize = pageSize || store_get($$store_subs ??= {}, "$tableSettings", tableSettings).pageSize;
  let globalFilter = "";
  let sorting = [];
  let columnFilters = [];
  let pageIndex = 0;
  const pagination = { pageIndex, pageSize: effectivePageSize };
  const table = createSvelteTable({
    get data() {
      return data;
    },
    get columns() {
      return columns2;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      get globalFilter() {
        return globalFilter;
      },
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      },
      get pagination() {
        return pagination;
      }
    },
    onGlobalFilterChange: (updater) => {
      globalFilter = typeof updater === "function" ? updater(globalFilter) : updater;
      pageIndex = 0;
    },
    onSortingChange: (updater) => {
      sorting = typeof updater === "function" ? updater(sorting) : updater;
    },
    onColumnFiltersChange: (updater) => {
      columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      pageIndex = newPagination.pageIndex;
    },
    globalFilterFn: "includesString"
  });
  function handleFilterChange(event) {
    const target = event.target;
    table.setGlobalFilter(target.value);
  }
  $$payload.out += `<div class="space-y-4"><div class="flex items-center justify-between gap-4 flex-wrap"><div class="flex-1 max-w-sm min-w-0">`;
  Input($$payload, {
    placeholder: "Filter results...",
    value: table.getState().globalFilter ?? "",
    oninput: handleFilterChange,
    class: "w-full",
    "data-filter-input": true
  });
  $$payload.out += `<!----></div> `;
  if (table.getState().globalFilter && table.getState().globalFilter.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-sm text-muted-foreground flex-shrink-0">`;
    if (table.getFilteredRowModel().rows.length > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `Showing ${escape_html(table.getFilteredRowModel().rows.length)} of ${escape_html(table.getCoreRowModel().rows.length)} results`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `No results found for current filter`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex items-center space-x-2 flex-shrink-0">`;
  Button($$payload, {
    variant: "outline",
    size: "sm",
    onclick: () => table.setPageIndex(0),
    disabled: !table.getCanPreviousPage(),
    children: ($$payload2) => {
      Chevrons_left($$payload2, { class: "h-4 w-4" });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    variant: "outline",
    size: "sm",
    onclick: () => table.previousPage(),
    disabled: !table.getCanPreviousPage(),
    "data-pagination-prev": true,
    children: ($$payload2) => {
      Chevron_left($$payload2, { class: "h-4 w-4" });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> <span class="text-sm text-muted-foreground">Page ${escape_html(table.getState().pagination.pageIndex + 1)} of ${escape_html(Math.max(1, table.getPageCount()))}</span> `;
  Button($$payload, {
    variant: "outline",
    size: "sm",
    onclick: () => table.nextPage(),
    disabled: !table.getCanNextPage(),
    "data-pagination-next": true,
    children: ($$payload2) => {
      Chevron_right($$payload2, { class: "h-4 w-4" });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    variant: "outline",
    size: "sm",
    onclick: () => table.setPageIndex(table.getPageCount() - 1),
    disabled: !table.getCanNextPage(),
    children: ($$payload2) => {
      Chevrons_right($$payload2, { class: "h-4 w-4" });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></div> <div class="bg-card rounded-lg shadow-md border-border overflow-hidden"><!---->`;
  Table($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Table_header($$payload2, {
        class: "bg-muted/50",
        children: ($$payload3) => {
          const each_array = ensure_array_like(table.getHeaderGroups());
          $$payload3.out += `<!--[-->`;
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let headerGroup = each_array[$$index_1];
            $$payload3.out += `<!---->`;
            Table_row($$payload3, {
              class: " border-border hover:bg-transparent bg-background",
              children: ($$payload4) => {
                const each_array_1 = ensure_array_like(headerGroup.headers);
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let header = each_array_1[$$index];
                  $$payload4.out += `<!---->`;
                  Table_head($$payload4, {
                    class: "text-card-foreground font-semibold",
                    children: ($$payload5) => {
                      if (!header.isPlaceholder) {
                        $$payload5.out += "<!--[-->";
                        if (header.column.getCanSort()) {
                          $$payload5.out += "<!--[-->";
                          Button($$payload5, {
                            variant: "ghost",
                            onclick: header.column.getToggleSortingHandler(),
                            class: "h-auto p-0 font-semibold hover:bg-secondary hover:text-secondary-foreground",
                            children: ($$payload6) => {
                              Flex_render($$payload6, {
                                content: header.column.columnDef.header,
                                context: header.getContext()
                              });
                              $$payload6.out += `<!----> `;
                              Arrow_up_down($$payload6, { class: "ml-2 h-4 w-4" });
                              $$payload6.out += `<!---->`;
                            },
                            $$slots: { default: true }
                          });
                        } else {
                          $$payload5.out += "<!--[!-->";
                          Flex_render($$payload5, {
                            content: header.column.columnDef.header,
                            context: header.getContext()
                          });
                        }
                        $$payload5.out += `<!--]-->`;
                      } else {
                        $$payload5.out += "<!--[!-->";
                      }
                      $$payload5.out += `<!--]-->`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!---->`;
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!---->`;
      Table_body($$payload2, {
        children: ($$payload3) => {
          if (table.getRowModel().rows?.length) {
            $$payload3.out += "<!--[-->";
            const each_array_2 = ensure_array_like(table.getRowModel().rows);
            $$payload3.out += `<!--[-->`;
            for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
              let row = each_array_2[index];
              $$payload3.out += `<!---->`;
              Table_row($$payload3, {
                class: `border-b border-border/50 transition-colors ${stringify(index % 2 === 0 ? "bg-background/75 hover:bg-secondary/20" : "bg-background/90 hover:bg-secondary/30")}`,
                "data-table-row": true,
                children: ($$payload4) => {
                  const each_array_3 = ensure_array_like(row.getVisibleCells());
                  $$payload4.out += `<!--[-->`;
                  for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                    let cell = each_array_3[$$index_2];
                    $$payload4.out += `<!---->`;
                    Table_cell($$payload4, {
                      class: "text-card-foreground",
                      "data-table-cell": true,
                      children: ($$payload5) => {
                        Flex_render($$payload5, {
                          content: cell.column.columnDef.cell,
                          context: cell.getContext()
                        });
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!---->`;
                  }
                  $$payload4.out += `<!--]-->`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!---->`;
            }
            $$payload3.out += `<!--]-->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<!---->`;
            Table_row($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<!---->`;
                Table_cell($$payload4, {
                  colspan: columns2.length,
                  class: "h-24 text-center",
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->No results found.`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div> <div class="flex items-center justify-end gap-2"><span class="text-sm text-muted-foreground">Items per page:</span> `;
  Input($$payload, {
    type: "number",
    min: "1",
    max: "1000",
    value: table.getState().pagination.pageSize,
    oninput: (e) => {
      const target = e.target;
      const value = parseInt(target.value);
      if (value > 0 && value <= 1e3) {
        table.setPageSize(value);
        tableSettings.setPageSize(value);
      }
    },
    class: "w-20 h-8 text-center"
  });
  $$payload.out += `<!----></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Table_actions($$payload, $$props) {
  push();
  var $$store_subs;
  let {
    type,
    username,
    domain,
    password,
    showEmailLink = false
  } = $$props;
  if (type === "username") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center gap-2">`;
    if (showEmailLink && !store_get($$store_subs ??= {}, "$page", page).route.id?.includes("/email/") && username && username !== "-" && domain && domain !== "-") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="text-muted-foreground hover:text-secondary-foreground transition-colors" title="View email breach info"${attr("aria-label", `View email breach info for ${stringify(username)}@${stringify(domain)}`)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`;
    } else if (showEmailLink && !store_get($$store_subs ??= {}, "$page", page).route.id?.includes("/email/")) {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<div class="w-4 h-4"></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (username && username !== "-") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="text-primary hover:text-secondary-foreground hover:underline cursor-pointer transition-colors">${escape_html(username)}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-muted-foreground">-</span>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else if (type === "domain") {
    $$payload.out += "<!--[1-->";
    if (domain && domain !== "-") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors">${escape_html(domain)}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-muted-foreground">-</span>`;
    }
    $$payload.out += `<!--]-->`;
  } else if (type === "password") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="font-mono max-w-xs">`;
    if (password && password !== "-") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="text-primary hover:text-secondary-foreground hover:underline cursor-pointer transition-colors block truncate hover:whitespace-normal hover:break-all"${attr("title", password)}>${escape_html(password)}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-muted-foreground">-</span>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const columns = [
  {
    accessorKey: "username",
    header: "Username",
    enableSorting: true,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const username = row.getValue("username");
      const domain = row.original.domain;
      return renderComponent(Table_actions, {
        type: "username",
        username,
        domain,
        showEmailLink: true
      });
    }
  },
  {
    accessorKey: "domain",
    header: "Domain",
    enableSorting: true,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const domain = row.getValue("domain");
      return renderComponent(Table_actions, {
        type: "domain",
        domain
      });
    }
  },
  {
    accessorKey: "password",
    header: "Password",
    enableSorting: false,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const password = row.getValue("password");
      return renderComponent(Table_actions, {
        type: "password",
        password
      });
    }
  }
];
function Results($$payload, $$props) {
  push();
  var $$store_subs;
  let searchParams, params;
  let results = $$props["results"];
  onDestroy(() => {
    keyboardShortcuts.setContext("global");
  });
  searchParams = store_get($$store_subs ??= {}, "$page", page).url.searchParams;
  params = {
    page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
    per_page: searchParams.get("per_page") ? parseInt(searchParams.get("per_page")) : void 0,
    ...Object.fromEntries(searchParams.entries())
  };
  $$payload.out += `<div class="max-w-4xl mx-auto">`;
  Data_table($$payload, {
    columns,
    data: results,
    pageSize: params.per_page
  });
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { results });
  pop();
}
function LoadingStates($$payload, $$props) {
  let { type = "spinner", message = "" } = $$props;
  if (type === "spinner") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center p-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div> `;
    if (message) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="mt-4 text-muted-foreground">${escape_html(message)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else if (type === "skeleton") {
    $$payload.out += "<!--[1-->";
    const each_array = ensure_array_like(Array(3));
    $$payload.out += `<div class="space-y-4 p-4"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      each_array[$$index];
      $$payload.out += `<div class="animate-pulse"><div class="h-4 bg-muted rounded w-3/4 mb-2"></div> <div class="h-4 bg-muted rounded w-1/2"></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else if (type === "dots") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="flex items-center justify-center space-x-2 p-8"><div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div> <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div> <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function useFetch(url, options = {}) {
  const {
    immediate = true,
    retry = 3,
    retryDelay = 1e3,
    ...fetchOptions
  } = options;
  let data = null;
  let error = null;
  let loading = false;
  const getUrl = () => typeof url === "function" ? url() : url;
  async function executeWithRetry(attempt = 0) {
    loading = true;
    error = null;
    try {
      const response = await fetch(getUrl(), fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      loading = false;
      await tick();
    } catch (e) {
      const fetchError = e;
      if (attempt < retry) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return executeWithRetry(attempt + 1);
      }
      error = fetchError;
      data = null;
      loading = false;
      await tick();
    }
  }
  async function execute() {
    return executeWithRetry(0);
  }
  async function mutate(newData) {
    data = newData;
    await tick();
  }
  if (immediate && typeof window !== "undefined") {
    execute();
  }
  return {
    get data() {
      return data;
    },
    get error() {
      return error;
    },
    get loading() {
      return loading;
    },
    get isIdle() {
      return !loading && !error && !data;
    },
    get isSuccess() {
      return !loading && !error && data !== null;
    },
    get isError() {
      return !loading && error !== null;
    },
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
function useAPI(endpoint, options) {
  const getBaseUrl = () => typeof window !== "undefined" ? localStorage.getItem("host") || "http://localhost:4567" : "http://localhost:4567";
  return useFetch(() => `${getBaseUrl()}${endpoint}`, options);
}
function Fetcher($$payload, $$props) {
  push();
  let endpoint = $$props["endpoint"];
  const { data: results, loading, error, isSuccess } = useAPI(endpoint);
  $$payload.out += `<div class="px-4 py-8">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    LoadingStates($$payload, {
      type: "spinner",
      message: "Searching database..."
    });
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="max-w-4xl mx-auto"><div class="bg-destructive/10 border border-destructive/30 rounded-lg p-6"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <div class="ml-3"><h3 class="text-sm font-medium text-destructive">Failed to fetch results</h3> <p class="mt-2 text-sm text-destructive">${escape_html(error.message)}</p> <p class="mt-2 text-sm text-destructive">Please check your API host configuration and try again.</p></div></div></div></div>`;
  } else if (isSuccess && results) {
    $$payload.out += "<!--[2-->";
    if (results.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="max-w-4xl mx-auto"><div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="mt-2 text-sm font-medium text-foreground">No results found</h3> <p class="mt-1 text-sm text-muted-foreground">Try adjusting your search terms</p></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      Results($$payload, { results });
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { endpoint });
  pop();
}
function Breadcrumb($$payload, $$props) {
  push();
  let {
    ref = void 0,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<nav${spread_attributes(
    {
      class: clsx(className),
      "aria-label": "breadcrumb",
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></nav>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes(
    {
      class: clsx(cn("inline-flex items-center gap-1.5", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></li>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes(
    {
      role: "presentation",
      "aria-hidden": "true",
      class: clsx(cn("[&>svg]:size-3.5", className)),
      ...restProps
    }
  )}>`;
  if (children) {
    $$payload.out += "<!--[-->";
    children?.($$payload);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    Chevron_right($$payload, {});
  }
  $$payload.out += `<!--]--></li>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_list($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<ol${spread_attributes(
    {
      class: clsx(cn("text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></ol>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_page($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<span${spread_attributes(
    {
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      class: clsx(cn("text-foreground font-normal", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></span>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumbs($$payload, $$props) {
  push();
  var $$store_subs;
  let displayBreadcrumbs, responsiveClasses, needsTextTruncation;
  displayBreadcrumbs = (() => {
    const total = store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).length;
    if (total <= 4) {
      return store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).map((breadcrumb, index) => ({
        ...breadcrumb,
        originalIndex: index,
        showEllipsis: false
      }));
    } else {
      const result = [];
      result.push({
        ...store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs)[0],
        originalIndex: 0,
        showEllipsis: false
      });
      result.push({
        label: "...",
        path: "",
        timestamp: 0,
        originalIndex: -1,
        showEllipsis: true
      });
      const lastThree = store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).slice(-3);
      lastThree.forEach((breadcrumb, index) => {
        result.push({
          ...breadcrumb,
          originalIndex: total - 3 + index,
          showEllipsis: false
        });
      });
      return result;
    }
  })();
  responsiveClasses = (() => {
    const total = store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).length;
    if (total <= 3) return "text-sm px-3 py-1.5";
    if (total <= 4) return "text-sm px-2.5 py-1.5";
    return "text-xs px-2 py-1.5";
  })();
  needsTextTruncation = store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).length > 4;
  if (store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).length > 1) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="max-w-4xl mx-auto mt-6 mb-6 px-4"><div class="bg-muted/20 rounded-md py-2 px-3 border border-border/30">`;
    Breadcrumb($$payload, {
      children: ($$payload2) => {
        Breadcrumb_list($$payload2, {
          class: "gap-1 flex-nowrap overflow-hidden",
          children: ($$payload3) => {
            const each_array = ensure_array_like(displayBreadcrumbs);
            $$payload3.out += `<!--[-->`;
            for (let index = 0, $$length = each_array.length; index < $$length; index++) {
              let breadcrumb = each_array[index];
              Breadcrumb_item($$payload3, {
                class: needsTextTruncation ? "flex-shrink min-w-0" : "flex-shrink-0",
                children: ($$payload4) => {
                  if (breadcrumb.showEllipsis) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `<div class="px-2 py-1.5 text-sm font-bold text-muted-foreground bg-muted/30 rounded border border-border/20 flex items-center justify-center min-w-[32px]">...</div>`;
                  } else if (breadcrumb.originalIndex === store_get($$store_subs ??= {}, "$breadcrumbs", breadcrumbs).length - 1) {
                    $$payload4.out += "<!--[1-->";
                    Breadcrumb_page($$payload4, {
                      class: `${stringify(responsiveClasses)} font-medium text-foreground bg-background/40 rounded border border-border/40 ${stringify(needsTextTruncation ? "truncate max-w-[200px]" : "")}`,
                      title: breadcrumb.label,
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(breadcrumb.label)}`;
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$payload4.out += "<!--[!-->";
                    $$payload4.out += `<button${attr_class(`${stringify(responsiveClasses)} text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/60 transition-all duration-200 cursor-pointer rounded border border-transparent hover:border-border/40 ${stringify(needsTextTruncation ? "truncate max-w-[200px]" : "")}`)}${attr("title", breadcrumb.label)}>${escape_html(breadcrumb.label)}</button>`;
                  }
                  $$payload4.out += `<!--]-->`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              if (index < displayBreadcrumbs.length - 1) {
                $$payload3.out += "<!--[-->";
                Breadcrumb_separator($$payload3, {
                  class: "mx-1 flex-shrink-0",
                  children: ($$payload4) => {
                    Chevron_right($$payload4, { class: "h-3 w-3 text-muted-foreground/50" });
                  },
                  $$slots: { default: true }
                });
              } else {
                $$payload3.out += "<!--[!-->";
              }
              $$payload3.out += `<!--]-->`;
            }
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function SearchResultLayout($$payload, $$props) {
  push();
  var $$store_subs;
  let paramValue, querystring, endpoint;
  let params = fallback($$props["params"], () => ({}), true);
  let apiPath = $$props["apiPath"];
  let paramKey = $$props["paramKey"];
  let breadcrumbLabel = $$props["breadcrumbLabel"];
  let formatBreadcrumb = fallback($$props["formatBreadcrumb"], (v) => v);
  paramValue = params[paramKey];
  querystring = store_get($$store_subs ??= {}, "$page", page).url.search;
  endpoint = `/api/v1/${apiPath}/${paramValue}${querystring}`;
  if (paramValue) {
    const displayValue = formatBreadcrumb(decodeURIComponent(paramValue));
    breadcrumbs.addFromLocation(`${breadcrumbLabel}: ${displayValue}`);
  }
  $$payload.out += `<div class="space-y-8">`;
  Breadcrumbs($$payload);
  $$payload.out += `<!----> <div class="px-4 py-8 space-y-8">`;
  Fetcher($$payload, { endpoint });
  $$payload.out += `<!----> <!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    params,
    apiPath,
    paramKey,
    breadcrumbLabel,
    formatBreadcrumb
  });
  pop();
}
export {
  LoadingStates as L,
  SearchResultLayout as S,
  useAPI as u
};
