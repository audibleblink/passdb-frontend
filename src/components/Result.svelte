<script>
	export let result
	import { location, link } from "svelte-spa-router"
</script>

<style>
.clip {
	margin-bottom: 0px;
}

.row .clip-left {
	margin-left: 0px;
}

</style>

<tr>
	<td class="valign-wrapper row clip">

		{ #if ! $location.match("/email/")}
			<a class="clip-left" href="/email/{result.username}@{result.domain}" use:link>
				<i class="col s1 material-icons">info</i>
			</a>
		{:else}
			<a class="clip-left" href="/email/{result.username}@{result.domain}" use:link>
			</a>
		{ /if }

		<a class ="col s10 clip-left" href="/username/{result.username}" use:link> {result.username} </a>
	</td>
	<td>
		<a href="/domain/{result.domain}" use:link> {result.domain} </a>
	</td>
	<td>
		<a href="/password/{result.password}" use:link> {result.password} </a>
	</td>
</tr>
