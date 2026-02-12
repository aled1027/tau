# pi-browser core library

A browser-based AI coding agent framework. The core library provides AI-powered conversations, tool calling, streaming, and thread persistence — all client-side with no server.

## Architecture

```
src/core/             ← core framework (no UI dependencies, pure TypeScript)
  agent.ts            Agent class (main API)
  types.ts            Message, ToolCall, AgentEvent, PromptResult, etc.
  extensions.ts       Extension system
  skills.ts           On-demand instruction documents
  prompt-templates.ts /slash command expansion
  openrouter.ts       OpenRouter streaming client + tool loop
  tools.ts            VirtualFS + built-in filesystem tools
  storage.ts          Thread persistence (IndexedDB + localStorage)

src/core/plugins/     ← built-in extensions, skills, prompt templates

examples/
  chat/               Minimal chat app (Lit + Vite)
  tutor/              AI tutor with lessons and code editor (Lit + Vite)
  sveltekit-chat/     Chat app built with SvelteKit
  do-i-suck-at-math/  Minimal SvelteKit example
```

## Quick start

### Simple (non-streaming)

```typescript
import { Agent } from "pi-browser";

const agent = await Agent.create({ apiKey: "sk-or-..." });

const result = await agent.send("Write a hello world in Python");
console.log(result.text);       // assistant's response
console.log(result.toolCalls);  // any tool calls made
```

### With streaming updates

```typescript
const result = await agent.send("Write a hello world in Python", {
  onText: (delta, fullText) => updateUI(fullText),
  onToolCallStart: (tc) => showSpinner(tc.name),
  onToolCallEnd: (tc) => showResult(tc.result),
  onError: (err) => showError(err),
});
```

### Low-level streaming (advanced)

For full control over every event, use `prompt()` which returns an `AsyncGenerator<AgentEvent>`:

```typescript
for await (const event of agent.prompt("Write hello world")) {
  switch (event.type) {
    case "text_delta":      process.stdout.write(event.delta); break;
    case "tool_call_start": console.log(`Calling ${event.toolCall.name}...`); break;
    case "tool_call_end":   console.log(`Result: ${event.toolCall.result?.content}`); break;
    case "error":           console.error(event.error); break;
  }
}
```

Everything else — extensions, skills, templates, threads — is opt-in.

---

## Public API

Exported from `pi-browser`:

```typescript
// Classes
Agent, VirtualFS

// Types
AgentConfig, Message, ToolCall, ToolResult, ToolDefinition,
AgentEvent, PromptResult, PromptCallbacks, ThreadMeta,
Extension, PiBrowserAPI, UserInputField, UserInputRequest, UserInputResponse,
Skill, PromptTemplate

// Built-in plugins
askUserExtension, codeReviewSkill, litComponentSkill, builtinTemplates
```

---

## Agent

The `Agent` class is the primary API. It orchestrates messages, tools, extensions, skills, templates, thread management, and persistence.

### Construction

```typescript
// Recommended — creates agent and restores/creates a thread
const agent = await Agent.create(config);

// Manual — you must call ready() yourself before prompting
const agent = new Agent(config);
await agent.ready();
```

### AgentConfig

```typescript
interface AgentConfig {
  apiKey: string;                      // OpenRouter API key (required)
  model?: string;                      // Default: "anthropic/claude-sonnet-4"
  systemPrompt?: string;               // Override default system prompt
  extensions?: Extension[];            // Add tools + event listeners
  skills?: Skill[];                    // On-demand instruction documents
  promptTemplates?: PromptTemplate[];  // /slash command templates
}
```

### Sending messages

#### `send(text, callbacks?): Promise<PromptResult>` — Recommended

The simplest way to interact with the agent. Sends a message, handles the full tool-use loop internally, and returns the final result. Optional callbacks provide streaming updates.

