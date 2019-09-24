<script>
	export let params
	import { link, location } from "svelte-spa-router"

	let strParams = `per_page=${params.per_page}`
</script>

<div class="row">
	<div class="center-align">
		<ul class="pagination">
			{#if params.page === 1 || params.page == undefined}
			<li class="disabled">
				<a><i class="material-icons">chevron_left</i></a>
			</li>
			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={params.page - 1}&amp;{strParams}" >
					<i class="material-icons">chevron_left</i>
				</a>
			</li>
			{/if}

			<li class="active">
				<a href="#!"> {params.page} </a>
			</li>

			{#if params.page == undefined}
			<li class="disabled">
				<a><i class="material-icons">chevron_right </i></a>
			</li>
			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={params.page + 1}&amp;{strParams}"
		><i class="material-icons">chevron_right </i></a>
			</li>
			{/if}
		</ul>
	</div>

	<div class="btn-group center-align" aria-label="Per-Page Selecter">
		<a class="btn btn-small">20</a>
		<a class="btn btn-small">50</a>
		<a class="btn btn-small">100</a>
	</div>

</div>
