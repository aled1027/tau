/**
 * Thread manager — handles creating, switching, listing, and
 * deleting conversation threads, with automatic persistence.
 */

import type { Message } from "./types.js";
import type { AgentConfig } from "./agent.js";
import { Agent } from "./agent.js";
import { ThreadStorage, type ThreadMeta } from "./storage.js";

export interface ThreadData {
  meta: ThreadMeta;
  messages: Message[];
  fs: Record<string, string>;
}

export class ThreadManager {
  readonly storage: ThreadStorage;
  private baseConfig: Omit<AgentConfig, "initialMessages" | "initialFS">;

  /**
   * @param baseConfig Agent config without initial state — used as
   *   the template when creating or restoring agents.
   */
  constructor(
    baseConfig: Omit<AgentConfig, "initialMessages" | "initialFS">,
    storage?: ThreadStorage
  ) {
    this.baseConfig = baseConfig;
    this.storage = storage ?? new ThreadStorage();
  }

  /** Generate a short random ID */
  private generateId(): string {
    return crypto.randomUUID().slice(0, 8);
  }

  // -----------------------------------------------------------------------
  // Thread CRUD
  // -----------------------------------------------------------------------

  /** List all threads, most recently updated first */
  listThreads(): ThreadMeta[] {
    return this.storage.listThreads();
  }

  /** Create a new thread and set it as active. Returns the new agent. */
  async createThread(name?: string): Promise<{ agent: Agent; threadId: string }> {
    const id = this.generateId();
    const now = Date.now();
    const meta: ThreadMeta = {
      id,
      name: name ?? "New thread",
      createdAt: now,
      updatedAt: now,
    };
    this.storage.saveThread(meta);
    this.storage.setActiveThreadId(id);

    const agent = new Agent({ ...this.baseConfig });
    // Persist the initial (empty) state
    await this.persist(id, agent);
    return { agent, threadId: id };
  }

  /** Load and switch to an existing thread. Returns a hydrated agent. */
  async switchThread(threadId: string): Promise<Agent> {
    const meta = this.storage.getThread(threadId);
    if (!meta) {
      throw new Error(`Thread not found: ${threadId}`);
    }

    const [messages, fs] = await Promise.all([
      this.storage.getMessages(threadId),
      this.storage.getFS(threadId),
    ]);

    this.storage.setActiveThreadId(threadId);

    return new Agent({
      ...this.baseConfig,
      initialMessages: messages.length > 0 ? messages : undefined,
      initialFS: Object.keys(fs).length > 0 ? fs : undefined,
    });
  }

  /** Delete a thread and all its data */
  async deleteThread(threadId: string): Promise<void> {
    await this.storage.deleteThread(threadId);
  }

  // -----------------------------------------------------------------------
  // Persistence
  // -----------------------------------------------------------------------

  /** Persist the current agent state for the given thread */
  async persist(threadId: string, agent: Agent): Promise<void> {
    const { messages, fs } = agent.serialize();

    // Update thread metadata timestamp
    const meta = this.storage.getThread(threadId);
    if (meta) {
      meta.updatedAt = Date.now();
      this.storage.saveThread(meta);
    }

    await Promise.all([
      this.storage.saveMessages(threadId, messages),
      this.storage.saveFS(threadId, fs),
    ]);
  }

  /** Persist current agent state for the active thread */
  async persistActive(agent: Agent): Promise<void> {
    const threadId = this.storage.getActiveThreadId();
    if (!threadId) return;
    await this.persist(threadId, agent);
  }

  /**
   * Update the thread name. Useful for auto-naming after first message.
   */
  renameThread(threadId: string, name: string): void {
    const meta = this.storage.getThread(threadId);
    if (meta) {
      meta.name = name;
      this.storage.saveThread(meta);
    }
  }

  // -----------------------------------------------------------------------
  // Active thread
  // -----------------------------------------------------------------------

  getActiveThreadId(): string | null {
    return this.storage.getActiveThreadId();
  }

  /**
   * Restore the active thread, or create a new one if none exists.
   * Returns the agent and thread ID.
   */
  async restoreOrCreate(): Promise<{ agent: Agent; threadId: string }> {
    const activeId = this.storage.getActiveThreadId();

    if (activeId && this.storage.getThread(activeId)) {
      const agent = await this.switchThread(activeId);
      return { agent, threadId: activeId };
    }

    return this.createThread();
  }
}
