<script>
	export let results

	import { querystring } from "svelte-spa-router"
	import Result from "./Result.svelte"
	import Pager from "./Pager.svelte"

	$: page = parseInt($querystring.split("=")[1]) || 1
</script>

<style></style>

<Pager {page} />
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
