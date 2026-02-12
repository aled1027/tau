/**
 * Shared agent creation helper.
 * Creates an Agent configured with the standard plugins.
 */
import {
  Agent,
  askUserExtension,
  codeReviewSkill,
  litComponentSkill,
  builtinTemplates,
} from "$core";

export async function createAgent(apiKey: string): Promise<Agent> {
  return Agent.create({
    apiKey,
    extensions: [askUserExtension],
    skills: [codeReviewSkill, litComponentSkill],
    promptTemplates: builtinTemplates,
  });
}
