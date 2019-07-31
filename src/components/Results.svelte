<script>
	export let results
	import Result from './Result.svelte'
</script>

<style>
</style>


<table>
	<thead>
		<tr>  
			<th>Usernames</th>
			<th>Domains</th>
			<th>Passwords</th>
		</tr>
	</thead>
	<tbody>

		{#each results as result}
		<Result {result}/>
		{/each}

	</tbody>
</table>
