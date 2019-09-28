<script>
	export let params
	export let resultSize
	import { link, location } from "svelte-spa-router"

	let strParams = (n) => `per_page=${n || params.per_page}`
	let pageParams = (n) => `page=${n || params.page}`
	let isLastPage = resultSize < params.per_page
</script>

<style>
.btn-group {
	padding: 14px;
}
</style>

<div class="row">
	<div class="col s3 offset-s5">
		<ul class="pagination">

			{#if params.page === 1 || params.page == undefined}
			<li class="disabled">
				<a href="null" onclick="return false"><i class="material-icons">chevron_left </i></a>
			</li>

			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={params.page - 1}&amp;{strParams()}" >
					<i class="material-icons">chevron_left</i>
				</a>
			</li>
			{/if}

			<li class="active">
				<a href="null" onclick="return false"> {params.page} </a>
			</li>

			{#if isLastPage || params.page === undefined}
			<li class="disabled">
				<a href="null" onclick="return false"><i class="material-icons">chevron_right </i></a>
			</li>
			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={params.page + 1}&amp;{strParams()}">
					<i class="material-icons">chevron_right </i>
				</a>
			</li>
			{/if}
		</ul>
	</div>

	<div class="btn-group col s4 offset-12 right-align" aria-label="Per-Page Selecter">
		<a use:link class="btn btn-small" href="{$location}?{pageParams()}&amp;{strParams(20)}">20</a>
		<a use:link class="btn btn-small" href="{$location}?{pageParams()}&amp;{strParams(50)}">50</a>
		<a use:link class="btn btn-small" href="{$location}?{pageParams()}&amp;{strParams(100)}">100</a>
	</div>

</div>
