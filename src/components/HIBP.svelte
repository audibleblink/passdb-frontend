<script>
	export let email

	import Spinner from "./Spinner.svelte"
	import apiServer from "../host.js"

	async function apiGet(q) {
		const res = await fetch(`${apiServer}${q}`)
		const text = await res.json()
		return text
	}
</script>

<style>
.header {
	font-weight: 800;
	padding: 0.5em;
}

.desc {
	font-size: 1.2em
}

img {
	width: 100%;
	height: 100%;
	overflow: hidden;
	object-fit: cover;
	-webkit-filter: drop-shadow(5px 5px 5px #ccc);
	filter: drop-shadow(5px 5px 5px #ccc);
}

li .row {
	margin: 0px;
}
</style>

{#await apiGet(`/breaches/${email}`)}
<Spinner />

{:then results}
<div class="row">
	<div class="col s12 center-align">
		<h4 class>breach data</h4>
	</div>
</div>



<ul class="collapsible">
	<li>
		<div class="row center-align header">
			<div class="col s3 left-align">Name</div>
			<div class="col s3">Domain</div>
			<div class="col s3">Date</div>
			<div class="col s3">Count</div>
		</div>
	</li>

	<hr/>

	{#each results as breach}
	<li>
		<div class="collapsible-header row center-align">
			<i class="col s1 material-icons">info</i>
			<div class="col s3 left-align"> {breach.Title} </div>
			<div class="col s3"> {breach.Domain} </div>
			<div class="col s3"> {breach.Date} </div>
			<div class="col s3"> {Number(breach.Count).toLocaleString() } </div>
		</div>

		<div class="collapsible-body row">
			<div class="col s3" >
				<img alt={breach.Title} src={breach.LogoPath} />
			</div>
				<div class="col s9 desc"> {@html breach.Description} </div>
		</div>
	</li>
	{/each}
</ul>


<script>
	M.AutoInit()
</script>

{:catch error}
<p style="color: red">{error.message}</p>
{/await}
