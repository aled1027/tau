import { describe, it, expect } from "vitest";
import { VirtualFS, createTools } from "../tools.js";

// ─── VirtualFS ──────────────────────────────────────────────────────

describe("VirtualFS", () => {
  it("should read and write files", () => {
    const fs = new VirtualFS();
    fs.write("/hello.txt", "world");
    expect(fs.read("/hello.txt")).toBe("world");
  });

  it("should return undefined for missing files", () => {
    const fs = new VirtualFS();
    expect(fs.read("/nonexistent")).toBeUndefined();
  });

  it("should overwrite existing files", () => {
    const fs = new VirtualFS();
    fs.write("/a.txt", "first");
    fs.write("/a.txt", "second");
    expect(fs.read("/a.txt")).toBe("second");
  });

  it("should delete files", () => {
    const fs = new VirtualFS();
    fs.write("/a.txt", "data");
    expect(fs.delete("/a.txt")).toBe(true);
    expect(fs.read("/a.txt")).toBeUndefined();
  });

  it("should return false when deleting nonexistent files", () => {
    const fs = new VirtualFS();
    expect(fs.delete("/nonexistent")).toBe(false);
  });

  it("should check existence", () => {
    const fs = new VirtualFS();
    fs.write("/a.txt", "data");
    expect(fs.exists("/a.txt")).toBe(true);
    expect(fs.exists("/b.txt")).toBe(false);
  });

  describe("normalize", () => {
    it("should add leading slash if missing", () => {
      const fs = new VirtualFS();
      fs.write("hello.txt", "world");
      expect(fs.read("/hello.txt")).toBe("world");
    });

    it("should collapse double slashes", () => {
      const fs = new VirtualFS();
      fs.write("//a//b.txt", "data");
      expect(fs.read("/a/b.txt")).toBe("data");
    });
  });

  describe("list", () => {
    it("should list all files with default prefix", () => {
      const fs = new VirtualFS();
      fs.write("/a.txt", "a");
      fs.write("/dir/b.txt", "b");
      const files = fs.list();
      expect(files).toContain("/a.txt");
      expect(files).toContain("/dir/b.txt");
      expect(files).toHaveLength(2);
    });

    it("should list files under a directory prefix", () => {
      const fs = new VirtualFS();
      fs.write("/src/a.ts", "a");
      fs.write("/src/b.ts", "b");
      fs.write("/lib/c.ts", "c");
      const files = fs.list("/src");
      expect(files).toContain("/src/a.ts");
      expect(files).toContain("/src/b.ts");
      expect(files).not.toContain("/lib/c.ts");
    });

    it("should not match partial directory names", () => {
      const fs = new VirtualFS();
      fs.write("/src/a.ts", "a");
      fs.write("/srclib/b.ts", "b");
      const files = fs.list("/src");
      expect(files).toContain("/src/a.ts");
      expect(files).not.toContain("/srclib/b.ts");
    });

    it("should return empty array when no files match", () => {
      const fs = new VirtualFS();
      fs.write("/a.txt", "a");
      expect(fs.list("/nonexistent")).toEqual([]);
    });
  });

  describe("snapshot and restore", () => {
    it("should create a snapshot and restore from it", () => {
      const fs = new VirtualFS();
      fs.write("/a.txt", "a");
      fs.write("/b.txt", "b");
      const snap = fs.snapshot();

      fs.write("/c.txt", "c");
      fs.restore(snap);

      expect(fs.exists("/a.txt")).toBe(true);
      expect(fs.exists("/b.txt")).toBe(true);
      expect(fs.exists("/c.txt")).toBe(false);
    });
  });

  describe("toJSON and fromJSON", () => {
    it("should round-trip through JSON serialization", () => {
      const fs = new VirtualFS();
      fs.write("/a.txt", "hello");
      fs.write("/dir/b.txt", "world");

      const json = fs.toJSON();
      expect(json).toEqual({ "/a.txt": "hello", "/dir/b.txt": "world" });

      const fs2 = VirtualFS.fromJSON(json);
      expect(fs2.read("/a.txt")).toBe("hello");
      expect(fs2.read("/dir/b.txt")).toBe("world");
    });
  });
});

