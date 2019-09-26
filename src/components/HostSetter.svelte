<script>
	import { writable } from "svelte/store";
	const host = writable(localStorage.getItem("host") || "http://127.0.0.1:4567")
	host.subscribe(val => localStorage.setItem("host", val));
</script>

<style>
.host-input {
	margin: 0 1em 0 1em;
}

.z-bottom {
	z-index: -99;
}
</style>

<div class="input-field host-input">
	<label class="z-bottom" for="Host">Host</label>
	<input bind:value={$host} placeholder="API Host" type="text" class="validate">
</div>


