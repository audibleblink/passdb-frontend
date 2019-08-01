<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'
	import Spinner from '../components/Spinner.svelte'
	import apiServer from '../host.js'

	async function fetchByUsername(name) {
		const res = await fetch(`${apiServer}/usernames/${name}`)
		const text = await res.json()
		if (res.ok) {
			return text
		} else {
			return text
		}
	}
</script>

<div class="container">
	<ResultHeader tableName={params.name} />
	{#await fetchByUsername(params.name)}
		<Spinner />
	{:then results}
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

