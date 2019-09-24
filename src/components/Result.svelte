<script>
	export let result
	import { link } from "svelte-spa-router"
</script>

<style>
.clip {
	margin-bottom: 0px;
}
</style>

<tr>
	<td class="valign-wrapper row clip">
		<a class ="col s10" href="/username/{result.username}" use:link> {result.username} </a>
		<a class="" href="/email/{result.username}@{result.domain}" use:link>
			<i class="col s1 material-icons">email</i>
		</a>
	</td>
	<td>
		<a href="/domain/{result.domain}" use:link> {result.domain} </a>
	</td>
	<td>
		<a href="/password/{result.password}" use:link> {result.password} </a>
	</td>
</tr>
