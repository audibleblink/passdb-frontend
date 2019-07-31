<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'
	import Spinner from '../components/Spinner.svelte'

	async function fetchByDomain(domain) {
		const res = await fetch(`http://localhost:4567/domains/${domain}`)
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
	<ResultHeader tableName={params.domain} />
	{#await fetchByDomain(params.domain)}
		<Spinner />
	{:then results}
		<!-- {@debug results} -->
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

