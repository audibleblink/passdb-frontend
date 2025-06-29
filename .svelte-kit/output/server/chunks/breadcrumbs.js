import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { w as writable, j as get } from "./exports.js";
import { g as goto } from "./client.js";
import { a1 as getContext } from "./index.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function createNavigationStore() {
  const { subscribe, set } = writable("none");
  return {
    subscribe,
    setNavigationType: (type) => {
      set(type);
      setTimeout(() => set("none"), 100);
    }
  };
}
const navigation = createNavigationStore();
const STORAGE_KEY = "passdb-breadcrumbs";
function createBreadcrumbStore() {
  const initialBreadcrumbs = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") : [];
  if (initialBreadcrumbs.length === 0 || initialBreadcrumbs[0].path !== "/") {
    initialBreadcrumbs.unshift({
      label: "Home",
      path: "/",
      timestamp: Date.now()
    });
  }
  const { subscribe, set, update } = writable(initialBreadcrumbs);
  function persistBreadcrumbs(breadcrumbs2) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(breadcrumbs2));
    }
  }
  function addBreadcrumb(label, path) {
    const currentNavigationType = get(navigation);
    if (currentNavigationType === "back") {
      return;
    }
    update((breadcrumbs2) => {
      const lastBreadcrumb = breadcrumbs2[breadcrumbs2.length - 1];
      if (lastBreadcrumb && lastBreadcrumb.path === path) {
        return breadcrumbs2;
      }
      if (path === "/" && breadcrumbs2.some((b) => b.path === "/")) {
        return breadcrumbs2;
      }
      const newBreadcrumb = {
        label,
        path,
        timestamp: Date.now()
      };
      const updatedBreadcrumbs = [...breadcrumbs2, newBreadcrumb];
      persistBreadcrumbs(updatedBreadcrumbs);
      return updatedBreadcrumbs;
    });
  }
  function navigateToBreadcrumb(index) {
    update((breadcrumbs2) => {
      const newBreadcrumbs = breadcrumbs2.slice(0, index + 1);
      persistBreadcrumbs(newBreadcrumbs);
      return newBreadcrumbs;
    });
  }
  function goBack() {
    const currentBreadcrumbs = get({ subscribe });
    if (currentBreadcrumbs.length > 1) {
      navigation.setNavigationType("back");
      const previousBreadcrumb = currentBreadcrumbs[currentBreadcrumbs.length - 2];
      update((breadcrumbs2) => {
        const newBreadcrumbs = breadcrumbs2.slice(0, -1);
        persistBreadcrumbs(newBreadcrumbs);
        return newBreadcrumbs;
      });
      goto(previousBreadcrumb.path);
    }
  }
  function clearBreadcrumbs() {
    const homeBreadcrumb = [{
      label: "Home",
      path: "/",
      timestamp: Date.now()
    }];
    set(homeBreadcrumb);
    persistBreadcrumbs(homeBreadcrumb);
  }
  function reset() {
    clearBreadcrumbs();
  }
  function addFromLocation(customLabel) {
    const currentPage = get(page);
    const currentLocation = currentPage.url.pathname;
    if (!currentLocation) return;
    let label = customLabel;
    if (!label) {
      if (currentLocation === "/") {
        label = "Home";
      } else if (currentLocation.startsWith("/username/")) {
        const username = currentLocation.split("/")[2];
        label = `Username: ${decodeURIComponent(username)}`;
      } else if (currentLocation.startsWith("/domain/")) {
        const domain = currentLocation.split("/")[2];
        label = `Domain: ${decodeURIComponent(domain)}`;
      } else if (currentLocation.startsWith("/password/")) {
        const password = currentLocation.split("/")[2];
        const displayPassword = password.length > 20 ? password.substring(0, 20) + "..." : password;
        label = `Password: ${decodeURIComponent(displayPassword)}`;
      } else if (currentLocation.startsWith("/email/")) {
        const email = currentLocation.split("/")[2];
        label = `Email: ${decodeURIComponent(email)}`;
      } else {
        label = "Page";
      }
    }
    addBreadcrumb(label, currentLocation);
  }
  return {
    subscribe,
    addBreadcrumb,
    navigateToBreadcrumb,
    goBack,
    clearBreadcrumbs,
    reset,
    addFromLocation
  };
}
const breadcrumbs = createBreadcrumbStore();
export {
  breadcrumbs as b,
  cn as c,
  page as p
};