```typescript
interface PromptResult {
  text: string;         // Full accumulated assistant text
  toolCalls: ToolCall[];  // All tool calls made (with results)
}

interface PromptCallbacks {
  onText?: (delta: string, fullText: string) => void;
  onToolCallStart?: (toolCall: ToolCall) => void;
  onToolCallEnd?: (toolCall: ToolCall) => void;
  onError?: (error: string) => void;
}
```

**Example — no streaming:**

```typescript
const result = await agent.send("What is 2 + 2?");
console.log(result.text); // "4"
```

**Example — with streaming UI:**

```typescript
const result = await agent.send("Create a React component", {
  onText: (_delta, full) => { streamingText = full; },
  onToolCallStart: (tc) => { console.log(`Calling ${tc.name}...`); },
  onToolCallEnd: (tc) => { syncEditorFromFS(); },
  onError: (err) => { showError(err); },
});

// After completion, use result.text and result.toolCalls
displayMessage(result.text, result.toolCalls);
```

If the request is aborted via `agent.abort()`, `send()` resolves with whatever text/toolCalls were accumulated so far (does not throw).

#### `prompt(text): AsyncGenerator<AgentEvent>` — Advanced

Returns a raw event stream for full control. You must manually accumulate text deltas, track tool calls, and handle errors. Use `send()` unless you need event-level control.

```typescript
for await (const event of agent.prompt(text)) {
  // handle each event
}
```

#### `abort()`

Cancel the current streaming response. With `send()`, the promise resolves with partial results. With `prompt()`, the generator throws an `AbortError`.

### Messages

```typescript
agent.getMessages(): Message[]  // Copy of full conversation history
```

```typescript
interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCalls?: ToolCall[];     // For assistant messages with tool use
  toolCallId?: string;        // For tool-role messages
}
```

### Tools

```typescript
agent.tools: ToolDefinition[]  // All available tools (builtin + extension + read_skill)
```

### Filesystem

```typescript
agent.fs: VirtualFS  // Direct access to the virtual filesystem
```

### User input

Extensions can pause and ask the user for input. You must wire up a handler:

```typescript
agent.setUserInputHandler(async (request) => {
  // Show a form to the user, return their response
  return { answer: "user's answer" };
});
```

### Thread management

Threads provide conversation persistence across page reloads using IndexedDB and localStorage.

| Method | Description |
|--------|-------------|
| `agent.activeThreadId` | Current thread ID (or null) |
| `agent.listThreads(): ThreadMeta[]` | All threads, most recent first |
| `agent.newThread(name?): Promise<string>` | Create a new thread, returns its ID |
| `agent.switchThread(id): Promise<void>` | Switch to an existing thread |
| `agent.deleteThread(id): Promise<void>` | Delete a thread |
| `agent.renameThread(id, name): void` | Rename a thread |
| `agent.persist(): Promise<void>` | Manually persist (auto-called after `send`/`prompt`) |
| `agent.serialize()` | Get `{ messages, fs }` snapshot |

```typescript
interface ThreadMeta {
  id: string;
  name: string;
  createdAt: number;  // epoch ms
  updatedAt: number;  // epoch ms
}
```

Threads auto-name themselves from the first user message. State (messages + filesystem) is persisted after each completed turn.

---

## AgentEvent

```typescript
type AgentEvent =
  | { type: "text_delta"; delta: string }            // Incremental model text
  | { type: "tool_call_start"; toolCall: ToolCall }  // Tool invocation started
  | { type: "tool_call_end"; toolCall: ToolCall }    // Tool finished (result attached)
  | { type: "tool_loop_message"; message: Message }  // Internal message added to history
  | { type: "turn_end" }                             // Model finished responding
  | { type: "error"; error: string }                 // Non-fatal error
```

**Typical sequences:**
- Simple text: `text_delta* → turn_end`
- With tools: `tool_call_start → tool_call_end → text_delta* → turn_end`
- Multiple tool calls can happen per turn, and the model may loop (call tools, get results, call more tools, etc.)

---

## Tools

### Built-in filesystem tools

