import { R as store_get, S as unsubscribe_stores, y as pop, w as push } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/breadcrumbs.js";
import { S as SearchResultLayout } from "../../../../chunks/SearchResultLayout.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let password;
  function formatPassword(password2) {
    return password2.length > 20 ? password2.substring(0, 20) + "..." : password2;
  }
  password = store_get($$store_subs ??= {}, "$page", page).params.password;
  SearchResultLayout($$payload, {
    params: { password },
    apiPath: "passwords",
    paramKey: "password",
    breadcrumbLabel: "Password",
    formatBreadcrumb: formatPassword
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