// ─── Tool implementations ───────────────────────────────────────────

describe("createTools", () => {
  function getToolByName(name: string, fs: VirtualFS) {
    const tools = createTools(fs);
    const tool = tools.find((t) => t.name === name);
    if (!tool) throw new Error(`Tool "${name}" not found`);
    return tool;
  }

  describe("read tool", () => {
    it("should read an existing file", async () => {
      const fs = new VirtualFS();
      fs.write("/test.txt", "content");
      const tool = getToolByName("read", fs);
      const result = await tool.execute({ path: "/test.txt" });
      expect(result.isError).toBe(false);
      expect(result.content).toBe("content");
    });

    it("should return error for missing file", async () => {
      const fs = new VirtualFS();
      const tool = getToolByName("read", fs);
      const result = await tool.execute({ path: "/missing.txt" });
      expect(result.isError).toBe(true);
      expect(result.content).toContain("not found");
    });
  });

  describe("write tool", () => {
    it("should write a file and report bytes", async () => {
      const fs = new VirtualFS();
      const tool = getToolByName("write", fs);
      const result = await tool.execute({ path: "/out.txt", content: "hello" });
      expect(result.isError).toBe(false);
      expect(result.content).toContain("5 bytes");
      expect(fs.read("/out.txt")).toBe("hello");
    });
  });

  describe("edit tool", () => {
    it("should replace exact text in a file", async () => {
      const fs = new VirtualFS();
      fs.write("/code.ts", 'const x = "old";');
      const tool = getToolByName("edit", fs);
      const result = await tool.execute({
        path: "/code.ts",
        oldText: '"old"',
        newText: '"new"',
      });
      expect(result.isError).toBe(false);
      expect(fs.read("/code.ts")).toBe('const x = "new";');
    });

    it("should return error when file does not exist", async () => {
      const fs = new VirtualFS();
      const tool = getToolByName("edit", fs);
      const result = await tool.execute({
        path: "/missing.ts",
        oldText: "a",
        newText: "b",
      });
      expect(result.isError).toBe(true);
      expect(result.content).toContain("not found");
    });

    it("should return error when oldText is not found", async () => {
      const fs = new VirtualFS();
      fs.write("/code.ts", "abc");
      const tool = getToolByName("edit", fs);
      const result = await tool.execute({
        path: "/code.ts",
        oldText: "xyz",
        newText: "new",
      });
      expect(result.isError).toBe(true);
      expect(result.content).toContain("oldText not found");
    });

    it("should only replace the first occurrence", async () => {
      const fs = new VirtualFS();
      fs.write("/code.ts", "aaa");
      const tool = getToolByName("edit", fs);
      await tool.execute({
        path: "/code.ts",
        oldText: "a",
        newText: "b",
      });
      expect(fs.read("/code.ts")).toBe("baa");
    });
  });

  describe("list tool", () => {
    it("should list files with default prefix", async () => {
      const fs = new VirtualFS();
      fs.write("/a.txt", "a");
      fs.write("/b.txt", "b");
      const tool = getToolByName("list", fs);
      const result = await tool.execute({});
      expect(result.isError).toBe(false);
      expect(result.content).toContain("/a.txt");
      expect(result.content).toContain("/b.txt");
    });

    it("should list files under a prefix", async () => {
      const fs = new VirtualFS();
      fs.write("/src/a.ts", "a");
      fs.write("/lib/b.ts", "b");
      const tool = getToolByName("list", fs);
      const result = await tool.execute({ prefix: "/src" });
      expect(result.isError).toBe(false);
      expect(result.content).toContain("/src/a.ts");
      expect(result.content).not.toContain("/lib/b.ts");
    });

    it("should report when no files found", async () => {
      const fs = new VirtualFS();
      const tool = getToolByName("list", fs);
      const result = await tool.execute({ prefix: "/empty" });
      expect(result.isError).toBe(false);
      expect(result.content).toContain("No files found");
    });
  });
});
