# Tau: The Self-Modifying, Browser-Based Agent

The power of Claude Code, the ability to self-modify, all running in the browser? That's Tau.

Tau is a browser-based AI agent powered by [OpenRouter](https://openrouter.ai/). Tau is inpired by the [pi coding agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) and [co-do](https://co-do.xyz/).

- Website:https://aled1027.github.com/tau
- Docs:https://aled1027.github.com/tau/docs
- Demos: https://aled1027.github.com/tau/examples

> **:warning: WARNING**
>
> This tool allows execution of **arbitrary code** in your browser tab.  
> Running untrusted code may be dangerous and could harm your system.  
> **Use with caution!**

## Quick start

Install for your project:

```bash
$ npm install @alexledger/tau@latest
```

```typescript
import { Agent } from "tau";

const openrouterApiKey = "sk-or-....";
const agent = await Agent.create({ apiKey: openrouterApiKey });

const res1 = await agent.prompt("Write hello world in Python");
console.log(res1.text);

const res2 = await agent.prompt("What time is it?");
console.log(res2.text);

// If you want streamed responses, that's also supported
// from agent.prompt.
```

See [docs/tau-core.md](docs/tau-core.md) for the full API reference.

## Examples

Browse all examples at [https://aled1027.github.io/tau/examples/](https://aled1027.github.io/tau/examples/)

| Example Name                                                                        | Path                       | Description                                                |
| ----------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| [**Chat**](https://aled1027.github.io/tau/examples/chat/)                           | examples/chat              | Minimal chat interface                                     |
| [**SvelteKit Chat**](https://aled1027.github.io/tau/examples/sveltekit-chat/)       | examples/sveltekit-chat    | Chat app built with SvelteKit                              |
| [**Do I Suck at Math**](https://aled1027.github.io/tau/examples/do-i-suck-at-math/) | examples/do-i-suck-at-math | Progressive math test that determines your math competency |
| [**Tutor**](https://aled1027.github.io/tau/examples/tutor/)                         | examples/tutor             | AI tutor with skills and prompt templates                  |

### Run the Examples Locally

```bash
# Build the library in the root of the repo
npm run build

# Then, navigate to the example and install and run
cd examples/chat
npm install
npm run dev
```

Note that the examples import the `tau` library via `file:`.

## Contributing

```bash
npm install

npm run build:watch          # rebuild library on changes

# If you want to test with an app, then do:
cd your/app/path/
npm run dev
```