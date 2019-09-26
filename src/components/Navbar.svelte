<script>
	import { link, push, pop } from "svelte-spa-router"
	import HostSetter from "./HostSetter.svelte"

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

	document.addEventListener('DOMContentLoaded', function() {
		let options = {
			"alignment": "right", 
			"constrainWidth": false,
			"coverTrigger": false,
			"hove": true,
			"closeOnClick": false
		}
		var elems = document.querySelectorAll('.dropdown-trigger');
		var instances = M.Dropdown.init(elems, options);
	});

</script>

<style>
	.input {
		color: white;
	}

	a i.settings {
		margin-top: -0.55em;
	}
</style>

<nav class="blue-grey darken-1 z-depth-3">

	<div class="container">

		<div class="row nav-wrapper">
			<a class="col s3" href="/" use:link>
				<div class="brand-logo">PassDB Search</div>
			</a>

			<ul id="nav-mobile" class="col s3 offset-s8">
				<li>
					<input
						placeholder="Search"
						type="text"
						class="white-text"
						on:keydown="{handleSearch}"
					/>
				</li>
			</ul>

			<span class="col s1">
				<!-- Dropdown Trigger -->
				<a class="dropdown-trigger btn" href="#" data-target="api-host">
					<i class="material-icons settings">settings</i>
				</a>

				<!-- Dropdown Structure -->
				<div id="api-host" class="dropdown-content">
					<HostSetter/>
				</div>
			</span>
		</div>
	</div>
</nav>
