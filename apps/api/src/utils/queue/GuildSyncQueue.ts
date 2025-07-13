import logger from "@hey/helpers/logger";
import syncAddressesToGuild from "../syncAddressesToGuild";
import { createQueue } from "./index";
import type { QueueProcessor } from "./QueueManager";

export interface GuildSyncJobData {
  addresses: string[];
  requirementId: number;
  roleId: number;
  retryCount?: number;
}

export class GuildSyncQueue {
  private static instance: GuildSyncQueue;
  private queue = createQueue<GuildSyncJobData>("guild-sync");

  private constructor() {
    this.setupWorker();
  }

  static getInstance(): GuildSyncQueue {
    if (!GuildSyncQueue.instance) {
      GuildSyncQueue.instance = new GuildSyncQueue();
    }
    return GuildSyncQueue.instance;
  }

  private setupWorker(): void {
    const processor: QueueProcessor<GuildSyncJobData> = async (job) => {
      const { addresses, requirementId, roleId } = job.data;

      logger.info(
        `[GuildSync] Processing guild sync for ${addresses.length} addresses`
      );

      try {
        const result = await syncAddressesToGuild({
          addresses,
          requirementId,
          roleId
        });

        logger.info(
          `[GuildSync] Successfully synced ${result.total} addresses to guild`
        );
        return result;
      } catch (error) {
        logger.error("[GuildSync] Failed to sync addresses to guild:", error);
        throw error;
      }
    };

    this.queue.createWorker(processor, { concurrency: 3 });
  }

  async addSyncJob(
    addresses: string[],
    requirementId: number,
    roleId: number,
    options?: { delay?: number; priority?: number }
  ): Promise<void> {
    await this.queue.addJob(
      "sync-addresses",
      { addresses, requirementId, roleId },
      { delay: options?.delay, priority: options?.priority }
    );
  }

  async addBulkSyncJobs(
    jobs: Array<{
      addresses: string[];
      requirementId: number;
      roleId: number;
      options?: { delay?: number; priority?: number };
    }>
  ): Promise<void> {
    const bulkJobs = jobs.map((job) => ({
      data: {
        addresses: job.addresses,
        requirementId: job.requirementId,
        roleId: job.roleId
      },
      name: "sync-addresses",
      options: job.options
    }));

    await this.queue.addBulkJobs(bulkJobs);
  }

  async getJobCounts() {
    return await this.queue.getJobCounts();
  }

  async pause(): Promise<void> {
    await this.queue.pause();
  }

  async resume(): Promise<void> {
    await this.queue.resume();
  }

  async clean(
    grace = 0,
    limit = 100,
    type: "completed" | "failed" | "active" | "wait" = "completed"
  ): Promise<void> {
    await this.queue.clean(grace, limit, type);
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}

export const guildSyncQueue = GuildSyncQueue.getInstance();
