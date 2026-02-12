# pi-browser

A browser-based AI coding agent powered by [OpenRouter](https://openrouter.ai/). Includes a core agent library and several example applications.

## Setup

Requires [Node.js](https://nodejs.org/) (v18+).

```bash
npm install    # installs root + all examples via workspaces
npm run build  # builds the core library to dist/
```

You'll need an [OpenRouter API key](https://openrouter.ai/keys) to use the agent.

## Development

Run the library build in watch mode alongside an example:

```bash
npm run build:watch          # rebuild library on changes
npm run dev:chat             # or dev:tutor, dev:sveltekit
```

## Examples

- **Chat** (`npm run dev:chat`) — Minimal chat interface (Lit + Vite)
- **Tutor** (`npm run dev:tutor`) — AI tutor with skills and prompt templates (Lit + Vite)
- **SvelteKit Chat** (`npm run dev:sveltekit`) — Chat app built with SvelteKit

Examples import the library as `"pi-browser"` via `file:` references resolved through npm workspaces.

## Project Structure

```
src/core/              Core agent library source
dist/                  Built library (via Rollup)
examples/
  chat/                Vanilla chat example
  tutor/               Tutor example
  sveltekit-chat/      SvelteKit example
rollup.config.js       Rollup build config
tsconfig.json          TypeScript config (type-checking)
tsconfig.build.json    TypeScript config (library build)
```
