import { w as push, J as escape_html, T as ensure_array_like, K as attr, F as bind_props, y as pop, R as store_get, S as unsubscribe_stores } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/breadcrumbs.js";
import { u as useAPI, L as LoadingStates, S as SearchResultLayout } from "../../../../chunks/SearchResultLayout.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function sanitizeHtml(html2) {
  const temp = document.createElement("div");
  temp.textContent = html2;
  return temp.innerHTML;
}
function HIBP($$payload, $$props) {
  push();
  let email = $$props["email"];
  const { data: results, loading, error, isSuccess } = useAPI(`/breaches/${email}`);
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="max-w-4xl mx-auto mt-8">`;
    LoadingStates($$payload, {
      type: "spinner",
      message: "Checking breach databases..."
    });
    $$payload.out += `<!----></div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="max-w-4xl mx-auto"><div class="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-4"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <div class="ml-3"><h3 class="text-sm font-medium text-accent-foreground">Unable to check breaches</h3> <p class="mt-1 text-sm text-accent-foreground">${escape_html(error.message)}</p></div></div></div></div>`;
  } else if (isSuccess && results) {
    $$payload.out += "<!--[2-->";
    if (results.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(results);
      $$payload.out += `<div class="max-w-4xl mx-auto mt-8 bg-card rounded-lg shadow-md"><div class="px-6 py-4 border-b border-border"><h3 class="text-lg font-semibold text-card-foreground">Data Breaches</h3> <p class="text-sm text-muted-foreground">Found ${escape_html(results.length)} breach${escape_html(results.length !== 1 ? "es" : "")} for this email</p></div> <div class="divide-y divide-border"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let breach = each_array[$$index];
        $$payload.out += `<div class="p-6"><div class="flex items-start space-x-4">`;
        if (breach.LogoPath) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="flex-shrink-0"><img${attr("src", breach.LogoPath)}${attr("alt", breach.Title)} class="w-12 h-12 rounded-lg object-cover shadow-sm"/></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <div class="flex-1 min-w-0"><div class="flex items-center justify-between"><h4 class="text-lg font-medium text-card-foreground">${escape_html(breach.Title)}</h4> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">${escape_html(Number(breach.Count).toLocaleString())} accounts</span></div> <div class="mt-2 flex items-center space-x-4 text-sm text-muted-foreground"><span class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 0l-3-3m3 3l-3 3"></path></svg> ${escape_html(breach.Domain)}</span> <span class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v8m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg> ${escape_html(breach.Date)}</span></div> <div class="mt-3 text-sm text-card-foreground">${html(sanitizeHtml(breach.Description))}</div></div></div></div>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="max-w-4xl mx-auto mt-8 text-center py-6"><svg class="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <h3 class="mt-2 text-sm font-medium text-foreground">No breaches found</h3> <p class="mt-1 text-sm text-muted-foreground">This email hasn't been found in any known data breaches</p></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { email });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let email;
  email = store_get($$store_subs ??= {}, "$page", page).params.email;
  SearchResultLayout($$payload, {
    params: { email },
    apiPath: "emails",
    paramKey: "email",
    breadcrumbLabel: "Email",
    formatBreadcrumb: (v) => v,
    children: ($$payload2) => {
      if (email) {
        $$payload2.out += "<!--[-->";
        HIBP($$payload2, { email });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
