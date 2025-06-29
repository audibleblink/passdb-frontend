export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DPfKXS4w.js",app:"_app/immutable/entry/app.BSYlrH4D.js",imports:["_app/immutable/entry/start.DPfKXS4w.js","_app/immutable/chunks/l39mzT4G.js","_app/immutable/chunks/CcQSGzXg.js","_app/immutable/entry/app.BSYlrH4D.js","_app/immutable/chunks/CcQSGzXg.js","_app/immutable/chunks/CkeX2SFv.js","_app/immutable/chunks/CBa6YeNv.js","_app/immutable/chunks/CSbn2Ldu.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/domain/[domain]",
				pattern: /^\/domain\/([^/]+?)\/?$/,
				params: [{"name":"domain","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/email/[email]",
				pattern: /^\/email\/([^/]+?)\/?$/,
				params: [{"name":"email","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/password/[password]",
				pattern: /^\/password\/([^/]+?)\/?$/,
				params: [{"name":"password","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/username/[name]",
				pattern: /^\/username\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
