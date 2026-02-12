<script lang="ts">
  import { Agent } from "pi-browser";
  import { onMount } from "svelte";

  let agent: Agent | null = $state(null);
  let response = $state("");

  function saveApiKey(apiKey: string) {
    localStorage.setItem("openrouterApiKey", apiKey);
  }

  function getApiKey() {
    return localStorage.getItem("openrouterApiKey") ?? "";
  }

  function submitInitializeAgent(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const apiKey = formData.get("openrouterApiKey") as string;
    initializeAgent(apiKey);
  }

  async function initializeAgent(apiKey: string) {
    agent = await Agent.create({
      apiKey: apiKey,
      extensions: [],
      skills: [],
      promptTemplates: [],
      systemPrompt: "respond like a cat, but only in 10 words or less",
    });
    console.log(agent);
    const result = await agent.send("Hello, how are you?");
    response = result.text;
  }

  onMount(() => {
    const apiKey = getApiKey();
    if (apiKey) {
      initializeAgent(apiKey);
    }
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>

{#if !agent}
  <form onsubmit={submitInitializeAgent}>
    <input type="text" name="openrouterApiKey" />
    <button type="submit">Initialize Agent</button>
  </form>
{/if}

<pre>
  {response}
</pre>

<pre>
  {JSON.stringify(agent, null, 2)}
</pre>
