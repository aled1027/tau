<script lang="ts">
  import { Agent, type AgentEvent } from "pi-browser";
  import { onMount } from "svelte";

  let agent: Agent | null = $state(null);
  let response = $state("");

  async function getResponse(
    response: AsyncGenerator<AgentEvent>,
  ): Promise<string> {
    let fullText = "";
    for await (const event of response) {
      switch (event.type) {
        case "text_delta":
          fullText += event.delta;
          break;
        case "tool_call_start":
          break;
        case "tool_call_end":
          break;
        case "error":
          fullText += `\n\n**Error:** ${event.error}`;
          break;
      }
    }
    return fullText;
  }

  async function initializeAgent(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const apiKey = formData.get("openrouterApiKey") as string;

    agent = await Agent.create({
      apiKey: apiKey,
      extensions: [],
      skills: [],
      promptTemplates: [],
      systemPrompt: "respond like a cat, but only in 10 words or less",
    });
    console.log(agent);
    const r = await agent.prompt("Hello, how are you?");
    response = await getResponse(r);
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>

<form onsubmit={initializeAgent}>
  <input type="text" name="openrouterApiKey" />
  <button type="submit">Initialize Agent</button>
</form>

<pre>
  {response}
</pre>

<pre>
  {JSON.stringify(agent, null, 2)}
</pre>
