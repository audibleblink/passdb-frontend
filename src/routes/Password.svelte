<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'

	async function fetchByPassword(password) {
		const res = await fetch(`http://localhost:4567/passwords/${password}`)
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
	<ResultHeader tableName={params.password} />
	{#await fetchByPassword(params.password)}
		<p>...waiting</p>
	{:then results}
		<!-- {@debug results} -->
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
