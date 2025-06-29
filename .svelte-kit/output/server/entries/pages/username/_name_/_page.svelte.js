import { R as store_get, S as unsubscribe_stores, y as pop, w as push } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/breadcrumbs.js";
import { S as SearchResultLayout } from "../../../../chunks/SearchResultLayout.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let name;
  name = store_get($$store_subs ??= {}, "$page", page).params.name;
  SearchResultLayout($$payload, {
    params: { name },
    apiPath: "usernames",
    paramKey: "name",
    breadcrumbLabel: "Username",
    formatBreadcrumb: (v) => v
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
