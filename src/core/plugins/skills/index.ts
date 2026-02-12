import { parseSkillMarkdown, type Skill } from "../../skills.js";

import codeReviewMd from "./code-review.md";
import litComponentMd from "./lit-component.md";
import piBrowserMd from "./pi-browser.md";

function loadSkill(markdown: string, filename: string): Skill {
  const skill = parseSkillMarkdown(markdown);
  if (!skill) {
    throw new Error(`Failed to parse skill from ${filename}`);
  }
  return skill;
}

export const codeReviewSkill = loadSkill(codeReviewMd, "code-review.md");
export const litComponentSkill = loadSkill(litComponentMd, "lit-component.md");
export const piBrowserSkill = loadSkill(piBrowserMd, "pi-browser.md");
