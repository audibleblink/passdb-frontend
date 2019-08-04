<script>
	export let params

	import Home from "./Home.svelte"
</script>

<style>
	#error {
		font-size: 1.1em;
		padding: -10px;
		height: 1%;
	}
</style>

<div class="container">
	<div class="row">
		<div class="card-panel red lighten-2 center-align" id="error">
			Unable to find: {params.wild}
		</div>
	</div>
</div>

<Home />
