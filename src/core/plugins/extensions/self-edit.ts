/**
 * self-edit extension
 *
 * Provides tools for the agent to inspect and modify its own behavior:
 *   - set_model: Change the LLM model used for subsequent prompts
 *   - get_model: Check which model is currently active
 *   - download_source: Download modified source files from the VFS
 *
 * Source files are loaded into the VFS separately via `loadSourcesIntoVFS()`,
 * which should be called after Agent.create() resolves.
 */

import type { Agent } from "../../agent.js";
import type { Extension } from "../../extensions.js";

/** The original embedded sources (for diffing against edits) */
let _embeddedSources: Record<string, string> | undefined;

/** Load embedded sources. Returns empty object if plugin not available. */
async function getEmbeddedSources(): Promise<Record<string, string>> {
  if (_embeddedSources !== undefined) return _embeddedSources;
  try {
    // Resolved by the Rollup embedSources plugin at build time.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — virtual module provided by rollup-plugin-embed-sources
    const mod = await import("virtual:pi-browser-sources");
    _embeddedSources = (mod as { sourceFiles: Record<string, string> }).sourceFiles;
  } catch {
    _embeddedSources = {};
  }
  return _embeddedSources;
}

/**
 * Load the agent's own source files into its VFS.
 * Call this after Agent.create() resolves.
 *
 * ```ts
 * const agent = await Agent.create({ ... });
 * await loadSourcesIntoVFS(agent);
 * ```
 */
export async function loadSourcesIntoVFS(agent: Agent): Promise<number> {
  const sources = await getEmbeddedSources();
  let count = 0;
  for (const [path, content] of Object.entries(sources)) {
    agent.fs.write("/" + path, content);
    count++;
  }
  if (count > 0) {
    console.log(`[self-edit] Loaded ${count} source files into VFS`);
  } else {
    console.warn(
      "[self-edit] No embedded sources found — run `npm run build` to embed source files"
    );
  }
  return count;
}

/**
 * Create the self-edit extension. Pass a ref object that will hold the agent
 * once it's created. Tools use the ref to access the agent at call time.
 *
 * ```ts
 * const agentRef: { current: Agent | null } = { current: null };
 * const agent = await Agent.create({
 *   extensions: [createSelfEditExtension(agentRef)],
 * });
 * agentRef.current = agent;
 * await loadSourcesIntoVFS(agent);
 * ```
 */
export function createSelfEditExtension(
  agentRef: { current: Agent | null }
): Extension {
  return (api) => {
    // --- set_model tool ---
    api.registerTool({
      name: "set_model",
      description: `Change the LLM model used for subsequent prompts. The change takes effect on the next message.

Common models:
  - anthropic/claude-sonnet-4 (current default)
  - anthropic/claude-sonnet-4.5
  - anthropic/claude-opus-4
  - openai/gpt-4o
  - google/gemini-2.5-pro

Use get_model to check the current model first.`,
      parameters: {
        type: "object",
        properties: {
          model: {
            type: "string",
            description:
              "The model identifier (e.g. 'anthropic/claude-sonnet-4.5')",
          },
        },
        required: ["model"],
      },
      execute: async (args) => {
        const agent = agentRef.current;
        if (!agent) {
          return { content: "Agent not available yet", isError: true };
        }
        const model = args.model as string;
        const oldModel = agent.model;
        agent.setModel(model);
        return {
          content: `Model changed from ${oldModel} to ${model}. The new model will be used starting from the next message.`,
          isError: false,
        };
      },
    });

    // --- get_model tool ---
    api.registerTool({
      name: "get_model",
      description: "Get the current LLM model identifier.",
      parameters: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const agent = agentRef.current;
        if (!agent) {
          return { content: "Agent not available yet", isError: true };
        }
        return {
          content: `Current model: ${agent.model}`,
          isError: false,
        };
      },
    });

    // --- download_source tool ---
    api.registerTool({
      name: "download_source",
      description: `Download a source file from the virtual filesystem as a browser file download. Use after editing source files to export changes.

Pass a specific path like "/src/core/openrouter.ts", or "*" to download all modified source files at once.`,
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              'File path to download, or "*" for all modified source files',
          },
        },
        required: ["path"],
      },
      execute: async (args) => {
        const agent = agentRef.current;
        if (!agent) {
          return { content: "Agent not available yet", isError: true };
        }

        const sources = await getEmbeddedSources();
        const requestedPath = args.path as string;

        if (requestedPath === "*") {
          let count = 0;
          for (const [origPath, origContent] of Object.entries(sources)) {
            const vfsPath = "/" + origPath;
            const currentContent = agent.fs.read(vfsPath);
            if (
              currentContent !== undefined &&
              currentContent !== origContent
            ) {
              triggerDownload(
                origPath.split("/").pop() ?? origPath,
                currentContent
              );
              count++;
            }
          }
          if (count === 0) {
            return {
              content: "No source files have been modified.",
              isError: false,
            };
          }
          return {
            content: `Downloaded ${count} modified file(s).`,
            isError: false,
          };
        }

        const content = agent.fs.read(requestedPath);
        if (content === undefined) {
          return { content: `File not found: ${requestedPath}`, isError: true };
        }
        const filename = requestedPath.split("/").pop() ?? "file.ts";
        triggerDownload(filename, content);
        return {
          content: `Downloaded ${requestedPath} as ${filename}`,
          isError: false,
        };
      },
    });
  };
}

/** Trigger a file download in the browser */
function triggerDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
