import logger from "@hey/helpers/logger";
import {
  type JobsOptions,
  Queue,
  type QueueOptions,
  Worker,
  type WorkerOptions
} from "bullmq";

export interface QueueJobData {
  [key: string]: any;
}

export type QueueProcessor<T extends QueueJobData> = (job: {
  data: T;
  id?: string;
}) => Promise<unknown>;

export class QueueManager<T extends QueueJobData = QueueJobData> {
  private queue: Queue;
  private worker: Worker | null = null;
  private readonly queueName: string;
  private readonly redisConnection: QueueOptions["connection"];

  constructor(
    queueName: string,
    redisConnection: QueueOptions["connection"],
    queueOptions?: Partial<QueueOptions>
  ) {
    this.queueName = queueName;
    this.redisConnection = redisConnection;

    this.queue = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          delay: 2000,
          type: "exponential"
        },
        removeOnComplete: 100,
        removeOnFail: 50
      },
      ...queueOptions
    });

    this.queue.on("error", (error) => {
      logger.error(`[Queue:${queueName}] Queue error:`, error);
    });

    logger.info(`[Queue:${queueName}] Queue initialized`);
  }

  async addJob(jobName: string, data: T, options?: JobsOptions): Promise<void> {
    try {
      await this.queue.add(jobName, data, options);
      logger.info(`[Queue:${this.queueName}] Job '${jobName}' added to queue`);
    } catch (error) {
      logger.error(
        `[Queue:${this.queueName}] Failed to add job '${jobName}':`,
        error
      );
      throw error;
    }
  }

  async addBulkJobs(
    jobs: Array<{ name: string; data: T; options?: JobsOptions }>
  ): Promise<void> {
    try {
      await this.queue.addBulk(jobs);
      logger.info(
        `[Queue:${this.queueName}] ${jobs.length} jobs added to queue`
      );
    } catch (error) {
      logger.error(`[Queue:${this.queueName}] Failed to add bulk jobs:`, error);
      throw error;
    }
  }

  async createWorker(
    processor: QueueProcessor<T>,
    workerOptions?: Partial<WorkerOptions>
  ): Promise<Worker> {
    if (this.worker) {
      logger.warn(
        `[Queue:${this.queueName}] Worker already exists, closing existing worker`
      );
      await this.worker.close();
    }

    this.worker = new Worker(
      this.queueName,
      async (job) => {
        logger.info(
          `[Queue:${this.queueName}] Processing job '${job.name}' (${job.id})`
        );
        try {
          const result = await processor(job);
          logger.info(
            `[Queue:${this.queueName}] Job '${job.name}' (${job.id}) completed`
          );
          return result;
        } catch (error) {
          logger.error(
            `[Queue:${this.queueName}] Job '${job.name}' (${job.id}) failed:`,
            error
          );
          throw error;
        }
      },
      {
        concurrency: 5,
        connection: this.redisConnection,
        ...workerOptions
      }
    );

    this.worker.on("completed", (job) => {
      logger.info(`[Queue:${this.queueName}] Job ${job.id} completed`);
    });

    this.worker.on("failed", (job, error) => {
      logger.error(`[Queue:${this.queueName}] Job ${job?.id} failed:`, error);
    });

    this.worker.on("error", (error) => {
      logger.error(`[Queue:${this.queueName}] Worker error:`, error);
    });

    logger.info(`[Queue:${this.queueName}] Worker created and started`);
    return this.worker;
  }

  async getJobCounts() {
    return await this.queue.getJobCounts();
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    logger.info(`[Queue:${this.queueName}] Queue paused`);
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    logger.info(`[Queue:${this.queueName}] Queue resumed`);
  }

  async clean(
    grace = 0,
    limit = 100,
    type: "completed" | "failed" | "active" | "wait" = "completed"
  ): Promise<void> {
    await this.queue.clean(grace, limit, type);
    logger.info(`[Queue:${this.queueName}] Queue cleaned: ${type}`);
  }

  async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
    }
    await this.queue.close();
    logger.info(`[Queue:${this.queueName}] Queue and worker closed`);
  }

  getQueue(): Queue {
    return this.queue;
  }

  getWorker(): Worker | null {
    return this.worker;
  }
}
