<script>
	export let params = {}

	import Fetcher from '../components/Fetcher.svelte'
	let endpoint = `/passwords/${params.password}`

</script>

<div class="container">
	<Fetcher {endpoint} />
</div>
