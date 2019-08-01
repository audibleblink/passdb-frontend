<script>
	export let params = {}

	import Fetcher from '../components/Fetcher.svelte'
	let endpoint = `/usernames/${params.name}`

</script>

<div class="container">
	<Fetcher {endpoint} />
</div>
