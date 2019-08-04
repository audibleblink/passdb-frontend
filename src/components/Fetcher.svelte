<script>
  export let endpoint;

  import Results from "./Results.svelte";
  import ResultHeader from "./ResultHeader.svelte";
  import Spinner from "./Spinner.svelte";
  import apiServer from "../host.js";
  let query = endpoint.split("/")[2];

  async function apiGet() {
    const res = await fetch(`${apiServer}${endpoint}`);
    const text = await res.json();
    return text;
  }
</script>

<ResultHeader {query} />
{#await apiGet()}
<Spinner />
{:then results}
<Results {results} />
{:catch error}
<p style="color: red">{error.message}</p>
{/await}
