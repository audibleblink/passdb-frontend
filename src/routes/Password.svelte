<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'
	import Spinner from '../components/Spinner.svelte'
	import apiServer from '../host.js'

	async function fetchByPassword(password) {
		const res = await fetch(`${apiServer}/passwords/${password}`)
		const text = await res.json()
		// debugger
		if (res.ok) {
			return text
		} else {
			return text
		}
	}
</script>

<div class="container">
	<ResultHeader tableName={params.password} />
	{#await fetchByPassword(params.password)}
		<Spinner />
	{:then results}
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
