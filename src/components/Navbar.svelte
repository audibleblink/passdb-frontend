<script>
	import { link, push, pop } from "svelte-spa-router"

	function handleSearch(e) {
		if (e.keyCode == 13) {
			let type, rest
			let query = e.target.value

			if (!query) {
				push(`/rtfm`)
				return
			}

			;[type] = query.split(":")
			rest = query.slice(2)

			switch (type) {
				case "u":
					push(`/username/${rest}`)
					break
				case "p":
					push(`/password/${rest}`)
					break
				case "d":
					push(`/domain/${rest}`)
					break
				case "e":
					push(`/email/${rest}`)
					break
				default:
					push(`/rtfm`)
			}
		}
	}
</script>

<style>
	.input {
		color: white;
	}
</style>

<nav class="blue-grey darken-1 z-depth-3">
	<div class="container">
		<div class="nav-wrapper">
			<a class="col s3 left" href="/" use:link>
				<span class="brand-logo">PassDB Search</span>
			</a>
			<ul id="nav-mobile" class="right col s6">
				<li>
					<input
						placeholder="Search"
						type="text"
						class="white-text"
						on:keydown="{handleSearch}"
					/>
				</li>
			</ul>
		</div>
	</div>
</nav>
