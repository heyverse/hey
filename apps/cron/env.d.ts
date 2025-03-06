declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    DISCORD_PAYMASTER_WEBHOOK_TOPIC: string;
  }
}
