<script>
	export let params = {}

	import Fetcher from '../components/Fetcher.svelte'
	let endpoint = `/emails/${params.email}`

</script>

<div class="container">
	<Fetcher {endpoint} />
</div>
