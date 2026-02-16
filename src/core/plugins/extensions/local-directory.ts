/**
 * local-directory extension
 *
 * Gives the agent sandboxed read/write access to a real directory on the
 * user's machine via the File System Access API (showDirectoryPicker).
 *
 * Inspired by Paul Kinlan's "the browser is the sandbox" (#019):
 * the browser's 30-year-old security model already provides chroot-like
 * filesystem isolation — once the user picks a directory, you can only
 * access files within it, never reaching parent or sibling directories.
 *
 * Tools registered:
 *   - local_pick_directory  — prompt the user to choose a folder
 *   - local_list_files      — list files in the selected directory (recursive)
 *   - local_read_file       — read a file (asks user permission)
 *   - local_write_file      — write/create a file (asks user permission)
 *   - local_delete_file     — delete a file (asks user permission)
 */

import type { Extension } from "../../extensions.js";

export const localDirectoryExtension: Extension = (agent) => {
  // State: the directory handle the user picked
  let directoryHandle: FileSystemDirectoryHandle | null = null;

  // Permission preference per operation type: "always" | "ask" | "never"
  // Defaults to "ask" — the user is prompted each time.
  const permissionPolicy: Record<string, "always" | "ask" | "never"> = {
    read: "ask",
    write: "ask",
    delete: "ask",
  };

  // ─── Helpers ────────────────────────────────────────────────────

  /**
   * Walk a directory handle recursively and return all file paths
   * relative to the root.
   */
  async function listAllFiles(
    dirHandle: FileSystemDirectoryHandle,
    prefix = "",
  ): Promise<string[]> {
    const results: string[] = [];
    for await (const [name, handle] of dirHandle as any) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (handle.kind === "directory") {
        results.push(path + "/");
        const children = await listAllFiles(handle as FileSystemDirectoryHandle, path);
        results.push(...children);
      } else {
        results.push(path);
      }
    }
    return results;
  }

  /**
   * Resolve a relative path to a FileSystemFileHandle inside the
   * directory handle. Walks the path segments to find intermediate
   * directories.
   */
  async function resolveFile(
    root: FileSystemDirectoryHandle,
    relativePath: string,
    create = false,
  ): Promise<FileSystemFileHandle> {
    const segments = relativePath.split("/").filter(Boolean);
    const fileName = segments.pop();
    if (!fileName) throw new Error("Invalid file path");

    let dir = root;
    for (const seg of segments) {
      dir = await dir.getDirectoryHandle(seg, { create });
    }
    return dir.getFileHandle(fileName, { create });
  }

  /**
   * Resolve a relative path to its parent FileSystemDirectoryHandle
   * and the entry name. Used for deletion.
   */
  async function resolveParent(
    root: FileSystemDirectoryHandle,
    relativePath: string,
  ): Promise<{ parent: FileSystemDirectoryHandle; name: string }> {
    const segments = relativePath.split("/").filter(Boolean);
    const name = segments.pop();
    if (!name) throw new Error("Invalid file path");

    let dir = root;
    for (const seg of segments) {
      dir = await dir.getDirectoryHandle(seg);
    }
    return { parent: dir, name };
  }

  /**
   * Ask the user for permission before performing an operation.
   * Respects the current permission policy for the operation type.
   * Returns true if permitted, false if denied.
   */
  async function checkPermission(
    operation: "read" | "write" | "delete",
    filePath: string,
  ): Promise<boolean> {
    const policy = permissionPolicy[operation];
    if (policy === "always") return true;
    if (policy === "never") return false;

    // policy === "ask"
    const verbMap = { read: "read", write: "write to", delete: "delete" };
    const response = await agent.requestUserInput({
      question: `Allow ${operation} access?`,
      description: `The agent wants to **${verbMap[operation]}** the file:\n\n\`${filePath}\`\n\nin the local directory \`${directoryHandle!.name}/\`.`,
      fields: [
        {
          name: "allow",
          label: "Permission",
          type: "select",
          options: [
            "Yes, this time",
            "Yes, always for this operation",
            "No",
            "No, never for this operation",
          ],
          required: true,
        },
      ],
    });

    const answer = response.allow;
    if (answer === "Yes, always for this operation") {
      permissionPolicy[operation] = "always";
      return true;
    }
    if (answer === "No, never for this operation") {
      permissionPolicy[operation] = "never";
      return false;
    }
    return answer === "Yes, this time";
  }

  // ─── Tools ──────────────────────────────────────────────────────

  agent.registerTool({
    name: "local_pick_directory",
    description: `Open the browser's directory picker so the user can grant access to a local folder.
This must be called before any other local_* tools. The selected directory becomes
the sandbox root — you can only access files within it (never parent or sibling dirs).

The File System Access API provides chroot-like isolation: the browser enforces that
no code can escape the boundary of the selected directory.

Returns the directory name and its immediate listing on success.`,
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    execute: async () => {
      try {
        if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
          return {
            content:
              "The File System Access API is not available in this browser. " +
              "This feature requires a Chromium-based browser (Chrome, Edge, Arc, etc.).",
            isError: true,
          };
        }

        directoryHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });

        // Reset permission policies on new directory pick
        permissionPolicy.read = "ask";
        permissionPolicy.write = "ask";
        permissionPolicy.delete = "ask";

        const files = await listAllFiles(directoryHandle!);
        const listing = files.length > 0 ? files.slice(0, 100).join("\n") : "(empty directory)";
        const truncated = files.length > 100 ? `\n... and ${files.length - 100} more files` : "";

        return {
          content:
            `Directory selected: ${directoryHandle!.name}/\n` +
            `Total entries: ${files.length}\n\n` +
            `Contents:\n${listing}${truncated}`,
          isError: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("abort") || msg.includes("cancel")) {
          return { content: "User cancelled the directory picker.", isError: true };
        }
        return { content: `Failed to pick directory: ${msg}`, isError: true };
      }
    },
  });

  agent.registerTool({
    name: "local_list_files",
    description: `List all files and directories inside the selected local directory (recursive).
Requires local_pick_directory to have been called first.
Directories end with a trailing slash. Returns up to 500 entries.`,
    parameters: {
      type: "object",
      properties: {
        prefix: {
          type: "string",
          description:
            "Optional subdirectory path to list (relative to the root). If omitted, lists from root.",
        },
      },
      additionalProperties: false,
    },
    execute: async (args) => {
      if (!directoryHandle) {
        return {
          content: "No directory selected. Call local_pick_directory first.",
          isError: true,
        };
      }

      try {
        const prefix = (args.prefix as string) ?? "";
        let startDir = directoryHandle;

        if (prefix) {
          const segments = prefix.split("/").filter(Boolean);
          for (const seg of segments) {
            startDir = await startDir.getDirectoryHandle(seg);
          }
        }

        const files = await listAllFiles(startDir, prefix);
        const limit = 500;
        const listing = files.slice(0, limit).join("\n") || "(empty)";
        const truncated = files.length > limit ? `\n... and ${files.length - limit} more` : "";

        return { content: listing + truncated, isError: false };
      } catch (e) {
        return {
          content: `Failed to list files: ${e instanceof Error ? e.message : String(e)}`,
          isError: true,
        };
      }
    },
  });

  agent.registerTool({
    name: "local_read_file",
    description: `Read the contents of a file from the selected local directory.
The path is relative to the directory root. The user will be asked for permission.
Returns the file contents as text.`,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the file (e.g. 'src/index.ts' or 'README.md')",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    execute: async (args) => {
      if (!directoryHandle) {
        return {
          content: "No directory selected. Call local_pick_directory first.",
          isError: true,
        };
      }

      const filePath = args.path as string;

      try {
        const allowed = await checkPermission("read", filePath);
        if (!allowed) {
          return { content: `Permission denied: read "${filePath}"`, isError: true };
        }

        const fileHandle = await resolveFile(directoryHandle, filePath);
        const file = await fileHandle.getFile();
        const text = await file.text();

        return { content: text, isError: false };
      } catch (e) {
        return {
          content: `Failed to read "${filePath}": ${e instanceof Error ? e.message : String(e)}`,
          isError: true,
        };
      }
    },
  });

  agent.registerTool({
    name: "local_write_file",
    description: `Write content to a file in the selected local directory.
Creates the file and any intermediate directories if they don't exist.
Overwrites the file if it already exists. The user will be asked for permission.
The path is relative to the directory root.`,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path for the file (e.g. 'output/result.txt')",
        },
        content: {
          type: "string",
          description: "Text content to write to the file",
        },
      },
      required: ["path", "content"],
      additionalProperties: false,
    },
    execute: async (args) => {
      if (!directoryHandle) {
        return {
          content: "No directory selected. Call local_pick_directory first.",
          isError: true,
        };
      }

      const filePath = args.path as string;
      const content = args.content as string;

      try {
        const allowed = await checkPermission("write", filePath);
        if (!allowed) {
          return { content: `Permission denied: write "${filePath}"`, isError: true };
        }

        const fileHandle = await resolveFile(directoryHandle, filePath, /* create */ true);
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        return {
          content: `Successfully wrote ${content.length} characters to "${filePath}"`,
          isError: false,
        };
      } catch (e) {
        return {
          content: `Failed to write "${filePath}": ${e instanceof Error ? e.message : String(e)}`,
          isError: true,
        };
      }
    },
  });

  agent.registerTool({
    name: "local_delete_file",
    description: `Delete a file from the selected local directory. This is destructive and
cannot be undone. The user will be asked for permission. The path is relative
to the directory root.`,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the file to delete",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    execute: async (args) => {
      if (!directoryHandle) {
        return {
          content: "No directory selected. Call local_pick_directory first.",
          isError: true,
        };
      }

      const filePath = args.path as string;

      try {
        const allowed = await checkPermission("delete", filePath);
        if (!allowed) {
          return { content: `Permission denied: delete "${filePath}"`, isError: true };
        }

        const { parent, name } = await resolveParent(directoryHandle, filePath);
        await parent.removeEntry(name);

        return { content: `Deleted "${filePath}"`, isError: false };
      } catch (e) {
        return {
          content: `Failed to delete "${filePath}": ${e instanceof Error ? e.message : String(e)}`,
          isError: true,
        };
      }
    },
  });
};
