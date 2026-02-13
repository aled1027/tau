/**
 * Shared agent creation helper.
 * Creates an Agent configured with the standard plugins (loaded by default).
 */
import { Agent } from "tau";

export async function createAgent(apiKey: string): Promise<Agent> {
  return Agent.create({ apiKey });
}
