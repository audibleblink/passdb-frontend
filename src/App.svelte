<script>
	import Router from "svelte-spa-router"
	import Navbar from "./components/Navbar.svelte"
	import routes from "./routes.js"
</script>

<body>
	<Navbar />
	<Router {routes} />
</body>
