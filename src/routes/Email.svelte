<script>
	export let params = {}

	import Results from '../components/Results.svelte'
	import ResultHeader from '../components/ResultHeader.svelte'
	import Spinner from '../components/Spinner.svelte'
	import apiServer from '../host.js'

	async function fetchByEmail(email) {
		const res = await fetch(`${apiServer}/emails/${email}`)
		const text = await res.json()
		if (res.ok) {
			return text
		} else {
			return text
		}
	}
</script>

<div class="container">
	<ResultHeader tableName={params.email} />
	{#await fetchByEmail(params.email)}
		<Spinner />
	{:then results}
		<Results {results} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

