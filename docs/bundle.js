
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(component, store, callback) {
        const unsub = store.subscribe(callback);
        component.$$.on_destroy.push(unsub.unsubscribe
            ? () => unsub.unsubscribe()
            : unsub);
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_style(node, key, value) {
        node.style.setProperty(key, value);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = key && { [key]: value };
            const child_ctx = assign(assign({}, info.ctx), info.resolved);
            const block = type && (info.current = type)(child_ctx);
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                flush();
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
        }
        if (is_promise(promise)) {
            promise.then(value => {
                update(info.then, 1, info.value, value);
            }, error => {
                update(info.catch, 2, info.error, error);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = { [info.value]: promise };
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    /**
     * Derived value store by synchronizing one or more readable stores and
     * applying an aggregation function over its input values.
     * @param {Stores} stores input stores
     * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
     * @param {*=}initial_value when used asynchronously
     */
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.6.9 */
    const { Error: Error_1, Object: Object_1 } = globals;

    function create_fragment(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.component;

    	function switch_props(ctx) {
    		return {
    			props: { params: ctx.componentParams },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	return {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.componentParams) switch_instance_changes.params = ctx.componentParams;

    			if (switch_value !== (switch_value = ctx.component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    const hashPosition = window.location.href.indexOf('#/');
    let location = (hashPosition > -1) ? window.location.href.substr(hashPosition + 1) : '/';

    // Check if there's a querystring
    const qsPosition = location.indexOf('?');
    let querystring = '';
    if (qsPosition > -1) {
        querystring = location.substr(qsPosition + 1);
        location = location.substr(0, qsPosition);
    }

    return {location, querystring}
    }

    /**
     * Readable store that returns the current full location (incl. querystring)
     */
    const loc = readable(
    getLocation(),
    // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
        const update = () => {
            set(getLocation());
        };
        window.addEventListener('hashchange', update, false);

        return function stop() {
            window.removeEventListener('hashchange', update, false);
        }
    }
    );

    /**
     * Readable store that returns the current location
     */
    const location = derived(
    loc,
    ($loc) => $loc.location
    );

    /**
     * Readable store that returns the current querystring
     */
    const querystring = derived(
    loc,
    ($loc) => $loc.querystring
    );

    /**
     * Navigates to a new page programmatically.
     *
     * @param {string} location - Path to navigate to (must start with `/`)
     */
    function push(location) {
    if (!location || location.length < 1 || location.charAt(0) != '/') {
        throw Error('Invalid parameter location')
    }

    // Execute this code when the current call stack is complete
    setTimeout(() => {
        window.location.hash = '#' + location;
    }, 0);
    }

    /**
     * Svelte Action that enables a link element (`<a>`) to use our history management.
     *
     * For example:
     *
     * ````html
     * <a href="/books" use:link>View books</a>
     * ````
     *
     * @param {HTMLElement} node - The target node (automatically set by Svelte). Must be an anchor tag (`<a>`) with a href attribute starting in `/`
     */
    function link(node) {
    // Only apply to <a> tags
    if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
        throw Error('Action "link" can only be used with <a> tags')
    }

    // Destination must start with '/'
    const href = node.getAttribute('href');
    if (!href || href.length < 1 || href.charAt(0) != '/') {
        throw Error('Invalid value for "href" attribute')
    }

    // onclick event handler
    node.addEventListener('click', (event) => {
        // Disable normal click event
        event.preventDefault();

        // Push link or link children click
        let href;
        let target = event.target;
        while ((href = target.getAttribute('href')) === null) {
            target = target.parentElement;
            if (target === null) {
                throw Error('Could not find corresponding href value')
            }
        }
        push(href);

        return false
    });
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc;

    	validate_store(loc, 'loc');
    	subscribe($$self, loc, $$value => { $loc = $$value; $$invalidate('$loc', $loc); });

    	/**
     * Dictionary of all routes, in the format `'/path': component`.
     *
     * For example:
     * ````js
     * import HomeRoute from './routes/HomeRoute.svelte'
     * import BooksRoute from './routes/BooksRoute.svelte'
     * import NotFoundRoute from './routes/NotFoundRoute.svelte'
     * routes = {
     *     '/': HomeRoute,
     *     '/books': BooksRoute,
     *     '*': NotFoundRoute
     * }
     * ````
     */
    let { routes = {} } = $$props;

    /**
     * Container for a route: path, component
     */
    class RouteItem {
        /**
         * Initializes the object and creates a regular expression from the path, using regexparam.
         *
         * @param {string} path - Path to the route (must start with '/' or '*')
         * @param {SvelteComponent} component - Svelte component for the route
         */
        constructor(path, component) {
            // Path must start with '/' or '*'
            if (!path || path.length < 1 || (path.charAt(0) != '/' && path.charAt(0) != '*')) {
                throw Error('Invalid value for "path" argument')
            }

            const {pattern, keys} = regexparam(path);

            this.path = path;
            this.component = component;

            this._pattern = pattern;
            this._keys = keys;
        }

        /**
         * Checks if `path` matches the current route.
         * If there's a match, will return the list of parameters from the URL (if any).
         * In case of no match, the method will return `null`.
         *
         * @param {string} path - Path to test
         * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
         */
        match(path) {
            const matches = this._pattern.exec(path);
            if (matches === null) {
                return null
            }

            const out = {};
            let i = 0;
            while (i < this._keys.length) {
                out[this._keys[i]] = matches[++i] || null;
            }
            return out
        }
    }

    // Set up all routes
    const routesList = Object.keys(routes).map((path) => {
        return new RouteItem(path, routes[path])
    });

    // Props for the component to render
    let component = null;
    let componentParams = {};

    	const writable_props = ['routes'];
    	Object_1.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('routes' in $$props) $$invalidate('routes', routes = $$props.routes);
    	};

    	$$self.$$.update = ($$dirty = { component: 1, $loc: 1 }) => {
    		if ($$dirty.component || $$dirty.$loc) { {
                // Find a route matching the location
                $$invalidate('component', component = null);
                let i = 0;
                while (!component && i < routesList.length) {
                    const match = routesList[i].match($loc.location);
                    if (match) {
                        $$invalidate('component', component = routesList[i].component);
                        $$invalidate('componentParams', componentParams = match);
                    }
                    i++;
                }
            } }
    	};

    	return { routes, component, componentParams };
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["routes"]);
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Navbar.svelte generated by Svelte v3.6.9 */

    const file = "src/components/Navbar.svelte";

    function create_fragment$1(ctx) {
    	var nav, div1, div0, a, span, link_action, t_1, ul, li, input, dispose;

    	return {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			span = element("span");
    			span.textContent = "PassDB Search";
    			t_1 = space();
    			ul = element("ul");
    			li = element("li");
    			input = element("input");
    			attr(span, "class", "brand-logo");
    			add_location(span, file, 46, 4, 758);
    			attr(a, "class", "col s3 left");
    			attr(a, "href", "/");
    			add_location(a, file, 45, 3, 712);
    			attr(input, "placeholder", "Search");
    			attr(input, "type", "text");
    			attr(input, "class", "white-text");
    			add_location(input, file, 50, 5, 871);
    			add_location(li, file, 49, 4, 861);
    			attr(ul, "id", "nav-mobile");
    			attr(ul, "class", "right col s6");
    			add_location(ul, file, 48, 3, 815);
    			attr(div0, "class", "nav-wrapper");
    			add_location(div0, file, 44, 2, 683);
    			attr(div1, "class", "container");
    			add_location(div1, file, 43, 1, 657);
    			attr(nav, "class", "blue-grey darken-1 z-depth-3");
    			add_location(nav, file, 42, 0, 613);
    			dispose = listen(input, "keydown", handleSearch);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, nav, anchor);
    			append(nav, div1);
    			append(div1, div0);
    			append(div0, a);
    			append(a, span);
    			link_action = link.call(null, a) || {};
    			append(div0, t_1);
    			append(div0, ul);
    			append(ul, li);
    			append(li, input);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(nav);
    			}

    			if (link_action && typeof link_action.destroy === 'function') link_action.destroy();
    			dispose();
    		}
    	};
    }

    function handleSearch(e) {
    	if (e.keyCode == 13) {
    		let type, rest;
    		let query = e.target.value;

    		if (!query) {
    			push(`/rtfm`);
    			return
    		}
    [type] = query.split(":");
    		rest = query.slice(2);

    		switch (type) {
    			case "u":
    				push(`/username/${rest}`);
    				break
    			case "p":
    				push(`/password/${rest}`);
    				break
    			case "d":
    				push(`/domain/${rest}`);
    				break
    			case "e":
    				push(`/email/${rest}`);
    				break
    			default:
    				push(`/rtfm`);
    		}
    	}
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    	}
    }

    /* src/routes/Home.svelte generated by Svelte v3.6.9 */

    const file$1 = "src/routes/Home.svelte";

    function create_fragment$2(ctx) {
    	var div2, div1, h4, t1, div0, ul, li0, t2, span0, pre0, t4, li1, t5, span1, pre1, t7, li2, t8, span2, pre2, t10, li3, t11, span3, pre3;

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "How to Search";
    			t1 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			t2 = text("Username ");
    			span0 = element("span");
    			pre0 = element("pre");
    			pre0.textContent = "u:$term";
    			t4 = space();
    			li1 = element("li");
    			t5 = text("Password ");
    			span1 = element("span");
    			pre1 = element("pre");
    			pre1.textContent = "p:$term";
    			t7 = space();
    			li2 = element("li");
    			t8 = text("Domain ");
    			span2 = element("span");
    			pre2 = element("pre");
    			pre2.textContent = "d:$term";
    			t10 = space();
    			li3 = element("li");
    			t11 = text("Email ");
    			span3 = element("span");
    			pre3 = element("pre");
    			pre3.textContent = "e:$term";
    			add_location(h4, file$1, 8, 2, 92);
    			attr(pre0, "class", "svelte-12hns1o");
    			add_location(pre0, file$1, 12, 20, 179);
    			add_location(span0, file$1, 12, 14, 173);
    			add_location(li0, file$1, 11, 4, 154);
    			attr(pre1, "class", "svelte-12hns1o");
    			add_location(pre1, file$1, 15, 20, 247);
    			add_location(span1, file$1, 15, 14, 241);
    			add_location(li1, file$1, 14, 4, 222);
    			attr(pre2, "class", "svelte-12hns1o");
    			add_location(pre2, file$1, 18, 18, 313);
    			add_location(span2, file$1, 18, 12, 307);
    			add_location(li2, file$1, 17, 4, 290);
    			attr(pre3, "class", "svelte-12hns1o");
    			add_location(pre3, file$1, 21, 17, 378);
    			add_location(span3, file$1, 21, 11, 372);
    			add_location(li3, file$1, 20, 4, 356);
    			add_location(ul, file$1, 10, 3, 145);
    			attr(div0, "class", "card-panel");
    			add_location(div0, file$1, 9, 2, 117);
    			attr(div1, "class", "row");
    			add_location(div1, file$1, 7, 1, 72);
    			attr(div2, "class", "container");
    			add_location(div2, file$1, 6, 0, 47);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, h4);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, t2);
    			append(li0, span0);
    			append(span0, pre0);
    			append(ul, t4);
    			append(ul, li1);
    			append(li1, t5);
    			append(li1, span1);
    			append(span1, pre1);
    			append(ul, t7);
    			append(ul, li2);
    			append(li2, t8);
    			append(li2, span2);
    			append(span2, pre2);
    			append(ul, t10);
    			append(ul, li3);
    			append(li3, t11);
    			append(li3, span3);
    			append(span3, pre3);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}
    		}
    	};
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$2, safe_not_equal, []);
    	}
    }

    /* src/components/Result.svelte generated by Svelte v3.6.9 */

    const file$2 = "src/components/Result.svelte";

    function create_fragment$3(ctx) {
    	var tr, td0, a0, t0_value = ctx.result.username, t0, a0_href_value, link_action, t1, td1, a1, t2_value = ctx.result.domain, t2, a1_href_value, link_action_1, t3, td2, a2, t4_value = ctx.result.password, t4, a2_href_value, link_action_2;

    	return {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a0 = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			a1 = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a2 = element("a");
    			t4 = text(t4_value);
    			attr(a0, "href", a0_href_value = "/username/" + ctx.result.username);
    			add_location(a0, file$2, 7, 2, 94);
    			add_location(td0, file$2, 6, 1, 87);
    			attr(a1, "href", a1_href_value = "/domain/" + ctx.result.domain);
    			add_location(a1, file$2, 9, 5, 177);
    			add_location(td1, file$2, 9, 1, 173);
    			attr(a2, "href", a2_href_value = "/password/" + ctx.result.password);
    			add_location(a2, file$2, 11, 2, 255);
    			add_location(td2, file$2, 10, 1, 248);
    			add_location(tr, file$2, 5, 0, 81);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, tr, anchor);
    			append(tr, td0);
    			append(td0, a0);
    			append(a0, t0);
    			link_action = link.call(null, a0) || {};
    			append(tr, t1);
    			append(tr, td1);
    			append(td1, a1);
    			append(a1, t2);
    			link_action_1 = link.call(null, a1) || {};
    			append(tr, t3);
    			append(tr, td2);
    			append(td2, a2);
    			append(a2, t4);
    			link_action_2 = link.call(null, a2) || {};
    		},

    		p: function update(changed, ctx) {
    			if ((changed.result) && t0_value !== (t0_value = ctx.result.username)) {
    				set_data(t0, t0_value);
    			}

    			if ((changed.result) && a0_href_value !== (a0_href_value = "/username/" + ctx.result.username)) {
    				attr(a0, "href", a0_href_value);
    			}

    			if ((changed.result) && t2_value !== (t2_value = ctx.result.domain)) {
    				set_data(t2, t2_value);
    			}

    			if ((changed.result) && a1_href_value !== (a1_href_value = "/domain/" + ctx.result.domain)) {
    				attr(a1, "href", a1_href_value);
    			}

    			if ((changed.result) && t4_value !== (t4_value = ctx.result.password)) {
    				set_data(t4, t4_value);
    			}

    			if ((changed.result) && a2_href_value !== (a2_href_value = "/password/" + ctx.result.password)) {
    				attr(a2, "href", a2_href_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(tr);
    			}

    			if (link_action && typeof link_action.destroy === 'function') link_action.destroy();
    			if (link_action_1 && typeof link_action_1.destroy === 'function') link_action_1.destroy();
    			if (link_action_2 && typeof link_action_2.destroy === 'function') link_action_2.destroy();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { result } = $$props;

    	const writable_props = ['result'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('result' in $$props) $$invalidate('result', result = $$props.result);
    	};

    	return { result };
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$3, safe_not_equal, ["result"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.result === undefined && !('result' in props)) {
    			console.warn("<Result> was created without expected prop 'result'");
    		}
    	}

    	get result() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Pager.svelte generated by Svelte v3.6.9 */

    const file$3 = "src/components/Pager.svelte";

    // (13:3) {:else}
    function create_else_block_1(ctx) {
    	var li, a, i, a_href_value, link_action;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			i.textContent = "chevron_left";
    			attr(i, "class", "material-icons");
    			add_location(i, file$3, 15, 6, 387);
    			attr(a, "href", a_href_value = "" + ctx.$location + "?page=" + (ctx.page - 1));
    			add_location(a, file$3, 14, 4, 334);
    			attr(li, "class", "waves-effect");
    			add_location(li, file$3, 13, 3, 304);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, i);
    			link_action = link.call(null, a) || {};
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$location || changed.page) && a_href_value !== (a_href_value = "" + ctx.$location + "?page=" + (ctx.page - 1))) {
    				attr(a, "href", a_href_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			if (link_action && typeof link_action.destroy === 'function') link_action.destroy();
    		}
    	};
    }

    // (9:3) {#if page === 1 || page == undefined}
    function create_if_block_1(ctx) {
    	var li, a, i;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			i.textContent = "chevron_left";
    			attr(i, "class", "material-icons");
    			add_location(i, file$3, 10, 7, 234);
    			add_location(a, file$3, 10, 4, 231);
    			attr(li, "class", "disabled");
    			add_location(li, file$3, 9, 3, 205);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, i);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    // (29:3) {:else}
    function create_else_block(ctx) {
    	var li, a, i, a_href_value, link_action;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			i.textContent = "chevron_right";
    			attr(i, "class", "material-icons");
    			add_location(i, file$3, 31, 6, 735);
    			attr(a, "href", a_href_value = "" + ctx.$location + "?page=" + (ctx.page + 1));
    			add_location(a, file$3, 30, 4, 682);
    			attr(li, "class", "waves-effect");
    			add_location(li, file$3, 29, 3, 652);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, i);
    			link_action = link.call(null, a) || {};
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$location || changed.page) && a_href_value !== (a_href_value = "" + ctx.$location + "?page=" + (ctx.page + 1))) {
    				attr(a, "href", a_href_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			if (link_action && typeof link_action.destroy === 'function') link_action.destroy();
    		}
    	};
    }

    // (25:3) {#if page == undefined}
    function create_if_block(ctx) {
    	var li, a, i;

    	return {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			i.textContent = "chevron_right";
    			attr(i, "class", "material-icons");
    			add_location(i, file$3, 26, 7, 580);
    			add_location(a, file$3, 26, 4, 577);
    			attr(li, "class", "disabled");
    			add_location(li, file$3, 25, 3, 551);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, i);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	var div1, div0, ul, t0, li, a, t1, t2;

    	function select_block_type(ctx) {
    		if (ctx.page === 1 || ctx.page == undefined) return create_if_block_1;
    		return create_else_block_1;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx) {
    		if (ctx.page == undefined) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type_1 = select_block_type_1(ctx);
    	var if_block1 = current_block_type_1(ctx);

    	return {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			if_block0.c();
    			t0 = space();
    			li = element("li");
    			a = element("a");
    			t1 = text(ctx.page);
    			t2 = space();
    			if_block1.c();
    			attr(a, "href", "#!");
    			add_location(a, file$3, 21, 4, 485);
    			attr(li, "class", "active");
    			add_location(li, file$3, 20, 3, 461);
    			attr(ul, "class", "pagination");
    			add_location(ul, file$3, 7, 2, 137);
    			attr(div0, "class", "center-align");
    			add_location(div0, file$3, 6, 1, 108);
    			attr(div1, "class", "row");
    			add_location(div1, file$3, 5, 0, 89);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			append(div0, ul);
    			if_block0.m(ul, null);
    			append(ul, t0);
    			append(ul, li);
    			append(li, a);
    			append(a, t1);
    			append(ul, t2);
    			if_block1.m(ul, null);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(ul, t0);
    				}
    			}

    			if (changed.page) {
    				set_data(t1, ctx.page);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(changed, ctx);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);
    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(ul, null);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			if_block0.d();
    			if_block1.d();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $location;

    	validate_store(location, 'location');
    	subscribe($$self, location, $$value => { $location = $$value; $$invalidate('$location', $location); });

    	let { page } = $$props;

    	const writable_props = ['page'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Pager> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	return { page, $location };
    }

    class Pager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$4, safe_not_equal, ["page"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.page === undefined && !('page' in props)) {
    			console.warn("<Pager> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<Pager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Pager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Results.svelte generated by Svelte v3.6.9 */

    const file$4 = "src/components/Results.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.result = list[i];
    	return child_ctx;
    }

    // (23:2) {#each results as result}
    function create_each_block(ctx) {
    	var current;

    	var result = new Result({
    		props: { result: ctx.result },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			result.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var result_changes = {};
    			if (changed.results) result_changes.result = ctx.result;
    			result.$set(result_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	var t0, table, thead, tr, th0, t2, th1, t4, th2, t6, tbody, current;

    	var pager = new Pager({
    		props: { page: ctx.page },
    		$$inline: true
    	});

    	var each_value = ctx.results;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			pager.$$.fragment.c();
    			t0 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Usernames";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "Domains";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "Passwords";
    			t6 = space();
    			tbody = element("tbody");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(th0, file$4, 16, 3, 279);
    			add_location(th1, file$4, 17, 3, 301);
    			add_location(th2, file$4, 18, 3, 321);
    			add_location(tr, file$4, 15, 2, 271);
    			add_location(thead, file$4, 14, 1, 261);
    			add_location(tbody, file$4, 21, 1, 359);
    			add_location(table, file$4, 13, 0, 252);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(pager, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, table, anchor);
    			append(table, thead);
    			append(thead, tr);
    			append(tr, th0);
    			append(tr, t2);
    			append(tr, th1);
    			append(tr, t4);
    			append(tr, th2);
    			append(table, t6);
    			append(table, tbody);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var pager_changes = {};
    			if (changed.page) pager_changes.page = ctx.page;
    			pager.$set(pager_changes);

    			if (changed.results) {
    				each_value = ctx.results;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(pager.$$.fragment, local);

    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(pager.$$.fragment, local);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(pager, detaching);

    			if (detaching) {
    				detach(t0);
    				detach(table);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $querystring;

    	validate_store(querystring, 'querystring');
    	subscribe($$self, querystring, $$value => { $querystring = $$value; $$invalidate('$querystring', $querystring); });

    	let { results } = $$props;

    	const writable_props = ['results'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Results> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('results' in $$props) $$invalidate('results', results = $$props.results);
    	};

    	let page;

    	$$self.$$.update = ($$dirty = { $querystring: 1 }) => {
    		if ($$dirty.$querystring) { $$invalidate('page', page = parseInt($querystring.split("=")[1]) || 1); }
    	};

    	return { results, page };
    }

    class Results extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$5, safe_not_equal, ["results"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.results === undefined && !('results' in props)) {
    			console.warn("<Results> was created without expected prop 'results'");
    		}
    	}

    	get results() {
    		throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set results(value) {
    		throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Spinner.svelte generated by Svelte v3.6.9 */

    const file$5 = "src/components/Spinner.svelte";

    function create_fragment$6(ctx) {
    	var div1, div0;

    	return {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr(div0, "class", "indeterminate");
    			add_location(div0, file$5, 1, 1, 24);
    			attr(div1, "class", "progress");
    			add_location(div1, file$5, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}
    		}
    	};
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, []);
    	}
    }

    const apiServer = "http://localhost:4567";

    /* src/components/Fetcher.svelte generated by Svelte v3.6.9 */

    const file$6 = "src/components/Fetcher.svelte";

    // (27:0) {:catch error}
    function create_catch_block(ctx) {
    	var p, t_value = ctx.error.message, t;

    	return {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "color", "red");
    			add_location(p, file$6, 27, 0, 543);
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    // (25:0) {:then results}
    function create_then_block(ctx) {
    	var current;

    	var results = new Results({
    		props: { results: ctx.results },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			results.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(results, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var results_changes = {};
    			if (changed.apiGet) results_changes.results = ctx.results;
    			results.$set(results_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(results.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(results.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(results, detaching);
    		}
    	};
    }

    // (23:17)  <Spinner /> {:then results}
    function create_pending_block(ctx) {
    	var current;

    	var spinner = new Spinner({ $$inline: true });

    	return {
    		c: function create() {
    			spinner.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	var div1, div0, h4, t0, t1_value = ctx.$location.split("/")[2], t1, t2, await_block_anchor, promise, current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 'results',
    		error: 'error',
    		blocks: [,,,]
    	};

    	handle_promise(promise = ctx.apiGet(), info);

    	return {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			t0 = text("results for ");
    			t1 = text(t1_value);
    			t2 = space();
    			await_block_anchor = empty();

    			info.block.c();
    			attr(h4, "class", "");
    			add_location(h4, file$6, 18, 2, 391);
    			attr(div0, "class", "col s12 center-align");
    			add_location(div0, file$6, 17, 1, 354);
    			attr(div1, "class", "row");
    			add_location(div1, file$6, 16, 0, 335);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			append(div0, h4);
    			append(h4, t0);
    			append(h4, t1);
    			insert(target, t2, anchor);
    			insert(target, await_block_anchor, anchor);

    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;

    			current = true;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((!current || changed.$location) && t1_value !== (t1_value = ctx.$location.split("/")[2])) {
    				set_data(t1, t1_value);
    			}

    			info.ctx = ctx;

    			if (promise !== (promise = ctx.apiGet()) && handle_promise(promise, info)) ; else {
    				info.block.p(changed, assign(assign({}, ctx), info.resolved));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},

    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    				detach(t2);
    				detach(await_block_anchor);
    			}

    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $location;

    	validate_store(location, 'location');
    	subscribe($$self, location, $$value => { $location = $$value; $$invalidate('$location', $location); });

    	let { endpoint } = $$props;

    	async function apiGet() {
    		const res = await fetch(`${apiServer}${endpoint}`);
    		const text = await res.json();
    		return text
    	}

    	const writable_props = ['endpoint'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Fetcher> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('endpoint' in $$props) $$invalidate('endpoint', endpoint = $$props.endpoint);
    	};

    	return { endpoint, apiGet, $location };
    }

    class Fetcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$7, safe_not_equal, ["endpoint"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.endpoint === undefined && !('endpoint' in props)) {
    			console.warn("<Fetcher> was created without expected prop 'endpoint'");
    		}
    	}

    	get endpoint() {
    		throw new Error("<Fetcher>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endpoint(value) {
    		throw new Error("<Fetcher>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Password.svelte generated by Svelte v3.6.9 */

    const file$7 = "src/routes/Password.svelte";

    function create_fragment$8(ctx) {
    	var div, current;

    	var fetcher = new Fetcher({
    		props: { endpoint: ctx.endpoint },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			fetcher.$$.fragment.c();
    			attr(div, "class", "container");
    			add_location(div, file$7, 9, 0, 210);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(fetcher, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var fetcher_changes = {};
    			if (changed.endpoint) fetcher_changes.endpoint = ctx.endpoint;
    			fetcher.$set(fetcher_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(fetcher.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(fetcher.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(fetcher);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $querystring;

    	validate_store(querystring, 'querystring');
    	subscribe($$self, querystring, $$value => { $querystring = $$value; $$invalidate('$querystring', $querystring); });

    	let { params = {} } = $$props;

    	const writable_props = ['params'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Password> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('params' in $$props) $$invalidate('params', params = $$props.params);
    	};

    	let endpoint;

    	$$self.$$.update = ($$dirty = { params: 1, $querystring: 1 }) => {
    		if ($$dirty.params || $$dirty.$querystring) { $$invalidate('endpoint', endpoint = `/passwords/${params.password}?${$querystring}`); }
    	};

    	return { params, endpoint };
    }

    class Password extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$8, safe_not_equal, ["params"]);
    	}

    	get params() {
    		throw new Error("<Password>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Password>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Username.svelte generated by Svelte v3.6.9 */

    const file$8 = "src/routes/Username.svelte";

    function create_fragment$9(ctx) {
    	var div, current;

    	var fetcher = new Fetcher({
    		props: { endpoint: ctx.endpoint },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			fetcher.$$.fragment.c();
    			attr(div, "class", "container");
    			add_location(div, file$8, 9, 0, 206);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(fetcher, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var fetcher_changes = {};
    			if (changed.endpoint) fetcher_changes.endpoint = ctx.endpoint;
    			fetcher.$set(fetcher_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(fetcher.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(fetcher.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(fetcher);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $querystring;

    	validate_store(querystring, 'querystring');
    	subscribe($$self, querystring, $$value => { $querystring = $$value; $$invalidate('$querystring', $querystring); });

    	let { params = {} } = $$props;

    	const writable_props = ['params'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Username> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('params' in $$props) $$invalidate('params', params = $$props.params);
    	};

    	let endpoint;

    	$$self.$$.update = ($$dirty = { params: 1, $querystring: 1 }) => {
    		if ($$dirty.params || $$dirty.$querystring) { $$invalidate('endpoint', endpoint = `/usernames/${params.name}?${$querystring}`); }
    	};

    	return { params, endpoint };
    }

    class Username extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$9, safe_not_equal, ["params"]);
    	}

    	get params() {
    		throw new Error("<Username>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Username>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Domain.svelte generated by Svelte v3.6.9 */

    const file$9 = "src/routes/Domain.svelte";

    function create_fragment$a(ctx) {
    	var div, current;

    	var fetcher = new Fetcher({
    		props: { endpoint: ctx.endpoint },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			fetcher.$$.fragment.c();
    			attr(div, "class", "container");
    			add_location(div, file$9, 9, 0, 206);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(fetcher, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var fetcher_changes = {};
    			if (changed.endpoint) fetcher_changes.endpoint = ctx.endpoint;
    			fetcher.$set(fetcher_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(fetcher.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(fetcher.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(fetcher);
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $querystring;

    	validate_store(querystring, 'querystring');
    	subscribe($$self, querystring, $$value => { $querystring = $$value; $$invalidate('$querystring', $querystring); });

    	let { params = {} } = $$props;

    	const writable_props = ['params'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Domain> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('params' in $$props) $$invalidate('params', params = $$props.params);
    	};

    	let endpoint;

    	$$self.$$.update = ($$dirty = { params: 1, $querystring: 1 }) => {
    		if ($$dirty.params || $$dirty.$querystring) { $$invalidate('endpoint', endpoint = `/domains/${params.domain}?${$querystring}`); }
    	};

    	return { params, endpoint };
    }

    class Domain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$a, safe_not_equal, ["params"]);
    	}

    	get params() {
    		throw new Error("<Domain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Domain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Email.svelte generated by Svelte v3.6.9 */

    const file$a = "src/routes/Email.svelte";

    function create_fragment$b(ctx) {
    	var div, current;

    	var fetcher = new Fetcher({
    		props: { endpoint: ctx.endpoint },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			fetcher.$$.fragment.c();
    			attr(div, "class", "container");
    			add_location(div, file$a, 9, 0, 204);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(fetcher, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var fetcher_changes = {};
    			if (changed.endpoint) fetcher_changes.endpoint = ctx.endpoint;
    			fetcher.$set(fetcher_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(fetcher.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(fetcher.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(fetcher);
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $querystring;

    	validate_store(querystring, 'querystring');
    	subscribe($$self, querystring, $$value => { $querystring = $$value; $$invalidate('$querystring', $querystring); });

    	let { params = {} } = $$props;

    	const writable_props = ['params'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Email> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('params' in $$props) $$invalidate('params', params = $$props.params);
    	};

    	let endpoint;

    	$$self.$$.update = ($$dirty = { params: 1, $querystring: 1 }) => {
    		if ($$dirty.params || $$dirty.$querystring) { $$invalidate('endpoint', endpoint = `/emails/${params.email}?${$querystring}`); }
    	};

    	return { params, endpoint };
    }

    class Email extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$b, safe_not_equal, ["params"]);
    	}

    	get params() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/NotFound.svelte generated by Svelte v3.6.9 */

    const file$b = "src/routes/NotFound.svelte";

    function create_fragment$c(ctx) {
    	var div2, div1, div0, t0, t1_value = ctx.params.wild, t1, t2, current;

    	var home = new Home({ $$inline: true });

    	return {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Unable to find: ");
    			t1 = text(t1_value);
    			t2 = space();
    			home.$$.fragment.c();
    			attr(div0, "class", "card-panel red lighten-2 center-align svelte-1pozbuo");
    			attr(div0, "id", "error");
    			add_location(div0, file$b, 16, 2, 202);
    			attr(div1, "class", "row");
    			add_location(div1, file$b, 15, 1, 182);
    			attr(div2, "class", "container");
    			add_location(div2, file$b, 14, 0, 157);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);
    			append(div0, t0);
    			append(div0, t1);
    			insert(target, t2, anchor);
    			mount_component(home, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.params) && t1_value !== (t1_value = ctx.params.wild)) {
    				set_data(t1, t1_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    				detach(t2);
    			}

    			destroy_component(home, detaching);
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { params } = $$props;

    	const writable_props = ['params'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('params' in $$props) $$invalidate('params', params = $$props.params);
    	};

    	return { params };
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$c, safe_not_equal, ["params"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.params === undefined && !('params' in props)) {
    			console.warn("<NotFound> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const routes = {
    	"/": Home,
    	"/password/:password": Password,
    	"/username/:name": Username,
    	"/domain/:domain": Domain,
    	"/email/:email": Email,
    	"*": NotFound,
    };

    /* src/App.svelte generated by Svelte v3.6.9 */

    const file$c = "src/App.svelte";

    function create_fragment$d(ctx) {
    	var body, t, current;

    	var navbar = new Navbar({ $$inline: true });

    	var router = new Router({
    		props: { routes: routes },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			body = element("body");
    			navbar.$$.fragment.c();
    			t = space();
    			router.$$.fragment.c();
    			add_location(body, file$c, 6, 0, 143);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, body, anchor);
    			mount_component(navbar, body, null);
    			append(body, t);
    			mount_component(router, body, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var router_changes = {};
    			if (changed.routes) router_changes.routes = routes;
    			router.$set(router_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);

    			transition_in(router.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(body);
    			}

    			destroy_component(navbar);

    			destroy_component(router);
    		}
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$d, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
