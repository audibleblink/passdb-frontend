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
	params.page = parseInt(params.page)
	params.per_page = parseInt(params.per_page)

	$: page = parseInt(params.page) || 1
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
