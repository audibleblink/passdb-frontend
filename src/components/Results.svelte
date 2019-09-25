<script>
	export let results

	import { querystring } from "svelte-spa-router"
	import Result from "./Result.svelte"
	import Pager from "./Pager.svelte"

	let qParams = $querystring.split("&")
	let params = qParams.reduce((memo, i) => {
		let [key, val] = i.split("=")
		memo[key] = val
		return memo
	}, {})

	if (params.page) {
		params.page = parseInt(params.page)
	} else {
		params.page = 1
	}

	if (params.per_page) {
		params.per_page = parseInt(params.per_page)
	} else {
		params.per_page = 50
	}

	$: page = parseInt(params.page)
</script>

<style></style>

<Pager {params} />
<table>
	<thead>
		<tr>
			<th>Usernames</th>
			<th>Domains</th>
			<th>Passwords</th>
		</tr>
	</thead>
	<tbody>
		{#each results as result}
		<Result {result} />
		{/each}
	</tbody>
</table>
