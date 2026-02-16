/**
 * Tests for the local-directory extension.
 *
 * Since the File System Access API (showDirectoryPicker) is only available
 * in Chromium browsers, we test tool registration and error paths that
 * don't require a real browser environment.
 */

import { describe, it, expect, vi } from "vitest";
import type { ToolDefinition, AgentEvent } from "../types.js";
import type { ExtensionHost, UserInputRequest, UserInputResponse } from "../extensions.js";
import { localDirectoryExtension } from "../plugins/extensions/local-directory.js";

// ─── Helpers ────────────────────────────────────────────────────────

function createFakeHost() {
  const tools: ToolDefinition[] = [];
  const requestUserInputFn = vi.fn<(req: UserInputRequest) => Promise<UserInputResponse>>();

  const host: ExtensionHost = {
    registerTool: (tool: ToolDefinition) => { tools.push(tool); },
    on: (_event: "agent_event", _handler: (e: AgentEvent) => void) => () => {},
    requestUserInput: requestUserInputFn,
    addExtension: vi.fn(),
    removeExtension: vi.fn(),
  };

  function getTool(name: string): ToolDefinition {
    const tool = tools.find((t) => t.name === name);
    if (!tool) throw new Error(`Tool "${name}" not found. Registered: ${tools.map(t => t.name).join(", ")}`);
    return tool;
  }

  return { host, tools, getTool, requestUserInputFn };
}

// ─── Tool registration ─────────────────────────────────────────────

describe("localDirectoryExtension", () => {
  it("should register all five local_* tools", () => {
    const { host, tools } = createFakeHost();
    localDirectoryExtension(host);

    const names = tools.map((t) => t.name);
    expect(names).toContain("local_pick_directory");
    expect(names).toContain("local_list_files");
    expect(names).toContain("local_read_file");
    expect(names).toContain("local_write_file");
    expect(names).toContain("local_delete_file");
    expect(names).toHaveLength(5);
  });

  // ─── local_pick_directory ───────────────────────────────────────

  describe("local_pick_directory", () => {
    it("should return error when File System Access API is not available", async () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_pick_directory");
      const result = await tool.execute({});

      expect(result.isError).toBe(true);
      expect(result.content).toContain("File System Access API is not available");
    });
  });

  // ─── Tools that require a directory to be picked first ──────────

  describe("local_list_files (no directory)", () => {
    it("should return error when no directory is selected", async () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_list_files");
      const result = await tool.execute({});

      expect(result.isError).toBe(true);
      expect(result.content).toContain("No directory selected");
      expect(result.content).toContain("local_pick_directory");
    });
  });

  describe("local_read_file (no directory)", () => {
    it("should return error when no directory is selected", async () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_read_file");
      const result = await tool.execute({ path: "test.txt" });

      expect(result.isError).toBe(true);
      expect(result.content).toContain("No directory selected");
    });
  });

  describe("local_write_file (no directory)", () => {
    it("should return error when no directory is selected", async () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_write_file");
      const result = await tool.execute({ path: "test.txt", content: "hello" });

      expect(result.isError).toBe(true);
      expect(result.content).toContain("No directory selected");
    });
  });

  describe("local_delete_file (no directory)", () => {
    it("should return error when no directory is selected", async () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_delete_file");
      const result = await tool.execute({ path: "test.txt" });

      expect(result.isError).toBe(true);
      expect(result.content).toContain("No directory selected");
    });
  });

  // ─── Tool descriptions ─────────────────────────────────────────

  describe("tool descriptions", () => {
    it("should have meaningful descriptions on all tools", () => {
      const { host, tools } = createFakeHost();
      localDirectoryExtension(host);

      for (const tool of tools) {
        expect(tool.description.length).toBeGreaterThan(20);
      }
    });

    it("local_pick_directory description should mention sandboxing", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_pick_directory");
      expect(tool.description).toContain("sandbox");
    });

    it("local_write_file description should mention permission", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_write_file");
      expect(tool.description).toContain("permission");
    });

    it("local_delete_file description should mention destructive", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_delete_file");
      expect(tool.description).toContain("destructive");
    });
  });

  // ─── Tool parameter schemas ─────────────────────────────────────

  describe("parameter schemas", () => {
    it("local_pick_directory should require no parameters", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_pick_directory");
      const schema = tool.parameters as any;
      expect(schema.type).toBe("object");
      expect(schema.required).toBeUndefined();
    });

    it("local_read_file should require path", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_read_file");
      const schema = tool.parameters as any;
      expect(schema.required).toContain("path");
    });

    it("local_write_file should require path and content", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_write_file");
      const schema = tool.parameters as any;
      expect(schema.required).toContain("path");
      expect(schema.required).toContain("content");
    });

    it("local_delete_file should require path", () => {
      const { host, getTool } = createFakeHost();
      localDirectoryExtension(host);

      const tool = getTool("local_delete_file");
      const schema = tool.parameters as any;
      expect(schema.required).toContain("path");
    });
  });
});
