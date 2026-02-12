# pi-browser

A browser-based AI coding agent powered by [OpenRouter](https://openrouter.ai/). Includes a core agent library and several example applications.

## Setup

Requires [Node.js](https://nodejs.org/) (v18+).

```bash
# Install root dependencies
npm install

# Install all example dependencies
npm run install:all
```

You'll need an [OpenRouter API key](https://openrouter.ai/keys) to use the agent.

## Examples

**Chat** — Minimal chat interface.
```bash
npm run dev:chat
```

**Tutor** — AI tutor with built-in skills and prompt templates.
```bash
npm run dev:tutor
```

**SvelteKit Chat** — Chat app built with SvelteKit.
```bash
npm run dev:sveltekit
```

## Project Structure

```
src/core/       Core agent library (agent, tools, extensions, skills, OpenRouter client)
examples/
  chat/         Vanilla chat example (Vite)
  tutor/        Tutor example (Vite)
  sveltekit-chat/  SvelteKit example
```
