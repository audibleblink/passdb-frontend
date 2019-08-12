<script>
	export let params = {}

	import { querystring } from "svelte-spa-router"
	import Fetcher from "../components/Fetcher.svelte"
	import HIBP from "../components/HIBP.svelte"

	$: email = params.email
	$: endpoint = `/emails/${email}?${$querystring}`
</script>

<div class="container">
	<Fetcher {endpoint} />
	<HIBP {email} />
</div>
