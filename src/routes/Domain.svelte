<script>
  export let params = {};

  import { querystring } from "svelte-spa-router";
  import Fetcher from "../components/Fetcher.svelte";

  $: endpoint = `/domains/${params.domain}?${$querystring}`;
</script>

<div class="container">
  <Fetcher {endpoint} />
</div>
