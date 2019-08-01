<script>
	export let page
	import {link, push, pop} from 'svelte-spa-router'
	import {location} from 'svelte-spa-router'

</script>



<div class="row">
<div class="center-align">
<ul class="pagination">

	{#if page === 1 || page == undefined}
	<li class="disabled">
		<a ><i class="material-icons">&lt;</i></a>
	</li>
	{:else}
	<li class="waves-effect">
		<a use:link href="{$location}?page={page - 1}"><i class="material-icons">&lt;</i></a>
	</li>
	{/if}

	<li class="active">
		<a href="#!"> Page {page} </a>
	</li>


	{#if page == undefined}
	<li class="disabled">
		<a ><i class="material-icons">&gt; </i></a>
	</li>
	{:else}
	<li class="waves-effect">
		<a use:link href="{$location}?page={page + 1}"><i class="material-icons">&gt; </i></a>
	</li>
	{/if}
</ul>

</div>
</div>