| Tool | Params | Description |
|------|--------|-------------|
| `read` | `path` | Read a file's contents |
| `write` | `path`, `content` | Create or overwrite a file |
| `edit` | `path`, `oldText`, `newText` | Replace exact text in a file |
| `list` | `prefix` (default `/`) | List files under a prefix |

### ToolDefinition

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;  // JSON Schema
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}

interface ToolResult {
  content: string;
  isError: boolean;
}
```

### Custom tools via extensions

```typescript
const myExtension: Extension = (api) => {
  api.registerTool({
    name: "fetch_url",
    description: "Fetch a URL and return its contents",
    parameters: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
    },
    execute: async (args) => {
      const text = await (await fetch(args.url as string)).text();
      return { content: text.slice(0, 5000), isError: false };
    },
  });
};
```

### `createTools(fs)` for standalone use

```typescript
import { VirtualFS } from "pi-browser";
import { createTools } from "pi-browser";  // if exported

const tools = createTools(new VirtualFS());  // [read, write, edit, list]
```

---

## VirtualFS

In-memory filesystem. Paths are normalized with leading `/` and collapsed `//`.

```typescript
const fs = new VirtualFS();

fs.write("/src/main.ts", "console.log('hello')");
fs.read("/src/main.ts");     // "console.log('hello')"
fs.exists("/src/main.ts");   // true
fs.list("/src");              // ["/src/main.ts"]
fs.delete("/src/main.ts");   // true

// Serialization (used internally for thread persistence)
const json = fs.toJSON();                // Record<string, string>
const restored = VirtualFS.fromJSON(json);

// Snapshot / restore
const snap = fs.snapshot();   // Map<string, string>
fs.restore(snap);
```

Pre-populate via `agent.fs` before prompting:

```typescript
agent.fs.write("/data.json", JSON.stringify({ items: [1, 2, 3] }));
const result = await agent.send("Summarize the data in /data.json");
```

---

## Extensions

Extensions are functions that receive a `PiBrowserAPI` and add capabilities. They run once during agent construction.

```typescript
type Extension = (api: PiBrowserAPI) => void | Promise<void>;
```

### PiBrowserAPI

```typescript
interface PiBrowserAPI {
  registerTool(tool: ToolDefinition): void;
  on(event: "agent_event", handler: (e: AgentEvent) => void): () => void;
  requestUserInput(request: UserInputRequest): Promise<UserInputResponse>;
}
```

### User input from extensions

Extensions can pause execution and ask the user for input via a form:

```typescript
const askExtension: Extension = (api) => {
  api.registerTool({
    name: "ask_user",
    description: "Ask the user a question",
    parameters: { /* ... */ },
    execute: async (args) => {
      const response = await api.requestUserInput({
        question: args.question as string,
        fields: [{ name: "answer", label: "Your answer", type: "text", required: true }],
      });
      return { content: response.answer, isError: false };
    },
  });
};
```

Requires `agent.setUserInputHandler()` to be wired up in the UI layer.

```typescript
interface UserInputRequest {
  question: string;
  description?: string;
  fields?: UserInputField[];  // Defaults to single text input
}

interface UserInputField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "confirm";
  placeholder?: string;
  options?: string[];       // Required for "select"
  defaultValue?: string;
  required?: boolean;
}

type UserInputResponse = Record<string, string>;
```

### Built-in extension

- **`askUserExtension`** — Registers an `ask_user` tool that prompts the user for input.

---

## Skills

Named instruction documents loaded on-demand. Only names and descriptions appear in the system prompt — full content is loaded when the model calls the auto-registered `read_skill` tool.

```typescript
interface Skill {
  name: string;         // e.g. "code-review"
  description: string;  // When to use this skill (shown in system prompt)
  content: string;      // Full instructions (markdown)
}
```

```typescript
const agent = await Agent.create({
  apiKey: "sk-or-...",
  skills: [
    {
      name: "api-design",
      description: "Design RESTful APIs. Use when asked to design or review an API.",
      content: "# API Design\n\n## Guidelines\n- Use nouns for resources...",
    },
  ],
});
```

