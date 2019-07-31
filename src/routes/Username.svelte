<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'

	async function fetchByUsername(name) {
		const res = await fetch(`http://localhost:4567/usernames/${name}`)
		const text = await res.json()
		// debugger
		if (res.ok) {
			return text
		} else {
			return text
		}
	}

</script>


<style>
</style>


<div class="container">
	<ResultHeader tableName={params.name} />
	{#await fetchByUsername(params.name)}
		<p>...waiting</p>
	{:then results}
		<!-- {@debug results} -->
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

