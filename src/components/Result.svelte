<script>
	export let result
	import {link} from 'svelte-spa-router'
</script>

<tr>
	<td> <a href="/username/{result.username}" use:link> {result.username} </a></td>
	<td> <a href="/domain/{result.domain}"     use:link> {result.domain} </a></td>
	<td> <a href="/password/{result.password}" use:link> {result.password} </a></td>
</tr>