When skills are registered, a `read_skill` tool is automatically added. The model reads the skill content when it encounters a matching task.

### Built-in skills

- **`codeReviewSkill`** — Code review guidelines
- **`litComponentSkill`** — Lit web component creation

---

## Prompt templates

`/slash` commands that expand before reaching the model.

```typescript
interface PromptTemplate {
  name: string;         // Command name (no leading slash)
  description: string;  // Shown in autocomplete
  body: string;         // Template body with placeholders
}
```

```typescript
const agent = await Agent.create({
  apiKey: "sk-or-...",
  promptTemplates: [
    {
      name: "scaffold",
      description: "Scaffold a new project",
      body: "Create a new $1 project called $2. Set up the basic file structure. ${@:3}",
    },
  ],
});
```

### Argument placeholders

| Placeholder | Meaning | Example with `/scaffold ts myapp with tests` |
|-------------|---------|-----------------------------------------------|
| `$1` | First argument | `ts` |
| `$2` | Second argument | `myapp` |
| `$@` | All arguments joined | `ts myapp with tests` |
| `${@:2}` | Args from position 2+ | `myapp with tests` |
| `${@:3:2}` | 2 args from position 3 | `with tests` |

Quoted strings are single arguments: `/scaffold ts "my app"` → `$1="ts"`, `$2="my app"`.

### Autocomplete

```typescript
agent.promptTemplates.search("sca");  // [{ name: "scaffold", ... }]
```

### Manual expansion

```typescript
agent.promptTemplates.expand("/scaffold ts myapp");
// → "Create a new ts project called myapp. Set up the basic file structure. "
```

Templates are auto-expanded by `send()` and `prompt()` — the model sees the final expanded text.

### Built-in templates

- **`builtinTemplates`** — Array of common templates (review, refactor, etc.)

---

## Full example

```typescript
import { Agent, askUserExtension, codeReviewSkill, builtinTemplates } from "pi-browser";
import type { Extension, Skill, PromptTemplate } from "pi-browser";

// Custom extension
const timestampExtension: Extension = (api) => {
  api.registerTool({
    name: "timestamp",
    description: "Get the current ISO timestamp",
    parameters: { type: "object", properties: {} },
    execute: async () => ({ content: new Date().toISOString(), isError: false }),
  });
};

// Custom skill
const cssSkill: Skill = {
  name: "css-layout",
  description: "CSS layout advice for flexbox, grid, responsive design.",
  content: "# CSS Layout\n\n## Flexbox\n...\n## Grid\n...",
};

// Custom template
const styleTemplate: PromptTemplate = {
  name: "style",
  description: "Style a component",
  body: "Write CSS for $1. Requirements: ${@:2}",
};

// Create agent
const agent = await Agent.create({
  apiKey: "sk-or-...",
  extensions: [askUserExtension, timestampExtension],
  skills: [codeReviewSkill, cssSkill],
  promptTemplates: [...builtinTemplates, styleTemplate],
});

// Pre-populate filesystem
agent.fs.write("/greeting.txt", "Hello, world!");

// Simple usage
const result = await agent.send("Read /greeting.txt and tell me what it says");
console.log(result.text);

// With streaming
const result2 = await agent.send("/style .card responsive with dark theme", {
  onText: (_delta, full) => { document.getElementById("output")!.textContent = full; },
  onToolCallEnd: (tc) => { console.log(`[tool] ${tc.name} → ${tc.result?.content}`); },
});
```

---

## Persistence

Thread state is persisted automatically:

- **Thread metadata** (id, name, timestamps) → `localStorage`
- **Messages and filesystem** → `IndexedDB`

State is saved after each completed `send()` or `prompt()` turn. On page reload, `Agent.create()` restores the last active thread.

```typescript
// Thread lifecycle
const id = await agent.newThread("My project");
await agent.send("Hello!");

// Later, switch between threads
const threads = agent.listThreads();
await agent.switchThread(threads[1].id);

// Delete a thread
await agent.deleteThread(id);
```
