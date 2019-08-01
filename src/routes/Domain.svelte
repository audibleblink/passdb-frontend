
<script>
	export let params = {}

	import Fetcher from '../components/Fetcher.svelte'
	let endpoint = `/domains/${params.domain}`

</script>

<div class="container">
	<Fetcher {endpoint} />
</div>
