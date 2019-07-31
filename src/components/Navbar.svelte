<script>
	// import Router from 'svelte-spa-router'
	import {link, push, pop} from 'svelte-spa-router'

	function handleSearch(e) {
		    if (e.keyCode == 13) {
				let type, rest
				let query = e.target.value

				if (!query) {
						push(`/rtfm`)
						console.log('No Query')
					return
				}

				[type] = query.split(':')
				rest = query.slice(2)

				switch (type) {
					case 'u':
						console.log('Username', rest)
						push(`/username/${rest}`)
						break;
					case 'p':
						console.log('Password', rest)
						push(`/password/${rest}`)
						break;
					case 'd':
						console.log('Domain', rest)
						push(`/domain/${rest}`)
						break;
					default:
						push(`/rtfm`)
						console.log('Not Found')
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
			<a href="/" use:link>
				<span class="brand-logo">PassDB Search</span>
			</a>
			<ul id="nav-mobile" class="right hide-on-med-and-down">
				<li>
					<input placeholder="Search" type="text" class="white-text" on:keydown={handleSearch}/>
				</li>
			</ul>
		</div>
	</div>
</nav>

