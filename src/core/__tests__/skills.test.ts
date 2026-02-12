import { describe, it, expect } from "vitest";
import { SkillRegistry, parseSkillMarkdown, serializeSkillMarkdown } from "../skills.js";
import type { Skill } from "../skills.js";

// ─── parseSkillMarkdown ─────────────────────────────────────────────

describe("parseSkillMarkdown", () => {
  it("should parse valid skill markdown with frontmatter", () => {
    const md = `---
name: code-review
description: Reviews code for quality issues.
---
# Code Review

Check for bugs and style issues.`;

    const skill = parseSkillMarkdown(md);
    expect(skill).not.toBeNull();
    expect(skill!.name).toBe("code-review");
    expect(skill!.description).toBe("Reviews code for quality issues.");
    expect(skill!.content).toContain("# Code Review");
    expect(skill!.content).toContain("Check for bugs");
  });

  it("should return null for missing frontmatter", () => {
    expect(parseSkillMarkdown("# Just content")).toBeNull();
  });

  it("should return null for missing name", () => {
    const md = `---
description: Does things.
---
Content here.`;
    expect(parseSkillMarkdown(md)).toBeNull();
  });

  it("should return null for missing description", () => {
    const md = `---
name: my-skill
---
Content here.`;
    expect(parseSkillMarkdown(md)).toBeNull();
  });

  it("should return null for empty content", () => {
    const md = `---
name: my-skill
description: Does things.
---
`;
    expect(parseSkillMarkdown(md)).toBeNull();
  });
});

// ─── serializeSkillMarkdown ─────────────────────────────────────────

describe("serializeSkillMarkdown", () => {
  it("should serialize a skill to markdown with frontmatter", () => {
    const skill: Skill = {
      name: "test-skill",
      description: "A test skill.",
      content: "# Instructions\nDo the thing.",
    };
    const md = serializeSkillMarkdown(skill);
    expect(md).toContain("---");
    expect(md).toContain("name: test-skill");
    expect(md).toContain("description: A test skill.");
    expect(md).toContain("# Instructions");
  });

  it("should round-trip through parse/serialize", () => {
    const skill: Skill = {
      name: "roundtrip",
      description: "Round trip test.",
      content: "Some content here.",
    };
    const md = serializeSkillMarkdown(skill);
    const parsed = parseSkillMarkdown(md);
    expect(parsed).not.toBeNull();
    expect(parsed!.name).toBe(skill.name);
    expect(parsed!.description).toBe(skill.description);
    expect(parsed!.content).toBe(skill.content);
  });
});

// ─── SkillRegistry ──────────────────────────────────────────────────

describe("SkillRegistry", () => {
  function makeSkill(name: string): Skill {
    return {
      name,
      description: `Description for ${name}`,
      content: `Content for ${name}`,
    };
  }

  it("should register and retrieve a skill", () => {
    const reg = new SkillRegistry();
    const skill = makeSkill("test");
    reg.register(skill);
    expect(reg.get("test")).toEqual(skill);
  });

  it("should return undefined for unregistered skill", () => {
    const reg = new SkillRegistry();
    expect(reg.get("nope")).toBeUndefined();
  });

  it("should register multiple skills", () => {
    const reg = new SkillRegistry();
    reg.registerAll([makeSkill("a"), makeSkill("b")]);
    expect(reg.getAll()).toHaveLength(2);
  });

  it("should skip duplicate skill names (keeps first)", () => {
    const reg = new SkillRegistry();
    reg.register({ name: "x", description: "first", content: "first" });
    reg.register({ name: "x", description: "second", content: "second" });
    expect(reg.get("x")!.description).toBe("first");
  });

  it("should skip skills with missing fields", () => {
    const reg = new SkillRegistry();
    reg.register({ name: "", description: "d", content: "c" });
    reg.register({ name: "n", description: "", content: "c" });
    reg.register({ name: "n", description: "d", content: "" });
    expect(reg.getAll()).toHaveLength(0);
  });

  it("should unregister a skill", () => {
    const reg = new SkillRegistry();
    reg.register(makeSkill("removeme"));
    expect(reg.unregister("removeme")).toBe(true);
    expect(reg.get("removeme")).toBeUndefined();
    expect(reg.unregister("removeme")).toBe(false);
  });

  describe("systemPromptFragment", () => {
    it("should return empty string when no skills registered", () => {
      const reg = new SkillRegistry();
      expect(reg.systemPromptFragment()).toBe("");
    });

    it("should list skills in XML format", () => {
      const reg = new SkillRegistry();
      reg.register(makeSkill("code-review"));
      const fragment = reg.systemPromptFragment();
      expect(fragment).toContain("<available_skills>");
      expect(fragment).toContain("<name>code-review</name>");
      expect(fragment).toContain("<description>Description for code-review</description>");
      expect(fragment).toContain("read_skill");
    });
  });

  describe("createReadSkillTool", () => {
    it("should return skill content when found", async () => {
      const reg = new SkillRegistry();
      reg.register(makeSkill("my-skill"));
      const tool = reg.createReadSkillTool();
      expect(tool.name).toBe("read_skill");

      const result = await tool.execute({ name: "my-skill" });
      expect(result.isError).toBe(false);
      expect(result.content).toBe("Content for my-skill");
    });

    it("should return error when skill not found", async () => {
      const reg = new SkillRegistry();
      reg.register(makeSkill("exists"));
      const tool = reg.createReadSkillTool();

      const result = await tool.execute({ name: "missing" });
      expect(result.isError).toBe(true);
      expect(result.content).toContain("not found");
      expect(result.content).toContain("exists");
    });
  });
});
