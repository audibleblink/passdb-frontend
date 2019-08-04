<script>
	export let page
	import { link, location } from "svelte-spa-router"
</script>

<div class="row">
	<div class="center-align">
		<ul class="pagination">
			{#if page === 1 || page == undefined}
			<li class="disabled">
				<a><i class="material-icons">chevron_left</i></a>
			</li>
			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={page - 1}"
					><i class="material-icons">chevron_left</i></a
				>
			</li>
			{/if}

			<li class="active">
				<a href="#!"> {page} </a>
			</li>

			{#if page == undefined}
			<li class="disabled">
				<a><i class="material-icons">chevron_right </i></a>
			</li>
			{:else}
			<li class="waves-effect">
				<a use:link href="{$location}?page={page + 1}"
					><i class="material-icons">chevron_right </i></a
				>
			</li>
			{/if}
		</ul>
	</div>
</div>
