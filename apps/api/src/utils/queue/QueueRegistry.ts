import logger from "@hey/helpers/logger";
import type { QueueManager } from "./QueueManager";

export class QueueRegistry {
  private static instance: QueueRegistry;
  private queues: Map<string, QueueManager> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): QueueRegistry {
    if (!QueueRegistry.instance) {
      QueueRegistry.instance = new QueueRegistry();
    }
    return QueueRegistry.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      logger.info("[QueueRegistry] Initializing queue system...");

      this.initialized = true;
      logger.info("[QueueRegistry] Queue system initialized successfully");
    } catch (error) {
      logger.error("[QueueRegistry] Failed to initialize queue system:", error);
      throw error;
    }
  }

  registerQueue(name: string, queue: QueueManager): void {
    if (this.queues.has(name)) {
      logger.warn(
        `[QueueRegistry] Queue '${name}' already registered, replacing...`
      );
    }

    this.queues.set(name, queue);
    logger.info(`[QueueRegistry] Queue '${name}' registered`);
  }

  getQueue(name: string): QueueManager | undefined {
    return this.queues.get(name);
  }

  getAllQueues(): Map<string, QueueManager> {
    return new Map(this.queues);
  }

  async getQueueStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};

    for (const [name, queue] of this.queues) {
      try {
        stats[name] = await queue.getJobCounts();
      } catch (error) {
        logger.error(
          `[QueueRegistry] Failed to get stats for queue '${name}':`,
          error
        );
        stats[name] = { error: "Failed to get stats" };
      }
    }

    return stats;
  }

  async pauseAllQueues(): Promise<void> {
    logger.info("[QueueRegistry] Pausing all queues...");

    for (const [name, queue] of this.queues) {
      try {
        await queue.pause();
      } catch (error) {
        logger.error(`[QueueRegistry] Failed to pause queue '${name}':`, error);
      }
    }
  }

  async resumeAllQueues(): Promise<void> {
    logger.info("[QueueRegistry] Resuming all queues...");

    for (const [name, queue] of this.queues) {
      try {
        await queue.resume();
      } catch (error) {
        logger.error(
          `[QueueRegistry] Failed to resume queue '${name}':`,
          error
        );
      }
    }
  }

  async shutdown(): Promise<void> {
    logger.info("[QueueRegistry] Shutting down all queues...");

    for (const [name, queue] of this.queues) {
      try {
        await queue.close();
        logger.info(`[QueueRegistry] Queue '${name}' closed`);
      } catch (error) {
        logger.error(`[QueueRegistry] Failed to close queue '${name}':`, error);
      }
    }

    this.queues.clear();
    this.initialized = false;
    logger.info("[QueueRegistry] All queues shut down");
  }
}

export const queueRegistry = QueueRegistry.getInstance();
