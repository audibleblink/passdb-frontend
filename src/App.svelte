<script>
	export let name;
	import "../node_modules/materialize-css/dist/css/materialize.min.css";
	import "../node_modules/materialize-css/dist/js/materialize.min.js";

	import Router from 'svelte-spa-router'
	import Navbar from './components/Navbar.svelte'
	import routes from './routes.js'
</script>

<style>
</style>

<body>
<Navbar />
<Router {routes}/>
</body>

