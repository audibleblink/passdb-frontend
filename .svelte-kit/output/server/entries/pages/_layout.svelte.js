import { z as is_array, A as get_prototype_of, C as object_prototype, w as push, y as pop, D as derived, E as spread_attributes, F as bind_props, G as getAllContexts, I as spread_props, J as escape_html, K as attr, M as copy_payload, N as assign_payload, O as sanitize_props, P as slot, Q as fallback, R as store_get, S as unsubscribe_stores, T as ensure_array_like, U as attr_style, V as stringify, W as attr_class, X as clsx, Y as element } from "../../chunks/index.js";
import { t as tick, m as mount, u as unmount, I as Icon, i as isDarkMode, a as theme, b as themes, c as Input, k as keyboardShortcuts, o as onDestroy } from "../../chunks/keyboard-shortcuts.js";
import "../../chunks/client.js";
import { c as cn, p as page } from "../../chunks/breadcrumbs.js";
import { d as defaultWindow, b as box, w as watch, e as executeCallbacks, C as Context, u as useRefById, g as getDataOpenClosed, a as useId$1, m as mergeProps, i as isBrowser$1, n as noop$1, c as isElement, E as ESCAPE, f as isSelectableInput, h as isElementHidden, T as TAB, j as isHTMLElement, k as composeHandlers, l as cssToStyleObj, o as isNotNull, s as styleToString, p as getDataOrientation, q as getAriaHidden, r as getAriaOrientation, t as ENTER, v as END, H as HOME, A as ARROW_UP, x as k, y as p, z as ARROW_DOWN, B as j, D as n, F as getDataSelected, G as getDataDisabled, I as getAriaSelected, J as getAriaDisabled, K as srOnlyStyles, S as SPACE, L as getAriaExpanded, M as isTouch, N as isFocusVisible } from "../../chunks/noop.js";
import "style-to-object";
import "clsx";
import cssesc from "css.escape";
import { computePosition, offset, shift, flip, size, arrow, hide, limitShift } from "@floating-ui/dom";
import { o as on } from "../../chunks/events.js";
import { isTabbable } from "tabbable";
import { tv } from "tailwind-variants";
const empty = [];
function snapshot(value, skip_warning = false) {
  return clone(value, /* @__PURE__ */ new Map(), "", empty);
}
function clone(value, cloned, path, paths, original = null) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element2 = value[i];
        if (i in value) {
          copy[i] = clone(element2, cloned, path, paths);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key in value) {
        copy[key] = clone(value[key], cloned, path, paths);
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function") {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        path,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
function useDebounce(callback, wait = 250) {
  let context = null;
  function debounced(...args) {
    if (context) {
      if (context.timeout) {
        clearTimeout(context.timeout);
      }
    } else {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      context = {
        timeout: null,
        runner: null,
        promise,
        resolve,
        reject
      };
    }
    context.runner = async () => {
      if (!context) return;
      const ctx = context;
      context = null;
      try {
        ctx.resolve(await callback.apply(this, args));
      } catch (error) {
        ctx.reject(error);
      }
    };
    context.timeout = setTimeout(context.runner, typeof wait === "function" ? wait() : wait);
    return context.promise;
  }
  debounced.cancel = async () => {
    if (!context || context.timeout === null) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!context || context.timeout === null) return;
    }
    clearTimeout(context.timeout);
    context.reject("Cancelled");
    context = null;
  };
  debounced.runScheduledNow = async () => {
    if (!context || !context.timeout) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!context || !context.timeout) return;
    }
    clearTimeout(context.timeout);
    context.timeout = null;
    await context.runner?.();
  };
  Object.defineProperty(debounced, "pending", {
    enumerable: true,
    get() {
      return !!context?.timeout;
    }
  });
  return debounced;
}
class ElementSize {
  #size = { width: 0, height: 0 };
  constructor(node, options = { box: "border-box" }) {
    options.window ?? defaultWindow;
    this.#size = {
      width: options.initialSize?.width ?? 0,
      height: options.initialSize?.height ?? 0
    };
  }
  get current() {
    return this.#size;
  }
  get width() {
    return this.#size.width;
  }
  get height() {
    return this.#size.height;
  }
}
class IsMounted {
  #isMounted = false;
  constructor() {
  }
  get current() {
    return this.#isMounted;
  }
}
class Previous {
  #previous = void 0;
  #curr;
  constructor(getter) {
  }
  get current() {
    return this.#previous;
  }
}
function afterSleep(ms, cb) {
  return setTimeout(cb, ms);
}
function afterTick(fn) {
  tick().then(fn);
}
function useStateMachine(initialState, machine) {
  const state = box(initialState);
  function reducer(event) {
    const nextState = machine[state.current][event];
    return nextState ?? state.current;
  }
  const dispatch = (event) => {
    state.current = reducer(event);
  };
  return { state, dispatch };
}
function usePresence(present, id) {
  let styles = {};
  let prevAnimationNameState = "none";
  const initialState = present.current ? "mounted" : "unmounted";
  let node = null;
  const prevPresent = new Previous(() => present.current);
  watch([() => id.current, () => present.current], ([id2, present2]) => {
    if (!id2 || !present2) return;
    afterTick(() => {
      node = document.getElementById(id2);
    });
  });
  const { state, dispatch } = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
    unmounted: { MOUNT: "mounted" }
  });
  watch(() => present.current, (currPresent) => {
    if (!node) {
      node = document.getElementById(id.current);
    }
    if (!node) return;
    const hasPresentChanged = currPresent !== prevPresent.current;
    if (!hasPresentChanged) return;
    const prevAnimationName = prevAnimationNameState;
    const currAnimationName = getAnimationName(node);
    if (currPresent) {
      dispatch("MOUNT");
    } else if (currAnimationName === "none" || styles.display === "none") {
      dispatch("UNMOUNT");
    } else {
      const isAnimating = prevAnimationName !== currAnimationName;
      if (prevPresent && isAnimating) {
        dispatch("ANIMATION_OUT");
      } else {
        dispatch("UNMOUNT");
      }
    }
  });
  function handleAnimationEnd(event) {
    if (!node) node = document.getElementById(id.current);
    if (!node) return;
    const currAnimationName = getAnimationName(node);
    const isCurrentAnimation = currAnimationName.includes(event.animationName) || currAnimationName === "none";
    if (event.target === node && isCurrentAnimation) {
      dispatch("ANIMATION_END");
    }
  }
  function handleAnimationStart(event) {
    if (!node) node = document.getElementById(id.current);
    if (!node) return;
    if (event.target === node) {
      prevAnimationNameState = getAnimationName(node);
    }
  }
  watch(() => state.current, () => {
    if (!node) node = document.getElementById(id.current);
    if (!node) return;
    const currAnimationName = getAnimationName(node);
    prevAnimationNameState = state.current === "mounted" ? currAnimationName : "none";
  });
  watch(() => node, (node2) => {
    if (!node2) return;
    styles = getComputedStyle(node2);
    return executeCallbacks(on(node2, "animationstart", handleAnimationStart), on(node2, "animationcancel", handleAnimationEnd), on(node2, "animationend", handleAnimationEnd));
  });
  const isPresentDerived = ["mounted", "unmountSuspended"].includes(state.current);
  return {
    get current() {
      return isPresentDerived;
    }
  };
}
function getAnimationName(node) {
  return node ? getComputedStyle(node).animationName || "none" : "none";
}
function Presence_layer($$payload, $$props) {
  push();
  let { present, forceMount, presence, id } = $$props;
  const isPresent = usePresence(box.with(() => present), box.with(() => id));
  if (forceMount || present || isPresent.current) {
    $$payload.out += "<!--[-->";
    presence?.($$payload, { present: isPresent });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function createAttrs(variant) {
  return {
    content: `data-${variant}-content`,
    trigger: `data-${variant}-trigger`,
    overlay: `data-${variant}-overlay`,
    title: `data-${variant}-title`,
    description: `data-${variant}-description`,
    close: `data-${variant}-close`,
    cancel: `data-${variant}-cancel`,
    action: `data-${variant}-action`
  };
}
class DialogRootState {
  opts;
  triggerNode = null;
  contentNode = null;
  descriptionNode = null;
  contentId = void 0;
  titleId = void 0;
  triggerId = void 0;
  descriptionId = void 0;
  cancelNode = null;
  #attrs = derived(() => createAttrs(this.opts.variant.current));
  get attrs() {
    return this.#attrs();
  }
  set attrs($$value) {
    return this.#attrs($$value);
  }
  constructor(opts) {
    this.opts = opts;
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleOpen() {
    if (this.opts.open.current) return;
    this.opts.open.current = true;
  }
  handleClose() {
    if (!this.opts.open.current) return;
    this.opts.open.current = false;
  }
  #sharedProps = derived(() => ({
    "data-state": getDataOpenClosed(this.opts.open.current)
  }));
  get sharedProps() {
    return this.#sharedProps();
  }
  set sharedProps($$value) {
    return this.#sharedProps($$value);
  }
}
class DialogTitleState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.titleId = node?.id;
      },
      deps: () => this.root.opts.open.current
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "heading",
    "aria-level": this.opts.level.current,
    [this.root.attrs.title]: "",
    ...this.root.sharedProps
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogDescriptionState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      deps: () => this.root.opts.open.current,
      onRefChange: (node) => {
        this.root.descriptionNode = node;
        this.root.descriptionId = node?.id;
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.root.attrs.description]: "",
    ...this.root.sharedProps
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      deps: () => this.root.opts.open.current,
      onRefChange: (node) => {
        this.root.contentNode = node;
        this.root.contentId = node?.id;
      }
    });
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
    "aria-modal": "true",
    "aria-describedby": this.root.descriptionId,
    "aria-labelledby": this.root.titleId,
    [this.root.attrs.content]: "",
    style: {
      pointerEvents: "auto",
      outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0
    },
    tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
    ...this.root.sharedProps
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogOverlayState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      deps: () => this.root.opts.open.current
    });
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.root.attrs.overlay]: "",
    style: { pointerEvents: "auto" },
    ...this.root.sharedProps
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
const DialogRootContext = new Context("Dialog.Root");
function useDialogRoot(props) {
  return DialogRootContext.set(new DialogRootState(props));
}
function useDialogTitle(props) {
  return new DialogTitleState(props, DialogRootContext.get());
}
function useDialogContent(props) {
  return new DialogContentState(props, DialogRootContext.get());
}
function useDialogOverlay(props) {
  return new DialogOverlayState(props, DialogRootContext.get());
}
function useDialogDescription(props) {
  return new DialogDescriptionState(props, DialogRootContext.get());
}
function Dialog_title($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    child,
    children,
    level = 2,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const titleState = useDialogTitle({
    id: box.with(() => id),
    level: box.with(() => level),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, titleState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Portal($$payload, $$props) {
  push();
  let { to = "body", children, disabled } = $$props;
  getAllContexts();
  let target = getTarget();
  function getTarget() {
    if (!isBrowser$1 || disabled) return null;
    let localTarget = null;
    if (typeof to === "string") {
      localTarget = document.querySelector(to);
    } else if (to instanceof HTMLElement || to instanceof DocumentFragment) {
      localTarget = to;
    } else ;
    return localTarget;
  }
  let instance;
  function unmountInstance() {
    if (instance) {
      unmount();
      instance = null;
    }
  }
  watch([() => target, () => disabled], ([target2, disabled2]) => {
    if (!target2 || disabled2) {
      unmountInstance();
      return;
    }
    instance = mount();
    return () => {
      unmountInstance();
    };
  });
  if (disabled) {
    $$payload.out += "<!--[-->";
    children?.($$payload);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
class CustomEventDispatcher {
  eventName;
  options;
  constructor(eventName, options = { bubbles: true, cancelable: true }) {
    this.eventName = eventName;
    this.options = options;
  }
  createEvent(detail) {
    return new CustomEvent(this.eventName, {
      ...this.options,
      detail
    });
  }
  dispatch(element2, detail) {
    const event = this.createEvent(detail);
    element2.dispatchEvent(event);
    return event;
  }
  listen(element2, callback, options) {
    const handler = (event) => {
      callback(event);
    };
    return on(element2, this.eventName, handler, options);
  }
}
function debounce(fn, wait = 500) {
  let timeout = null;
  const debounced = (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
  debounced.destroy = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
function getFirstNonCommentChild(element2) {
  if (!element2)
    return null;
  for (const child of element2.childNodes) {
    if (child.nodeType !== Node.COMMENT_NODE) {
      return child;
    }
  }
  return null;
}
function isClickTrulyOutside(event, contentNode) {
  const { clientX, clientY } = event;
  const rect = contentNode.getBoundingClientRect();
  return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
class DismissibleLayerState {
  opts;
  #interactOutsideProp;
  #behaviorType;
  #interceptedEvents = { pointerdown: false };
  #isResponsibleLayer = false;
  #isFocusInsideDOMTree = false;
  node = box(null);
  #documentObj = void 0;
  #onFocusOutside;
  currNode = null;
  #unsubClickListener = noop$1;
  constructor(opts) {
    this.opts = opts;
    useRefById({
      id: opts.id,
      ref: this.node,
      deps: () => opts.enabled.current,
      onRefChange: (node) => {
        this.currNode = node;
      }
    });
    this.#behaviorType = opts.interactOutsideBehavior;
    this.#interactOutsideProp = opts.onInteractOutside;
    this.#onFocusOutside = opts.onFocusOutside;
    let unsubEvents = noop$1;
    const cleanup = () => {
      this.#resetState();
      globalThis.bitsDismissableLayers.delete(this);
      this.#handleInteractOutside.destroy();
      unsubEvents();
    };
    watch(
      [
        () => this.opts.enabled.current,
        () => this.currNode
      ],
      ([enabled, currNode]) => {
        if (!enabled || !currNode) return;
        afterSleep(1, () => {
          if (!this.currNode) return;
          globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
          unsubEvents();
          unsubEvents = this.#addEventListeners();
        });
        return cleanup;
      }
    );
  }
  #handleFocus = (event) => {
    if (event.defaultPrevented) return;
    if (!this.currNode) return;
    afterTick(() => {
      if (!this.currNode || this.#isTargetWithinLayer(event.target)) return;
      if (event.target && !this.#isFocusInsideDOMTree) {
        this.#onFocusOutside.current?.(event);
      }
    });
  };
  #addEventListeners() {
    return executeCallbacks(
      /**
      * CAPTURE INTERACTION START
      * mark interaction-start event as intercepted.
      * mark responsible layer during interaction start
      * to avoid checking if is responsible layer during interaction end
      * when a new floating element may have been opened.
      */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
      /**
      * BUBBLE INTERACTION START
      * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
      * to avoid prematurely checking if other events were intercepted.
      */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
      /**
      * HANDLE FOCUS OUTSIDE
      */
      on(this.#documentObj, "focusin", this.#handleFocus)
    );
  }
  #handleDismiss = (e) => {
    let event = e;
    if (event.defaultPrevented) {
      event = createWrappedEvent(e);
    }
    this.#interactOutsideProp.current(e);
  };
  #handleInteractOutside = debounce(
    (e) => {
      if (!this.currNode) {
        this.#unsubClickListener();
        return;
      }
      const isEventValid = this.opts.isValidEvent.current(e, this.currNode) || isValidEvent(e, this.currNode);
      if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
        this.#unsubClickListener();
        return;
      }
      let event = e;
      if (event.defaultPrevented) {
        event = createWrappedEvent(event);
      }
      if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
        this.#unsubClickListener();
        return;
      }
      if (e.pointerType === "touch") {
        this.#unsubClickListener();
        this.#unsubClickListener = addEventListener(this.#documentObj, "click", this.#handleDismiss, { once: true });
      } else {
        this.#interactOutsideProp.current(event);
      }
    },
    10
  );
  #markInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = true;
  };
  #markNonInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = false;
  };
  #markResponsibleLayer = () => {
    if (!this.node.current) return;
    this.#isResponsibleLayer = isResponsibleLayer(this.node.current);
  };
  #isTargetWithinLayer = (target) => {
    if (!this.node.current) return false;
    return isOrContainsTarget(this.node.current, target);
  };
  #resetState = debounce(
    () => {
      for (const eventType in this.#interceptedEvents) {
        this.#interceptedEvents[eventType] = false;
      }
      this.#isResponsibleLayer = false;
    },
    20
  );
  #isAnyEventIntercepted() {
    const i = Object.values(this.#interceptedEvents).some(Boolean);
    return i;
  }
  #onfocuscapture = () => {
    this.#isFocusInsideDOMTree = true;
  };
  #onblurcapture = () => {
    this.#isFocusInsideDOMTree = false;
  };
  props = {
    onfocuscapture: this.#onfocuscapture,
    onblurcapture: this.#onblurcapture
  };
}
function useDismissibleLayer(props) {
  return new DismissibleLayerState(props);
}
function getTopMostLayer(layersArr) {
  return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
  const layersArr = [...globalThis.bitsDismissableLayers];
  const topMostLayer = getTopMostLayer(layersArr);
  if (topMostLayer) return topMostLayer[0].node.current === node;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode.node.current === node;
}
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0) return false;
  const target = e.target;
  if (!isElement(target)) return false;
  const ownerDocument = getOwnerDocument(target);
  const isValid = ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
  return isValid;
}
function createWrappedEvent(e) {
  const capturedCurrentTarget = e.currentTarget;
  const capturedTarget = e.target;
  let newEvent;
  if (e instanceof PointerEvent) {
    newEvent = new PointerEvent(e.type, e);
  } else {
    newEvent = new PointerEvent("pointerdown", e);
  }
  let isPrevented = false;
  const wrappedEvent = new Proxy(newEvent, {
    get: (target, prop) => {
      if (prop === "currentTarget") {
        return capturedCurrentTarget;
      }
      if (prop === "target") {
        return capturedTarget;
      }
      if (prop === "preventDefault") {
        return () => {
          isPrevented = true;
          if (typeof target.preventDefault === "function") {
            target.preventDefault();
          }
        };
      }
      if (prop === "defaultPrevented") {
        return isPrevented;
      }
      if (prop in target) {
        return target[prop];
      }
      return e[prop];
    }
  });
  return wrappedEvent;
}
function Dismissible_layer($$payload, $$props) {
  push();
  let {
    interactOutsideBehavior = "close",
    onInteractOutside = noop$1,
    onFocusOutside = noop$1,
    id,
    children,
    enabled,
    isValidEvent: isValidEvent2 = () => false
  } = $$props;
  const dismissibleLayerState = useDismissibleLayer({
    id: box.with(() => id),
    interactOutsideBehavior: box.with(() => interactOutsideBehavior),
    onInteractOutside: box.with(() => onInteractOutside),
    enabled: box.with(() => enabled),
    onFocusOutside: box.with(() => onFocusOutside),
    isValidEvent: box.with(() => isValidEvent2)
  });
  children?.($$payload, { props: dismissibleLayerState.props });
  $$payload.out += `<!---->`;
  pop();
}
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
class EscapeLayerState {
  opts;
  constructor(opts) {
    this.opts = opts;
    let unsubEvents = noop$1;
    watch(() => opts.enabled.current, (enabled) => {
      if (enabled) {
        globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
        unsubEvents = this.#addEventListener();
      }
      return () => {
        unsubEvents();
        globalThis.bitsEscapeLayers.delete(this);
      };
    });
  }
  #addEventListener = () => {
    return on(document, "keydown", this.#onkeydown, { passive: false });
  };
  #onkeydown = (e) => {
    if (e.key !== ESCAPE || !isResponsibleEscapeLayer(this)) return;
    const clonedEvent = new KeyboardEvent(e.type, e);
    e.preventDefault();
    const behaviorType = this.opts.escapeKeydownBehavior.current;
    if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
    this.opts.onEscapeKeydown.current(clonedEvent);
  };
}
function useEscapeLayer(props) {
  return new EscapeLayerState(props);
}
function isResponsibleEscapeLayer(instance) {
  const layersArr = [...globalThis.bitsEscapeLayers];
  const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
  if (topMostLayer) return topMostLayer[0] === instance;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode === instance;
}
function Escape_layer($$payload, $$props) {
  push();
  let {
    escapeKeydownBehavior = "close",
    onEscapeKeydown = noop$1,
    children,
    enabled
  } = $$props;
  useEscapeLayer({
    escapeKeydownBehavior: box.with(() => escapeKeydownBehavior),
    onEscapeKeydown: box.with(() => onEscapeKeydown),
    enabled: box.with(() => enabled)
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
const focusStack = box([]);
function createFocusScopeStack() {
  return {
    add(focusScope) {
      const activeFocusScope = focusStack.current[0];
      if (activeFocusScope && focusScope.id !== activeFocusScope.id) {
        activeFocusScope.pause();
      }
      focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
      focusStack.current.unshift(focusScope);
    },
    remove(focusScope) {
      focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
      focusStack.current[0]?.resume();
    },
    get current() {
      return focusStack.current;
    }
  };
}
function createFocusScopeAPI() {
  let paused = false;
  let isHandlingFocus = false;
  return {
    id: useId$1(),
    get paused() {
      return paused;
    },
    get isHandlingFocus() {
      return isHandlingFocus;
    },
    set isHandlingFocus(value) {
      isHandlingFocus = value;
    },
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
    }
  };
}
function removeFromFocusScopeArray(arr, item) {
  return [...arr].filter((i) => i.id !== item.id);
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}
function focus(element2, { select = false } = {}) {
  if (!(element2 && element2.focus))
    return;
  if (document.activeElement === element2)
    return;
  const previouslyFocusedElement = document.activeElement;
  element2.focus({ preventScroll: true });
  if (element2 !== previouslyFocusedElement && isSelectableInput(element2) && select) {
    element2.select();
  }
}
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement)
      return true;
  }
}
function findVisible(elements, container) {
  for (const element2 of elements) {
    if (!isElementHidden(element2, container))
      return element2;
  }
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode())
    nodes.push(walker.currentNode);
  return nodes;
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
const AutoFocusOnMountEvent = new CustomEventDispatcher("focusScope.autoFocusOnMount", { bubbles: false, cancelable: true });
const AutoFocusOnDestroyEvent = new CustomEventDispatcher("focusScope.autoFocusOnDestroy", { bubbles: false, cancelable: true });
const FocusScopeContext = new Context("FocusScope");
function useFocusScope({
  id,
  loop,
  enabled,
  onOpenAutoFocus,
  onCloseAutoFocus,
  forceMount
}) {
  const focusScopeStack = createFocusScopeStack();
  const focusScope = createFocusScopeAPI();
  const ref = box(null);
  const ctx = FocusScopeContext.getOr({ ignoreCloseAutoFocus: false });
  let lastFocusedElement = null;
  useRefById({ id, ref, deps: () => enabled.current });
  function manageFocus(event) {
    if (focusScope.paused || !ref.current || focusScope.isHandlingFocus) return;
    focusScope.isHandlingFocus = true;
    try {
      const target = event.target;
      if (!isHTMLElement(target)) return;
      const isWithinActiveScope = ref.current.contains(target);
      if (event.type === "focusin") {
        if (isWithinActiveScope) {
          lastFocusedElement = target;
        } else {
          if (ctx.ignoreCloseAutoFocus) return;
          focus(lastFocusedElement, { select: true });
        }
      } else if (event.type === "focusout") {
        if (!isWithinActiveScope && !ctx.ignoreCloseAutoFocus) {
          focus(lastFocusedElement, { select: true });
        }
      }
    } finally {
      focusScope.isHandlingFocus = false;
    }
  }
  function handleMutations(mutations) {
    if (!lastFocusedElement || !ref.current) return;
    let elementWasRemoved = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
        for (const removedNode of mutation.removedNodes) {
          if (removedNode === lastFocusedElement) {
            elementWasRemoved = true;
            break;
          }
          if (removedNode.nodeType === Node.ELEMENT_NODE && removedNode.contains(lastFocusedElement)) {
            elementWasRemoved = true;
            break;
          }
        }
      }
      if (elementWasRemoved) break;
    }
    if (elementWasRemoved && ref.current && !ref.current.contains(document.activeElement)) {
      focus(ref.current);
    }
  }
  watch([() => ref.current, () => enabled.current], ([container, enabled2]) => {
    if (!container || !enabled2) return;
    const removeEvents = executeCallbacks(on(document, "focusin", manageFocus), on(document, "focusout", manageFocus));
    const mutationObserver = new MutationObserver(handleMutations);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: false
    });
    return () => {
      removeEvents();
      mutationObserver.disconnect();
    };
  });
  watch([() => forceMount.current, () => ref.current], ([forceMount2, container]) => {
    if (forceMount2) return;
    const prevFocusedElement = document.activeElement;
    handleOpen(container, prevFocusedElement);
    return () => {
      if (!container) return;
      handleClose(prevFocusedElement);
    };
  });
  watch(
    [
      () => forceMount.current,
      () => ref.current,
      () => enabled.current
    ],
    ([forceMount2, container]) => {
      if (!forceMount2) return;
      const prevFocusedElement = document.activeElement;
      handleOpen(container, prevFocusedElement);
      return () => {
        if (!container) return;
        handleClose(prevFocusedElement);
      };
    }
  );
  function handleOpen(container, prevFocusedElement) {
    if (!container) container = document.getElementById(id.current);
    if (!container || !enabled.current) return;
    focusScopeStack.add(focusScope);
    const hasFocusedCandidate = container.contains(prevFocusedElement);
    if (!hasFocusedCandidate) {
      const mountEvent = AutoFocusOnMountEvent.createEvent();
      onOpenAutoFocus.current(mountEvent);
      if (!mountEvent.defaultPrevented) {
        afterTick(() => {
          if (!container) return;
          const result = focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (!result) focus(container);
        });
      }
    }
  }
  function handleClose(prevFocusedElement) {
    const destroyEvent = AutoFocusOnDestroyEvent.createEvent();
    onCloseAutoFocus.current?.(destroyEvent);
    const shouldIgnore = ctx.ignoreCloseAutoFocus;
    afterSleep(0, () => {
      if (!destroyEvent.defaultPrevented && prevFocusedElement && !shouldIgnore) {
        focus(isTabbable(prevFocusedElement) ? prevFocusedElement : document.body, { select: true });
      }
      focusScopeStack.remove(focusScope);
    });
  }
  function handleKeydown(e) {
    if (!enabled.current) return;
    if (!loop.current && !enabled.current) return;
    if (focusScope.paused) return;
    const isTabKey = e.key === TAB && !e.ctrlKey && !e.altKey && !e.metaKey;
    const focusedElement = document.activeElement;
    if (!(isTabKey && focusedElement)) return;
    const container = ref.current;
    if (!container) return;
    const [first, last] = getTabbableEdges(container);
    const hasTabbableElementsInside = first && last;
    if (!hasTabbableElementsInside) {
      if (focusedElement === container) {
        e.preventDefault();
      }
    } else {
      if (!e.shiftKey && focusedElement === last) {
        e.preventDefault();
        if (loop.current) focus(first, { select: true });
      } else if (e.shiftKey && focusedElement === first) {
        e.preventDefault();
        if (loop.current) focus(last, { select: true });
      }
    }
  }
  const props = (() => ({
    id: id.current,
    tabindex: -1,
    onkeydown: handleKeydown
  }))();
  return {
    get props() {
      return props;
    }
  };
}
function Focus_scope($$payload, $$props) {
  push();
  let {
    id,
    trapFocus = false,
    loop = false,
    onCloseAutoFocus = noop$1,
    onOpenAutoFocus = noop$1,
    focusScope,
    forceMount = false
  } = $$props;
  const focusScopeState = useFocusScope({
    enabled: box.with(() => trapFocus),
    loop: box.with(() => loop),
    onCloseAutoFocus: box.with(() => onCloseAutoFocus),
    onOpenAutoFocus: box.with(() => onOpenAutoFocus),
    id: box.with(() => id),
    forceMount: box.with(() => forceMount)
  });
  focusScope?.($$payload, { props: focusScopeState.props });
  $$payload.out += `<!---->`;
  pop();
}
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
class TextSelectionLayerState {
  opts;
  #unsubSelectionLock = noop$1;
  #ref = box(null);
  constructor(opts) {
    this.opts = opts;
    useRefById({
      id: opts.id,
      ref: this.#ref,
      deps: () => this.opts.enabled.current
    });
    let unsubEvents = noop$1;
    watch(() => this.opts.enabled.current, (isEnabled) => {
      if (isEnabled) {
        globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
        unsubEvents();
        unsubEvents = this.#addEventListeners();
      }
      return () => {
        unsubEvents();
        this.#resetSelectionLock();
        globalThis.bitsTextSelectionLayers.delete(this);
      };
    });
  }
  #addEventListeners() {
    return executeCallbacks(on(document, "pointerdown", this.#pointerdown), on(document, "pointerup", composeHandlers(this.#resetSelectionLock, this.opts.onPointerUp.current)));
  }
  #pointerdown = (e) => {
    const node = this.#ref.current;
    const target = e.target;
    if (!isHTMLElement(node) || !isHTMLElement(target) || !this.opts.enabled.current) return;
    if (!isHighestLayer(this) || !isOrContainsTarget(node, target)) return;
    this.opts.onPointerDown.current(e);
    if (e.defaultPrevented) return;
    this.#unsubSelectionLock = preventTextSelectionOverflow(node);
  };
  #resetSelectionLock = () => {
    this.#unsubSelectionLock();
    this.#unsubSelectionLock = noop$1;
  };
}
function useTextSelectionLayer(props) {
  return new TextSelectionLayerState(props);
}
const getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node) {
  const body = document.body;
  const originalBodyUserSelect = getUserSelect(body);
  const originalNodeUserSelect = getUserSelect(node);
  setUserSelect(body, "none");
  setUserSelect(node, "text");
  return () => {
    setUserSelect(body, originalBodyUserSelect);
    setUserSelect(node, originalNodeUserSelect);
  };
}
function setUserSelect(node, value) {
  node.style.userSelect = value;
  node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
  const layersArr = [...globalThis.bitsTextSelectionLayers];
  if (!layersArr.length) return false;
  const highestLayer = layersArr.at(-1);
  if (!highestLayer) return false;
  return highestLayer[0] === instance;
}
function Text_selection_layer($$payload, $$props) {
  push();
  let {
    preventOverflowTextSelection = true,
    onPointerDown = noop$1,
    onPointerUp = noop$1,
    id,
    children,
    enabled
  } = $$props;
  useTextSelectionLayer({
    id: box.with(() => id),
    onPointerDown: box.with(() => onPointerDown),
    onPointerUp: box.with(() => onPointerUp),
    enabled: box.with(() => enabled && preventOverflowTextSelection)
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function createSharedHook(factory) {
  let state = void 0;
  return (...args) => {
    return state;
  };
}
const useBodyLockStackCount = createSharedHook();
function useBodyScrollLock(initialState, restoreScrollDelay = () => null) {
  useId$1();
  useBodyLockStackCount();
  return;
}
function Scroll_lock($$payload, $$props) {
  push();
  let {
    preventScroll = true,
    restoreScrollDelay = null
  } = $$props;
  useBodyScrollLock(preventScroll, () => restoreScrollDelay);
  pop();
}
function shouldTrapFocus({ forceMount, present, trapFocus, open }) {
  if (forceMount) {
    return open && trapFocus;
  }
  return present && trapFocus && open;
}
function Dialog_overlay($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    forceMount = false,
    child,
    children,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const overlayState = useDialogOverlay({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, overlayState.props);
  {
    let presence = function($$payload2) {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, {
          props: mergeProps(mergedProps),
          ...overlayState.snippetProps
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<div${spread_attributes({ ...mergeProps(mergedProps) })}>`;
        children?.($$payload2, overlayState.snippetProps);
        $$payload2.out += `<!----></div>`;
      }
      $$payload2.out += `<!--]-->`;
    };
    Presence_layer($$payload, {
      id,
      present: overlayState.root.opts.open.current || forceMount,
      presence
    });
  }
  bind_props($$props, { ref });
  pop();
}
function Dialog_description($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const descriptionState = useDialogDescription({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, descriptionState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function get(valueOrGetValue) {
  return typeof valueOrGetValue === "function" ? valueOrGetValue() : valueOrGetValue;
}
function getDPR(element2) {
  if (typeof window === "undefined") return 1;
  const win = element2.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element2, value) {
  const dpr = getDPR(element2);
  return Math.round(value * dpr) / dpr;
}
function getFloatingContentCSSVars(name) {
  return {
    [`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
    [`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
    [`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
    [`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
    [`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`
  };
}
function useFloating(options) {
  get(options.open) ?? true;
  const middlewareOption = get(options.middleware);
  const transformOption = get(options.transform) ?? true;
  const placementOption = get(options.placement) ?? "bottom";
  const strategyOption = get(options.strategy) ?? "absolute";
  const reference = options.reference;
  let x = 0;
  let y = 0;
  const floating = box(null);
  let strategy = strategyOption;
  let placement = placementOption;
  let middlewareData = {};
  let isPositioned = false;
  const floatingStyles = (() => {
    const initialStyles = { position: strategy, left: "0", top: "0" };
    if (!floating.current) {
      return initialStyles;
    }
    const xVal = roundByDPR(floating.current, x);
    const yVal = roundByDPR(floating.current, y);
    if (transformOption) {
      return {
        ...initialStyles,
        transform: `translate(${xVal}px, ${yVal}px)`,
        ...getDPR(floating.current) >= 1.5 && { willChange: "transform" }
      };
    }
    return {
      position: strategy,
      left: `${xVal}px`,
      top: `${yVal}px`
    };
  })();
  function update() {
    if (reference.current === null || floating.current === null) return;
    computePosition(reference.current, floating.current, {
      middleware: middlewareOption,
      placement: placementOption,
      strategy: strategyOption
    }).then((position) => {
      x = position.x;
      y = position.y;
      strategy = position.strategy;
      placement = position.placement;
      middlewareData = position.middlewareData;
      isPositioned = true;
    });
  }
  return {
    floating,
    reference,
    get strategy() {
      return strategy;
    },
    get placement() {
      return placement;
    },
    get middlewareData() {
      return middlewareData;
    },
    get isPositioned() {
      return isPositioned;
    },
    get floatingStyles() {
      return floatingStyles;
    },
    get update() {
      return update;
    }
  };
}
const OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
class FloatingRootState {
  anchorNode = box(null);
  customAnchorNode = box(null);
  triggerNode = box(null);
  constructor() {
  }
}
class FloatingContentState {
  opts;
  root;
  // nodes
  contentRef = box(null);
  wrapperRef = box(null);
  arrowRef = box(null);
  // ids
  arrowId = box(useId$1());
  #transformedStyle = derived(() => {
    if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
    if (!this.opts.style) return {};
  });
  #updatePositionStrategy = void 0;
  #arrowSize = new ElementSize(() => this.arrowRef.current ?? void 0);
  #arrowWidth = derived(() => this.#arrowSize?.width ?? 0);
  #arrowHeight = derived(() => this.#arrowSize?.height ?? 0);
  #desiredPlacement = derived(() => this.opts.side?.current + (this.opts.align.current !== "center" ? `-${this.opts.align.current}` : ""));
  #boundary = derived(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
  #hasExplicitBoundaries = derived(() => this.#boundary().length > 0);
  get hasExplicitBoundaries() {
    return this.#hasExplicitBoundaries();
  }
  set hasExplicitBoundaries($$value) {
    return this.#hasExplicitBoundaries($$value);
  }
  #detectOverflowOptions = derived(() => ({
    padding: this.opts.collisionPadding.current,
    boundary: this.#boundary().filter(isNotNull),
    altBoundary: this.hasExplicitBoundaries
  }));
  get detectOverflowOptions() {
    return this.#detectOverflowOptions();
  }
  set detectOverflowOptions($$value) {
    return this.#detectOverflowOptions($$value);
  }
  #availableWidth = void 0;
  #availableHeight = void 0;
  #anchorWidth = void 0;
  #anchorHeight = void 0;
  #middleware = derived(() => [
    offset({
      mainAxis: this.opts.sideOffset.current + this.#arrowHeight(),
      alignmentAxis: this.opts.alignOffset.current
    }),
    this.opts.avoidCollisions.current && shift({
      mainAxis: true,
      crossAxis: false,
      limiter: this.opts.sticky.current === "partial" ? limitShift() : void 0,
      ...this.detectOverflowOptions
    }),
    this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
    size({
      ...this.detectOverflowOptions,
      apply: ({ rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference;
        this.#availableWidth = availableWidth;
        this.#availableHeight = availableHeight;
        this.#anchorWidth = anchorWidth;
        this.#anchorHeight = anchorHeight;
      }
    }),
    this.arrowRef.current && arrow({
      element: this.arrowRef.current,
      padding: this.opts.arrowPadding.current
    }),
    transformOrigin({
      arrowWidth: this.#arrowWidth(),
      arrowHeight: this.#arrowHeight()
    }),
    this.opts.hideWhenDetached.current && hide({
      strategy: "referenceHidden",
      ...this.detectOverflowOptions
    })
  ].filter(Boolean));
  get middleware() {
    return this.#middleware();
  }
  set middleware($$value) {
    return this.#middleware($$value);
  }
  floating;
  #placedSide = derived(() => getSideFromPlacement(this.floating.placement));
  get placedSide() {
    return this.#placedSide();
  }
  set placedSide($$value) {
    return this.#placedSide($$value);
  }
  #placedAlign = derived(() => getAlignFromPlacement(this.floating.placement));
  get placedAlign() {
    return this.#placedAlign();
  }
  set placedAlign($$value) {
    return this.#placedAlign($$value);
  }
  #arrowX = derived(() => this.floating.middlewareData.arrow?.x ?? 0);
  get arrowX() {
    return this.#arrowX();
  }
  set arrowX($$value) {
    return this.#arrowX($$value);
  }
  #arrowY = derived(() => this.floating.middlewareData.arrow?.y ?? 0);
  get arrowY() {
    return this.#arrowY();
  }
  set arrowY($$value) {
    return this.#arrowY($$value);
  }
  #cannotCenterArrow = derived(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
  get cannotCenterArrow() {
    return this.#cannotCenterArrow();
  }
  set cannotCenterArrow($$value) {
    return this.#cannotCenterArrow($$value);
  }
  contentZIndex;
  #arrowBaseSide = derived(() => OPPOSITE_SIDE[this.placedSide]);
  get arrowBaseSide() {
    return this.#arrowBaseSide();
  }
  set arrowBaseSide($$value) {
    return this.#arrowBaseSide($$value);
  }
  #wrapperProps = derived(() => ({
    id: this.opts.wrapperId.current,
    "data-bits-floating-content-wrapper": "",
    style: {
      ...this.floating.floatingStyles,
      // keep off page when measuring
      transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
      minWidth: "max-content",
      zIndex: this.contentZIndex,
      "--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
      "--bits-floating-available-width": `${this.#availableWidth}px`,
      "--bits-floating-available-height": `${this.#availableHeight}px`,
      "--bits-floating-anchor-width": `${this.#anchorWidth}px`,
      "--bits-floating-anchor-height": `${this.#anchorHeight}px`,
      // hide the content if using the hide middleware and should be hidden
      ...this.floating.middlewareData.hide?.referenceHidden && {
        visibility: "hidden",
        "pointer-events": "none"
      },
      ...this.#transformedStyle()
    },
    // Floating UI calculates logical alignment based the `dir` attribute
    dir: this.opts.dir.current
  }));
  get wrapperProps() {
    return this.#wrapperProps();
  }
  set wrapperProps($$value) {
    return this.#wrapperProps($$value);
  }
  #props = derived(() => ({
    "data-side": this.placedSide,
    "data-align": this.placedAlign,
    style: styleToString({
      ...this.#transformedStyle()
      // if the FloatingContent hasn't been placed yet (not all measurements done)
    })
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  #arrowStyle = derived(() => ({
    position: "absolute",
    left: this.arrowX ? `${this.arrowX}px` : void 0,
    top: this.arrowY ? `${this.arrowY}px` : void 0,
    [this.arrowBaseSide]: 0,
    "transform-origin": {
      top: "",
      right: "0 0",
      bottom: "center 0",
      left: "100% 0"
    }[this.placedSide],
    transform: {
      top: "translateY(100%)",
      right: "translateY(50%) rotate(90deg) translateX(-50%)",
      bottom: "rotate(180deg)",
      left: "translateY(50%) rotate(-90deg) translateX(50%)"
    }[this.placedSide],
    visibility: this.cannotCenterArrow ? "hidden" : void 0
  }));
  get arrowStyle() {
    return this.#arrowStyle();
  }
  set arrowStyle($$value) {
    return this.#arrowStyle($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    if (opts.customAnchor) {
      this.root.customAnchorNode.current = opts.customAnchor.current;
    }
    watch(() => opts.customAnchor.current, (customAnchor) => {
      this.root.customAnchorNode.current = customAnchor;
    });
    useRefById({
      id: this.opts.wrapperId,
      ref: this.wrapperRef,
      deps: () => this.opts.enabled.current
    });
    useRefById({
      id: this.opts.id,
      ref: this.contentRef,
      deps: () => this.opts.enabled.current
    });
    this.floating = useFloating({
      strategy: () => this.opts.strategy.current,
      placement: () => this.#desiredPlacement(),
      middleware: () => this.middleware,
      reference: this.root.anchorNode,
      open: () => this.opts.enabled.current
    });
    watch(() => this.contentRef.current, (contentNode) => {
      if (!contentNode) return;
      this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
    });
  }
}
class FloatingAnchorState {
  opts;
  root;
  ref = box(null);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    if (opts.virtualEl && opts.virtualEl.current) {
      root.triggerNode = box.from(opts.virtualEl.current);
    } else {
      useRefById({
        id: opts.id,
        ref: this.ref,
        onRefChange: (node) => {
          root.triggerNode.current = node;
        }
      });
    }
  }
}
const FloatingRootContext = new Context("Floating.Root");
const FloatingContentContext = new Context("Floating.Content");
function useFloatingRootState() {
  return FloatingRootContext.set(new FloatingRootState());
}
function useFloatingContentState(props) {
  return FloatingContentContext.set(new FloatingContentState(props, FloatingRootContext.get()));
}
function useFloatingAnchorState(props) {
  return new FloatingAnchorState(props, FloatingRootContext.get());
}
function transformOrigin(options) {
  return {
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
function getSideFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[0];
}
function getAlignFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[1];
}
function Floating_layer($$payload, $$props) {
  push();
  let { children } = $$props;
  useFloatingRootState();
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function boxAutoReset(defaultValue, afterMs = 1e4, onChange = noop$1) {
  let timeout = null;
  let value = defaultValue;
  function resetAfter() {
    return window.setTimeout(
      () => {
        value = defaultValue;
        onChange(defaultValue);
      },
      afterMs
    );
  }
  return box.with(() => value, (v) => {
    value = v;
    onChange(v);
    if (timeout) clearTimeout(timeout);
    timeout = resetAfter();
  });
}
function Floating_layer_anchor($$payload, $$props) {
  push();
  let { id, children, virtualEl } = $$props;
  useFloatingAnchorState({
    id: box.with(() => id),
    virtualEl: box.with(() => virtualEl)
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function Floating_layer_content($$payload, $$props) {
  push();
  let {
    content,
    side = "bottom",
    sideOffset = 0,
    align = "center",
    alignOffset = 0,
    id,
    arrowPadding = 0,
    avoidCollisions = true,
    collisionBoundary = [],
    collisionPadding = 0,
    hideWhenDetached = false,
    onPlaced = () => {
    },
    sticky = "partial",
    updatePositionStrategy = "optimized",
    strategy = "fixed",
    dir = "ltr",
    style = {},
    wrapperId = useId$1(),
    customAnchor = null,
    enabled
  } = $$props;
  const contentState = useFloatingContentState({
    side: box.with(() => side),
    sideOffset: box.with(() => sideOffset),
    align: box.with(() => align),
    alignOffset: box.with(() => alignOffset),
    id: box.with(() => id),
    arrowPadding: box.with(() => arrowPadding),
    avoidCollisions: box.with(() => avoidCollisions),
    collisionBoundary: box.with(() => collisionBoundary),
    collisionPadding: box.with(() => collisionPadding),
    hideWhenDetached: box.with(() => hideWhenDetached),
    onPlaced: box.with(() => onPlaced),
    sticky: box.with(() => sticky),
    updatePositionStrategy: box.with(() => updatePositionStrategy),
    strategy: box.with(() => strategy),
    dir: box.with(() => dir),
    style: box.with(() => style),
    enabled: box.with(() => enabled),
    wrapperId: box.with(() => wrapperId),
    customAnchor: box.with(() => customAnchor)
  });
  const mergedProps = mergeProps(contentState.wrapperProps, { style: { pointerEvents: "auto" } });
  content?.($$payload, {
    props: contentState.props,
    wrapperProps: mergedProps
  });
  $$payload.out += `<!---->`;
  pop();
}
function Floating_layer_content_static($$payload, $$props) {
  push();
  let { content } = $$props;
  content?.($$payload, { props: {}, wrapperProps: {} });
  $$payload.out += `<!---->`;
  pop();
}
const SEPARATOR_ROOT_ATTR = "data-separator-root";
class SeparatorRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: this.opts.decorative.current ? "none" : "separator",
    "aria-orientation": getAriaOrientation(this.opts.orientation.current),
    "aria-hidden": getAriaHidden(this.opts.decorative.current),
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [SEPARATOR_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function useSeparatorRoot(props) {
  return new SeparatorRootState(props);
}
function Separator$1($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    child,
    children,
    decorative = false,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSeparatorRoot({
    ref: box.with(() => ref, (v) => ref = v),
    id: box.with(() => id),
    decorative: box.with(() => decorative),
    orientation: box.with(() => orientation)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Popper_content($$payload, $$props) {
  let {
    content,
    isStatic = false,
    onPlaced,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (isStatic) {
    $$payload.out += "<!--[-->";
    Floating_layer_content_static($$payload, { content });
  } else {
    $$payload.out += "<!--[!-->";
    Floating_layer_content($$payload, spread_props([{ content, onPlaced }, restProps]));
  }
  $$payload.out += `<!--]-->`;
}
function Popper_layer_inner($$payload, $$props) {
  push();
  let {
    popper,
    onEscapeKeydown,
    escapeKeydownBehavior,
    preventOverflowTextSelection,
    id,
    onPointerDown,
    onPointerUp,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    sticky,
    hideWhenDetached,
    updatePositionStrategy,
    strategy,
    dir,
    preventScroll,
    wrapperId,
    style,
    onPlaced,
    onInteractOutside,
    onCloseAutoFocus,
    onOpenAutoFocus,
    onFocusOutside,
    interactOutsideBehavior = "close",
    loop,
    trapFocus = true,
    isValidEvent: isValidEvent2 = () => false,
    customAnchor = null,
    isStatic = false,
    enabled,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  {
    let content = function($$payload2, { props: floatingProps, wrapperProps }) {
      if (restProps.forceMount && enabled) {
        $$payload2.out += "<!--[-->";
        Scroll_lock($$payload2, { preventScroll });
      } else if (!restProps.forceMount) {
        $$payload2.out += "<!--[1-->";
        Scroll_lock($$payload2, { preventScroll });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        let focusScope = function($$payload3, { props: focusScopeProps }) {
          Escape_layer($$payload3, {
            onEscapeKeydown,
            escapeKeydownBehavior,
            enabled,
            children: ($$payload4) => {
              {
                let children = function($$payload5, { props: dismissibleProps }) {
                  Text_selection_layer($$payload5, {
                    id,
                    preventOverflowTextSelection,
                    onPointerDown,
                    onPointerUp,
                    enabled,
                    children: ($$payload6) => {
                      popper?.($$payload6, {
                        props: mergeProps(restProps, floatingProps, dismissibleProps, focusScopeProps, { style: { pointerEvents: "auto" } }),
                        wrapperProps
                      });
                      $$payload6.out += `<!---->`;
                    }
                  });
                };
                Dismissible_layer($$payload4, {
                  id,
                  onInteractOutside,
                  onFocusOutside,
                  interactOutsideBehavior,
                  isValidEvent: isValidEvent2,
                  enabled,
                  children
                });
              }
            }
          });
        };
        Focus_scope($$payload2, {
          id,
          onOpenAutoFocus,
          onCloseAutoFocus,
          loop,
          trapFocus: enabled && trapFocus,
          forceMount: restProps.forceMount,
          focusScope
        });
      }
      $$payload2.out += `<!---->`;
    };
    Popper_content($$payload, {
      isStatic,
      id,
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      updatePositionStrategy,
      strategy,
      dir,
      wrapperId,
      style,
      onPlaced,
      customAnchor,
      enabled,
      content,
      $$slots: { content: true }
    });
  }
  pop();
}
function Popper_layer($$payload, $$props) {
  let {
    popper,
    present,
    onEscapeKeydown,
    escapeKeydownBehavior,
    preventOverflowTextSelection,
    id,
    onPointerDown,
    onPointerUp,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    sticky,
    hideWhenDetached,
    updatePositionStrategy,
    strategy,
    dir,
    preventScroll,
    wrapperId,
    style,
    onPlaced,
    onInteractOutside,
    onCloseAutoFocus,
    onOpenAutoFocus,
    onFocusOutside,
    interactOutsideBehavior = "close",
    loop,
    trapFocus = true,
    isValidEvent: isValidEvent2 = () => false,
    customAnchor = null,
    isStatic = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  {
    let presence = function($$payload2) {
      Popper_layer_inner($$payload2, spread_props([
        {
          popper,
          onEscapeKeydown,
          escapeKeydownBehavior,
          preventOverflowTextSelection,
          id,
          onPointerDown,
          onPointerUp,
          side,
          sideOffset,
          align,
          alignOffset,
          arrowPadding,
          avoidCollisions,
          collisionBoundary,
          collisionPadding,
          sticky,
          hideWhenDetached,
          updatePositionStrategy,
          strategy,
          dir,
          preventScroll,
          wrapperId,
          style,
          onPlaced,
          customAnchor,
          isStatic,
          enabled: present,
          onInteractOutside,
          onCloseAutoFocus,
          onOpenAutoFocus,
          interactOutsideBehavior,
          loop,
          trapFocus,
          isValidEvent: isValidEvent2,
          onFocusOutside,
          forceMount: false
        },
        restProps
      ]));
    };
    Presence_layer($$payload, spread_props([
      { id, present },
      restProps,
      { presence, $$slots: { presence: true } }
    ]));
  }
}
function Popper_layer_force_mount($$payload, $$props) {
  let {
    popper,
    onEscapeKeydown,
    escapeKeydownBehavior,
    preventOverflowTextSelection,
    id,
    onPointerDown,
    onPointerUp,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    sticky,
    hideWhenDetached,
    updatePositionStrategy,
    strategy,
    dir,
    preventScroll,
    wrapperId,
    style,
    onPlaced,
    onInteractOutside,
    onCloseAutoFocus,
    onOpenAutoFocus,
    onFocusOutside,
    interactOutsideBehavior = "close",
    loop,
    trapFocus = true,
    isValidEvent: isValidEvent2 = () => false,
    customAnchor = null,
    isStatic = false,
    enabled,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  Popper_layer_inner($$payload, spread_props([
    {
      popper,
      onEscapeKeydown,
      escapeKeydownBehavior,
      preventOverflowTextSelection,
      id,
      onPointerDown,
      onPointerUp,
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      updatePositionStrategy,
      strategy,
      dir,
      preventScroll,
      wrapperId,
      style,
      onPlaced,
      customAnchor,
      isStatic,
      enabled,
      onInteractOutside,
      onCloseAutoFocus,
      onOpenAutoFocus,
      interactOutsideBehavior,
      loop,
      trapFocus,
      isValidEvent: isValidEvent2,
      onFocusOutside
    },
    restProps,
    { forceMount: true }
  ]));
}
function Mounted$1($$payload, $$props) {
  push();
  let { mounted = false, onMountedChange = noop$1 } = $$props;
  bind_props($$props, { mounted });
  pop();
}
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.previousElementSibling;
  }
}
const COMMAND_ROOT_ATTR = "data-command-root";
const COMMAND_EMPTY_ATTR = "data-command-empty";
const COMMAND_GROUP_ATTR = "data-command-group";
const COMMAND_GROUP_ITEMS_ATTR = "data-command-group-items";
const COMMAND_GROUP_HEADING_ATTR = "data-command-group-heading";
const COMMAND_ITEM_ATTR = "data-command-item";
const COMMAND_INPUT_LABEL_ATTR = "data-command-input-label";
const COMMAND_VALUE_ATTR = "data-value";
const COMMAND_GROUP_SELECTOR = `[${COMMAND_GROUP_ATTR}]`;
const COMMAND_GROUP_ITEMS_SELECTOR = `[${COMMAND_GROUP_ITEMS_ATTR}]`;
const COMMAND_GROUP_HEADING_SELECTOR = `[${COMMAND_GROUP_HEADING_ATTR}]`;
const COMMAND_ITEM_SELECTOR = `[${COMMAND_ITEM_ATTR}]`;
const COMMAND_VALID_ITEM_SELECTOR = `${COMMAND_ITEM_SELECTOR}:not([aria-disabled="true"])`;
const CommandRootContext = new Context("Command.Root");
const CommandGroupContainerContext = new Context("Command.Group");
const defaultState = {
  /** Value of the search query */
  search: "",
  /** Currently selected item value */
  value: "",
  filtered: {
    /** The count of all visible items. */
    count: 0,
    /** Map from visible item id to its search store. */
    items: /* @__PURE__ */ new Map(),
    /** Set of groups with at least one visible item. */
    groups: /* @__PURE__ */ new Set()
  }
};
class CommandRootState {
  opts;
  #updateScheduled = false;
  sortAfterTick = false;
  sortAndFilterAfterTick = false;
  allItems = /* @__PURE__ */ new Set();
  allGroups = /* @__PURE__ */ new Map();
  allIds = /* @__PURE__ */ new Map();
  // attempt to prevent the harsh delay when user is typing fast
  key = 0;
  viewportNode = null;
  inputNode = null;
  labelNode = null;
  // published state that the components and other things can react to
  commandState = defaultState;
  // internal state that we mutate in batches and publish to the `state` at once
  _commandState = defaultState;
  #snapshot() {
    return snapshot(this._commandState);
  }
  #scheduleUpdate() {
    if (this.#updateScheduled) return;
    this.#updateScheduled = true;
    afterTick(() => {
      this.#updateScheduled = false;
      const currentState = this.#snapshot();
      const hasStateChanged = !Object.is(this.commandState, currentState);
      if (hasStateChanged) {
        this.commandState = currentState;
        this.opts.onStateChange?.current?.(currentState);
      }
    });
  }
  setState(key, value, opts) {
    if (Object.is(this._commandState[key], value)) return;
    this._commandState[key] = value;
    if (key === "search") {
      this.#filterItems();
      this.#sort();
    } else if (key === "value") {
      if (!opts) {
        this.#scrollSelectedIntoView();
      }
    }
    this.#scheduleUpdate();
  }
  constructor(opts) {
    this.opts = opts;
    const defaults = {
      ...this._commandState,
      value: this.opts.value.current ?? ""
    };
    this._commandState = defaults;
    this.commandState = defaults;
    useRefById(opts);
    this.onkeydown = this.onkeydown.bind(this);
  }
  /**
   * Calculates score for an item based on search text and keywords.
   * Higher score = better match.
   *
   * @param value - Item's display text
   * @param keywords - Optional keywords to boost scoring
   * @returns Score from 0-1, where 0 = no match
   */
  #score(value, keywords) {
    const filter = this.opts.filter.current ?? computeCommandScore;
    const score = value ? filter(value, this._commandState.search, keywords) : 0;
    return score;
  }
  /**
   * Sorts items and groups based on search scores.
   * Groups are sorted by their highest scoring item.
   * When no search active, selects first item.
   */
  #sort() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      this.#selectFirstItem();
      return;
    }
    const scores = this._commandState.filtered.items;
    const groups = [];
    for (const value of this._commandState.filtered.groups) {
      const items = this.allGroups.get(value);
      let max = 0;
      if (!items) {
        groups.push([value, max]);
        continue;
      }
      for (const item of items) {
        const score = scores.get(item);
        max = Math.max(score ?? 0, max);
      }
      groups.push([value, max]);
    }
    const listInsertionElement = this.viewportNode;
    const sorted = this.getValidItems().sort((a, b) => {
      const valueA = a.getAttribute("data-value");
      const valueB = b.getAttribute("data-value");
      const scoresA = scores.get(valueA) ?? 0;
      const scoresB = scores.get(valueB) ?? 0;
      return scoresB - scoresA;
    });
    for (const item of sorted) {
      const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);
      if (group) {
        const itemToAppend = item.parentElement === group ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          group.appendChild(itemToAppend);
        }
      } else {
        const itemToAppend = item.parentElement === listInsertionElement ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          listInsertionElement?.appendChild(itemToAppend);
        }
      }
    }
    const sortedGroups = groups.sort((a, b) => b[1] - a[1]);
    for (const group of sortedGroups) {
      const element2 = listInsertionElement?.querySelector(`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssesc(group[0])}"]`);
      element2?.parentElement?.appendChild(element2);
    }
    this.#selectFirstItem();
  }
  /**
   * Sets current value and triggers re-render if cleared.
   *
   * @param value - New value to set
   */
  setValue(value, opts) {
    if (value !== this.opts.value.current && value === "") {
      afterTick(() => {
        this.key++;
      });
    }
    this.setState("value", value, opts);
    this.opts.value.current = value;
  }
  /**
   * Selects first non-disabled item on next tick.
   */
  #selectFirstItem() {
    afterTick(() => {
      const item = this.getValidItems().find((item2) => item2.getAttribute("aria-disabled") !== "true");
      const value = item?.getAttribute(COMMAND_VALUE_ATTR);
      this.setValue(value || "");
    });
  }
  /**
   * Updates filtered items/groups based on search.
   * Recalculates scores and filtered count.
   */
  #filterItems() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      this._commandState.filtered.count = this.allItems.size;
      return;
    }
    this._commandState.filtered.groups = /* @__PURE__ */ new Set();
    let itemCount = 0;
    for (const id of this.allItems) {
      const value = this.allIds.get(id)?.value ?? "";
      const keywords = this.allIds.get(id)?.keywords ?? [];
      const rank = this.#score(value, keywords);
      this._commandState.filtered.items.set(id, rank);
      if (rank > 0) itemCount++;
    }
    for (const [groupId, group] of this.allGroups) {
      for (const itemId of group) {
        const currItem = this._commandState.filtered.items.get(itemId);
        if (currItem && currItem > 0) {
          this._commandState.filtered.groups.add(groupId);
          break;
        }
      }
    }
    this._commandState.filtered.count = itemCount;
  }
  /**
   * Gets all non-disabled, visible command items.
   *
   * @returns Array of valid item elements
   * @remarks Exposed for direct item access and bound checking
   */
  getValidItems() {
    const node = this.opts.ref.current;
    if (!node) return [];
    const validItems = Array.from(node.querySelectorAll(COMMAND_VALID_ITEM_SELECTOR)).filter((el) => !!el);
    return validItems;
  }
  /**
   * Gets currently selected command item.
   *
   * @returns Selected element or undefined
   */
  #getSelectedItem() {
    const node = this.opts.ref.current;
    if (!node) return;
    const selectedNode = node.querySelector(`${COMMAND_VALID_ITEM_SELECTOR}[data-selected]`);
    if (!selectedNode) return;
    return selectedNode;
  }
  /**
   * Scrolls selected item into view.
   * Special handling for first items in groups.
   */
  #scrollSelectedIntoView() {
    afterTick(() => {
      const item = this.#getSelectedItem();
      if (!item) return;
      const grandparent = item.parentElement?.parentElement;
      if (!grandparent) return;
      const firstChildOfParent = getFirstNonCommentChild(grandparent);
      if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
        const closestGroupHeader = item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR);
        closestGroupHeader?.scrollIntoView({ block: "nearest" });
        return;
      }
      item.scrollIntoView({ block: "nearest" });
    });
  }
  /**
   * Sets selection to item at specified index in valid items array.
   * If index is out of bounds, does nothing.
   *
   * @param index - Zero-based index of item to select
   * @remarks
   * Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
   * Access valid items directly via `getValidItems()` to check bounds before calling.
   *
   * @example
   * // get valid items length for bounds check
   * const items = getValidItems()
   * if (index < items.length) {
   *   updateSelectedToIndex(index)
   * }
   */
  updateSelectedToIndex(index) {
    const items = this.getValidItems();
    const item = items[index];
    if (item) {
      this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    }
  }
  /**
   * Updates selected item by moving up/down relative to current selection.
   * Handles wrapping when loop option is enabled.
   *
   * @param change - Direction to move: 1 for next item, -1 for previous item
   * @remarks
   * The loop behavior wraps:
   * - From last item to first when moving next
   * - From first item to last when moving previous
   *
   * Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
   * You can call `getValidItems()` directly to get the current valid items array.
   *
   * @example
   * // select next item
   * updateSelectedByItem(1)
   *
   * // get all valid items
   * const items = getValidItems()
   */
  updateSelectedByItem(change) {
    const selected = this.#getSelectedItem();
    const items = this.getValidItems();
    const index = items.findIndex((item) => item === selected);
    let newSelected = items[index + change];
    if (this.opts.loop.current) {
      newSelected = index + change < 0 ? items[items.length - 1] : index + change === items.length ? items[0] : items[index + change];
    }
    if (newSelected) {
      this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    }
  }
  /**
   * Moves selection to the first valid item in the next/previous group.
   * If no group is found, falls back to selecting the next/previous item globally.
   *
   * @param change - Direction to move: 1 for next group, -1 for previous group
   * @example
   * // move to first item in next group
   * updateSelectedByGroup(1)
   *
   * // move to first item in previous group
   * updateSelectedByGroup(-1)
   */
  updateSelectedByGroup(change) {
    const selected = this.#getSelectedItem();
    let group = selected?.closest(COMMAND_GROUP_SELECTOR);
    let item;
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, COMMAND_GROUP_SELECTOR) : findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
      item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
    }
    if (item) {
      this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    } else {
      this.updateSelectedByItem(change);
    }
  }
  /**
   * Maps item id to display value and search keywords.
   * Returns cleanup function to remove mapping.
   *
   * @param id - Unique item identifier
   * @param value - Display text
   * @param keywords - Optional search boost terms
   * @returns Cleanup function
   */
  registerValue(value, keywords) {
    if (!(value && value === this.allIds.get(value)?.value)) {
      this.allIds.set(value, { value, keywords });
    }
    this._commandState.filtered.items.set(value, this.#score(value, keywords));
    if (!this.sortAfterTick) {
      this.sortAfterTick = true;
      afterTick(() => {
        this.#sort();
        this.sortAfterTick = false;
      });
    }
    return () => {
      this.allIds.delete(value);
    };
  }
  /**
   * Registers item in command list and its group.
   * Handles filtering, sorting and selection updates.
   *
   * @param id - Item identifier
   * @param groupId - Optional group to add item to
   * @returns Cleanup function that handles selection
   */
  registerItem(id, groupId) {
    this.allItems.add(id);
    if (groupId) {
      if (!this.allGroups.has(groupId)) {
        this.allGroups.set(groupId, /* @__PURE__ */ new Set([id]));
      } else {
        this.allGroups.get(groupId).add(id);
      }
    }
    if (!this.sortAndFilterAfterTick) {
      this.sortAndFilterAfterTick = true;
      afterTick(() => {
        this.#filterItems();
        this.#sort();
        this.sortAndFilterAfterTick = false;
      });
    }
    this.#scheduleUpdate();
    return () => {
      const selectedItem = this.#getSelectedItem();
      this.allIds.delete(id);
      this.allItems.delete(id);
      this.commandState.filtered.items.delete(id);
      this.#filterItems();
      if (selectedItem?.getAttribute("id") === id) {
        this.#selectFirstItem();
      }
      this.#scheduleUpdate();
    };
  }
  /**
   * Creates empty group if not exists.
   *
   * @param id - Group identifier
   * @returns Cleanup function
   */
  registerGroup(id) {
    if (!this.allGroups.has(id)) {
      this.allGroups.set(id, /* @__PURE__ */ new Set());
    }
    return () => {
      this.allIds.delete(id);
      this.allGroups.delete(id);
    };
  }
  /**
   * Selects last valid item.
   */
  #last() {
    return this.updateSelectedToIndex(this.getValidItems().length - 1);
  }
  /**
   * Handles next item selection:
   * - Meta: Jump to last
   * - Alt: Next group
   * - Default: Next item
   *
   * @param e - Keyboard event
   */
  #next(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.#last();
    } else if (e.altKey) {
      this.updateSelectedByGroup(1);
    } else {
      this.updateSelectedByItem(1);
    }
  }
  /**
   * Handles previous item selection:
   * - Meta: Jump to first
   * - Alt: Previous group
   * - Default: Previous item
   *
   * @param e - Keyboard event
   */
  #prev(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.updateSelectedToIndex(0);
    } else if (e.altKey) {
      this.updateSelectedByGroup(-1);
    } else {
      this.updateSelectedByItem(-1);
    }
  }
  onkeydown(e) {
    switch (e.key) {
      case n:
      case j: {
        if (this.opts.vimBindings.current && e.ctrlKey) {
          this.#next(e);
        }
        break;
      }
      case ARROW_DOWN:
        this.#next(e);
        break;
      case p:
      case k: {
        if (this.opts.vimBindings.current && e.ctrlKey) {
          this.#prev(e);
        }
        break;
      }
      case ARROW_UP:
        this.#prev(e);
        break;
      case HOME:
        e.preventDefault();
        this.updateSelectedToIndex(0);
        break;
      case END:
        e.preventDefault();
        this.#last();
        break;
      case ENTER: {
        if (!e.isComposing && e.keyCode !== 229) {
          e.preventDefault();
          const item = this.#getSelectedItem();
          if (item) {
            item?.click();
          }
        }
      }
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "application",
    [COMMAND_ROOT_ATTR]: "",
    tabindex: -1,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandEmptyState {
  opts;
  root;
  #isInitialRender = true;
  #shouldRender = derived(() => {
    return this.root._commandState.filtered.count === 0 && this.#isInitialRender === false || this.opts.forceMount.current;
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({ ...opts, deps: () => this.shouldRender });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "presentation",
    [COMMAND_EMPTY_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandGroupContainerState {
  opts;
  root;
  headingNode = null;
  trueValue = "";
  #shouldRender = derived(() => {
    if (this.opts.forceMount.current) return true;
    if (this.root.opts.shouldFilter.current === false) return true;
    if (!this.root.commandState.search) return true;
    return this.root._commandState.filtered.groups.has(this.trueValue);
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.trueValue = opts.value.current ?? opts.id.current;
    useRefById({ ...opts, deps: () => this.shouldRender });
    watch(() => this.trueValue, () => {
      return this.root.registerGroup(this.trueValue);
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "presentation",
    hidden: this.shouldRender ? void 0 : true,
    "data-value": this.trueValue,
    [COMMAND_GROUP_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandGroupHeadingState {
  opts;
  group;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.group.headingNode = node;
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [COMMAND_GROUP_HEADING_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandGroupItemsState {
  opts;
  group;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    useRefById(opts);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "group",
    [COMMAND_GROUP_ITEMS_ATTR]: "",
    "aria-labelledby": this.group.headingNode?.id ?? void 0
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandItemState {
  opts;
  root;
  #group = null;
  #trueForceMount = derived(() => {
    return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
  });
  trueValue = "";
  #shouldRender = derived(() => {
    this.opts.ref.current;
    if (this.#trueForceMount() || this.root.opts.shouldFilter.current === false || !this.root.commandState.search) {
      return true;
    }
    const currentScore = this.root.commandState.filtered.items.get(this.trueValue);
    if (currentScore === void 0) return false;
    return currentScore > 0;
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  #isSelected = derived(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
  get isSelected() {
    return this.#isSelected();
  }
  set isSelected($$value) {
    return this.#isSelected($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.#group = CommandGroupContainerContext.getOr(null);
    this.trueValue = opts.value.current;
    useRefById({
      ...opts,
      deps: () => Boolean(this.root.commandState.search)
    });
    watch(
      [
        () => this.trueValue,
        () => this.#group?.trueValue,
        () => this.opts.forceMount.current
      ],
      () => {
        if (this.opts.forceMount.current) return;
        return this.root.registerItem(this.trueValue, this.#group?.trueValue);
      }
    );
    watch(
      [
        () => this.opts.value.current,
        () => this.opts.ref.current
      ],
      () => {
        if (!this.opts.value.current && this.opts.ref.current?.textContent) {
          this.trueValue = this.opts.ref.current.textContent.trim();
        }
        this.root.registerValue(this.trueValue, opts.keywords.current.map((kw) => kw.trim()));
        this.opts.ref.current?.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
      }
    );
    this.onclick = this.onclick.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
  }
  #onSelect() {
    if (this.opts.disabled.current) return;
    this.#select();
    this.opts.onSelect?.current();
  }
  #select() {
    if (this.opts.disabled.current) return;
    this.root.setValue(this.trueValue, true);
  }
  onpointermove(_) {
    if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
    this.#select();
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#onSelect();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-disabled": getAriaDisabled(this.opts.disabled.current),
    "aria-selected": getAriaSelected(this.isSelected),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-selected": getDataSelected(this.isSelected),
    "data-value": this.trueValue,
    [COMMAND_ITEM_ATTR]: "",
    role: "option",
    onpointermove: this.onpointermove,
    onclick: this.onclick
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandLabelState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.labelNode = node;
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [COMMAND_INPUT_LABEL_ATTR]: "",
    for: this.opts.for?.current,
    style: srOnlyStyles
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function useCommandRoot(props) {
  return CommandRootContext.set(new CommandRootState(props));
}
function useCommandEmpty(props) {
  return new CommandEmptyState(props, CommandRootContext.get());
}
function useCommandItem(props) {
  const group = CommandGroupContainerContext.getOr(null);
  return new CommandItemState({ ...props, group }, CommandRootContext.get());
}
function useCommandGroupContainer(props) {
  return CommandGroupContainerContext.set(new CommandGroupContainerState(props, CommandRootContext.get()));
}
function useCommandGroupHeading(props) {
  return new CommandGroupHeadingState(props, CommandGroupContainerContext.get());
}
function useCommandGroupItems(props) {
  return new CommandGroupItemsState(props, CommandGroupContainerContext.get());
}
function useCommandLabel(props) {
  return new CommandLabelState(props, CommandRootContext.get());
}
function _command_label($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const labelState = useCommandLabel({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, labelState.props);
  $$payload.out += `<label${spread_attributes({ ...mergedProps })}>`;
  children?.($$payload);
  $$payload.out += `<!----></label>`;
  bind_props($$props, { ref });
  pop();
}
function Command$1($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    value = "",
    onValueChange = noop$1,
    onStateChange = noop$1,
    loop = false,
    shouldFilter = true,
    filter = computeCommandScore,
    label = "",
    vimBindings = true,
    disablePointerSelection = false,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useCommandRoot({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    filter: box.with(() => filter),
    shouldFilter: box.with(() => shouldFilter),
    loop: box.with(() => loop),
    value: box.with(() => value, (v) => {
      if (value !== v) {
        value = v;
        onValueChange(v);
      }
    }),
    vimBindings: box.with(() => vimBindings),
    disablePointerSelection: box.with(() => disablePointerSelection),
    onStateChange: box.with(() => onStateChange)
  });
  const updateSelectedToIndex = (i) => rootState.updateSelectedToIndex(i);
  const updateSelectedByGroup = (c) => rootState.updateSelectedByGroup(c);
  const updateSelectedByItem = (c) => rootState.updateSelectedByItem(c);
  const getValidItems = () => rootState.getValidItems();
  const mergedProps = mergeProps(restProps, rootState.props);
  function Label2($$payload2) {
    _command_label($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->${escape_html(label)}`;
      },
      $$slots: { default: true }
    });
  }
  if (child) {
    $$payload.out += "<!--[-->";
    Label2($$payload);
    $$payload.out += `<!----> `;
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    Label2($$payload);
    $$payload.out += `<!----> `;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    ref,
    value,
    updateSelectedToIndex,
    updateSelectedByGroup,
    updateSelectedByItem,
    getValidItems
  });
  pop();
}
function Command_empty$1($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    children,
    child,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const emptyState = useCommandEmpty({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    forceMount: box.with(() => forceMount)
  });
  const mergedProps = mergeProps(emptyState.props, restProps);
  if (emptyState.shouldRender) {
    $$payload.out += "<!--[-->";
    if (child) {
      $$payload.out += "<!--[-->";
      child($$payload, { props: mergedProps });
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
      children?.($$payload);
      $$payload.out += `<!----></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Command_group$1($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    value = "",
    forceMount = false,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const groupState = useCommandGroupContainer({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    forceMount: box.with(() => forceMount),
    value: box.with(() => value)
  });
  const mergedProps = mergeProps(restProps, groupState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Command_group_heading($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const headingState = useCommandGroupHeading({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, headingState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Command_group_items($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const groupItemsState = useCommandGroupItems({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, groupItemsState.props);
  $$payload.out += `<div style="display: contents;">`;
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { ref });
  pop();
}
function Command_item$1($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    value = "",
    disabled = false,
    children,
    child,
    onSelect = noop$1,
    forceMount = false,
    keywords = [],
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const itemState = useCommandItem({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    value: box.with(() => value),
    disabled: box.with(() => disabled),
    onSelect: box.with(() => onSelect),
    forceMount: box.with(() => forceMount),
    keywords: box.with(() => keywords)
  });
  const mergedProps = mergeProps(restProps, itemState.props);
  $$payload.out += `<!---->`;
  {
    $$payload.out += `<div style="display: contents;" data-item-wrapper=""${attr("data-value", itemState.trueValue)}>`;
    if (itemState.shouldRender) {
      $$payload.out += "<!--[-->";
      if (child) {
        $$payload.out += "<!--[-->";
        child($$payload, { props: mergedProps });
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload);
        $$payload.out += `<!----></div>`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;
function computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length)
      return SCORE_CONTINUE_MATCH;
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0)
    return memoizedResults[memoizeKey];
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, transposedScore, wordBreaks, spaceBreaks;
  while (index >= 0) {
    score = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** wordBreaks.length;
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** spaceBreaks.length;
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= PENALTY_SKIPPED ** (index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
function computeCommandScore(command, search, commandKeywords) {
  command = commandKeywords && commandKeywords.length > 0 ? `${`${command} ${commandKeywords?.join(" ")}`}` : command;
  return computeCommandScoreInner(command, search, formatInput(command), formatInput(search), 0, 0, {});
}
function useGraceArea(opts) {
  const enabled = opts.enabled();
  const isPointerInTransit = boxAutoReset(false, opts.transitTimeout ?? 300, (value) => {
    if (enabled) {
      opts.setIsPointerInTransit?.(value);
    }
  });
  let pointerGraceArea = null;
  function handleRemoveGraceArea() {
    pointerGraceArea = null;
    isPointerInTransit.current = false;
  }
  function handleCreateGraceArea(e, hoverTarget) {
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget)) return;
    const exitPoint = { x: e.clientX, y: e.clientY };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    pointerGraceArea = graceArea;
    isPointerInTransit.current = true;
  }
  watch(
    [
      opts.triggerNode,
      opts.contentNode,
      opts.enabled
    ],
    ([triggerNode, contentNode, enabled2]) => {
      if (!triggerNode || !contentNode || !enabled2) return;
      const handleTriggerLeave = (e) => {
        handleCreateGraceArea(e, contentNode);
      };
      const handleContentLeave = (e) => {
        handleCreateGraceArea(e, triggerNode);
      };
      return executeCallbacks(on(triggerNode, "pointerleave", handleTriggerLeave), on(contentNode, "pointerleave", handleContentLeave));
    }
  );
  watch(() => pointerGraceArea, () => {
    const handleTrackPointerGrace = (e) => {
      if (!pointerGraceArea) return;
      const target = e.target;
      if (!isElement(target)) return;
      const pointerPosition = { x: e.clientX, y: e.clientY };
      const hasEnteredTarget = opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
      const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
      if (hasEnteredTarget) {
        handleRemoveGraceArea();
      } else if (isPointerOutsideGraceArea) {
        handleRemoveGraceArea();
        opts.onPointerExit();
      }
    };
    return on(document, "pointermove", handleTrackPointerGrace);
  });
  return { isPointerInTransit };
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const tipPadding = padding * 1.5;
  switch (exitSide) {
    case "top":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y + padding
        },
        { x: exitPoint.x, y: exitPoint.y - tipPadding },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y + padding
        }
      ];
    case "bottom":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x, y: exitPoint.y + tipPadding },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y - padding
        }
      ];
    case "left":
      return [
        {
          x: exitPoint.x + padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x - tipPadding, y: exitPoint.y },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y + padding
        }
      ];
    case "right":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x + tipPadding, y: exitPoint.y },
        {
          x: exitPoint.x - padding,
          y: exitPoint.y + padding
        }
      ];
  }
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j2 = polygon.length - 1; i < polygon.length; j2 = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j2].x;
    const yj = polygon[j2].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p2 = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p2.y - r.y) >= (q.y - r.y) * (p2.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p2);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p2 = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p2.y - r.y) >= (q.y - r.y) * (p2.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p2);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
class PopoverRootState {
  opts;
  contentNode = null;
  triggerNode = null;
  constructor(opts) {
    this.opts = opts;
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  handleClose() {
    if (!this.opts.open.current) return;
    this.opts.open.current = false;
  }
}
class PopoverTriggerState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.triggerNode = node;
      }
    });
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  onclick(e) {
    if (this.opts.disabled.current) return;
    if (e.button !== 0) return;
    this.root.toggleOpen();
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (!(e.key === ENTER || e.key === SPACE)) return;
    e.preventDefault();
    this.root.toggleOpen();
  }
  #getAriaControls() {
    if (this.root.opts.open.current && this.root.contentNode?.id) {
      return this.root.contentNode?.id;
    }
    return void 0;
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": getAriaExpanded(this.root.opts.open.current),
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "aria-controls": this.#getAriaControls(),
    "data-popover-trigger": "",
    disabled: this.opts.disabled.current,
    //
    onkeydown: this.onkeydown,
    onclick: this.onclick
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class PopoverContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      deps: () => this.root.opts.open.current,
      onRefChange: (node) => {
        this.root.contentNode = node;
      }
    });
  }
  onInteractOutside = (e) => {
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    if (!isElement(e.target)) return;
    const closestTrigger = e.target.closest(`[data-popover-trigger]`);
    if (closestTrigger === this.root.triggerNode) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onCloseAutoFocus = (e) => {
    this.opts.onCloseAutoFocus.current(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    this.root.triggerNode?.focus();
  };
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "data-popover-content": "",
    style: { pointerEvents: "auto" }
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
const PopoverRootContext = new Context("Popover.Root");
function usePopoverRoot(props) {
  return PopoverRootContext.set(new PopoverRootState(props));
}
function usePopoverTrigger(props) {
  return new PopoverTriggerState(props, PopoverRootContext.get());
}
function usePopoverContent(props) {
  return new PopoverContentState(props, PopoverRootContext.get());
}
function Popover_content$1($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId$1(),
    forceMount = false,
    onCloseAutoFocus = noop$1,
    onEscapeKeydown = noop$1,
    onInteractOutside = noop$1,
    trapFocus = true,
    preventScroll = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = usePopoverContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    onInteractOutside: box.with(() => onInteractOutside),
    onEscapeKeydown: box.with(() => onEscapeKeydown),
    onCloseAutoFocus: box.with(() => onCloseAutoFocus)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
  if (forceMount) {
    $$payload.out += "<!--[-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const finalProps = mergeProps(props, {
          style: getFloatingContentCSSVars("popover")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: finalProps,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer_force_mount($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          enabled: contentState.root.opts.open.current,
          id,
          trapFocus,
          preventScroll,
          loop: true,
          forceMount: true,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else if (!forceMount) {
    $$payload.out += "<!--[1-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const finalProps = mergeProps(props, {
          style: getFloatingContentCSSVars("popover")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: finalProps,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          present: contentState.root.opts.open.current,
          id,
          trapFocus,
          preventScroll,
          loop: true,
          forceMount: false,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Popover_trigger($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId$1(),
    ref = null,
    type = "button",
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = usePopoverTrigger({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    disabled: box.with(() => Boolean(disabled))
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  bind_props($$props, { ref });
  pop();
}
function Dialog($$payload, $$props) {
  push();
  let { open = false, onOpenChange = noop$1, children } = $$props;
  useDialogRoot({
    variant: box.with(() => "dialog"),
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    })
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  bind_props($$props, { open });
  pop();
}
function Dialog_content($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    children,
    child,
    ref = null,
    forceMount = false,
    onCloseAutoFocus = noop$1,
    onOpenAutoFocus = noop$1,
    onEscapeKeydown = noop$1,
    onInteractOutside = noop$1,
    trapFocus = true,
    preventScroll = true,
    restoreScrollDelay = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useDialogContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
  {
    let presence = function($$payload2) {
      {
        let focusScope = function($$payload3, { props: focusScopeProps }) {
          Escape_layer($$payload3, spread_props([
            mergedProps,
            {
              enabled: contentState.root.opts.open.current,
              onEscapeKeydown: (e) => {
                onEscapeKeydown(e);
                if (e.defaultPrevented) return;
                contentState.root.handleClose();
              },
              children: ($$payload4) => {
                Dismissible_layer($$payload4, spread_props([
                  mergedProps,
                  {
                    enabled: contentState.root.opts.open.current,
                    onInteractOutside: (e) => {
                      onInteractOutside(e);
                      if (e.defaultPrevented) return;
                      contentState.root.handleClose();
                    },
                    children: ($$payload5) => {
                      Text_selection_layer($$payload5, spread_props([
                        mergedProps,
                        {
                          enabled: contentState.root.opts.open.current,
                          children: ($$payload6) => {
                            if (child) {
                              $$payload6.out += "<!--[-->";
                              if (contentState.root.opts.open.current) {
                                $$payload6.out += "<!--[-->";
                                Scroll_lock($$payload6, { preventScroll, restoreScrollDelay });
                              } else {
                                $$payload6.out += "<!--[!-->";
                              }
                              $$payload6.out += `<!--]--> `;
                              child($$payload6, {
                                props: mergeProps(mergedProps, focusScopeProps),
                                ...contentState.snippetProps
                              });
                              $$payload6.out += `<!---->`;
                            } else {
                              $$payload6.out += "<!--[!-->";
                              Scroll_lock($$payload6, { preventScroll });
                              $$payload6.out += `<!----> <div${spread_attributes(
                                {
                                  ...mergeProps(mergedProps, focusScopeProps)
                                }
                              )}>`;
                              children?.($$payload6);
                              $$payload6.out += `<!----></div>`;
                            }
                            $$payload6.out += `<!--]-->`;
                          },
                          $$slots: { default: true }
                        }
                      ]));
                    },
                    $$slots: { default: true }
                  }
                ]));
              },
              $$slots: { default: true }
            }
          ]));
        };
        Focus_scope($$payload2, {
          loop: true,
          trapFocus: shouldTrapFocus({
            forceMount,
            present: contentState.root.opts.open.current,
            trapFocus,
            open: contentState.root.opts.open.current
          }),
          onOpenAutoFocus,
          id,
          onCloseAutoFocus: (e) => {
            onCloseAutoFocus(e);
            if (e.defaultPrevented) return;
            contentState.root.triggerNode?.focus();
          },
          focusScope
        });
      }
    };
    Presence_layer($$payload, spread_props([
      mergedProps,
      {
        forceMount,
        present: contentState.root.opts.open.current || forceMount,
        presence,
        $$slots: { presence: true }
      }
    ]));
  }
  bind_props($$props, { ref });
  pop();
}
const ROOT_ATTR = "data-label-root";
class LabelRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    this.onmousedown = this.onmousedown.bind(this);
    useRefById(opts);
  }
  onmousedown(e) {
    if (e.detail > 1) e.preventDefault();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [ROOT_ATTR]: "",
    onmousedown: this.onmousedown
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function setLabelRootState(props) {
  return new LabelRootState(props);
}
function Label$1($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId$1(),
    ref = null,
    for: forProp,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = setLabelRootState({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props, { for: forProp });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<label${spread_attributes({ ...mergedProps, for: forProp })}>`;
    children?.($$payload);
    $$payload.out += `<!----></label>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
const LINK_PREVIEW_CONTENT_ATTR = "data-link-preview-content";
const LINK_PREVIEW_TRIGGER_ATTR = "data-link-preview-trigger";
class LinkPreviewRootState {
  opts;
  hasSelection = false;
  isPointerDownOnContent = false;
  containsSelection = false;
  timeout = null;
  contentNode = null;
  contentMounted = false;
  triggerNode = null;
  isOpening = false;
  constructor(opts) {
    this.opts = opts;
    watch(() => this.opts.open.current, (isOpen) => {
      if (!isOpen) {
        this.hasSelection = false;
        return;
      }
      const handlePointerUp = () => {
        this.containsSelection = false;
        this.isPointerDownOnContent = false;
        afterSleep(1, () => {
          const isSelection = document.getSelection()?.toString() !== "";
          if (isSelection) {
            this.hasSelection = true;
          } else {
            this.hasSelection = false;
          }
        });
      };
      const unsubListener = on(document, "pointerup", handlePointerUp);
      if (!this.contentNode) return;
      const tabCandidates = getTabbableCandidates(this.contentNode);
      for (const candidate of tabCandidates) {
        candidate.setAttribute("tabindex", "-1");
      }
      return () => {
        unsubListener();
        this.hasSelection = false;
        this.isPointerDownOnContent = false;
      };
    });
  }
  clearTimeout() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
  handleOpen() {
    this.clearTimeout();
    if (this.opts.open.current) return;
    this.isOpening = true;
    this.timeout = window.setTimeout(
      () => {
        if (this.isOpening) {
          this.opts.open.current = true;
          this.isOpening = false;
        }
      },
      this.opts.openDelay.current
    );
  }
  immediateClose() {
    this.clearTimeout();
    this.isOpening = false;
    this.opts.open.current = false;
  }
  handleClose() {
    this.isOpening = false;
    this.clearTimeout();
    if (!this.isPointerDownOnContent && !this.hasSelection) {
      this.timeout = window.setTimeout(
        () => {
          this.opts.open.current = false;
        },
        this.opts.closeDelay.current
      );
    }
  }
}
class LinkPreviewTriggerState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.onpointerenter = this.onpointerenter.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
    this.onfocus = this.onfocus.bind(this);
    this.onblur = this.onblur.bind(this);
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.triggerNode = node;
      }
    });
  }
  onpointerenter(e) {
    if (isTouch(e)) return;
    this.root.handleOpen();
  }
  onpointerleave(e) {
    if (isTouch(e)) return;
    if (!this.root.contentMounted) {
      this.root.immediateClose();
    }
  }
  onfocus(e) {
    if (!isFocusVisible(e.currentTarget)) return;
    this.root.handleOpen();
  }
  onblur(_) {
    this.root.handleClose();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": getAriaExpanded(this.root.opts.open.current),
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "aria-controls": this.root.contentNode?.id,
    role: "button",
    [LINK_PREVIEW_TRIGGER_ATTR]: "",
    onpointerenter: this.onpointerenter,
    onfocus: this.onfocus,
    onblur: this.onblur,
    onpointerleave: this.onpointerleave
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class LinkPreviewContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerenter = this.onpointerenter.bind(this);
    this.onfocusout = this.onfocusout.bind(this);
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.contentNode = node;
      },
      deps: () => this.root.opts.open.current
    });
    useGraceArea({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.opts.ref.current,
      enabled: () => this.root.opts.open.current,
      onPointerExit: () => {
        this.root.handleClose();
      }
    });
  }
  onpointerdown(e) {
    const target = e.target;
    if (!isElement(target)) return;
    if (e.currentTarget.contains(target)) {
      this.root.containsSelection = true;
    }
    this.root.hasSelection = true;
    this.root.isPointerDownOnContent = true;
  }
  onpointerenter(e) {
    if (isTouch(e)) return;
    this.root.handleOpen();
  }
  onfocusout(e) {
    e.preventDefault();
  }
  onInteractOutside = (e) => {
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    [LINK_PREVIEW_CONTENT_ATTR]: "",
    onpointerdown: this.onpointerdown,
    onpointerenter: this.onpointerenter,
    onfocusout: this.onfocusout
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
const LinkPreviewRootContext = new Context("LinkPreview.Root");
function useLinkPreviewRoot(props) {
  return LinkPreviewRootContext.set(new LinkPreviewRootState(props));
}
function useLinkPreviewTrigger(props) {
  return new LinkPreviewTriggerState(props, LinkPreviewRootContext.get());
}
function useLinkPreviewContent(props) {
  return new LinkPreviewContentState(props, LinkPreviewRootContext.get());
}
function Link_preview($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop$1,
    openDelay = 700,
    closeDelay = 300,
    children
  } = $$props;
  useLinkPreviewRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    }),
    openDelay: box.with(() => openDelay),
    closeDelay: box.with(() => closeDelay)
  });
  $$payload.out += `<!---->`;
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  $$payload.out += `<!---->`;
  bind_props($$props, { open });
  pop();
}
function Link_preview_content($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId$1(),
    ref = null,
    side = "top",
    sideOffset = 0,
    align = "center",
    avoidCollisions = true,
    arrowPadding = 0,
    sticky = "partial",
    hideWhenDetached = false,
    collisionPadding = 0,
    onInteractOutside = noop$1,
    onEscapeKeydown = noop$1,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useLinkPreviewContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    onInteractOutside: box.with(() => onInteractOutside),
    onEscapeKeydown: box.with(() => onEscapeKeydown)
  });
  const floatingProps = {
    side,
    sideOffset,
    align,
    avoidCollisions,
    arrowPadding,
    sticky,
    hideWhenDetached,
    collisionPadding
  };
  const mergedProps = mergeProps(restProps, floatingProps, contentState.props);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (forceMount) {
      $$payload2.out += "<!--[-->";
      {
        let popper = function($$payload3, { props, wrapperProps }) {
          const mergedProps2 = mergeProps(props, {
            style: getFloatingContentCSSVars("link-preview")
          });
          if (child) {
            $$payload3.out += "<!--[-->";
            child($$payload3, {
              props: mergedProps2,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`;
            children?.($$payload3);
            $$payload3.out += `<!----></div></div>`;
          }
          $$payload3.out += `<!--]-->`;
        };
        Popper_layer_force_mount($$payload2, spread_props([
          mergedProps,
          contentState.popperProps,
          {
            enabled: contentState.root.opts.open.current,
            id,
            trapFocus: false,
            loop: false,
            preventScroll: false,
            forceMount: true,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$payload2.out += "<!--[1-->";
      {
        let popper = function($$payload3, { props, wrapperProps }) {
          const mergedProps2 = mergeProps(props, {
            style: getFloatingContentCSSVars("link-preview")
          });
          if (child) {
            $$payload3.out += "<!--[-->";
            child($$payload3, {
              props: mergedProps2,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`;
            children?.($$payload3);
            $$payload3.out += `<!----></div></div>`;
          }
          $$payload3.out += `<!--]--> `;
          Mounted$1($$payload3, {
            get mounted() {
              return contentState.root.contentMounted;
            },
            set mounted($$value) {
              contentState.root.contentMounted = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!---->`;
        };
        Popper_layer($$payload2, spread_props([
          mergedProps,
          contentState.popperProps,
          {
            present: contentState.root.opts.open.current,
            id,
            trapFocus: false,
            loop: false,
            preventScroll: false,
            forceMount: false,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Link_preview_trigger($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId$1(),
    child,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useLinkPreviewTrigger({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props);
  $$payload.out += `<!---->`;
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<a${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></a>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
function useResizeObserver(node, onResize) {
}
function Popover($$payload, $$props) {
  push();
  let { open = false, onOpenChange = noop$1, children } = $$props;
  usePopoverRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    })
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  bind_props($$props, { open });
  pop();
}
function clamp(n2, min, max) {
  return Math.min(max, Math.max(min, n2));
}
const SCROLL_AREA_ROOT_ATTR = "data-scroll-area-root";
const SCROLL_AREA_VIEWPORT_ATTR = "data-scroll-area-viewport";
const SCROLL_AREA_CORNER_ATTR = "data-scroll-area-corner";
const SCROLL_AREA_THUMB_ATTR = "data-scroll-area-thumb";
const SCROLL_AREA_SCROLLBAR_ATTR = "data-scroll-area-scrollbar";
class ScrollAreaRootState {
  opts;
  scrollAreaNode = null;
  viewportNode = null;
  contentNode = null;
  scrollbarXNode = null;
  scrollbarYNode = null;
  cornerWidth = 0;
  cornerHeight = 0;
  scrollbarXEnabled = false;
  scrollbarYEnabled = false;
  constructor(opts) {
    this.opts = opts;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.scrollAreaNode = node;
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    dir: this.opts.dir.current,
    style: {
      position: "relative",
      "--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
      "--bits-scroll-area-corner-width": `${this.cornerWidth}px`
    },
    [SCROLL_AREA_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaViewportState {
  opts;
  root;
  #contentId = box(useId$1());
  #contentRef = box(null);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.viewportNode = node;
      }
    });
    useRefById({
      id: this.#contentId,
      ref: this.#contentRef,
      onRefChange: (node) => {
        this.root.contentNode = node;
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    style: {
      overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
      overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden"
    },
    [SCROLL_AREA_VIEWPORT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  #contentProps = derived(() => ({
    id: this.#contentId.current,
    "data-scroll-area-content": "",
    /**
     * When horizontal scrollbar is visible: this element should be at least
     * as wide as its children for size calculations to work correctly.
     *
     * When horizontal scrollbar is NOT visible: this element's width should
     * be constrained by the parent container to enable `text-overflow: ellipsis`
     */
    style: {
      minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0
    }
  }));
  get contentProps() {
    return this.#contentProps();
  }
  set contentProps($$value) {
    return this.#contentProps($$value);
  }
}
class ScrollAreaScrollbarState {
  opts;
  root;
  #isHorizontal = derived(() => this.opts.orientation.current === "horizontal");
  get isHorizontal() {
    return this.#isHorizontal();
  }
  set isHorizontal($$value) {
    return this.#isHorizontal($$value);
  }
  hasThumb = false;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
  }
}
class ScrollAreaScrollbarHoverState {
  scrollbar;
  root;
  isVisible = false;
  constructor(scrollbar) {
    this.scrollbar = scrollbar;
    this.root = scrollbar.root;
  }
  #props = derived(() => ({
    "data-state": this.isVisible ? "visible" : "hidden"
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaScrollbarScrollState {
  scrollbar;
  root;
  machine = useStateMachine("hidden", {
    hidden: { SCROLL: "scrolling" },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: { SCROLL: "interacting", POINTER_LEAVE: "idle" },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  #isHidden = derived(() => this.machine.state.current === "hidden");
  get isHidden() {
    return this.#isHidden();
  }
  set isHidden($$value) {
    return this.#isHidden($$value);
  }
  constructor(scrollbar) {
    this.scrollbar = scrollbar;
    this.root = scrollbar.root;
    useDebounce(() => this.machine.dispatch("SCROLL_END"), 100);
    this.onpointerenter = this.onpointerenter.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
  }
  onpointerenter(_) {
    this.machine.dispatch("POINTER_ENTER");
  }
  onpointerleave(_) {
    this.machine.dispatch("POINTER_LEAVE");
  }
  #props = derived(() => ({
    "data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
    onpointerenter: this.onpointerenter,
    onpointerleave: this.onpointerleave
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaScrollbarAutoState {
  scrollbar;
  root;
  isVisible = false;
  constructor(scrollbar) {
    this.scrollbar = scrollbar;
    this.root = scrollbar.root;
    useDebounce(
      () => {
        const viewportNode = this.root.viewportNode;
        if (!viewportNode) return;
        const isOverflowX = viewportNode.offsetWidth < viewportNode.scrollWidth;
        const isOverflowY = viewportNode.offsetHeight < viewportNode.scrollHeight;
        this.isVisible = this.scrollbar.isHorizontal ? isOverflowX : isOverflowY;
      },
      10
    );
  }
  #props = derived(() => ({
    "data-state": this.isVisible ? "visible" : "hidden"
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaScrollbarVisibleState {
  scrollbar;
  root;
  thumbNode = null;
  pointerOffset = 0;
  sizes = {
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  };
  #thumbRatio = derived(() => getThumbRatio(this.sizes.viewport, this.sizes.content));
  get thumbRatio() {
    return this.#thumbRatio();
  }
  set thumbRatio($$value) {
    return this.#thumbRatio($$value);
  }
  #hasThumb = derived(() => Boolean(this.thumbRatio > 0 && this.thumbRatio < 1));
  get hasThumb() {
    return this.#hasThumb();
  }
  set hasThumb($$value) {
    return this.#hasThumb($$value);
  }
  // this needs to be a $state to properly restore the transform style when the scrollbar
  // goes from a hidden to visible state, otherwise it will start at the beginning of the
  // scrollbar and flicker to the correct position after
  prevTransformStyle = "";
  constructor(scrollbar) {
    this.scrollbar = scrollbar;
    this.root = scrollbar.root;
  }
  setSizes(sizes) {
    this.sizes = sizes;
  }
  getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer({
      pointerPos,
      pointerOffset: this.pointerOffset,
      sizes: this.sizes,
      dir
    });
  }
  onThumbPointerUp() {
    this.pointerOffset = 0;
  }
  onThumbPointerDown(pointerPos) {
    this.pointerOffset = pointerPos;
  }
  xOnThumbPositionChange() {
    if (!(this.root.viewportNode && this.thumbNode)) return;
    const scrollPos = this.root.viewportNode.scrollLeft;
    const offset2 = getThumbOffsetFromScroll({
      scrollPos,
      sizes: this.sizes,
      dir: this.root.opts.dir.current
    });
    const transformStyle = `translate3d(${offset2}px, 0, 0)`;
    this.thumbNode.style.transform = transformStyle;
    this.prevTransformStyle = transformStyle;
  }
  xOnWheelScroll(scrollPos) {
    if (!this.root.viewportNode) return;
    this.root.viewportNode.scrollLeft = scrollPos;
  }
  xOnDragScroll(pointerPos) {
    if (!this.root.viewportNode) return;
    this.root.viewportNode.scrollLeft = this.getScrollPosition(pointerPos, this.root.opts.dir.current);
  }
  yOnThumbPositionChange() {
    if (!(this.root.viewportNode && this.thumbNode)) return;
    const scrollPos = this.root.viewportNode.scrollTop;
    const offset2 = getThumbOffsetFromScroll({ scrollPos, sizes: this.sizes });
    const transformStyle = `translate3d(0, ${offset2}px, 0)`;
    this.thumbNode.style.transform = transformStyle;
    this.prevTransformStyle = transformStyle;
  }
  yOnWheelScroll(scrollPos) {
    if (!this.root.viewportNode) return;
    this.root.viewportNode.scrollTop = scrollPos;
  }
  yOnDragScroll(pointerPos) {
    if (!this.root.viewportNode) return;
    this.root.viewportNode.scrollTop = this.getScrollPosition(pointerPos, this.root.opts.dir.current);
  }
}
class ScrollAreaScrollbarXState {
  opts;
  scrollbarVis;
  root;
  computedStyle;
  scrollbar;
  constructor(opts, scrollbarVis) {
    this.opts = opts;
    this.scrollbarVis = scrollbarVis;
    this.root = scrollbarVis.root;
    this.scrollbar = scrollbarVis.scrollbar;
    useRefById({
      ...this.scrollbar.opts,
      onRefChange: (node) => {
        this.root.scrollbarXNode = node;
      },
      deps: () => this.opts.mounted.current
    });
  }
  onThumbPointerDown = (pointerPos) => {
    this.scrollbarVis.onThumbPointerDown(pointerPos.x);
  };
  onDragScroll = (pointerPos) => {
    this.scrollbarVis.xOnDragScroll(pointerPos.x);
  };
  onThumbPointerUp = () => {
    this.scrollbarVis.onThumbPointerUp();
  };
  onThumbPositionChange = () => {
    this.scrollbarVis.xOnThumbPositionChange();
  };
  onWheelScroll = (e, maxScrollPos) => {
    if (!this.root.viewportNode) return;
    const scrollPos = this.root.viewportNode.scrollLeft + e.deltaX;
    this.scrollbarVis.xOnWheelScroll(scrollPos);
    if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
      e.preventDefault();
    }
  };
  onResize = () => {
    if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle)) return;
    this.scrollbarVis.setSizes({
      content: this.root.viewportNode.scrollWidth,
      viewport: this.root.viewportNode.offsetWidth,
      scrollbar: {
        size: this.scrollbar.opts.ref.current.clientWidth,
        paddingStart: toInt(this.computedStyle.paddingLeft),
        paddingEnd: toInt(this.computedStyle.paddingRight)
      }
    });
  };
  #thumbSize = derived(() => {
    return getThumbSize(this.scrollbarVis.sizes);
  });
  get thumbSize() {
    return this.#thumbSize();
  }
  set thumbSize($$value) {
    return this.#thumbSize($$value);
  }
  #props = derived(() => ({
    id: this.scrollbar.opts.id.current,
    "data-orientation": "horizontal",
    style: {
      bottom: 0,
      left: this.root.opts.dir.current === "rtl" ? "var(--bits-scroll-area-corner-width)" : 0,
      right: this.root.opts.dir.current === "ltr" ? "var(--bits-scroll-area-corner-width)" : 0,
      "--bits-scroll-area-thumb-width": `${this.thumbSize}px`
    }
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaScrollbarYState {
  opts;
  scrollbarVis;
  root;
  scrollbar;
  computedStyle;
  constructor(opts, scrollbarVis) {
    this.opts = opts;
    this.scrollbarVis = scrollbarVis;
    this.root = scrollbarVis.root;
    this.scrollbar = scrollbarVis.scrollbar;
    useRefById({
      ...this.scrollbar.opts,
      onRefChange: (node) => {
        this.root.scrollbarYNode = node;
      },
      deps: () => this.opts.mounted.current
    });
    this.onThumbPointerDown = this.onThumbPointerDown.bind(this);
    this.onDragScroll = this.onDragScroll.bind(this);
    this.onThumbPointerUp = this.onThumbPointerUp.bind(this);
    this.onThumbPositionChange = this.onThumbPositionChange.bind(this);
    this.onWheelScroll = this.onWheelScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  onThumbPointerDown(pointerPos) {
    this.scrollbarVis.onThumbPointerDown(pointerPos.y);
  }
  onDragScroll(pointerPos) {
    this.scrollbarVis.yOnDragScroll(pointerPos.y);
  }
  onThumbPointerUp() {
    this.scrollbarVis.onThumbPointerUp();
  }
  onThumbPositionChange() {
    this.scrollbarVis.yOnThumbPositionChange();
  }
  onWheelScroll(e, maxScrollPos) {
    if (!this.root.viewportNode) return;
    const scrollPos = this.root.viewportNode.scrollTop + e.deltaY;
    this.scrollbarVis.yOnWheelScroll(scrollPos);
    if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
      e.preventDefault();
    }
  }
  onResize() {
    if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle)) return;
    this.scrollbarVis.setSizes({
      content: this.root.viewportNode.scrollHeight,
      viewport: this.root.viewportNode.offsetHeight,
      scrollbar: {
        size: this.scrollbar.opts.ref.current.clientHeight,
        paddingStart: toInt(this.computedStyle.paddingTop),
        paddingEnd: toInt(this.computedStyle.paddingBottom)
      }
    });
  }
  #thumbSize = derived(() => {
    return getThumbSize(this.scrollbarVis.sizes);
  });
  get thumbSize() {
    return this.#thumbSize();
  }
  set thumbSize($$value) {
    return this.#thumbSize($$value);
  }
  #props = derived(() => ({
    id: this.scrollbar.opts.id.current,
    "data-orientation": "vertical",
    style: {
      top: 0,
      right: this.root.opts.dir.current === "ltr" ? 0 : void 0,
      left: this.root.opts.dir.current === "rtl" ? 0 : void 0,
      bottom: "var(--bits-scroll-area-corner-height)",
      "--bits-scroll-area-thumb-height": `${this.thumbSize}px`
    }
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaScrollbarSharedState {
  scrollbarState;
  root;
  scrollbarVis;
  scrollbar;
  rect = null;
  prevWebkitUserSelect = "";
  handleResize;
  handleThumbPositionChange;
  handleWheelScroll;
  handleThumbPointerDown;
  handleThumbPointerUp;
  #maxScrollPos = derived(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
  get maxScrollPos() {
    return this.#maxScrollPos();
  }
  set maxScrollPos($$value) {
    return this.#maxScrollPos($$value);
  }
  constructor(scrollbarState) {
    this.scrollbarState = scrollbarState;
    this.root = scrollbarState.root;
    this.scrollbarVis = scrollbarState.scrollbarVis;
    this.scrollbar = scrollbarState.scrollbarVis.scrollbar;
    this.handleResize = useDebounce(() => this.scrollbarState.onResize(), 10);
    this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange;
    this.handleWheelScroll = this.scrollbarState.onWheelScroll;
    this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown;
    this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp;
    useResizeObserver(() => this.scrollbar.opts.ref.current, this.handleResize);
    useResizeObserver(() => this.root.contentNode, this.handleResize);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
  }
  handleDragScroll(e) {
    if (!this.rect) return;
    const x = e.clientX - this.rect.left;
    const y = e.clientY - this.rect.top;
    this.scrollbarState.onDragScroll({ x, y });
  }
  onpointerdown(e) {
    if (e.button !== 0) return;
    const target = e.target;
    target.setPointerCapture(e.pointerId);
    this.rect = this.scrollbar.opts.ref.current?.getBoundingClientRect() ?? null;
    this.prevWebkitUserSelect = document.body.style.webkitUserSelect;
    document.body.style.webkitUserSelect = "none";
    if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "auto";
    this.handleDragScroll(e);
  }
  onpointermove(e) {
    this.handleDragScroll(e);
  }
  onpointerup(e) {
    const target = e.target;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
    document.body.style.webkitUserSelect = this.prevWebkitUserSelect;
    if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "";
    this.rect = null;
  }
  #props = derived(() => mergeProps({
    ...this.scrollbarState.props,
    style: {
      position: "absolute",
      ...this.scrollbarState.props.style
    },
    [SCROLL_AREA_SCROLLBAR_ATTR]: "",
    onpointerdown: this.onpointerdown,
    onpointermove: this.onpointermove,
    onpointerup: this.onpointerup
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaThumbImplState {
  opts;
  scrollbarState;
  #root;
  #removeUnlinkedScrollListener;
  #debounceScrollEnd = useDebounce(
    () => {
      if (this.#removeUnlinkedScrollListener) {
        this.#removeUnlinkedScrollListener();
        this.#removeUnlinkedScrollListener = void 0;
      }
    },
    100
  );
  constructor(opts, scrollbarState) {
    this.opts = opts;
    this.scrollbarState = scrollbarState;
    this.#root = scrollbarState.root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.scrollbarState.scrollbarVis.thumbNode = node;
      },
      deps: () => this.opts.mounted.current
    });
    this.onpointerdowncapture = this.onpointerdowncapture.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
  }
  onpointerdowncapture(e) {
    const thumb = e.target;
    if (!thumb) return;
    const thumbRect = thumb.getBoundingClientRect();
    const x = e.clientX - thumbRect.left;
    const y = e.clientY - thumbRect.top;
    this.scrollbarState.handleThumbPointerDown({ x, y });
  }
  onpointerup(_) {
    this.scrollbarState.handleThumbPointerUp();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden",
    style: {
      width: "var(--bits-scroll-area-thumb-width)",
      height: "var(--bits-scroll-area-thumb-height)",
      transform: this.scrollbarState.scrollbarVis.prevTransformStyle
    },
    onpointerdowncapture: this.onpointerdowncapture,
    onpointerup: this.onpointerup,
    [SCROLL_AREA_THUMB_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class ScrollAreaCornerImplState {
  opts;
  root;
  #width = 0;
  #height = 0;
  #hasSize = derived(() => Boolean(this.#width && this.#height));
  get hasSize() {
    return this.#hasSize();
  }
  set hasSize($$value) {
    return this.#hasSize($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    style: {
      width: this.#width,
      height: this.#height,
      position: "absolute",
      right: this.root.opts.dir.current === "ltr" ? 0 : void 0,
      left: this.root.opts.dir.current === "rtl" ? 0 : void 0,
      bottom: 0
    },
    [SCROLL_AREA_CORNER_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
const ScrollAreaRootContext = new Context("ScrollArea.Root");
const ScrollAreaScrollbarContext = new Context("ScrollArea.Scrollbar");
const ScrollAreaScrollbarVisibleContext = new Context("ScrollArea.ScrollbarVisible");
const ScrollAreaScrollbarAxisContext = new Context("ScrollArea.ScrollbarAxis");
const ScrollAreaScrollbarSharedContext = new Context("ScrollArea.ScrollbarShared");
function useScrollAreaRoot(props) {
  return ScrollAreaRootContext.set(new ScrollAreaRootState(props));
}
function useScrollAreaViewport(props) {
  return new ScrollAreaViewportState(props, ScrollAreaRootContext.get());
}
function useScrollAreaScrollbar(props) {
  return ScrollAreaScrollbarContext.set(new ScrollAreaScrollbarState(props, ScrollAreaRootContext.get()));
}
function useScrollAreaScrollbarVisible() {
  return ScrollAreaScrollbarVisibleContext.set(new ScrollAreaScrollbarVisibleState(ScrollAreaScrollbarContext.get()));
}
function useScrollAreaScrollbarAuto() {
  return new ScrollAreaScrollbarAutoState(ScrollAreaScrollbarContext.get());
}
function useScrollAreaScrollbarScroll() {
  return new ScrollAreaScrollbarScrollState(ScrollAreaScrollbarContext.get());
}
function useScrollAreaScrollbarHover() {
  return new ScrollAreaScrollbarHoverState(ScrollAreaScrollbarContext.get());
}
function useScrollAreaScrollbarX(props) {
  return ScrollAreaScrollbarAxisContext.set(new ScrollAreaScrollbarXState(props, ScrollAreaScrollbarVisibleContext.get()));
}
function useScrollAreaScrollbarY(props) {
  return ScrollAreaScrollbarAxisContext.set(new ScrollAreaScrollbarYState(props, ScrollAreaScrollbarVisibleContext.get()));
}
function useScrollAreaScrollbarShared() {
  return ScrollAreaScrollbarSharedContext.set(new ScrollAreaScrollbarSharedState(ScrollAreaScrollbarAxisContext.get()));
}
function useScrollAreaThumb(props) {
  return new ScrollAreaThumbImplState(props, ScrollAreaScrollbarSharedContext.get());
}
function useScrollAreaCorner(props) {
  return new ScrollAreaCornerImplState(props, ScrollAreaRootContext.get());
}
function toInt(value) {
  return value ? Number.parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return Number.isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer({
  pointerPos,
  pointerOffset,
  sizes,
  dir = "ltr"
}) {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset2 = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset2;
  const minPointerPos = sizes.scrollbar.paddingStart + offset2;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll({ scrollPos, sizes, dir = "ltr" }) {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange[0], scrollClampRange[1]);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
function Scroll_area$1($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId$1(),
    type = "hover",
    dir = "ltr",
    scrollHideDelay = 600,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useScrollAreaRoot({
    type: box.with(() => type),
    dir: box.with(() => dir),
    scrollHideDelay: box.with(() => scrollHideDelay),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_viewport($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId$1(),
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const viewportState = useScrollAreaViewport({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, viewportState.props);
  const mergedContentProps = mergeProps({}, viewportState.contentProps);
  $$payload.out += `<div${spread_attributes({ ...mergedProps })}><div${spread_attributes({ ...mergedContentProps })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div></div>`;
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_scrollbar_shared($$payload, $$props) {
  push();
  let {
    child,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarSharedState = useScrollAreaScrollbarShared();
  const mergedProps = mergeProps(restProps, scrollbarSharedState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Scroll_area_scrollbar_x($$payload, $$props) {
  push();
  let { $$slots, $$events, ...restProps } = $$props;
  const isMounted = new IsMounted();
  const scrollbarXState = useScrollAreaScrollbarX({ mounted: box.with(() => isMounted.current) });
  const mergedProps = mergeProps(restProps, scrollbarXState.props);
  Scroll_area_scrollbar_shared($$payload, spread_props([mergedProps]));
  pop();
}
function Scroll_area_scrollbar_y($$payload, $$props) {
  push();
  let { $$slots, $$events, ...restProps } = $$props;
  const isMounted = new IsMounted();
  const scrollbarYState = useScrollAreaScrollbarY({ mounted: box.with(() => isMounted.current) });
  const mergedProps = mergeProps(restProps, scrollbarYState.props);
  Scroll_area_scrollbar_shared($$payload, spread_props([mergedProps]));
  pop();
}
function Scroll_area_scrollbar_visible($$payload, $$props) {
  push();
  let { $$slots, $$events, ...restProps } = $$props;
  const scrollbarVisibleState = useScrollAreaScrollbarVisible();
  if (scrollbarVisibleState.scrollbar.opts.orientation.current === "horizontal") {
    $$payload.out += "<!--[-->";
    Scroll_area_scrollbar_x($$payload, spread_props([restProps]));
  } else {
    $$payload.out += "<!--[!-->";
    Scroll_area_scrollbar_y($$payload, spread_props([restProps]));
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Scroll_area_scrollbar_auto($$payload, $$props) {
  push();
  let {
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarAutoState = useScrollAreaScrollbarAuto();
  const mergedProps = mergeProps(restProps, scrollbarAutoState.props);
  {
    let presence = function($$payload2) {
      Scroll_area_scrollbar_visible($$payload2, spread_props([mergedProps]));
    };
    Presence_layer($$payload, spread_props([
      {
        present: forceMount || scrollbarAutoState.isVisible
      },
      mergedProps,
      { presence, $$slots: { presence: true } }
    ]));
  }
  pop();
}
function Scroll_area_scrollbar_scroll($$payload, $$props) {
  push();
  let {
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarScrollState = useScrollAreaScrollbarScroll();
  const mergedProps = mergeProps(restProps, scrollbarScrollState.props);
  {
    let presence = function($$payload2) {
      Scroll_area_scrollbar_visible($$payload2, spread_props([mergedProps]));
    };
    Presence_layer($$payload, spread_props([
      mergedProps,
      {
        present: forceMount || !scrollbarScrollState.isHidden,
        presence,
        $$slots: { presence: true }
      }
    ]));
  }
  pop();
}
function Scroll_area_scrollbar_hover($$payload, $$props) {
  push();
  let {
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarHoverState = useScrollAreaScrollbarHover();
  const scrollbarAutoState = useScrollAreaScrollbarAuto();
  const mergedProps = mergeProps(restProps, scrollbarHoverState.props, scrollbarAutoState.props, {
    "data-state": scrollbarHoverState.isVisible ? "visible" : "hidden"
  });
  const present = forceMount || scrollbarHoverState.isVisible && scrollbarAutoState.isVisible;
  {
    let presence = function($$payload2) {
      Scroll_area_scrollbar_visible($$payload2, spread_props([mergedProps]));
    };
    Presence_layer($$payload, spread_props([
      mergedProps,
      {
        present,
        presence,
        $$slots: { presence: true }
      }
    ]));
  }
  pop();
}
function Scroll_area_scrollbar$1($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId$1(),
    orientation,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarState = useScrollAreaScrollbar({
    orientation: box.with(() => orientation),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const type = scrollbarState.root.opts.type.current;
  if (type === "hover") {
    $$payload.out += "<!--[-->";
    Scroll_area_scrollbar_hover($$payload, spread_props([restProps, { id }]));
  } else if (type === "scroll") {
    $$payload.out += "<!--[1-->";
    Scroll_area_scrollbar_scroll($$payload, spread_props([restProps, { id }]));
  } else if (type === "auto") {
    $$payload.out += "<!--[2-->";
    Scroll_area_scrollbar_auto($$payload, spread_props([restProps, { id }]));
  } else if (type === "always") {
    $$payload.out += "<!--[3-->";
    Scroll_area_scrollbar_visible($$payload, spread_props([restProps, { id }]));
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_thumb_impl($$payload, $$props) {
  push();
  let {
    ref = null,
    id,
    child,
    children,
    present,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const isMounted = new IsMounted();
  const thumbState = useScrollAreaThumb({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    mounted: box.with(() => isMounted.current)
  });
  const mergedProps = mergeProps(restProps, thumbState.props, { style: { hidden: !present } });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_thumb($$payload, $$props) {
  push();
  let {
    id = useId$1(),
    ref = null,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollbarState = ScrollAreaScrollbarVisibleContext.get();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    {
      let presence = function($$payload3, { present }) {
        Scroll_area_thumb_impl($$payload3, spread_props([
          restProps,
          {
            id,
            present: present.current,
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
      };
      Presence_layer($$payload2, spread_props([
        { present: forceMount || scrollbarState.hasThumb },
        restProps,
        { id, presence, $$slots: { presence: true } }
      ]));
    }
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_corner_impl($$payload, $$props) {
  push();
  let {
    ref = null,
    id,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const cornerState = useScrollAreaCorner({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, cornerState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Scroll_area_corner($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId$1(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const scrollAreaState = ScrollAreaRootContext.get();
  const hasBothScrollbarsVisible = Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode);
  const hasCorner = scrollAreaState.opts.type.current !== "scroll" && hasBothScrollbarsVisible;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (hasCorner) {
      $$payload2.out += "<!--[-->";
      Scroll_area_corner_impl($$payload2, spread_props([
        restProps,
        {
          id,
          get ref() {
            return ref;
          },
          set ref($$value) {
            ref = $$value;
            $$settled = false;
          }
        }
      ]));
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function useTimeoutFn(cb, interval, options = {}) {
  const { immediate = true } = options;
  const isPending = box(false);
  let timer;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.current = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.current = true;
    timer = setTimeout(
      () => {
        isPending.current = false;
        timer = null;
        cb(...args);
      },
      interval
    );
  }
  if (immediate) {
    isPending.current = true;
    if (isBrowser$1) start();
  }
  return {
    isPending: box.readonly(isPending),
    start,
    stop
  };
}
const TOOLTIP_CONTENT_ATTR = "data-tooltip-content";
const TOOLTIP_TRIGGER_ATTR = "data-tooltip-trigger";
class TooltipProviderState {
  opts;
  isOpenDelayed = true;
  isPointerInTransit = box(false);
  #timerFn;
  #openTooltip = null;
  constructor(opts) {
    this.opts = opts;
    this.#timerFn = useTimeoutFn(
      () => {
        this.isOpenDelayed = true;
      },
      this.opts.skipDelayDuration.current,
      { immediate: false }
    );
  }
  #startTimer = () => {
    const skipDuration = this.opts.skipDelayDuration.current;
    if (skipDuration === 0) {
      return;
    } else {
      this.#timerFn.start();
    }
  };
  #clearTimer = () => {
    this.#timerFn.stop();
  };
  onOpen = (tooltip) => {
    if (this.#openTooltip && this.#openTooltip !== tooltip) {
      this.#openTooltip.handleClose();
    }
    this.#clearTimer();
    this.isOpenDelayed = false;
    this.#openTooltip = tooltip;
  };
  onClose = (tooltip) => {
    if (this.#openTooltip === tooltip) {
      this.#openTooltip = null;
    }
    this.#startTimer();
  };
  isTooltipOpen = (tooltip) => {
    return this.#openTooltip === tooltip;
  };
}
class TooltipRootState {
  opts;
  provider;
  #delayDuration = derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
  get delayDuration() {
    return this.#delayDuration();
  }
  set delayDuration($$value) {
    return this.#delayDuration($$value);
  }
  #disableHoverableContent = derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
  get disableHoverableContent() {
    return this.#disableHoverableContent();
  }
  set disableHoverableContent($$value) {
    return this.#disableHoverableContent($$value);
  }
  #disableCloseOnTriggerClick = derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
  get disableCloseOnTriggerClick() {
    return this.#disableCloseOnTriggerClick();
  }
  set disableCloseOnTriggerClick($$value) {
    return this.#disableCloseOnTriggerClick($$value);
  }
  #disabled = derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
  get disabled() {
    return this.#disabled();
  }
  set disabled($$value) {
    return this.#disabled($$value);
  }
  #ignoreNonKeyboardFocus = derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
  get ignoreNonKeyboardFocus() {
    return this.#ignoreNonKeyboardFocus();
  }
  set ignoreNonKeyboardFocus($$value) {
    return this.#ignoreNonKeyboardFocus($$value);
  }
  contentNode = null;
  triggerNode = null;
  #wasOpenDelayed = false;
  #timerFn;
  #stateAttr = derived(() => {
    if (!this.opts.open.current) return "closed";
    return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
  });
  get stateAttr() {
    return this.#stateAttr();
  }
  set stateAttr($$value) {
    return this.#stateAttr($$value);
  }
  constructor(opts, provider) {
    this.opts = opts;
    this.provider = provider;
    this.#timerFn = useTimeoutFn(
      () => {
        this.#wasOpenDelayed = true;
        this.opts.open.current = true;
      },
      this.delayDuration ?? 0,
      { immediate: false }
    );
    watch(() => this.delayDuration, () => {
      if (this.delayDuration === void 0) return;
      this.#timerFn = useTimeoutFn(
        () => {
          this.#wasOpenDelayed = true;
          this.opts.open.current = true;
        },
        this.delayDuration,
        { immediate: false }
      );
    });
    watch(() => this.opts.open.current, (isOpen) => {
      if (isOpen) {
        this.provider.onOpen(this);
      } else {
        this.provider.onClose(this);
      }
    });
  }
  handleOpen = () => {
    this.#timerFn.stop();
    this.#wasOpenDelayed = false;
    this.opts.open.current = true;
  };
  handleClose = () => {
    this.#timerFn.stop();
    this.opts.open.current = false;
  };
  #handleDelayedOpen = () => {
    this.#timerFn.stop();
    const shouldSkipDelay = !this.provider.isOpenDelayed;
    const delayDuration = this.delayDuration ?? 0;
    if (shouldSkipDelay || delayDuration === 0) {
      this.#wasOpenDelayed = delayDuration > 0 && shouldSkipDelay;
      this.opts.open.current = true;
    } else {
      this.#timerFn.start();
    }
  };
  onTriggerEnter = () => {
    this.#handleDelayedOpen();
  };
  onTriggerLeave = () => {
    if (this.disableHoverableContent) {
      this.handleClose();
    } else {
      this.#timerFn.stop();
    }
  };
}
class TooltipTriggerState {
  opts;
  root;
  #isPointerDown = box(false);
  #hasPointerMoveOpened = false;
  #isDisabled = derived(() => this.opts.disabled.current || this.root.disabled);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.triggerNode = node;
      }
    });
  }
  handlePointerUp = () => {
    this.#isPointerDown.current = false;
  };
  #onpointerup = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = false;
  };
  #onpointerdown = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = true;
    document.addEventListener(
      "pointerup",
      () => {
        this.handlePointerUp();
      },
      { once: true }
    );
  };
  #onpointermove = (e) => {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch") return;
    if (this.#hasPointerMoveOpened) return;
    if (this.root.provider.isPointerInTransit.current) return;
    this.root.onTriggerEnter();
    this.#hasPointerMoveOpened = true;
  };
  #onpointerleave = () => {
    if (this.#isDisabled()) return;
    this.root.onTriggerLeave();
    this.#hasPointerMoveOpened = false;
  };
  #onfocus = (e) => {
    if (this.#isPointerDown.current || this.#isDisabled()) return;
    if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
    this.root.handleOpen();
  };
  #onblur = () => {
    if (this.#isDisabled()) return;
    this.root.handleClose();
  };
  #onclick = () => {
    if (this.root.disableCloseOnTriggerClick || this.#isDisabled()) return;
    this.root.handleClose();
  };
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-describedby": this.root.opts.open.current ? this.root.contentNode?.id : void 0,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(this.#isDisabled()),
    "data-delay-duration": `${this.root.delayDuration}`,
    [TOOLTIP_TRIGGER_ATTR]: "",
    tabindex: this.#isDisabled() ? void 0 : 0,
    disabled: this.opts.disabled.current,
    onpointerup: this.#onpointerup,
    onpointerdown: this.#onpointerdown,
    onpointermove: this.#onpointermove,
    onpointerleave: this.#onpointerleave,
    onfocus: this.#onfocus,
    onblur: this.#onblur,
    onclick: this.#onclick
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TooltipContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.contentNode = node;
      },
      deps: () => this.root.opts.open.current
    });
    useGraceArea({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
      onPointerExit: () => {
        if (this.root.provider.isTooltipOpen(this.root)) {
          this.root.handleClose();
        }
      },
      setIsPointerInTransit: (value) => {
        this.root.provider.isPointerInTransit.current = value;
      },
      transitTimeout: this.root.provider.opts.skipDelayDuration.current
    });
  }
  onInteractOutside = (e) => {
    if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(this.root.disabled),
    style: { pointerEvents: "auto", outline: "none" },
    [TOOLTIP_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
const TooltipProviderContext = new Context("Tooltip.Provider");
const TooltipRootContext = new Context("Tooltip.Root");
function useTooltipProvider(props) {
  return TooltipProviderContext.set(new TooltipProviderState(props));
}
function useTooltipRoot(props) {
  return TooltipRootContext.set(new TooltipRootState(props, TooltipProviderContext.get()));
}
function useTooltipTrigger(props) {
  return new TooltipTriggerState(props, TooltipRootContext.get());
}
function useTooltipContent(props) {
  return new TooltipContentState(props, TooltipRootContext.get());
}
function Tooltip($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop$1,
    disabled,
    delayDuration,
    disableCloseOnTriggerClick,
    disableHoverableContent,
    ignoreNonKeyboardFocus,
    children
  } = $$props;
  useTooltipRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    }),
    delayDuration: box.with(() => delayDuration),
    disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
    disableHoverableContent: box.with(() => disableHoverableContent),
    ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
    disabled: box.with(() => disabled)
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  bind_props($$props, { open });
  pop();
}
function Tooltip_content$1($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId$1(),
    ref = null,
    side = "top",
    sideOffset = 0,
    align = "center",
    avoidCollisions = true,
    arrowPadding = 0,
    sticky = "partial",
    hideWhenDetached = false,
    collisionPadding = 0,
    onInteractOutside = noop$1,
    onEscapeKeydown = noop$1,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useTooltipContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    onInteractOutside: box.with(() => onInteractOutside),
    onEscapeKeydown: box.with(() => onEscapeKeydown)
  });
  const floatingProps = {
    side,
    sideOffset,
    align,
    avoidCollisions,
    arrowPadding,
    sticky,
    hideWhenDetached,
    collisionPadding
  };
  const mergedProps = mergeProps(restProps, floatingProps, contentState.props);
  if (forceMount) {
    $$payload.out += "<!--[-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const mergedProps2 = mergeProps(props, {
          style: getFloatingContentCSSVars("tooltip")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: mergedProps2,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer_force_mount($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          enabled: contentState.root.opts.open.current,
          id,
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: true,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else if (!forceMount) {
    $$payload.out += "<!--[1-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const mergedProps2 = mergeProps(props, {
          style: getFloatingContentCSSVars("tooltip")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: mergedProps2,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...mergedProps2 })}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          present: contentState.root.opts.open.current,
          id,
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: false,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Tooltip_trigger($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId$1(),
    disabled = false,
    type = "button",
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useTooltipTrigger({
    id: box.with(() => id),
    disabled: box.with(() => disabled ?? false),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  bind_props($$props, { ref });
  pop();
}
function Tooltip_provider($$payload, $$props) {
  push();
  let {
    children,
    delayDuration = 700,
    disableCloseOnTriggerClick = false,
    disableHoverableContent = false,
    disabled = false,
    ignoreNonKeyboardFocus = false,
    skipDelayDuration = 300
  } = $$props;
  useTooltipProvider({
    delayDuration: box.with(() => delayDuration),
    disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
    disableHoverableContent: box.with(() => disableHoverableContent),
    disabled: box.with(() => disabled),
    ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
    skipDelayDuration: box.with(() => skipDelayDuration)
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function Command($$payload, $$props) {
  push();
  let {
    ref = null,
    value = "",
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Command$1($$payload2, spread_props([
      {
        class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
      },
      restProps,
      {
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        },
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref, value });
  pop();
}
function Arrow_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-left" },
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
function Arrow_right($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-right" },
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
function Check($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$payload, spread_props([
    { name: "check" },
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
function Keyboard($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M10 8h.01" }],
    ["path", { "d": "M12 12h.01" }],
    ["path", { "d": "M14 8h.01" }],
    ["path", { "d": "M16 12h.01" }],
    ["path", { "d": "M18 8h.01" }],
    ["path", { "d": "M6 8h.01" }],
    ["path", { "d": "M7 16h10" }],
    ["path", { "d": "M8 12h.01" }],
    [
      "rect",
      {
        "width": "20",
        "height": "16",
        "x": "2",
        "y": "4",
        "rx": "2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "keyboard" },
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
function Moon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "moon" },
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
function Palette($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
      }
    ],
    [
      "circle",
      {
        "cx": "13.5",
        "cy": "6.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "17.5",
        "cy": "10.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "6.5",
        "cy": "12.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "8.5",
        "cy": "7.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "palette" },
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
function Search($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m21 21-4.34-4.34" }],
    [
      "circle",
      { "cx": "11", "cy": "11", "r": "8" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "search" },
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
function Shuffle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m18 14 4 4-4 4" }],
    ["path", { "d": "m18 2 4 4-4 4" }],
    [
      "path",
      {
        "d": "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"
      }
    ],
    [
      "path",
      { "d": "M2 6h1.972a4 4 0 0 1 3.6 2.2" }
    ],
    [
      "path",
      {
        "d": "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "shuffle" },
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
function Sun($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "4" }
    ],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "m17.66 17.66 1.41 1.41" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.34 17.66-1.41 1.41" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }]
  ];
  Icon($$payload, spread_props([
    { name: "sun" },
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
function Command_empty($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<!---->`;
  Command_empty$1($$payload, spread_props([
    {
      class: cn("py-6 text-center text-sm", className)
    },
    restProps
  ]));
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
function Command_group($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    heading,
    value,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Command_group$1($$payload2, spread_props([
      {
        class: cn("text-foreground overflow-hidden p-1", className),
        value: value ?? heading ?? `----${useId$1()}`
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          if (heading) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<!---->`;
            Command_group_heading($$payload3, {
              class: "text-muted-foreground px-2 py-1.5 text-xs font-medium",
              children: ($$payload4) => {
                $$payload4.out += `<!---->${escape_html(heading)}`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> <!---->`;
          Command_group_items($$payload3, { children });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Command_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Command_item$1($$payload2, spread_props([
      {
        class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Popover_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 4,
    align = "center",
    portalProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Popover_content$1($$payload3, spread_props([
            {
              sideOffset,
              align,
              class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none", className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              }
            }
          ]));
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const Root$2 = Popover;
const Trigger$2 = Popover_trigger;
function Separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Separator$1($$payload2, spread_props([
      {
        class: cn("bg-border shrink-0", orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]", className),
        orientation
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Tooltip_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 4,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Tooltip_content$1($$payload2, spread_props([
      {
        sideOffset,
        class: cn("bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const Root$1 = Tooltip;
const Trigger$1 = Tooltip_trigger;
const Provider = Tooltip_provider;
function ThemeSearch($$payload, $$props) {
  push();
  var $$store_subs;
  let search = fallback($$props["search"], "");
  let filteredThemes = fallback($$props["filteredThemes"], () => [], true);
  let onSearchInput = $$props["onSearchInput"];
  let onDarkModeToggle = $$props["onDarkModeToggle"];
  let onRandomizeTheme = $$props["onRandomizeTheme"];
  $$payload.out += `<div class="flex w-full items-center"><div class="flex w-full items-center border-b px-3 py-1">`;
  Search($$payload, { class: "size-4 shrink-0 opacity-50" });
  $$payload.out += `<!----> <input placeholder="Search themes..." class="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"${attr("value", search)}/></div></div> <div class="flex items-center justify-between px-4 py-2"><div class="text-muted-foreground text-xs">${escape_html(filteredThemes.length)} theme${escape_html(filteredThemes.length !== 1 ? "s" : "")}</div> <div class="flex gap-1">`;
  Root$1($$payload, {
    children: ($$payload2) => {
      Trigger$1($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<button class="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground">`;
          if (store_get($$store_subs ??= {}, "$isDarkMode", isDarkMode)) {
            $$payload3.out += "<!--[-->";
            Moon($$payload3, { class: "h-3.5 w-3.5" });
          } else {
            $$payload3.out += "<!--[!-->";
            Sun($$payload3, { class: "h-3.5 w-3.5" });
          }
          $$payload3.out += `<!--]--></button>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Tooltip_content($$payload2, {
        side: "bottom",
        children: ($$payload3) => {
          $$payload3.out += `<p class="text-xs">Toggle dark mode</p>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Root$1($$payload, {
    children: ($$payload2) => {
      Trigger$1($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<button class="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground">`;
          Shuffle($$payload3, { class: "h-3.5 w-3.5" });
          $$payload3.out += `<!----></button>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Tooltip_content($$payload2, {
        side: "bottom",
        children: ($$payload3) => {
          $$payload3.out += `<p class="text-xs">Random theme</p>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></div> `;
  Separator($$payload, {});
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    search,
    filteredThemes,
    onSearchInput,
    onDarkModeToggle,
    onRandomizeTheme
  });
  pop();
}
function Scroll_area_scrollbar($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    orientation = "vertical",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Scroll_area_scrollbar$1($$payload2, spread_props([
      {
        orientation,
        class: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px", orientation === "horizontal" && "h-2.5 w-full border-t border-t-transparent p-px", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          children?.($$payload3);
          $$payload3.out += `<!----> <!---->`;
          Scroll_area_thumb($$payload3, {
            class: cn("bg-border relative rounded-full", orientation === "vertical" && "flex-1")
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Scroll_area($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    orientation = "vertical",
    scrollbarXClasses = "",
    scrollbarYClasses = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Scroll_area$1($$payload2, spread_props([
      restProps,
      {
        class: cn("relative overflow-hidden", className),
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Scroll_area_viewport($$payload3, {
            class: "h-full w-full rounded-[inherit]",
            children: ($$payload4) => {
              children?.($$payload4);
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          if (orientation === "vertical" || orientation === "both") {
            $$payload3.out += "<!--[-->";
            Scroll_area_scrollbar($$payload3, {
              orientation: "vertical",
              class: scrollbarYClasses
            });
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> `;
          if (orientation === "horizontal" || orientation === "both") {
            $$payload3.out += "<!--[-->";
            Scroll_area_scrollbar($$payload3, {
              orientation: "horizontal",
              class: scrollbarXClasses
            });
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> <!---->`;
          Scroll_area_corner($$payload3, {});
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function ThemeGrid($$payload, $$props) {
  push();
  var $$store_subs;
  let systemThemes = fallback($$props["systemThemes"], () => [], true);
  let builtInThemes = fallback($$props["builtInThemes"], () => [], true);
  let onThemeSelect = $$props["onThemeSelect"];
  function getThemeColors(themeInfo) {
    if (store_get($$store_subs ??= {}, "$isDarkMode", isDarkMode) && themeInfo.colorsDark) {
      return themeInfo.colorsDark;
    }
    return themeInfo.colors;
  }
  function handleThemeSelect(themeValue) {
    onThemeSelect(themeValue);
  }
  Scroll_area($$payload, {
    class: "h-[400px] max-h-[70vh]",
    children: ($$payload2) => {
      Command_empty($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->No themes found.`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      if (systemThemes.length > 0) {
        $$payload2.out += "<!--[-->";
        Command_group($$payload2, {
          heading: "System",
          children: ($$payload3) => {
            const each_array = ensure_array_like(systemThemes);
            $$payload3.out += `<!--[-->`;
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let themeOption = each_array[$$index];
              if (themeOption) {
                $$payload3.out += "<!--[-->";
                const colors = getThemeColors(themeOption);
                Command_item($$payload3, {
                  value: themeOption.value,
                  onSelect: () => handleThemeSelect(themeOption.value),
                  class: "data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2",
                  children: ($$payload4) => {
                    $$payload4.out += `<div class="flex gap-0.5"><div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.primary)}`)}></div> <div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.secondary)}`)}></div> <div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.background)}`)}></div></div> <div class="flex flex-1 items-center gap-2"><span class="line-clamp-1 text-sm font-medium capitalize">${escape_html(themeOption.name)}</span></div> `;
                    if (store_get($$store_subs ??= {}, "$theme", theme) === themeOption.value) {
                      $$payload4.out += "<!--[-->";
                      Check($$payload4, { class: "h-4 w-4 shrink-0 opacity-70" });
                    } else {
                      $$payload4.out += "<!--[!-->";
                    }
                    $$payload4.out += `<!--]-->`;
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
        $$payload2.out += `<!----> `;
        if (builtInThemes.length > 0) {
          $$payload2.out += "<!--[-->";
          Separator($$payload2, { class: "my-2" });
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]-->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      if (builtInThemes.length > 0) {
        $$payload2.out += "<!--[-->";
        Command_group($$payload2, {
          heading: "Built-in Themes",
          children: ($$payload3) => {
            const each_array_1 = ensure_array_like(builtInThemes);
            $$payload3.out += `<!--[-->`;
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let themeOption = each_array_1[$$index_1];
              if (themeOption) {
                $$payload3.out += "<!--[-->";
                const colors = getThemeColors(themeOption);
                Command_item($$payload3, {
                  value: themeOption.value,
                  onSelect: () => handleThemeSelect(themeOption.value),
                  class: "data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2",
                  children: ($$payload4) => {
                    $$payload4.out += `<div class="flex gap-0.5"><div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.primary)}`)}></div> <div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.secondary)}`)}></div> <div class="h-3 w-3 rounded-sm border border-muted"${attr_style(`background-color: ${stringify(colors.background)}`)}></div></div> <div class="flex flex-1 items-center gap-2"><span class="line-clamp-1 text-sm font-medium capitalize">${escape_html(themeOption.name)}</span></div> `;
                    if (store_get($$store_subs ??= {}, "$theme", theme) === themeOption.value) {
                      $$payload4.out += "<!--[-->";
                      Check($$payload4, { class: "h-4 w-4 shrink-0 opacity-70" });
                    } else {
                      $$payload4.out += "<!--[!-->";
                    }
                    $$payload4.out += `<!--]-->`;
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
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { systemThemes, builtInThemes, onThemeSelect });
  pop();
}
function ThemeSwitcher($$payload, $$props) {
  push();
  var $$store_subs;
  let filteredThemes, builtInThemes, systemThemes;
  let withCycleThemes = fallback($$props["withCycleThemes"], false);
  let className = fallback($$props["className"], "");
  let compact = fallback($$props["compact"], false);
  let open = false;
  let search = "";
  function handleThemeSelect(themeValue) {
    theme.setTheme(themeValue);
    open = false;
    search = "";
  }
  function handleDarkModeToggle() {
    isDarkMode.toggle();
  }
  function randomizeTheme() {
    const randomIndex = Math.floor(Math.random() * store_get($$store_subs ??= {}, "$themes", themes).length);
    theme.setTheme(store_get($$store_subs ??= {}, "$themes", themes)[randomIndex].value);
  }
  function handleSearchInput(event) {
    const target = event.target;
    search = target.value;
  }
  store_get($$store_subs ??= {}, "$themes", themes).find((t) => t.value === store_get($$store_subs ??= {}, "$theme", theme)) || store_get($$store_subs ??= {}, "$themes", themes)[0];
  filteredThemes = store_get($$store_subs ??= {}, "$themes", themes).filter((theme2) => search.trim() === "" || theme2.name.toLowerCase().includes(search.toLowerCase()));
  builtInThemes = filteredThemes.filter((t) => t.value !== "system");
  systemThemes = filteredThemes.filter((t) => t.value === "system");
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (compact) {
      $$payload2.out += "<!--[-->";
      Root$2($$payload2, {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          Trigger$2($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<button class="p-2 text-primary-foreground bg-white/10 hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors flex items-center gap-2" title="Change theme" data-theme-trigger="">`;
              Palette($$payload4, { class: "w-5 h-5" });
              $$payload4.out += `<!----> <span class="sr-only">Change theme</span></button>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Popover_content($$payload3, {
            class: "w-[300px] p-0 border-0 bg-background shadow-2xl",
            align: "end",
            children: ($$payload4) => {
              Command($$payload4, {
                class: "h-100 w-full rounded-lg shadow-2xl bg-background",
                children: ($$payload5) => {
                  ThemeSearch($$payload5, {
                    filteredThemes,
                    onSearchInput: handleSearchInput,
                    onDarkModeToggle: handleDarkModeToggle,
                    onRandomizeTheme: randomizeTheme,
                    get search() {
                      return search;
                    },
                    set search($$value) {
                      search = $$value;
                      $$settled = false;
                    }
                  });
                  $$payload5.out += `<!----> `;
                  ThemeGrid($$payload5, {
                    systemThemes,
                    builtInThemes,
                    onThemeSelect: handleThemeSelect
                  });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="flex w-full items-center">`;
      if (withCycleThemes) {
        $$payload2.out += "<!--[-->";
        Separator($$payload2, { orientation: "vertical", class: "min-h-8" });
        $$payload2.out += `<!----> `;
        Root$1($$payload2, {
          children: ($$payload3) => {
            Trigger$1($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<button class="aspect-square min-h-8 w-auto inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground">`;
                Arrow_left($$payload4, { class: "h-4 w-4" });
                $$payload4.out += `<!----></button>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            Tooltip_content($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<!---->Previous theme`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----> `;
        Separator($$payload2, { orientation: "vertical", class: "min-h-8" });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      Root$2($$payload2, {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          Trigger$2($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<button${attr_class(clsx(cn("p-2 text-primary-foreground bg-white/10 hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors flex items-center gap-2", className)))} title="Change theme" data-theme-trigger="">`;
              Palette($$payload4, { class: "w-5 h-5" });
              $$payload4.out += `<!----> <span class="sr-only">Change theme</span></button>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Popover_content($$payload3, {
            class: "w-[300px] p-0 border-0 bg-background shadow-2xl",
            align: "center",
            children: ($$payload4) => {
              Command($$payload4, {
                class: "h-100 w-full rounded-lg shadow-2xl bg-background p-3",
                children: ($$payload5) => {
                  ThemeSearch($$payload5, {
                    filteredThemes,
                    onSearchInput: handleSearchInput,
                    onDarkModeToggle: handleDarkModeToggle,
                    onRandomizeTheme: randomizeTheme,
                    get search() {
                      return search;
                    },
                    set search($$value) {
                      search = $$value;
                      $$settled = false;
                    }
                  });
                  $$payload5.out += `<!----> `;
                  ThemeGrid($$payload5, {
                    systemThemes,
                    builtInThemes,
                    onThemeSelect: handleThemeSelect
                  });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      if (withCycleThemes) {
        $$payload2.out += "<!--[-->";
        Separator($$payload2, { orientation: "vertical", class: "min-h-8" });
        $$payload2.out += `<!----> `;
        Root$1($$payload2, {
          children: ($$payload3) => {
            Trigger$1($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<button class="aspect-square min-h-8 w-auto inline-flex items-center justify-center rounded-md bg-transparent hover:bg-secondary hover:text-secondary-foreground">`;
                Arrow_right($$payload4, { class: "h-4 w-4" });
                $$payload4.out += `<!----></button>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            Tooltip_content($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<!---->Next theme`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div>`;
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { withCycleThemes, className, compact });
  pop();
}
function Hover_card_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    align = "center",
    sideOffset = 4,
    portalProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Link_preview_content($$payload3, spread_props([
            {
              align,
              sideOffset,
              class: cn("bg-popover text-popover-foreground z-50 mt-3 w-64 rounded-md border p-4 shadow-md outline-none", className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              }
            }
          ]));
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const Root = Link_preview;
const Trigger = Link_preview_trigger;
const badgeVariants = tv({
  base: "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
      destructive: "bg-destructive text-destructive-foreground hover:bg-secondary hover:text-secondary-foreground border-transparent",
      outline: "text-foreground"
    }
  },
  defaultVariants: { variant: "default" }
});
function Badge($$payload, $$props) {
  push();
  let {
    ref = null,
    href,
    class: className,
    variant = "default",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  element(
    $$payload,
    href ? "a" : "span",
    () => {
      $$payload.out += `${spread_attributes(
        {
          href,
          class: clsx(cn(badgeVariants({ variant }), className)),
          ...restProps
        }
      )}`;
    },
    () => {
      children?.($$payload);
      $$payload.out += `<!---->`;
    }
  );
  bind_props($$props, { ref });
  pop();
}
function Label($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Label$1($$payload2, spread_props([
      {
        class: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Navbar($$payload, $$props) {
  push();
  var $$store_subs;
  let searchValue = "";
  let hostValue = typeof window !== "undefined" ? localStorage.getItem("host") || "http://127.0.0.1:3000" : "http://127.0.0.1:3000";
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<nav class="bg-primary shadow-lg"><div class="px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center"><button class="text-primary-foreground text-xl font-semibold hover:text-secondary-foreground transition-colors">PassDB Search</button> <div class="flex items-center m-8">`;
    ThemeSwitcher($$payload2, {});
    $$payload2.out += `<!----></div></div> <div class="flex items-center space-x-4">`;
    if (store_get($$store_subs ??= {}, "$page", page).route.id !== "/") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="relative"><input${attr("value", searchValue)} type="text" placeholder="Search " class="flex h-10 w-64 rounded-md border border-input bg-background pl-3 pr-10 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"/> <div class="absolute right-2 top-1/2 -translate-y-1/2"><!---->`;
      Root($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Trigger($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<button type="button" class="text-muted-foreground hover:text-secondary-foreground transition-colors p-1" aria-label="Search help"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <!---->`;
          Hover_card_content($$payload3, {
            class: "w-80 bg-background border-0 shadow-2xl p-6",
            children: ($$payload4) => {
              $$payload4.out += `<div class="space-y-2"><h4 class="text-sm font-semibold">Search Operators</h4> <div class="p-3">`;
              Separator($$payload4, {});
              $$payload4.out += `<!----></div> <div class="grid grid-cols-2 gap-2 text-sm"><div class="flex items-center gap-2">`;
              Badge($$payload4, {
                variant: "default",
                class: "font-mono",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->u:`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <span>Username search</span></div> <div class="flex items-center gap-2">`;
              Badge($$payload4, {
                variant: "default",
                class: "font-mono",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->p:`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <span>Password check</span></div> <div class="flex items-center gap-2">`;
              Badge($$payload4, {
                variant: "default",
                class: "font-mono",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->d:`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <span>Domain search</span></div> <div class="flex items-center gap-2">`;
              Badge($$payload4, {
                variant: "default",
                class: "font-mono",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->e:`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <span>Email search</span></div></div></div>`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <!---->`;
    Root$2($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Trigger$2($$payload3, {
          class: "p-2 text-primary-foreground bg-primary hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors",
          "aria-label": "Settings",
          children: ($$payload4) => {
            $$payload4.out += `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Popover_content($$payload3, {
          class: "w-80 bg-background border-0 shadow-2xl p-6",
          align: "end",
          children: ($$payload4) => {
            $$payload4.out += `<div class="grid gap-4"><div class="space-y-2"><h4 class="font-medium leading-none">API Settings</h4> <p class="text-muted-foreground text-sm">Configure the API endpoint for PassDB backend.</p></div> <div class="grid gap-2"><div class="grid grid-cols-3 items-center gap-4">`;
            Label($$payload4, {
              for: "api-host",
              children: ($$payload5) => {
                $$payload5.out += `<!---->API Host`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "api-host",
              placeholder: "http://127.0.0.1:3000",
              class: "col-span-2 h-8 focus-visible:ring-0 focus-visible:ring-offset-0",
              get value() {
                return hostValue;
              },
              set value($$value) {
                hostValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div></div></div>`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div></div></div></nav>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ErrorBoundary($$payload, $$props) {
  push();
  let {
    error = null,
    reset: reset2 = () => window.location.reload(),
    children
  } = $$props;
  if (error) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-4xl mx-auto px-4"><div class="max-w-md mx-auto space-y-8"><div class="bg-card p-8 rounded-lg shadow-lg border"><div class="flex items-center justify-center w-12 h-12 mx-auto bg-destructive/10 rounded-full"><svg class="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div> <div class="mt-4 text-center"><h3 class="text-lg font-medium text-foreground">Oops! Something went wrong</h3> <p class="mt-2 text-sm text-muted-foreground">We encountered an unexpected error. Please try again.</p></div> <div class="mt-6 space-y-3"><button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors">Reload Page</button> <button class="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors">${escape_html("Show")} Details</button></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    children?.($$payload);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { error });
  pop();
}
function noop() {
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};
const VELOCITY_THRESHOLD = 0.4;
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement))
    return;
  let originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache)
    return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement))
    return;
  let originalStyles = cache.get(el);
  if (!originalStyles)
    return;
  {
    el.style[prop] = originalStyles[prop];
  }
}
const isVertical = (direction) => {
  switch (direction) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default:
      return direction;
  }
};
function getTranslate(element2, direction) {
  if (!element2) {
    return null;
  }
  const style = window.getComputedStyle(element2);
  const transform = (
    // @ts-expect-error - shh
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function assignStyle(element2, style) {
  if (!element2)
    return () => {
    };
  const prevStyle = element2.style.cssText;
  Object.assign(element2.style, style);
  return () => {
    element2.style.cssText = prevStyle;
  };
}
function chain$1(...fns) {
  return (...args) => {
    for (const fn of fns) {
      if (typeof fn === "function") {
        fn(...args);
      }
    }
  };
}
function useSnapPoints({
  snapPoints,
  drawerNode,
  overlayNode,
  fadeFromIndex,
  setOpenTime,
  direction,
  container,
  snapToSequentialPoint,
  activeSnapPoint,
  open,
  isReleasing
}) {
  let windowDimensions = typeof window !== "undefined" ? {} : void 0;
  const isLastSnapPoint = activeSnapPoint.current === snapPoints.current?.[snapPoints.current.length - 1] || null;
  const activeSnapPointIndex = snapPoints.current?.findIndex((snapPoint) => snapPoint === activeSnapPoint.current);
  const shouldFade = snapPoints.current && snapPoints.current.length > 0 && (fadeFromIndex.current || fadeFromIndex.current === 0) && !Number.isNaN(fadeFromIndex.current) && snapPoints.current[fadeFromIndex.current] === activeSnapPoint.current || !snapPoints.current;
  const snapPointsOffset = (() => {
    open.current;
    const containerSize = container.current ? {
      width: container.current.getBoundingClientRect().width,
      height: container.current.getBoundingClientRect().height
    } : typeof window !== "undefined" ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : { width: 0, height: 0 };
    return snapPoints.current?.map((snapPoint) => {
      const isPx = typeof snapPoint === "string";
      let snapPointAsNumber = 0;
      if (isPx) {
        snapPointAsNumber = parseInt(snapPoint, 10);
      }
      if (isVertical(direction.current)) {
        const height = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.height : 0;
        if (windowDimensions) {
          return direction.current === "bottom" ? containerSize.height - height : -containerSize.height + height;
        }
        return height;
      }
      const width = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.width : 0;
      if (windowDimensions) {
        return direction.current === "right" ? containerSize.width - width : -containerSize.width + width;
      }
      return width;
    }) ?? [];
  })();
  const activeSnapPointOffset = (() => {
    if (activeSnapPointIndex !== null) {
      if (activeSnapPointIndex !== void 0) {
        return snapPointsOffset[activeSnapPointIndex];
      }
    }
    return null;
  })();
  function onSnapPointChange(activeSnapPointIndex2) {
    if (snapPoints.current && activeSnapPointIndex2 === snapPointsOffset.length - 1) {
      setOpenTime(/* @__PURE__ */ new Date());
    }
  }
  function snapToPoint(dimension) {
    const newSnapPointIndex = snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
    onSnapPointChange(newSnapPointIndex);
    set(drawerNode(), {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: isVertical(direction.current) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
    });
    if (snapPointsOffset && newSnapPointIndex !== snapPointsOffset.length - 1 && fadeFromIndex.current !== void 0 && newSnapPointIndex !== fadeFromIndex.current && newSnapPointIndex < fadeFromIndex.current) {
      set(overlayNode(), {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        opacity: "0"
      });
    } else {
      set(overlayNode(), {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        opacity: "1"
      });
    }
    activeSnapPoint.current = snapPoints.current?.[Math.max(newSnapPointIndex, 0)];
  }
  watch(
    [
      () => activeSnapPoint.current,
      () => open.current
    ],
    () => {
      const releasing = isReleasing();
      if (!activeSnapPoint.current || releasing) return;
      const newIndex = snapPoints.current?.findIndex((snapPoint) => snapPoint === activeSnapPoint.current) ?? -1;
      if (snapPointsOffset && newIndex !== -1 && typeof snapPointsOffset[newIndex] === "number") {
        if (snapPointsOffset[newIndex] === activeSnapPoint.current) return;
        snapToPoint(snapPointsOffset[newIndex]);
      }
    }
  );
  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
    dismissible
  }) {
    if (fadeFromIndex.current === void 0) return;
    const dir = direction.current;
    const currentPosition = dir === "bottom" || dir === "right" ? (activeSnapPointOffset ?? 0) - draggedDistance : (activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex.current - 1;
    const isFirst = activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set(overlayNode(), {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (!snapToSequentialPoint.current && velocity > 2 && !hasDraggedUp) {
      if (dismissible) {
        closeDrawer();
      } else {
        snapToPoint(snapPointsOffset[0]);
      }
      return;
    }
    if (!snapToSequentialPoint.current && velocity > 2 && hasDraggedUp && snapPointsOffset && snapPoints.current) {
      snapToPoint(snapPointsOffset[snapPoints.current.length - 1]);
      return;
    }
    const closestSnapPoint = snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number") return prev;
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });
    const dim = isVertical(dir) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && isLastSnapPoint && snapPoints.current) {
        snapToPoint(snapPointsOffset[snapPoints.current.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if (activeSnapPointIndex === null) return;
      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    if (activeSnapPointOffset === null) return;
    const dir = direction.current;
    const newValue = isBottomOrRight(dir) ? activeSnapPointOffset - draggedDistance : activeSnapPointOffset + draggedDistance;
    const lastSnapPoint = snapPointsOffset[snapPointsOffset.length - 1];
    if (isBottomOrRight(dir) && newValue < lastSnapPoint) return;
    if (!isBottomOrRight(dir) && newValue > lastSnapPoint) return;
    set(drawerNode(), {
      transform: isVertical(dir) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    if (!snapPoints.current || typeof activeSnapPointIndex !== "number" || !snapPointsOffset || fadeFromIndex.current === void 0) {
      return null;
    }
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex.current - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex.current;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown) {
      return 1;
    }
    if (!shouldFade && !isOverlaySnapPoint) {
      return null;
    }
    const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex + 1 : activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? snapPointsOffset[targetSnapPointIndex] - snapPointsOffset[targetSnapPointIndex - 1] : snapPointsOffset[targetSnapPointIndex + 1] - snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  return {
    get isLastSnapPoint() {
      return isLastSnapPoint;
    },
    get shouldFade() {
      return shouldFade;
    },
    get activeSnapPointIndex() {
      return activeSnapPointIndex;
    },
    get snapPointsOffset() {
      return snapshot(snapPointsOffset);
    },
    getPercentageDragged,
    onRelease,
    onDrag
  };
}
function isBottomOrRight(direction) {
  if (direction === "bottom" || direction === "right") return true;
  return false;
}
const isBrowser = typeof document !== "undefined";
function isMobileFirefox() {
  const userAgent = navigator.userAgent;
  return typeof window !== "undefined" && (/Firefox/.test(userAgent) && /Mobile/.test(userAgent) || // Android Firefox
  /FxiOS/.test(userAgent));
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const KEYBOARD_BUFFER = 24;
function chain(...callbacks) {
  return (...args) => {
    for (let callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
const visualViewport = isBrowser && window.visualViewport;
function isScrollable(node) {
  let style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
let preventScrollCount = 0;
let restore;
function usePreventScroll(opts) {
  watch(opts.isDisabled, () => {
    if (opts.isDisabled()) {
      return;
    }
    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari();
      }
    }
    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore?.();
      }
    };
  });
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  const onTouchStart = (e) => {
    scrollable = getScrollParent(e.target);
    if (scrollable === document.documentElement && scrollable === document.body) {
      return;
    }
    lastY = e.changedTouches[0].pageY;
  };
  let onTouchMove = (e) => {
    if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    }
    let y = e.changedTouches[0].pageY;
    let scrollTop = scrollable.scrollTop;
    let bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0) {
      return;
    }
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  };
  let onTouchEnd = (e) => {
    let target = e.target;
    if (isInput(target) && target !== document.activeElement) {
      e.preventDefault();
      target.style.transform = "translateY(-2000px)";
      target.focus();
      requestAnimationFrame(() => {
        target.style.transform = "";
      });
    }
  };
  const onFocus = (e) => {
    let target = e.target;
    if (isInput(target)) {
      target.style.transform = "translateY(-2000px)";
      requestAnimationFrame(() => {
        target.style.transform = "";
        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            requestAnimationFrame(() => {
              scrollIntoView(target);
            });
          } else {
            visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
          }
        }
      });
    }
  };
  let onWindowScroll = () => {
    window.scrollTo(0, 0);
  };
  let scrollX = window.pageXOffset;
  let scrollY = window.pageYOffset;
  let restoreStyles = chain(setStyle(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`));
  window.scrollTo(0, 0);
  let removeEvents = chain(on(document, "touchstart", onTouchStart, { passive: false, capture: true }), on(document, "touchmove", onTouchMove, { passive: false, capture: true }), on(document, "touchend", onTouchEnd, { passive: false, capture: true }), on(document, "focus", onFocus, { capture: true }), on(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element2, style, value) {
  let cur = element2.style[style];
  element2.style[style] = value;
  return () => {
    element2.style[style] = cur;
  };
}
function scrollIntoView(target) {
  let root = document.scrollingElement || document.documentElement;
  while (target && target !== root) {
    let scrollable = getScrollParent(target);
    if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
      let scrollableTop = scrollable.getBoundingClientRect().top;
      let targetTop = target.getBoundingClientRect().top;
      let targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
let previousBodyPosition = null;
function usePositionFixed({
  open,
  modal,
  nested,
  hasBeenOpened,
  preventScrollRestoration,
  noBodyStyles
}) {
  let activeUrl = typeof window !== "undefined" ? window.location.href : "";
  let scrollPos = 0;
  function setPositionFixed() {
    if (!isSafari()) return;
    if (previousBodyPosition === null && open.current && !noBodyStyles.current) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: "unset"
      };
      const { scrollX, innerHeight } = window;
      document.body.style.setProperty("position", "fixed", "important");
      Object.assign(document.body.style, {
        top: `${-scrollPos}px`,
        left: `${-scrollX}px`,
        right: "0px",
        height: "auto"
      });
      window.setTimeout(
        () => window.requestAnimationFrame(() => {
          const bottomBarHeight = innerHeight - window.innerHeight;
          if (bottomBarHeight && scrollPos >= innerHeight) {
            document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
          }
        }),
        300
      );
    }
  }
  function restorePositionSetting() {
    if (!isSafari()) return;
    if (previousBodyPosition !== null && !noBodyStyles.current) {
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);
      Object.assign(document.body.style, previousBodyPosition);
      window.requestAnimationFrame(() => {
        if (preventScrollRestoration.current && activeUrl !== window.location.href) {
          activeUrl = window.location.href;
          return;
        }
        window.scrollTo(x, y);
      });
      previousBodyPosition = null;
    }
  }
  watch([() => modal.current, () => activeUrl], () => {
    if (!modal.current) return;
    return () => {
      if (typeof document === "undefined") return;
      const hasDrawerOpened = !!document.querySelector("[data-vaul-drawer]");
      if (hasDrawerOpened) return;
      restorePositionSetting();
    };
  });
  watch(
    [
      () => open.current,
      () => hasBeenOpened(),
      () => activeUrl,
      () => modal.current,
      () => nested.current
    ],
    () => {
      if (nested.current || !hasBeenOpened()) return;
      if (open.current) {
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        !isStandalone && setPositionFixed();
        if (!modal.current) {
          window.setTimeout(
            () => {
              restorePositionSetting();
            },
            500
          );
        }
      } else {
        restorePositionSetting();
      }
    }
  );
  return { restorePositionSetting };
}
const DrawerContext = new Context("Drawer.Root");
function useDrawerRoot(opts) {
  let hasBeenOpened = false;
  let isDragging = false;
  let justReleased = false;
  let overlayNode = null;
  let drawerNode = null;
  let openTime = null;
  let dragStartTime = null;
  let dragEndTime = null;
  let lastTimeDragPrevented = null;
  let isAllowedToDrag = false;
  let nestedOpenChangeTimer = null;
  let pointerStart = 0;
  let keyboardIsOpen = box(false);
  let shouldAnimate = !opts.open.current;
  let previousDiffFromInitial = 0;
  let drawerHeight = 0;
  let drawerWidth = 0;
  let initialDrawerHeight = 0;
  let isReleasing = false;
  const snapPointsState = useSnapPoints({
    snapPoints: opts.snapPoints,
    drawerNode: () => drawerNode,
    activeSnapPoint: opts.activeSnapPoint,
    container: opts.container,
    direction: opts.direction,
    fadeFromIndex: opts.fadeFromIndex,
    overlayNode: () => overlayNode,
    setOpenTime: (time) => {
      openTime = time;
    },
    snapToSequentialPoint: opts.snapToSequentialPoint,
    open: opts.open,
    isReleasing: () => isReleasing
  });
  usePreventScroll({
    isDisabled: () => !opts.open.current || isDragging || !opts.modal.current || justReleased || !hasBeenOpened || !opts.repositionInputs.current || !opts.disablePreventScroll.current
  });
  const { restorePositionSetting } = usePositionFixed({ ...opts, hasBeenOpened: () => hasBeenOpened });
  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }
  function onPress(event) {
    if (!opts.dismissible.current && !opts.snapPoints.current) return;
    if (drawerNode && !drawerNode.contains(event.target)) return;
    drawerHeight = drawerNode?.getBoundingClientRect().height || 0;
    drawerWidth = drawerNode?.getBoundingClientRect().width || 0;
    isDragging = true;
    dragStartTime = /* @__PURE__ */ new Date();
    if (isIOS()) {
      on(window, "touchend", () => isAllowedToDrag = false, { once: true });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart = isVertical(opts.direction.current) ? event.pageY : event.pageX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    let element2 = el;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerNode ? getTranslate(drawerNode, opts.direction.current) : null;
    const date = /* @__PURE__ */ new Date();
    if (element2.tagName === "SELECT") return false;
    if (element2.hasAttribute("data-vaul-no-drag") || element2.closest("[data-vaul-no-drag]")) {
      return false;
    }
    if (opts.direction.current === "right" || opts.direction.current === "left") {
      return true;
    }
    if (openTime && date.getTime() - openTime.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if (opts.direction.current === "bottom" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < opts.scrollLockTimeout.current && swipeAmount === 0) {
      lastTimeDragPrevented = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented = date;
      return false;
    }
    while (element2) {
      if (element2.scrollHeight > element2.clientHeight) {
        if (element2.scrollTop !== 0) {
          lastTimeDragPrevented = /* @__PURE__ */ new Date();
          return false;
        }
        if (element2.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element2 = element2.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    if (!drawerNode || !isDragging) return;
    const directionMultiplier = opts.direction.current === "bottom" || opts.direction.current === "right" ? 1 : -1;
    const draggedDistance = (pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX)) * directionMultiplier;
    const isDraggingInDirection = draggedDistance > 0;
    const noCloseSnapPointsPreCondition = opts.snapPoints.current && !opts.dismissible.current && !isDraggingInDirection;
    if (noCloseSnapPointsPreCondition && snapPointsState.activeSnapPointIndex === 0) return;
    const absDraggedDistance = Math.abs(draggedDistance);
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const drawerDimension = opts.direction.current === "bottom" || opts.direction.current === "top" ? drawerHeight : drawerWidth;
    let percentageDragged = absDraggedDistance / drawerDimension;
    const snapPointPercentageDragged = snapPointsState.getPercentageDragged(absDraggedDistance, isDraggingInDirection);
    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged;
    }
    if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
      return;
    }
    if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) return;
    drawerNode.classList.add(DRAG_CLASS);
    isAllowedToDrag = true;
    set(drawerNode, { transition: "none" });
    set(overlayNode, { transition: "none" });
    if (opts.snapPoints.current) {
      snapPointsState.onDrag({ draggedDistance });
    }
    if (isDraggingInDirection && !opts.snapPoints.current) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);
      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
      set(drawerNode, {
        transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
      return;
    }
    const opacityValue = 1 - percentageDragged;
    if (snapPointsState.shouldFade || opts.fadeFromIndex.current && snapPointsState.activeSnapPointIndex === opts.fadeFromIndex.current - 1) {
      opts.onDrag.current?.(event, percentageDragged);
      set(
        overlayNode,
        {
          opacity: `${opacityValue}`,
          transition: "none"
        },
        true
      );
    }
    if (wrapper && overlayNode && opts.shouldScaleBackground.current) {
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
      const borderRadiusValue = 8 - percentageDragged * 8;
      const translateValue = Math.max(0, 14 - percentageDragged * 14);
      set(
        wrapper,
        {
          borderRadius: `${borderRadiusValue}px`,
          transform: isVertical(opts.direction.current) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
          transition: "none"
        },
        true
      );
    }
    if (!opts.snapPoints.current) {
      const translateValue = absDraggedDistance * directionMultiplier;
      set(drawerNode, {
        transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
    }
  }
  function onDialogOpenChange(o) {
    if (!opts.dismissible.current && !o) return;
    if (o) {
      hasBeenOpened = true;
    } else {
      closeDrawer(true);
    }
    opts.open.current = o;
  }
  function onVisualViewportChange() {
    if (!drawerNode || !opts.repositionInputs.current) return;
    const focusedElement = document.activeElement;
    if (isInput(focusedElement) || keyboardIsOpen.current) {
      const visualViewportHeight = window.visualViewport?.height || 0;
      const totalHeight = window.innerHeight;
      let diffFromInitial = totalHeight - visualViewportHeight;
      const drawerHeight2 = drawerNode.getBoundingClientRect().height || 0;
      const isTallEnough = drawerHeight2 > totalHeight * 0.8;
      if (!initialDrawerHeight) {
        initialDrawerHeight = drawerHeight2;
      }
      const offsetFromTop = drawerNode.getBoundingClientRect().top;
      if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
        keyboardIsOpen.current = !keyboardIsOpen.current;
      }
      if (opts.snapPoints.current && opts.snapPoints.current.length > 0 && snapPointsState.snapPointsOffset && snapPointsState.activeSnapPointIndex) {
        const activeSnapPointHeight = snapPointsState.snapPointsOffset[snapPointsState.activeSnapPointIndex] || 0;
        diffFromInitial += activeSnapPointHeight;
      }
      previousDiffFromInitial = diffFromInitial;
      if (drawerHeight2 > visualViewportHeight || keyboardIsOpen.current) {
        const height = drawerNode.getBoundingClientRect().height;
        let newDrawerHeight = height;
        if (height > visualViewportHeight) {
          newDrawerHeight = visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
        }
        if (opts.fixed.current) {
          drawerNode.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
        } else {
          drawerNode.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
        }
      } else if (!isMobileFirefox()) {
        drawerNode.style.height = `${initialDrawerHeight}px`;
      }
      if (opts.snapPoints.current && opts.snapPoints.current.length > 0 && !keyboardIsOpen.current) {
        drawerNode.style.bottom = `0px`;
      } else {
        drawerNode.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
      }
    }
  }
  watch(
    [
      () => snapPointsState.activeSnapPointIndex,
      () => opts.snapPoints.current,
      () => snapPointsState.snapPointsOffset,
      () => drawerNode
    ],
    () => {
      if (!window.visualViewport) return;
      return on(window.visualViewport, "resize", onVisualViewportChange);
    }
  );
  function cancelDrag() {
    if (!isDragging || !drawerNode) return;
    drawerNode.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
  }
  function closeDrawer(fromWithin) {
    cancelDrag();
    opts.onClose?.current();
    if (!fromWithin) {
      handleOpenChange(false);
      opts.open.current = false;
    }
    window.setTimeout(
      () => {
        if (opts.snapPoints.current && opts.snapPoints.current.length > 0) {
          opts.activeSnapPoint.current = opts.snapPoints.current[0];
        }
      },
      TRANSITIONS.DURATION * 1e3
    );
  }
  function resetDrawer() {
    if (!drawerNode) return;
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const currentSwipeAmount = getTranslate(drawerNode, opts.direction.current);
    set(drawerNode, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(overlayNode, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    if (opts.shouldScaleBackground.current && currentSwipeAmount && currentSwipeAmount > 0 && opts.open.current) {
      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: "hidden",
          ...isVertical(opts.direction.current) ? {
            transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
            transformOrigin: "top"
          } : {
            transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
            transformOrigin: "left"
          },
          transitionProperty: "transform, border-radius",
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
        },
        true
      );
    }
  }
  function onRelease(event) {
    isReleasing = true;
    handleRelease(event);
    afterTick(() => {
      isReleasing = false;
    });
  }
  function handleRelease(event) {
    if (!isDragging || !drawerNode) return;
    drawerNode.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
    const swipeAmount = getTranslate(drawerNode, opts.direction.current);
    if (!event || event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) {
      return;
    }
    if (dragStartTime === null) return;
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
    const distMoved = pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      justReleased = true;
      setTimeout(
        () => {
          justReleased = false;
        },
        200
      );
    }
    if (opts.snapPoints.current) {
      const directionMultiplier = opts.direction.current === "bottom" || opts.direction.current === "right" ? 1 : -1;
      snapPointsState.onRelease({
        draggedDistance: distMoved * directionMultiplier,
        closeDrawer,
        velocity,
        dismissible: opts.dismissible.current
      });
      opts.onRelease.current?.(event, true);
      return;
    }
    if (opts.direction.current === "bottom" || opts.direction.current === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      opts.onRelease.current?.(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      opts.onRelease.current?.(event, false);
      return;
    }
    const visibleDrawerHeight = Math.min(drawerNode.getBoundingClientRect().height ?? 0, window.innerHeight);
    const visibleDrawerWidth = Math.min(drawerNode.getBoundingClientRect().width ?? 0, window.innerWidth);
    const isHorizontalSwipe = opts.direction.current === "left" || opts.direction.current === "right";
    if (Math.abs(swipeAmount) >= (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * opts.closeThreshold.current) {
      closeDrawer();
      opts.onRelease.current?.(event, false);
      return;
    }
    opts.onRelease.current?.(event, true);
    resetDrawer();
  }
  watch(() => opts.open.current, () => {
    if (opts.open.current) {
      set(document.documentElement, { scrollBehavior: "auto" });
      openTime = /* @__PURE__ */ new Date();
    }
    return () => {
      reset(document.documentElement, "scrollBehavior");
    };
  });
  function onNestedOpenChange(o) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const initialTranslate = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer) {
      window.clearTimeout(nestedOpenChangeTimer);
    }
    set(drawerNode, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: isVertical(opts.direction.current) ? `scale(${scale}) translate3d(0, ${initialTranslate}px, 0)` : `scale(${scale}) translate3d(${initialTranslate}px, 0, 0)`
    });
    if (!o && drawerNode) {
      nestedOpenChangeTimer = window.setTimeout(
        () => {
          const translateValue = getTranslate(drawerNode, opts.direction.current);
          set(drawerNode, {
            transition: "none",
            transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
          });
        },
        500
      );
    }
  }
  function onNestedDrag(_event, percentageDragged) {
    if (percentageDragged < 0) return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    set(drawerNode, {
      transform: isVertical(opts.direction.current) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_event, o) {
    const dim = isVertical(opts.direction.current) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(drawerNode, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical(opts.direction.current) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  let bodyStyles;
  function handleOpenChange(o) {
    opts.onOpenChange.current?.(o);
    if (o && !opts.nested.current) {
      bodyStyles = document.body.style.cssText;
    } else if (!o && !opts.nested.current) {
      afterSleep(TRANSITIONS.DURATION * 1e3, () => {
        document.body.style.cssText = bodyStyles;
      });
    }
    if (!o && !opts.nested.current) {
      restorePositionSetting();
    }
    setTimeout(
      () => {
        opts.onAnimationEnd.current?.(o);
      },
      TRANSITIONS.DURATION * 1e3
    );
    if (o && !opts.modal.current) {
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          document.body.style.pointerEvents = "auto";
        });
      }
    }
    if (!o) {
      document.body.style.pointerEvents = "auto";
    }
  }
  watch(() => opts.modal.current, () => {
    if (!opts.modal.current) {
      window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = "auto";
      });
    }
  });
  function setOverlayNode(node) {
    overlayNode = node;
  }
  function setDrawerNode(node) {
    drawerNode = node;
  }
  return DrawerContext.set({
    ...opts,
    keyboardIsOpen,
    closeDrawer,
    setDrawerNode,
    setOverlayNode,
    onDrag,
    onNestedDrag,
    onNestedOpenChange,
    onNestedRelease,
    onRelease,
    onPress,
    onDialogOpenChange,
    get shouldAnimate() {
      return shouldAnimate;
    },
    get isDragging() {
      return isDragging;
    },
    get overlayNode() {
      return overlayNode;
    },
    get drawerNode() {
      return drawerNode;
    },
    get snapPointsOffset() {
      return snapPointsState.snapPointsOffset;
    },
    get shouldFade() {
      return snapPointsState.shouldFade;
    },
    restorePositionSetting,
    handleOpenChange
  });
}
function Drawer$1($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop,
    onDrag = noop,
    onRelease = noop,
    snapPoints,
    shouldScaleBackground = false,
    setBackgroundColorOnScale = true,
    closeThreshold = CLOSE_THRESHOLD,
    scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
    dismissible = true,
    handleOnly = false,
    fadeFromIndex = snapPoints && snapPoints.length - 1,
    activeSnapPoint = null,
    onActiveSnapPointChange = noop,
    fixed = false,
    modal = true,
    onClose = noop,
    nested = false,
    noBodyStyles = false,
    direction = "bottom",
    snapToSequentialPoint = false,
    preventScrollRestoration = false,
    repositionInputs = true,
    onAnimationEnd = noop,
    container = null,
    autoFocus = false,
    disablePreventScroll = true,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useDrawerRoot({
    open: box.with(() => open, (o) => {
      open = o;
      rootState.handleOpenChange(o);
    }),
    closeThreshold: box.with(() => closeThreshold),
    scrollLockTimeout: box.with(() => scrollLockTimeout),
    snapPoints: box.with(() => snapPoints),
    fadeFromIndex: box.with(() => fadeFromIndex),
    nested: box.with(() => nested),
    shouldScaleBackground: box.with(() => shouldScaleBackground),
    activeSnapPoint: box.with(() => activeSnapPoint, (v) => {
      activeSnapPoint = v;
      onActiveSnapPointChange(v);
    }),
    onRelease: box.with(() => onRelease),
    onDrag: box.with(() => onDrag),
    onClose: box.with(() => onClose),
    dismissible: box.with(() => dismissible),
    direction: box.with(() => direction),
    fixed: box.with(() => fixed),
    modal: box.with(() => modal),
    handleOnly: box.with(() => handleOnly),
    noBodyStyles: box.with(() => noBodyStyles),
    preventScrollRestoration: box.with(() => preventScrollRestoration),
    setBackgroundColorOnScale: box.with(() => setBackgroundColorOnScale),
    repositionInputs: box.with(() => repositionInputs),
    autoFocus: box.with(() => autoFocus),
    snapToSequentialPoint: box.with(() => snapToSequentialPoint),
    container: box.with(() => container),
    disablePreventScroll: box.with(() => disablePreventScroll),
    onOpenChange: box.with(() => onOpenChange),
    onAnimationEnd: box.with(() => onAnimationEnd)
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    var bind_get = () => rootState.open.current;
    var bind_set = (o) => {
      rootState.onDialogOpenChange(o);
    };
    $$payload2.out += `<!---->`;
    Dialog($$payload2, spread_props([
      {
        get open() {
          return bind_get();
        },
        set open($$value) {
          bind_set($$value);
        }
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { open, activeSnapPoint });
  pop();
}
globalThis.vaulIdCounter ??= { current: 0 };
function useId(prefix = "vaul-svelte") {
  globalThis.vaulIdCounter.current++;
  return `${prefix}-${globalThis.vaulIdCounter.current}`;
}
function useScaleBackground() {
  const ctx = DrawerContext.get();
  let timeoutId = null;
  const initialBackgroundColor = typeof document !== "undefined" ? document.body.style.backgroundColor : "";
  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }
  watch(
    [
      () => ctx.open.current,
      () => ctx.shouldScaleBackground.current,
      () => ctx.setBackgroundColorOnScale.current
    ],
    () => {
      if (ctx.open.current && ctx.shouldScaleBackground.current) {
        if (timeoutId) clearTimeout(timeoutId);
        const wrapper = document.querySelector("[data-vaul-drawer-wrapper]") || document.querySelector("[data-vaul-drawer-wrapper]");
        if (!wrapper) return;
        chain$1(ctx.setBackgroundColorOnScale.current && !ctx.noBodyStyles.current ? assignStyle(document.body, { background: "black" }) : noop, assignStyle(wrapper, {
          transformOrigin: isVertical(ctx.direction.current) ? "top" : "left",
          transitionProperty: "transform, border-radius",
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
        }));
        const wrapperStylesCleanup = assignStyle(wrapper, {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: "hidden",
          ...isVertical(ctx.direction.current) ? {
            transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`
          } : {
            transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`
          }
        });
        return () => {
          wrapperStylesCleanup();
          timeoutId = window.setTimeout(
            () => {
              if (initialBackgroundColor) {
                document.body.style.background = initialBackgroundColor;
              } else {
                document.body.style.removeProperty("background");
              }
            },
            TRANSITIONS.DURATION * 1e3
          );
        };
      }
    }
  );
}
function useDrawerContent(opts) {
  const ctx = DrawerContext.get();
  let mounted = false;
  useRefById({
    id: opts.id,
    ref: opts.ref,
    deps: () => [mounted, ctx.open.current],
    onRefChange: (node) => {
      if (!mounted) {
        ctx.setDrawerNode(null);
      } else {
        ctx.setDrawerNode(node);
      }
    }
  });
  let delayedSnapPoints = false;
  let pointerStart = null;
  let lastKnownPointerEvent = null;
  let wasBeyondThePoint = false;
  const hasSnapPoints = ctx.snapPoints.current && ctx.snapPoints.current.length > 0;
  useScaleBackground();
  function isDeltaInDirection(delta, direction, threshold = 0) {
    if (wasBeyondThePoint) return true;
    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = ["bottom", "right"].includes(direction) ? 1 : -1;
    if (direction === "left" || direction === "right") {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }
    wasBeyondThePoint = true;
    return true;
  }
  watch([() => hasSnapPoints, () => ctx.open.current], () => {
    if (hasSnapPoints && ctx.open.current) {
      window.requestAnimationFrame(() => {
        delayedSnapPoints = true;
      });
    } else {
      delayedSnapPoints = false;
    }
  });
  function handleOnPointerUp(e) {
    pointerStart = null;
    wasBeyondThePoint = false;
    ctx.onRelease(e);
  }
  function onpointerdown(e) {
    if (ctx.handleOnly.current) return;
    opts.onpointerdown.current?.(e);
    pointerStart = { x: e.pageX, y: e.pageY };
    ctx.onPress(e);
  }
  function onOpenAutoFocus(e) {
    opts.onOpenAutoFocus.current?.(e);
    if (!ctx.autoFocus.current) {
      e.preventDefault();
    }
  }
  function onInteractOutside(e) {
    opts.onInteractOutside.current?.(e);
    if (!ctx.modal.current || e.defaultPrevented) {
      e.preventDefault();
      return;
    }
    if (ctx.keyboardIsOpen.current) {
      ctx.keyboardIsOpen.current = false;
    }
  }
  function onFocusOutside(e) {
    if (!ctx.modal.current) {
      e.preventDefault();
      return;
    }
  }
  function onpointermove(e) {
    lastKnownPointerEvent = e;
    if (ctx.handleOnly.current) return;
    opts.onpointermove.current?.(e);
    if (!pointerStart) return;
    const yPosition = e.pageY - pointerStart.y;
    const xPosition = e.pageX - pointerStart.x;
    const swipeStartThreshold = e.pointerType === "touch" ? 10 : 2;
    const delta = { x: xPosition, y: yPosition };
    const isAllowedToSwipe = isDeltaInDirection(delta, ctx.direction.current, swipeStartThreshold);
    if (isAllowedToSwipe) {
      ctx.onDrag(e);
    } else if (Math.abs(xPosition) > swipeStartThreshold || Math.abs(yPosition) > swipeStartThreshold) {
      pointerStart = null;
    }
  }
  function onpointerup(e) {
    opts.onpointerup.current?.(e);
    pointerStart = null;
    wasBeyondThePoint = false;
    ctx.onRelease(e);
  }
  function onpointerout(e) {
    opts.onpointerout.current?.(e);
    handleOnPointerUp(lastKnownPointerEvent);
  }
  function oncontextmenu(e) {
    opts.oncontextmenu.current?.(e);
    if (lastKnownPointerEvent) {
      handleOnPointerUp(lastKnownPointerEvent);
    }
  }
  const props = {
    id: opts.id.current,
    "data-vaul-drawer-direction": ctx.direction.current,
    "data-vaul-drawer": "",
    "data-vaul-delayed-snap-points": delayedSnapPoints ? "true" : "false",
    "data-vaul-snap-points": ctx.open.current && hasSnapPoints ? "true" : "false",
    "data-vaul-custom-container": ctx.container.current ? "true" : "false",
    "data-vaul-animate": ctx.shouldAnimate ? "true" : "false",
    onpointerdown,
    onOpenAutoFocus,
    onInteractOutside,
    onFocusOutside,
    onpointerup,
    onpointermove,
    onpointerout,
    oncontextmenu,
    preventScroll: ctx.modal.current
  };
  return {
    get props() {
      return props;
    },
    ctx,
    setMounted: (value) => {
      mounted = value;
    }
  };
}
function Mounted($$payload, $$props) {
  push();
  let { onMounted } = $$props;
  pop();
}
function Drawer_content$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    onOpenAutoFocus = noop,
    onInteractOutside = noop,
    onFocusOutside = noop,
    oncontextmenu = noop,
    onpointerdown = noop,
    onpointerup = noop,
    onpointerout = noop,
    onpointermove = noop,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useDrawerContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    oncontextmenu: box.with(() => oncontextmenu ?? noop),
    onInteractOutside: box.with(() => onInteractOutside),
    onpointerdown: box.with(() => onpointerdown ?? noop),
    onpointermove: box.with(() => onpointermove ?? noop),
    onpointerout: box.with(() => onpointerout ?? noop),
    onpointerup: box.with(() => onpointerup ?? noop),
    onOpenAutoFocus: box.with(() => onOpenAutoFocus),
    onFocusOutside: box.with(() => onFocusOutside)
  });
  const snapPointsOffset = contentState.ctx.snapPointsOffset;
  const styleProp = snapPointsOffset && snapPointsOffset.length > 0 ? {
    "--snap-point-height": `${snapPointsOffset[contentState.ctx.activeSnapPointIndex ?? 0]}px`
  } : {};
  const mergedProps = mergeProps(restProps, contentState.props, { style: styleProp });
  $$payload.out += `<!---->`;
  Dialog_content($$payload, spread_props([
    mergedProps,
    {
      children: ($$payload2) => {
        children?.($$payload2);
        $$payload2.out += `<!----> `;
        Mounted($$payload2, { onMounted: contentState.setMounted });
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
function useDrawerOverlay(opts) {
  const ctx = DrawerContext.get();
  let mounted = false;
  useRefById({
    id: opts.id,
    ref: opts.ref,
    deps: () => mounted,
    onRefChange: (node) => {
      if (!mounted) {
        ctx.setOverlayNode(null);
      } else {
        ctx.setOverlayNode(node);
      }
    }
  });
  const hasSnapPoints = ctx.snapPoints.current && ctx.snapPoints.current.length > 0;
  const shouldRender = ctx.modal.current;
  const props = {
    id: opts.id.current,
    onmouseup: ctx.onRelease,
    "data-vaul-overlay": "",
    "data-vaul-snap-points": ctx.open.current && hasSnapPoints ? "true" : "false",
    "data-vaul-snap-points-overlay": ctx.open.current && ctx.shouldFade ? "true" : "false",
    "data-vaul-animate": ctx.shouldAnimate ? "true" : "false"
  };
  return {
    get props() {
      return props;
    },
    get shouldRender() {
      return shouldRender;
    },
    setMounted: (value) => {
      mounted = value;
    }
  };
}
function Drawer_overlay$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const overlayState = useDrawerOverlay({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, overlayState.props);
  if (overlayState.shouldRender) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    Dialog_overlay($$payload, spread_props([
      mergedProps,
      {
        children: ($$payload2) => {
          Mounted($$payload2, { onMounted: overlayState.setMounted });
          $$payload2.out += `<!----> `;
          children?.($$payload2);
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Drawer_portal($$payload, $$props) {
  push();
  const ctx = DrawerContext.get();
  let {
    to = ctx.container.current ?? void 0,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<!---->`;
  Portal($$payload, spread_props([{ to }, restProps]));
  $$payload.out += `<!---->`;
  pop();
}
const Title = Dialog_title;
const Description = Dialog_description;
function Drawer($$payload, $$props) {
  push();
  let {
    shouldScaleBackground = true,
    open = false,
    activeSnapPoint = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Drawer$1($$payload2, spread_props([
      { shouldScaleBackground },
      restProps,
      {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        get activeSnapPoint() {
          return activeSnapPoint;
        },
        set activeSnapPoint($$value) {
          activeSnapPoint = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { open, activeSnapPoint });
  pop();
}
function Drawer_overlay($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Drawer_overlay$1($$payload2, spread_props([
      {
        class: cn("fixed inset-0 z-50 bg-black/80", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Drawer_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    portalProps,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Drawer_portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          Drawer_overlay($$payload3, {});
          $$payload3.out += `<!----> <!---->`;
          Drawer_content$1($$payload3, spread_props([
            {
              class: cn("bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border", className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              },
              children: ($$payload4) => {
                $$payload4.out += `<div class="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full"></div> `;
                children?.($$payload4);
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Drawer_description($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Description($$payload2, spread_props([
      {
        class: cn("text-muted-foreground text-sm", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Drawer_header($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes(
    {
      class: clsx(cn("grid gap-1.5 p-4 text-center sm:text-left", className)),
      ...restProps
    }
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Drawer_title($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Title($$payload2, spread_props([
      {
        class: cn("text-lg font-semibold leading-none tracking-tight", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function KeyboardShortcutsHelp($$payload, $$props) {
  push();
  let shortcutGroups;
  let isOpen = false;
  function formatKey(key) {
    return key.replace("ctrl+", "Ctrl+").replace("cmd+", "Cmd+").replace("shift+", "Shift+").replace("alt+", "Alt+").replace(" ", "+");
  }
  function handleOpenChange(open) {
    isOpen = open;
  }
  shortcutGroups = keyboardShortcuts.getShortcutGroups();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Drawer($$payload2, {
      onOpenChange: handleOpenChange,
      get open() {
        return isOpen;
      },
      set open($$value) {
        isOpen = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        Drawer_content($$payload3, {
          class: "max-w-full mx-4 md:mx-8 lg:mx-16 max-h-[85vh]",
          children: ($$payload4) => {
            const each_array = ensure_array_like(shortcutGroups);
            Drawer_header($$payload4, {
              class: "text-center",
              children: ($$payload5) => {
                Drawer_title($$payload5, {
                  class: "flex items-center justify-center gap-2",
                  children: ($$payload6) => {
                    Keyboard($$payload6, { class: "w-5 h-5" });
                    $$payload6.out += `<!----> Keyboard Shortcuts`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> `;
                Drawer_description($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->Navigate the application faster with these keyboard shortcuts`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="px-6 pb-6 space-y-6 overflow-y-auto"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`;
            for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
              let group = each_array[$$index_2];
              const each_array_1 = ensure_array_like(group.shortcuts);
              $$payload4.out += `<div class="space-y-3"><h3 class="text-lg font-semibold text-foreground border-b border-border pb-2">${escape_html(group.title)}</h3> <div class="space-y-2"><!--[-->`;
              for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
                let shortcut = each_array_1[$$index_1];
                const each_array_2 = ensure_array_like(formatKey(shortcut.key).split("+"));
                $$payload4.out += `<div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div class="flex flex-col gap-1 flex-1 min-w-0"><span class="text-sm text-muted-foreground">${escape_html(shortcut.description)}</span> `;
                if (shortcut.context && shortcut.context !== "global") {
                  $$payload4.out += "<!--[-->";
                  $$payload4.out += `<span class="text-xs text-muted-foreground/70 italic">Available on ${escape_html(shortcut.context === "results" ? "search results pages" : "table navigation")}</span>`;
                } else {
                  $$payload4.out += "<!--[!-->";
                }
                $$payload4.out += `<!--]--></div> <div class="flex items-center gap-1 flex-shrink-0 ml-2"><!--[-->`;
                for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                  let keyPart = each_array_2[$$index];
                  Badge($$payload4, {
                    variant: "outline",
                    class: "text-xs font-mono px-2 py-1 bg-background",
                    children: ($$payload5) => {
                      $$payload5.out += `<!---->${escape_html(keyPart)}`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!----> `;
                  if (formatKey(shortcut.key).split("+").indexOf(keyPart) < formatKey(shortcut.key).split("+").length - 1) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `<span class="text-xs text-muted-foreground">+</span>`;
                  } else {
                    $$payload4.out += "<!--[!-->";
                  }
                  $$payload4.out += `<!--]-->`;
                }
                $$payload4.out += `<!--]--></div></div>`;
              }
              $$payload4.out += `<!--]--></div></div>`;
            }
            $$payload4.out += `<!--]--></div> <div class="text-center pt-4 border-t"><p class="text-xs text-muted-foreground">Press `;
            Badge($$payload4, {
              variant: "outline",
              class: "text-xs font-mono px-2 py-1 bg-background",
              children: ($$payload5) => {
                $$payload5.out += `<!---->?`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> to open this help • Press `;
            Badge($$payload4, {
              variant: "outline",
              class: "text-xs font-mono px-2 py-1 bg-background",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Esc`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> or click outside to close</p></div></div>`;
          },
          $$slots: { default: true }
        });
      },
      $$slots: { default: true }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let error = null;
  onDestroy(() => {
    keyboardShortcuts.destroy();
  });
  Provider($$payload, {
    children: ($$payload2) => {
      ErrorBoundary($$payload2, {
        error,
        reset: () => error = null,
        children: ($$payload3) => {
          $$payload3.out += `<div class="min-h-screen bg-card"><div class="max-w-5xl mx-auto bg-background text-foreground min-h-screen shadow-2xl">`;
          Navbar($$payload3);
          $$payload3.out += `<!----> <main><!---->`;
          slot($$payload3, $$props, "default", {});
          $$payload3.out += `<!----></main></div></div> `;
          KeyboardShortcutsHelp($$payload3);
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    }
  });
  pop();
}
export {
  _layout as default
};
