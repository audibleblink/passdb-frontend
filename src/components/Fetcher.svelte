<script>
	export let endpoint

	import { location } from "svelte-spa-router"

	import Results from "./Results.svelte"
	import Spinner from "./Spinner.svelte"
	import apiServer from "../host.js"

	async function apiGet(q) {
		const res = await fetch(`${apiServer}${q}`)
		const text = await res.json()
		return text
	}
</script>

<div class="row">
	<div class="col s12 center-align">
		<h4 class>results for {$location.split("/")[2]}</h4>
	</div>
</div>

{#await apiGet(endpoint)}
<Spinner />
{:then results}
<Results {results} />
{:catch error}
<p style="color: red">{error.message}</p>
{/await}
