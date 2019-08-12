<script>
	export let email

	import Spinner from "./Spinner.svelte"
	import apiServer from "../host.js"

	async function apiGet(q) {
		const res = await fetch(`${apiServer}${q}`)
		const text = await res.json()
		return text
	}
</script>

{#await apiGet(`/breaches/${email}`)}
<Spinner />

{:then results}
<div class="row">
	<div class="col s12 center-align">
		<h4 class>breach data</h4>
	</div>
</div>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Domain</th>
			<th>Date</th>
			<th>Count</th>
		</tr>
	</thead>

	<tbody>
		{#each results as breach}
		<tr>
			<td> {breach.Title} </td>
			<td> {breach.Domain} </td>
			<td> {breach.Date} </td>
			<td> {Number(breach.Count).toLocaleString() } </td>
		</tr>
		{/each}
	</tbody>
</table>

{:catch error}
<p style="color: red">{error.message}</p>
{/await}
