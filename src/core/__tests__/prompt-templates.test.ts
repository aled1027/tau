import { describe, it, expect } from "vitest";
import { PromptTemplateRegistry } from "../prompt-templates.js";
import type { PromptTemplate } from "../prompt-templates.js";

function makeTemplate(name: string, body: string): PromptTemplate {
  return { name, description: `Template: ${name}`, body };
}

describe("PromptTemplateRegistry", () => {
  describe("register and retrieve", () => {
    it("should register and get a template", () => {
      const reg = new PromptTemplateRegistry();
      const tmpl = makeTemplate("review", "Review this: $@");
      reg.register(tmpl);
      expect(reg.get("review")).toEqual(tmpl);
    });

    it("should return undefined for unregistered template", () => {
      const reg = new PromptTemplateRegistry();
      expect(reg.get("nope")).toBeUndefined();
    });

    it("should register multiple templates", () => {
      const reg = new PromptTemplateRegistry();
      reg.registerAll([
        makeTemplate("a", "body a"),
        makeTemplate("b", "body b"),
      ]);
      expect(reg.getAll()).toHaveLength(2);
    });
  });

  describe("search", () => {
    it("should find templates by prefix", () => {
      const reg = new PromptTemplateRegistry();
      reg.registerAll([
        makeTemplate("review", "r"),
        makeTemplate("refactor", "r"),
        makeTemplate("help", "h"),
      ]);
      const results = reg.search("re");
      expect(results).toHaveLength(2);
      expect(results.map((t) => t.name)).toContain("review");
      expect(results.map((t) => t.name)).toContain("refactor");
    });

    it("should be case-insensitive", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("Review", "body"));
      expect(reg.search("rev")).toHaveLength(1);
    });
  });

  describe("expand", () => {
    it("should return null for non-slash input", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("test", "body"));
      expect(reg.expand("test")).toBeNull();
    });

    it("should return null for unknown template", () => {
      const reg = new PromptTemplateRegistry();
      expect(reg.expand("/unknown")).toBeNull();
    });

    it("should expand template with no arguments", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("help", "Show help information."));
      expect(reg.expand("/help")).toBe("Show help information.");
    });

    it("should expand $@ with all arguments", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("review", "Review: $@"));
      expect(reg.expand("/review staged changes")).toBe(
        "Review: staged changes"
      );
    });

    it("should expand $ARGUMENTS with all arguments", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("cmd", "Run: $ARGUMENTS"));
      expect(reg.expand("/cmd foo bar")).toBe("Run: foo bar");
    });

    it("should expand positional args $1, $2", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("component", "Create $1 in $2"));
      expect(reg.expand("/component Button ./src")).toBe(
        "Create Button in ./src"
      );
    });

    it("should handle missing positional args as empty string", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("test", "A=$1 B=$2"));
      expect(reg.expand("/test only")).toBe("A=only B=");
    });

    it("should expand ${@:N} for args from position N", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("test", "First=$1 Rest=${@:2}"));
      expect(reg.expand("/test a b c d")).toBe("First=a Rest=b c d");
    });

    it("should expand ${@:N:L} for slice of args", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("test", "Middle=${@:2:2}"));
      expect(reg.expand("/test a b c d")).toBe("Middle=b c");
    });

    it("should handle quoted arguments", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("review", "Review: $1 for $2"));
      expect(reg.expand('/review "staged changes" quality')).toBe(
        "Review: staged changes for quality"
      );
    });

    it("should handle single-quoted arguments", () => {
      const reg = new PromptTemplateRegistry();
      reg.register(makeTemplate("echo", "Say: $1"));
      expect(reg.expand("/echo 'hello world'")).toBe("Say: hello world");
    });
  });
});
