declare namespace NodeJS {
  interface ProcessEnv {
    LENS_NETWORK: string;
    LENS_DATABASE_URL: string;
    PRIVATE_KEY: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
    SHARED_SECRET: string;
    PAGEVIEWS_DISCORD_WEBHOOK_URL: string;
    EVENTS_DISCORD_WEBHOOK_URL: string;
  }
}
