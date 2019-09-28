<script>
	export let type
</script>

{#if type === "circle"}
	<div class="center-align">
		<div class="center-align preloader-wrapper big active">
			<div class="spinner-layer spinner-blue-only">
				<div class="circle-clipper left">
					<div class="circle"></div>
				</div><div class="gap-patch">
					<div class="circle"></div>
				</div><div class="circle-clipper right">
					<div class="circle"></div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="progress">
		<div class="indeterminate"></div>
	</div>
{/if}
